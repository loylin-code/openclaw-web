import { ref, onMounted, onUnmounted } from 'vue'
import { useChatStore } from '@/stores/chatStore'
import { getGatewayConfig } from '@/config/gateway'
import type { Message } from '@/types/chat'
import type { OpenClawClient, OpenClawClientOptions } from 'openclaw-webchat'

export function useOpenClawChat() {
  const store = useChatStore()
  const client = ref<OpenClawClient | null>(null)
  const error = ref<string | null>(null)
  
  const config = getGatewayConfig()
  
  // 生成唯一 ID
  function generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  }
  
  // 当前流式消息 ID
  let currentStreamingMessageId: string | null = null
  
  // 处理消息事件
  function handleMessage(message: Message) {
    // 如果是流式消息已经存在，跳过（由 streamEnd 处理）
    if (currentStreamingMessageId && message.id === currentStreamingMessageId) {
      return
    }
    store.addMessage({
      id: message.id || generateId(),
      role: message.role,
      content: message.content,
      timestamp: message.timestamp || Date.now(),
      streaming: false,
      metadata: message.metadata
    })
  }
  
  // 处理流式开始
  function handleStreamStart(messageId: string) {
    console.log('[OpenClaw] Stream start:', messageId)
    currentStreamingMessageId = messageId
    store.setStreaming(true)
    // 创建空的流式消息
    store.addMessage({
      id: messageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      streaming: true
    })
  }
  
  // 处理流式 Chunk - 累积追加内容
  function handleStreamChunk(messageId: string, chunk: string) {
    console.log('[OpenClaw] Stream chunk:', messageId, chunk.length, 'chars')
    const msg = store.messages.find(m => m.id === messageId)
    if (msg) {
      msg.content += chunk  // 累积追加
    }
  }
  
  // 处理流结束
  function handleStreamEnd(messageId: string) {
    console.log('[OpenClaw] Stream end:', messageId)
    currentStreamingMessageId = null
    store.finishMessage(messageId)
  }
  
  // 处理工具调用开始
  function handleToolStart(tool: { id: string; name: string; input?: object }) {
    console.log('[OpenClaw] Tool start:', tool.name)
    store.addToolCall({
      id: tool.id,
      name: tool.name,
      status: 'running',
      input: tool.input,
      startedAt: Date.now()
    })
  }
  
  // 处理工具调用结束
  function handleToolEnd(tool: { id: string; name: string; output?: string; error?: string }) {
    console.log('[OpenClaw] Tool end:', tool.name, tool.error ? 'error' : 'success')
    store.updateToolStatus(
      tool.id,
      tool.error ? 'error' : 'completed',
      tool.output || tool.error
    )
  }
  
  // 处理连接状态
  function handleConnected() {
    console.log('[OpenClaw] Connected to gateway')
    store.setConnectionState('connected')
    error.value = null
  }
  
  // 处理断开连接
  function handleDisconnected(reason?: string) {
    console.log('[OpenClaw] Disconnected:', reason)
    store.setConnectionState('disconnected')
  }
  
  // 处理错误
  function handleError(err: Error) {
    console.error('[OpenClaw] Error:', err.message)
    error.value = err.message || '连接错误'
    store.setConnectionState('error')
  }
  
  // 处理重连
  function handleReconnecting(attempt: number) {
    console.log('[OpenClaw] Reconnecting, attempt:', attempt)
    store.setConnectionState('connecting')
  }
  
  // 处理状态变化
  function handleStateChange(state: { connectionState: string }) {
    console.log('[OpenClaw] State changed:', state.connectionState)
    store.setConnectionState(state.connectionState as any)
  }
  
  // 连接
  async function connect() {
    try {
      console.log('[OpenClaw] Connecting to:', config.url)
      console.log('[OpenClaw] Token:', config.token ? 'provided' : 'not provided')
      
      // 动态导入 SDK
      const { OpenClawClient } = await import('openclaw-webchat')
      
      // 构建配置选项
      const options: OpenClawClientOptions = {
        gateway: config.url,
        reconnect: config.reconnect,
        reconnectInterval: config.reconnectInterval,
        debug: config.debug
      }
      
      // 只有 token 存在时才添加
      if (config.token) {
        options.token = config.token
      }
      
      console.log('[OpenClaw] Client options:', { ...options, token: options.token ? '***' : undefined })
      
      const clientInstance = new OpenClawClient(options)
      client.value = clientInstance
      
      // 注册事件监听
      clientInstance.on('connected', handleConnected)
      clientInstance.on('disconnected', handleDisconnected)
      clientInstance.on('error', handleError)
      clientInstance.on('reconnecting', handleReconnecting)
      clientInstance.on('stateChange', handleStateChange)
      clientInstance.on('message', (msg: any) => {
        console.log('[OpenClaw] Message event:', msg.id, msg.role, msg.content?.substring(0, 50))
        handleMessage(msg)
      })
      clientInstance.on('streamStart', (messageId: string) => {
        console.log('[OpenClaw] ⚡ streamStart event:', messageId)
        handleStreamStart(messageId)
      })
      clientInstance.on('streamChunk', (messageId: string, chunk: string) => {
        console.log('[OpenClaw] ⚡ streamChunk event:', messageId, chunk.length, 'chars:', chunk.substring(0, 30))
        handleStreamChunk(messageId, chunk)
      })
      clientInstance.on('streamEnd', (messageId: string) => {
        console.log('[OpenClaw] ⚡ streamEnd event:', messageId)
        handleStreamEnd(messageId)
      })
      // 工具调用事件（使用 any 绕过类型检查，因为 SDK 类型定义未更新）
      clientInstance.on('toolStart' as any, (tool: any) => {
        console.log('[OpenClaw] 🔧 toolStart event:', tool.id, tool.name)
        handleToolStart(tool)
      })
      clientInstance.on('toolEnd' as any, (tool: any) => {
        console.log('[OpenClaw] 🔧 toolEnd event:', tool.id, tool.name, tool.error ? 'error' : 'success')
        handleToolEnd(tool)
      })
      
      // 尝试连接
      await clientInstance.connect()
      
      console.log('[OpenClaw] Connect promise resolved')
      console.log('[OpenClaw] isConnected:', clientInstance.isConnected)
      console.log('[OpenClaw] connectionState:', clientInstance.connectionState)
      
    } catch (err: any) {
      console.error('[OpenClaw] Connection failed:', err)
      handleError(err)
    }
  }
  
  // 发送消息
  async function sendMessage(content: string) {
    if (!client.value || !content.trim()) {
      console.warn('[OpenClaw] Cannot send: client not connected or empty content')
      return
    }
    
    // 设置流式状态（显示思考中）
    store.setStreaming(true)
    
    // 先添加用户消息
    store.addMessage({
      id: generateId(),
      role: 'user',
      content: content,
      timestamp: Date.now()
    })
    
    try {
      console.log('[OpenClaw] Sending message:', content.substring(0, 50))
      await client.value.send(content)
    } catch (err: any) {
      console.error('[OpenClaw] Send failed:', err)
      store.setStreaming(false)
      error.value = err.message
    }
  }
  
  // 断开连接
  function disconnect() {
    if (client.value) {
      console.log('[OpenClaw] Disconnecting...')
      client.value.disconnect()
      client.value = null
      store.setConnectionState('disconnected')
    }
  }
  
  // 加载历史
  async function loadHistory() {
    if (!client.value) return
    
    try {
      const history = await client.value.getHistory(50)
      history.forEach(msg => store.addMessage(msg))
    } catch (err: any) {
      console.error('[OpenClaw] Load history failed:', err)
      error.value = err.message
    }
  }
  
  // 生命周期
  onMounted(() => {
    console.log('[OpenClaw] Component mounted, starting connection...')
    connect()
  })
  
  onUnmounted(() => {
    console.log('[OpenClaw] Component unmounted, disconnecting...')
    disconnect()
  })
  
  return {
    connect,
    disconnect,
    sendMessage,
    loadHistory,
    error,
    client
  }
}