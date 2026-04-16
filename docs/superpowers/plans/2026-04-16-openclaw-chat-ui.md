# OpenClaw Chat UI 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个现代化、简洁的 Vue 3 聊天 UI，完整支持 OpenClaw 消息类型展示

**Architecture:** 全宽居中布局（max-width 768px），白蓝配色，左右分列消息气泡，使用 openclaw-webchat SDK 作为 WebSocket 通信层，Pinia 状态管理

**Tech Stack:** Vue 3 + Vite + TypeScript + Pinia + openclaw-webchat + TailwindCSS

---

## 文件结构

### 创建文件

| 文件路径 | 责任 |
|----------|------|
| `package.json` | 项目依赖配置 |
| `vite.config.ts` | Vite 构建配置 |
| `tsconfig.json` | TypeScript 配置 |
| `tailwind.config.js` | TailwindCSS 配置 |
| `src/main.ts` | 应用入口 |
| `src/App.vue` | 根组件 |
| `src/types/chat.ts` | 消息类型定义 |
| `src/stores/chatStore.ts` | Pinia 状态管理 |
| `src/composables/useOpenClawChat.ts` | SDK集成 Hook |
| `src/styles/chat.css` | 全局样式 + 动效 |
| `src/components/chat/ChatContainer.vue` | 主容器布局 |
| `src/components/chat/ChatHeader.vue` | 顶部导航 |
| `src/components/chat/MessageList.vue` | 消息列表容器 |
| `src/components/chat/MessageBubble.vue` | 消息气泡（用户/AI） |
| `src/components/chat/CodeBlock.vue` | 代码块 + 语法高亮 |
| `src/components/chat/ToolStatus.vue` | 工具执行状态 |
| `src/components/chat/MediaGrid.vue` | 图片网格 |
| `src/components/chat/LinkPreview.vue` | 链接预览 |
| `src/components/chat/FileAttachment.vue` | 文件附件 |
| `src/components/chat/StreamingText.vue` | 流式文本 + 光标 |
| `src/components/chat/ChatInput.vue` | 输入区域 |
| `src/config/gateway.ts` | Gateway 配置 |

---

## Task 1: 项目初始化

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `src/main.ts`
- Create: `src/App.vue`
- Create: `src/vite-env.d.ts`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "openclaw-web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.5.13",
    "pinia": "^3.0.1",
    "openclaw-webchat": "^0.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.3",
    "typescript": "~5.7.2",
    "vite": "^6.2.4",
    "vue-tsc": "^2.2.8",
    "tailwindcss": "^3.4.17",
    "postcss": "^8.5.3",
    "autoprefixer": "^10.4.21"
  }
}
```

- [ ] **Step 2: 创建 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/ws': {
        target: 'ws://localhost:18789',
        ws: true
      }
    }
  }
})
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

- [ ] **Step 4: 创建 tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-primary': '#3b82f6',
        'blue-secondary': '#2563eb',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
      },
      maxWidth: {
        'chat': '768px',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 5: 创建 postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 6: 创建 src/vite-env.d.ts**

```typescript
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, any>
  export default component
}
```

- [ ] **Step 7: 创建 src/main.ts**

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles/chat.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
```

- [ ] **Step 8: 创建 src/App.vue**

```vue
<script setup lang="ts">
import ChatContainer from '@/components/chat/ChatContainer.vue'
</script>

<template>
  <ChatContainer />
</template>
```

- [ ] **Step 9: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/svg+xml" href="/vite.svg">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenClaw Chat</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 10: 安装依赖**

Run: `pnpm install`

Expected: 依赖安装成功，node_modules 目录创建

- [ ] **Step 11: 验证项目启动**

Run: `pnpm dev`

Expected: Vite dev server 在 http://localhost:5173 启动

- [ ] **Step 12: Commit**

```bash
git add .
git commit -m "feat: init Vue 3 + Vite project with TailwindCSS"
```

---

## Task 2: 类型定义

**Files:**
- Create: `src/types/chat.ts`
- Create: `src/config/gateway.ts`

- [ ] **Step 1: 创建 src/types/chat.ts**

```typescript
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
```

- [ ] **Step 2: 创建 src/config/gateway.ts**

```typescript
// Gateway 配置
export interface GatewayConfig {
  url: string
  token?: string
  reconnect?: boolean
  reconnectInterval?: number
}

// 默认配置
export const defaultGatewayConfig: GatewayConfig = {
  url: 'ws://localhost:18789',
  token: '',
  reconnect: true,
  reconnectInterval: 5000
}

// 从环境变量读取
export function getGatewayConfig(): GatewayConfig {
  return {
    url: import.meta.env.VITE_GATEWAY_URL || defaultGatewayConfig.url,
    token: import.meta.env.VITE_GATEWAY_TOKEN || defaultGatewayConfig.token,
    reconnect: defaultGatewayConfig.reconnect,
    reconnectInterval: defaultGatewayConfig.reconnectInterval
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/types/chat.ts src/config/gateway.ts
git commit -m "feat: add chat types and gateway config"
```

---

## Task 3: 全局样式

**Files:**
- Create: `src/styles/chat.css`

- [ ] **Step 1: 创建 src/styles/chat.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 字体 */
@layer base {
  body {
    font-family: 'Inter', -apple-system, sans-serif;
  }
}

/* 自定义组件样式 */
@layer components {
  /* 用户消息气泡 */
  .bubble-user {
    @apply bg-gradient-to-br from-blue-500 to-blue-600 text-white;
    border-radius: 20px 20px 6px 20px;
  }
  
  /* AI消息气泡 */
  .bubble-ai {
    @apply bg-white text-slate-700 border border-slate-200;
    border-radius: 20px 20px 20px 6px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  
  /* 代码块 */
  .code-block {
    @apply bg-slate-800 text-slate-200 font-mono rounded-lg;
  }
  
  .code-header {
    @apply bg-slate-700 rounded-t-lg;
  }
  
  /* 工具状态 */
  .tool-badge-running {
    @apply bg-blue-100 border border-blue-500 text-blue-700;
  }
  
  .tool-badge-completed {
    @apply bg-green-100 border border-green-500 text-green-700;
  }
  
  .tool-badge-error {
    @apply bg-red-100 border border-red-500 text-red-700;
  }
  
  /* 按钮悬浮 */
  .btn-hover {
    @apply transition-all duration-200;
  }
  .btn-hover:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
  }
  
  /* 蓝色焦点环 */
  .blue-focus:focus {
    @apply outline-none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
  
  /* 自定义滚动条 */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-slate-300 rounded;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    @apply bg-slate-400;
  }
}

/* 动效 */
@layer utilities {
  /* 流式光标 */
  .typing-cursor::after {
    content: '▊';
    animation: cursor-blink 1s step-end infinite;
    margin-left: 2px;
    color: #3b82f6;
  }
  
  @keyframes cursor-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  
  /* 工具脉冲动画 */
  .streaming-dot {
    animation: pulse-dot 1.5s ease-in-out infinite;
  }
  
  @keyframes pulse-dot {
    0%, 100% { 
      opacity: 1; 
      transform: scale(1); 
    }
    50% { 
      opacity: 0.4; 
      transform: scale(0.8); 
    }
  }
  
  /* 渐变背景 */
  .gradient-blue {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/chat.css
git commit -m "feat: add global chat styles with animations"
```

---

## Task 4: Pinia Store

**Files:**
- Create: `src/stores/chatStore.ts`

- [ ] **Step 1: 创建 src/stores/chatStore.ts**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/chatStore.ts
git commit -m "feat: add Pinia chat store with all state management"
```

---

## Task 5: SDK集成 Hook

**Files:**
- Create: `src/composables/useOpenClawChat.ts`

- [ ] **Step 1: 创建 src/composables/useOpenClawChat.ts**

```typescript
import { ref, onMounted, onUnmounted } from 'vue'
import { useChatStore } from '@/stores/chatStore'
import { getGatewayConfig } from '@/config/gateway'
import type { Message, StreamChunk, ToolEvent, ConnectionState } from '@/types/chat'

// OpenClawClient 类型（来自 SDK）
interface OpenClawClient {
  connect: () => Promise<void>
  disconnect: () => void
  send: (message: string) => Promise<void>
  getHistory: () => Promise<Message[]>
  on: (event: string, handler: (data: any) => void) => void
  off: (event: string, handler: (data: any) => void) => void
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
  function handleStreamChunk(data: StreamChunk) {
    store.updateMessageContent(data.messageId, data.content)
    
    if (data.done) {
      store.finishMessage(data.messageId)
    }
  }
  
  // 处理工具事件
  function handleToolEvent(data: ToolEvent) {
    if (data.type === 'tool_use') {
      store.addToolCall({
        id: data.toolId,
        name: data.toolName,
        status: 'running',
        input: data.input
      })
    } else if (data.type === 'tool_result') {
      store.updateToolStatus(data.toolId, 'completed', data.output)
    }
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
      
      client.value = new OpenClawClient({
        gateway: config.url,
        token: config.token,
        reconnect: config.reconnect,
        reconnectInterval: config.reconnectInterval
      })
      
      // 注册事件监听
      client.value.on('message', handleMessage)
      client.value.on('streamChunk', handleStreamChunk)
      client.value.on('toolUse', handleToolEvent)
      client.value.on('toolResult', handleToolEvent)
      client.value.on('connected', () => handleConnectionChange('connected'))
      client.value.on('disconnected', () => handleConnectionChange('disconnected'))
      client.value.on('error', handleError)
      
      await client.value.connect()
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
```

- [ ] **Step 2: Commit**

```bash
git add src/composables/useOpenClawChat.ts
git commit -m "feat: add OpenClaw SDK integration hook"
```

---

## Task 6: ChatHeader 组件

**Files:**
- Create: `src/components/chat/ChatHeader.vue`

- [ ] **Step 1: 创建 src/components/chat/ChatHeader.vue**

```vue
<script setup lang="ts">
import { useChatStore } from '@/stores/chatStore'
import { computed } from 'vue'

const store = useChatStore()

const agentOptions = computed(() => store.agents)
const currentAgentName = computed(() => {
  const agent = store.agents.find(a => a.id === store.currentAgent)
  return agent?.name || 'Default Agent'
})

function handleNewSession() {
  store.clearMessages()
  store.setSessionId('')
}

function handleAgentChange(event: Event) {
  const target = event.target as HTMLSelectElement
  store.selectAgent(target.value)
}
</script>

<template>
  <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
    <!-- 左侧: Logo + Agent 选择器 -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center">
          <span class="text-white text-xl">🦞</span>
        </div>
        <div>
          <h1 class="text-slate-800 font-semibold text-sm">OpenClaw Chat</h1>
          <p class="text-slate-400 text-xs">AI Assistant</p>
        </div>
      </div>
      
      <!-- Agent 选择器 -->
      <div class="ml-6 flex items-center gap-2 border border-slate-200 rounded-full px-4 py-2 hover:border-blue-300 transition cursor-pointer">
        <span class="text-slate-500 text-sm">Agent:</span>
        <select 
          class="bg-transparent text-slate-700 font-medium text-sm outline-none cursor-pointer"
          :value="store.currentAgent"
          @change="handleAgentChange"
        >
          <option value="default">Default Agent</option>
          <option v-for="agent in agentOptions" :key="agent.id" :value="agent.id">
            {{ agent.name }}
          </option>
        </select>
        <span class="text-slate-400 text-xs">▼</span>
      </div>
    </div>
    
    <!-- 右侧: 操作按钮 -->
    <div class="flex items-center gap-3">
      <button 
        @click="handleNewSession"
        class="px-4 py-2 gradient-blue text-white rounded-full text-sm font-medium btn-hover"
      >
        + 新建会话
      </button>
      <button class="w-9 h-9 border border-slate-200 rounded-full text-slate-500 flex items-center justify-center hover:border-blue-300 hover:text-blue-500 transition">
        ⚙
      </button>
    </div>
  </header>
</template>

<style scoped>
.gradient-blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/chat/ChatHeader.vue
git commit -m "feat: add ChatHeader component with agent selector"
```

---

## Task 7: ChatInput 组件

**Files:**
- Create: `src/components/chat/ChatInput.vue`

- [ ] **Step 1: 创建 src/components/chat/ChatInput.vue**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useChatStore } from '@/stores/chatStore'
import { useOpenClawChat } from '@/composables/useOpenClawChat'

const store = useChatStore()
const { sendMessage } = useOpenClawChat()

const inputText = ref('')
const isFocused = ref(false)

// 连接状态文本
const connectionText = computed(() => {
  switch (store.isConnected) {
    case 'connected': return '已连接'
    case 'connecting': return '连接中...'
    case 'disconnected': return '未连接'
    case 'error': return '连接错误'
    default: return '未知'
  }
})

const connectionColor = computed(() => {
  switch (store.isConnected) {
    case 'connected': return 'bg-green-100 text-green-600 border-green-200'
    case 'connecting': return 'bg-yellow-100 text-yellow-600 border-yellow-200'
    case 'error': return 'bg-red-100 text-red-600 border-red-200'
    default: return 'bg-slate-100 text-slate-500 border-slate-200'
  }
})

async function handleSend() {
  if (!inputText.value.trim() || store.isStreaming) return
  
  await sendMessage(inputText.value)
  inputText.value = ''
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSend()
  }
}

function handleFocus() {
  isFocused.value = true
}

function handleBlur() {
  isFocused.value = false
}
</script>

<template>
  <footer class="bg-white border-t border-slate-200 p-4">
    <div class="max-w-chat mx-auto">
      <!-- 输入框容器 -->
      <div 
        class="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-slate-200 transition"
        :class="{ 'border-blue-300 shadow-[0_0_0_3px_rgba(59,130,246,0.2)]': isFocused }"
      >
        <!-- 附件按钮 -->
        <button class="w-10 h-10 rounded-full bg-slate-50 hover:bg-blue-50 flex items-center justify-center text-slate-400 hover:text-blue-500 transition">
          📎
        </button>
        
        <!-- 输入框 -->
        <input 
          v-model="inputText"
          type="text"
          placeholder="输入消息，按 Enter 发送，Shift+Enter 换行..."
          class="flex-1 bg-transparent text-slate-700 text-sm outline-none placeholder:text-slate-400"
          :disabled="store.isStreaming || store.isConnected !== 'connected'"
          @keydown="handleKeydown"
          @focus="handleFocus"
          @blur="handleBlur"
        />
        
        <!-- 语音按钮 -->
        <button class="w-10 h-10 rounded-full bg-slate-50 hover:bg-blue-50 flex items-center justify-center text-slate-400 hover:text-blue-500 transition">
          🎤
        </button>
        
        <!-- 发送按钮 -->
        <button 
          @click="handleSend"
          :disabled="!inputText.trim() || store.isStreaming || store.isConnected !== 'connected'"
          class="w-10 h-10 rounded-full gradient-blue text-white flex items-center justify-center btn-hover shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span class="text-lg">→</span>
        </button>
      </div>
      
      <!-- 底部提示 -->
      <div class="flex items-center justify-between mt-2 text-xs text-slate-400">
        <span>支持 Markdown、代码块、@提及 Agent</span>
        <div class="flex items-center gap-2">
          <span 
            class="px-2 py-0.5 rounded border"
            :class="connectionColor"
          >
            {{ store.isConnected === 'connected' ? '🟢' : store.isConnected === 'error' ? '🔴' : '🟡' }} 
            {{ connectionText }}
          </span>
          <span class="text-slate-500">Token: {{ store.tokenCount }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { computed } from 'vue'
export default {
  name: 'ChatInput'
}
</script>

<style scoped>
.gradient-blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.max-w-chat {
  max-width: 768px;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/chat/ChatInput.vue
git commit -m "feat: add ChatInput component with send functionality"
```

---

## Task 8: MessageBubble 组件

**Files:**
- Create: `src/components/chat/MessageBubble.vue`

- [ ] **Step 1: 创建 src/components/chat/MessageBubble.vue**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '@/types/chat'
import CodeBlock from './CodeBlock.vue'
import MediaGrid from './MediaGrid.vue'
import LinkPreview from './LinkPreview.vue'
import FileAttachment from './FileAttachment.vue'
import ToolStatus from './ToolStatus.vue'
import StreamingText from './StreamingText.vue'

const props = defineProps<{
  message: Message
}>()

const isUser = computed(() => props.message.role === 'user')
const isAI = computed(() => props.message.role === 'assistant')

// 格式化时间
const formattedTime = computed(() => {
  const date = new Date(props.message.timestamp)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
})

// 是否显示附加内容
const hasAttachments = computed(() => {
  return props.message.codeBlocks?.length ||
         props.message.media?.length ||
         props.message.links?.length ||
         props.message.files?.length
})

const hasToolCalls = computed(() => props.message.toolCalls?.length)
</script>

<template>
  <div :class="isUser ? 'flex justify-end' : 'flex justify-start'">
    
    <!-- 用户消息 -->
    <div v-if="isUser" class="bubble-user px-5 py-3 max-w-lg shadow-md">
      <p class="text-sm leading-relaxed">{{ message.content }}</p>
    </div>
    
    <!-- AI 消息 -->
    <div v-if="isAI" class="max-w-2xl w-full">
      <!-- Avatar + 时间戳 -->
      <div class="flex items-center gap-2 mb-3 ml-1">
        <div class="w-8 h-8 gradient-blue rounded-full flex items-center justify-center">
          <span class="text-white text-sm">🦞</span>
        </div>
        <span class="text-sm text-slate-500 font-medium">AI Assistant</span>
        <span class="text-xs text-slate-400">• {{ formattedTime }}</span>
        <span v-if="message.streaming" class="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded font-medium">
          生成中...
        </span>
      </div>
      
      <!-- 消息气泡 -->
      <div class="bubble-ai p-5">
        <!-- 文本内容 -->
        <StreamingText 
          v-if="message.streaming"
          :content="message.content"
        />
        <p v-else class="text-sm leading-relaxed text-slate-700">{{ message.content }}</p>
        
        <!-- 代码块 -->
        <div v-if="message.codeBlocks?.length" class="mt-4 space-y-3">
          <CodeBlock 
            v-for="(block, idx) in message.codeBlocks" 
            :key="idx"
            :code="block.code"
            :language="block.language"
            :filename="block.filename"
          />
        </div>
        
        <!-- 图片网格 -->
        <MediaGrid v-if="message.media?.length" :items="message.media" class="mt-4" />
        
        <!-- 链接预览 -->
        <div v-if="message.links?.length" class="mt-3 space-y-2">
          <LinkPreview v-for="(link, idx) in message.links" :key="idx" :link="link" />
        </div>
        
        <!-- 文件附件 -->
        <div v-if="message.files?.length" class="mt-3 space-y-2">
          <FileAttachment v-for="(file, idx) in message.files" :key="idx" :file="file" />
        </div>
        
        <!-- 工具调用 -->
        <div v-if="hasToolCalls" class="mt-4 space-y-2">
          <ToolStatus v-for="(tool, idx) in message.toolCalls" :key="idx" :tool="tool" />
        </div>
        
        <!-- 操作按钮 -->
        <div v-if="!message.streaming" class="flex gap-2 mt-4 pt-4 border-t border-slate-100">
          <button class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-blue-300 hover:text-blue-600 transition">
            👍 有帮助
          </button>
          <button class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-blue-300 hover:text-blue-600 transition">
            🔄 重新生成
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gradient-blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.bubble-user {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-radius: 20px 20px 6px 20px;
}

.bubble-ai {
  background: white;
  color: #334155;
  border: 1px solid #e2e8f0;
  border-radius: 20px 20px 20px 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/chat/MessageBubble.vue
git commit -m "feat: add MessageBubble component supporting all content types"
```

---

## Task 9: StreamingText 组件

**Files:**
- Create: `src/components/chat/StreamingText.vue`

- [ ] **Step 1: 创建 src/components/chat/StreamingText.vue**

```vue
<script setup lang="ts">
const props = defineProps<{
  content: string
}>()
</script>

<template>
  <p class="text-sm leading-relaxed text-slate-700 typing-cursor">
    {{ content }}
  </p>
</template>

<style scoped>
.typing-cursor::after {
  content: '▊';
  animation: cursor-blink 1s step-end infinite;
  margin-left: 2px;
  color: #3b82f6;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/chat/StreamingText.vue
git commit -m "feat: add StreamingText component with typing cursor"
```

---

## Task 10: CodeBlock 组件

**Files:**
- Create: `src/components/chat/CodeBlock.vue`

- [ ] **Step 1: 创建 src/components/chat/CodeBlock.vue**

```vue
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  code: string
  language: string
  filename?: string
}>()

const copied = ref(false)

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error('Copy failed:', err)
  }
}
</script>

<template>
  <div class="code-block overflow-hidden">
    <!-- Header -->
    <div class="code-header px-4 py-2 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-xs text-slate-400">{{ language }}</span>
        <span v-if="filename" class="text-xs text-slate-500">• {{ filename }}</span>
      </div>
      <button 
        @click="handleCopy"
        class="text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
      >
        <span>{{ copied ? '✓ 已复制' : '📋 复制' }}</span>
      </button>
    </div>
    
    <!-- Code Content -->
    <pre class="p-4 text-sm leading-relaxed overflow-x-auto"><code>{{ code }}</code></pre>
  </div>
</template>

<style scoped>
.code-block {
  background: #1e293b;
  color: #e2e8f0;
  border-radius: 12px;
  font-family: 'JetBrains Mono', monospace;
}

.code-header {
  background: #334155;
  border-radius: 12px 12px 0 0;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/chat/CodeBlock.vue
git commit -m "feat: add CodeBlock component with copy functionality"
```

---

## Task 11: ToolStatus 组件

**Files:**
- Create: `src/components/chat/ToolStatus.vue`

- [ ] **Step 1: 创建 src/components/chat/ToolStatus.vue**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { ToolCall } from '@/types/chat'

const props = defineProps<{
  tool: ToolCall
}>()

const statusClass = computed(() => {
  switch (props.tool.status) {
    case 'running': return 'tool-badge-running'
    case 'completed': return 'tool-badge-completed'
    case 'error': return 'tool-badge-error'
    default: return 'bg-slate-100 border-slate-300 text-slate-600'
  }
})

const statusIcon = computed(() => {
  switch (props.tool.status) {
    case 'running': return '⏳'
    case 'completed': return '✓'
    case 'error': return '✗'
    default: return '?'
  }
})

const statusText = computed(() => {
  switch (props.tool.status) {
    case 'running': return '执行中'
    case 'completed': return '完成'
    case 'error': return '错误'
    default: return '待执行'
  }
})
</script>

<template>
  <div :class="['px-4 py-2 rounded-xl flex items-center gap-3', statusClass]">
    <!-- 状态指示 -->
    <div v-if="tool.status === 'running'" class="flex gap-1">
      <span class="w-2 h-2 rounded-full bg-blue-500 streaming-dot"></span>
      <span class="w-2 h-2 rounded-full bg-blue-500 streaming-dot" style="animation-delay: 0.3s"></span>
      <span class="w-2 h-2 rounded-full bg-blue-500 streaming-dot" style="animation-delay: 0.6s"></span>
    </div>
    <span v-else class="text-sm">{{ statusIcon }}</span>
    
    <!-- 工具信息 -->
    <div>
      <p class="text-sm font-medium">{{ tool.name }}</p>
      <p class="text-xs opacity-70">{{ statusText }} • {{ tool.id }}</p>
    </div>
  </div>
</template>

<style scoped>
.tool-badge-running {
  background: #dbeafe;
  border: 1px solid #3b82f6;
  color: #1d4ed8;
}

.tool-badge-completed {
  background: #dcfce7;
  border: 1px solid #22c55e;
  color: #166534;
}

.tool-badge-error {
  background: #fee2e2;
  border: 1px solid #ef4444;
  color: #991b1b;
}

.streaming-dot {
  animation: pulse-dot 1.5s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1); 
  }
  50% { 
    opacity: 0.4; 
    transform: scale(0.8); 
  }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/chat/ToolStatus.vue
git commit -m "feat: add ToolStatus component with running animation"
```

---

## Task 12: MediaGrid 组件

**Files:**
- Create: `src/components/chat/MediaGrid.vue`

- [ ] **Step 1: 创建 src/components/chat/MediaGrid.vue**

```vue
<script setup lang="ts">
import type { MediaContent } from '@/types/chat'

const props = defineProps<{
  items: MediaContent[]
}>()

function getThumbnail(item: MediaContent): string {
  return item.thumbnail || item.url
}
</script>

<template>
  <div class="grid grid-cols-3 gap-3">
    <div 
      v-for="(item, idx) in items" 
      :key="idx"
      class="aspect-square rounded-lg overflow-hidden bg-slate-200"
    >
      <!-- 图片 -->
      <img 
        v-if="item.type === 'image'"
        :src="getThumbnail(item)"
        :alt="`Media ${idx + 1}`"
        class="w-full h-full object-cover"
      />
      
      <!-- 视频 -->
      <div 
        v-if="item.type === 'video'"
        class="w-full h-full flex items-center justify-center bg-slate-300"
      >
        <span class="text-2xl">🎬</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.aspect-square {
  aspect-ratio: 1;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/chat/MediaGrid.vue
git commit -m "feat: add MediaGrid component for images display"
```

---

## Task 13: LinkPreview 组件

**Files:**
- Create: `src/components/chat/LinkPreview.vue`

- [ ] **Step 1: 创建 src/components/chat/LinkPreview.vue**

```vue
<script setup lang="ts">
import type { LinkPreview as LinkPreviewType } from '@/types/chat'

const props = defineProps<{
  link: LinkPreviewType
}>()

function openLink() {
  window.open(props.link.url, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div 
    class="bg-white border border-slate-200 rounded-lg p-3 cursor-pointer hover:border-blue-300 transition"
    @click="openLink"
  >
    <div class="flex items-start gap-3">
      <!-- 图标 -->
      <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
        <span class="text-blue-500">🔗</span>
      </div>
      
      <!-- 内容 -->
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-slate-800 truncate">{{ link.title }}</p>
        <p class="text-xs text-slate-400 truncate">
          {{ link.siteName || new URL(link.url).hostname }}
        </p>
        <p v-if="link.description" class="text-xs text-slate-600 mt-1 line-clamp-2">
          {{ link.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/chat/LinkPreview.vue
git commit -m "feat: add LinkPreview component"
```

---

## Task 14: FileAttachment 组件

**Files:**
- Create: `src/components/chat/FileAttachment.vue`

- [ ] **Step 1: 创建 src/components/chat/FileAttachment.vue**

```vue
<script setup lang="ts">
import type { FileAttachment as FileAttachmentType } from '@/types/chat'

const props = defineProps<{
  file: FileAttachmentType
}>()

// 格式化文件大小
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

// 文件类型图标
function getFileIcon(type: string): string {
  if (type.includes('image')) return '🖼️'
  if (type.includes('pdf')) return '📄'
  if (type.includes('zip') || type.includes('archive')) return '📦'
  if (type.includes('code') || type.includes('script')) return '💻'
  return '📁'
}

function handleDownload() {
  if (props.file.url) {
    window.open(props.file.url, '_blank')
  }
}
</script>

<template>
  <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
    <!-- 文件图标 -->
    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
      <span class="text-blue-600 text-lg">{{ getFileIcon(file.type) }}</span>
    </div>
    
    <!-- 文件信息 -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-slate-800 truncate">{{ file.name }}</p>
      <p class="text-xs text-slate-500">{{ formatSize(file.size) }} • {{ file.type }}</p>
    </div>
    
    <!-- 下载按钮 -->
    <button 
      v-if="file.url"
      @click="handleDownload"
      class="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition"
    >
      ⬇ 下载
    </button>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/chat/FileAttachment.vue
git commit -m "feat: add FileAttachment component"
```

---

## Task 15: MessageList 组件

**Files:**
- Create: `src/components/chat/MessageList.vue`

- [ ] **Step 1: 创建 src/components/chat/MessageList.vue**

```vue
<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useChatStore } from '@/stores/chatStore'
import MessageBubble from './MessageBubble.vue'

const store = useChatStore()
const containerRef = ref<HTMLElement | null>(null)

// 自动滚动到底部
watch(
  () => store.messages.length,
  async () => {
    await nextTick()
    if (containerRef.value) {
      containerRef.value.scrollTop = containerRef.value.scrollHeight
    }
  }
)

// 格式化会话开始时间
function getSessionTime(): string {
  if (!store.messages.length) return ''
  const firstMsg = store.messages[0]
  return new Date(firstMsg.timestamp).toLocaleString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <main ref="containerRef" class="flex-1 overflow-y-auto custom-scrollbar py-8 px-4 bg-slate-50">
    <div class="max-w-chat mx-auto space-y-6">
      
      <!-- 会话开始提示 -->
      <div v-if="store.hasMessages" class="text-center py-4">
        <div class="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2">
          <span class="text-slate-400 text-sm">会话开始于</span>
          <span class="text-slate-700 font-medium text-sm">{{ getSessionTime() }}</span>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-if="!store.hasMessages" class="text-center py-20">
        <div class="w-16 h-16 mx-auto gradient-blue rounded-2xl flex items-center justify-center mb-4">
          <span class="text-white text-3xl">🦞</span>
        </div>
        <h2 class="text-lg font-medium text-slate-700 mb-2">开始新对话</h2>
        <p class="text-sm text-slate-500">输入消息与 AI Assistant 开始聊天</p>
      </div>
      
      <!-- 消息列表 -->
      <MessageBubble 
        v-for="msg in store.messages" 
        :key="msg.id"
        :message="msg"
      />
      
    </div>
  </main>
</template>

<style scoped>
.gradient-blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.max-w-chat {
  max-width: 768px;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/chat/MessageList.vue
git commit -m "feat: add MessageList component with auto-scroll"
```

---

## Task 16: ChatContainer 组件

**Files:**
- Create: `src/components/chat/ChatContainer.vue`

- [ ] **Step 1: 创建 src/components/chat/ChatContainer.vue**

```vue
<script setup lang="ts">
import ChatHeader from './ChatHeader.vue'
import MessageList from './MessageList.vue'
import ChatInput from './ChatInput.vue'
import { useOpenClawChat } from '@/composables/useOpenClawChat'

// 初始化 SDK 连接
useOpenClawChat()
</script>

<template>
  <div class="w-full h-screen flex flex-col bg-white">
    <ChatHeader />
    <MessageList />
    <ChatInput />
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/chat/ChatContainer.vue
git commit -m "feat: add ChatContainer as main layout component"
```

---

## Task 17: 验证与测试

- [ ] **Step 1: 运行 TypeScript 检查**

Run: `pnpm vue-tsc --noEmit`

Expected: 无类型错误

- [ ] **Step 2: 运行构建**

Run: `pnpm build`

Expected: 构建成功，dist 目录生成

- [ ] **Step 3: 启动开发服务器**

Run: `pnpm dev`

Expected: 服务启动，浏览器可访问 http://localhost:5173

- [ ] **Step 4: 确认组件渲染**

在浏览器中检查：
- Header 显示 Logo + Agent 选择器
- MessageList 显示空状态
- ChatInput 显示输入框 + 连接状态

- [ ] **Step 5: 最终 Commit**

```bash
git add .
git commit -m "feat: complete OpenClaw Chat UI implementation"
```

---

## Self-Review

**1. Spec Coverage Check:**

| 规范要求 | 对应 Task |
|----------|-----------|
| 全宽居中布局 | Task 6, 15, 16 |
| 白蓝配色 | Task 3 (CSS), 各组件 style |
| 用户消息气泡 | Task 8 (MessageBubble) |
| AI消息气泡 | Task 8 (MessageBubble) |
| 代码块 + 复制 | Task 10 (CodeBlock) |
| 工具状态动画 | Task 11 (ToolStatus) |
| 图片网格 | Task 12 (MediaGrid) |
| 链接预览 | Task 13 (LinkPreview) |
| 文件附件 | Task 14 (FileAttachment) |
| 流式光标 | Task 9 (StreamingText) |
| 输入框 + 按钮 | Task 7 (ChatInput) |
| Agent 选择器 | Task 6 (ChatHeader) |
| 新建会话 | Task 6 (ChatHeader) |
| 连接状态 | Task 7 (ChatInput) |
| Token 计数 | Task 4 (Store), Task 7 |
| openclaw-webchat SDK | Task 5 (Hook) |
| Pinia 状态管理 | Task 4 (Store) |

✅ 所有规范要求已覆盖

**2. Placeholder Scan:**

- ✅ 无 TBD / TODO
- ✅ 无 "implement later"
- ✅ 所有代码块完整
- ✅ 所有命令明确

**3. Type Consistency:**

- `Message` 类型在 Task 2 定义，Task 8/15 使用一致
- `ToolCall` 类型在 Task 2 定义，Task 11 使用一致
- `ConnectionState` 类型在 Task 2 定义，Task 4/7 使用一致
- Store 方法命名在 Task 4 定义，Task 5/7/8 使用一致

✅ 类型一致

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-04-16-openclaw-chat-ui.md`**

**Two execution options:**

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**