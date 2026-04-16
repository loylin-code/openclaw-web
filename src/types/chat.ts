// 消息类型
export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  streaming?: boolean
  
  // 附加内容
  codeBlocks?: CodeBlock[]
  media?: MediaContent[]
  links?: LinkPreview[]
  files?: FileAttachment[]
  toolCalls?: ToolCall[]
}

// 代码块
export interface CodeBlock {
  language: string
  filename?: string
  code: string
}

// 多媒体内容
export interface MediaContent {
  type: 'image' | 'video'
  url: string
  thumbnail?: string
}

// 链接预览
export interface LinkPreview {
  url: string
  title: string
  description?: string
  favicon?: string
  siteName?: string
}

// 文件附件
export interface FileAttachment {
  name: string
  size: number
  type: string
  url?: string
}

// 工具调用
export interface ToolCall {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'error'
  input?: object
  output?: string
  startedAt?: number
  completedAt?: number
}

// Agent 信息
export interface Agent {
  id: string
  name: string
  description?: string
  model?: string
}

// 连接状态
export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error'

// 流式响应 Chunk
export interface StreamChunk {
  messageId: string
  content: string
  done: boolean
}

// 工具事件
export interface ToolEvent {
  type: 'tool_use' | 'tool_result'
  toolName: string
  toolId: string
  input?: object
  output?: string
}
