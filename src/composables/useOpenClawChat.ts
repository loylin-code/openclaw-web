import { ref, onMounted, onUnmounted } from 'vue'
import { useChatStore } from '@/stores/chatStore'
import { getGatewayConfig } from '@/config/gateway'
import type { Message, ConnectionState } from '@/types/chat'

// OpenClawClient 类型（来自 SDK）
interface OpenClawClient {
  connect: () => Promise<void>
  disconnect: () => void
  send: (message: string) => Promise<void>
  getHistory: () => Promise<Message[]>
  on: (event: string, handler: (...args: any[]) => void) => void
  off: (event: string, handler: (...args: any[]) => void) => void
}

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
  function handleMessage(data: any) {
    const message: Message = {
      id: data.id || generateId(),
      role: data.role,
      content: data.content,
      timestamp: data.timestamp || Date.now(),
      streaming: data.streaming ?? false,
      codeBlocks: data.codeBlocks,
      media: data.media,
      links: data.links,
      files: data.files,
      toolCalls: data.toolCalls
    }
    store.addMessage(message)
    
    if (message.streaming) {
      store.setStreaming(true)
    }
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
  function handleConnectionChange(state: ConnectionState) {
    store.setConnectionState(state)
  }
  
  // 处理错误
  function handleError(err: any) {
    error.value = err.message || '连接错误'
    store.setConnectionState('error')
  }
  
  // 连接
  async function connect() {
    try {
      // 动态导入 SDK
      const { OpenClawClient } = await import('openclaw-webchat')
      
      const clientInstance = new OpenClawClient({
        gateway: config.url,
        token: config.token,
        reconnect: config.reconnect,
        reconnectInterval: config.reconnectInterval
      })
      
      client.value = clientInstance as unknown as OpenClawClient
      
      // 注册事件监听
      clientInstance.on('message', handleMessage)
      clientInstance.on('streamStart', (_messageId: string) => {
        // 流开始，可以设置 streaming 状态
      })
      clientInstance.on('streamChunk', handleStreamChunk)
      clientInstance.on('streamEnd', handleStreamEnd)
      clientInstance.on('connected', () => handleConnectionChange('connected'))
      clientInstance.on('disconnected', () => handleConnectionChange('disconnected'))
      clientInstance.on('error', handleError)
      clientInstance.on('stateChange', (_state: any) => {
        // 状态变化时可以更新 UI
      })
      
      await clientInstance.connect()
      store.setConnectionState('connected')
      
    } catch (err: any) {
      handleError(err)
    }
  }
  
  // 发送消息
  async function sendMessage(content: string) {
    if (!client.value || !content.trim()) return
    
    // 先添加用户消息
    store.addMessage({
      id: generateId(),
      role: 'user',
      content: content,
      timestamp: Date.now()
    })
    
    try {
      await client.value.send(content)
    } catch (err: any) {
      error.value = err.message
    }
  }
  
  // 断开连接
  function disconnect() {
    if (client.value) {
      client.value.disconnect()
      client.value = null
      store.setConnectionState('disconnected')
    }
  }
  
  // 加载历史
  async function loadHistory() {
    if (!client.value) return
    
    try {
      const history = await client.value.getHistory()
      history.forEach(msg => store.addMessage(msg))
    } catch (err: any) {
      error.value = err.message
    }
  }
  
  // 生命周期
  onMounted(() => {
    connect()
  })
  
  onUnmounted(() => {
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