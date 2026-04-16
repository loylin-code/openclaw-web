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
  
  // 处理消息事件
  function handleMessage(message: Message) {
    store.addMessage({
      id: message.id || generateId(),
      role: message.role,
      content: message.content,
      timestamp: message.timestamp || Date.now(),
      streaming: false,
      metadata: message.metadata
    })
  }
  
  // 处理流式 Chunk
  function handleStreamChunk(messageId: string, chunk: string) {
    store.updateMessageContent(messageId, chunk)
  }
  
  // 处理流结束
  function handleStreamEnd(messageId: string) {
    store.finishMessage(messageId)
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
      clientInstance.on('message', handleMessage)
      clientInstance.on('streamStart', (messageId: string) => {
        console.log('[OpenClaw] Stream start:', messageId)
        store.setStreaming(true)
      })
      clientInstance.on('streamChunk', handleStreamChunk)
      clientInstance.on('streamEnd', handleStreamEnd)
      
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