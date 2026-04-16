import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message, ToolCall, ConnectionState, Agent } from '@/types/chat'

export const useChatStore = defineStore('chat', () => {
  // 状态
  const messages = ref<Message[]>([])
  const isConnected = ref<ConnectionState>('disconnected')
  const isStreaming = ref(false)
  const currentTool = ref<ToolCall | null>(null)
  const tokenCount = ref(0)
  const agents = ref<Agent[]>([])
  const currentAgent = ref<string>('default')
  const sessionId = ref<string>('')
  
  // 计算属性
  const lastMessage = computed(() => messages.value[messages.value.length - 1])
  const hasMessages = computed(() => messages.value.length > 0)
  
  // Actions
  
  // 添加消息
  function addMessage(message: Message) {
    messages.value.push(message)
  }
  
  // 更新消息内容（流式）
  function updateMessageContent(id: string, content: string) {
    const msg = messages.value.find(m => m.id === id)
    if (msg) {
      msg.content = content
    }
  }
  
  // 标记消息完成
  function finishMessage(id: string) {
    const msg = messages.value.find(m => m.id === id)
    if (msg) {
      msg.streaming = false
    }
    isStreaming.value = false
  }
  
  // 添加工具调用
  function addToolCall(tool: ToolCall) {
    const msg = lastMessage.value
    if (msg && msg.role === 'assistant') {
      if (!msg.toolCalls) {
        msg.toolCalls = []
      }
      msg.toolCalls.push(tool)
    }
    currentTool.value = tool
  }
  
  // 更新工具状态
  function updateToolStatus(toolId: string, status: ToolCall['status'], output?: string) {
    const msg = lastMessage.value
    if (msg && msg.toolCalls) {
      const tool = msg.toolCalls.find(t => t.id === toolId)
      if (tool) {
        tool.status = status
        if (output) {
          tool.output = output
        }
        if (status === 'completed' || status === 'error') {
          tool.completedAt = Date.now()
        }
      }
    }
    currentTool.value = null
  }
  
  // 清空消息
  function clearMessages() {
    messages.value = []
    tokenCount.value = 0
  }
  
  // 设置连接状态
  function setConnectionState(state: ConnectionState) {
    isConnected.value = state
  }
  
  // 设置流式状态
  function setStreaming(streaming: boolean) {
    isStreaming.value = streaming
  }
  
  // 增加 token 计数
  function incrementTokens(count: number) {
    tokenCount.value += count
  }
  
  // 设置 Agent 列表
  function setAgents(agentList: Agent[]) {
    agents.value = agentList
  }
  
  // 选择 Agent
  function selectAgent(agentId: string) {
    currentAgent.value = agentId
  }
  
  // 设置会话 ID
  function setSessionId(id: string) {
    sessionId.value = id
  }
  
  return {
    // State
    messages,
    isConnected,
    isStreaming,
    currentTool,
    tokenCount,
    agents,
    currentAgent,
    sessionId,
    
    // Computed
    lastMessage,
    hasMessages,
    
    // Actions
    addMessage,
    updateMessageContent,
    finishMessage,
    addToolCall,
    updateToolStatus,
    clearMessages,
    setConnectionState,
    setStreaming,
    incrementTokens,
    setAgents,
    selectAgent,
    setSessionId
  }
})
