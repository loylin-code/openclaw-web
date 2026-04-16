<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useChatStore } from '@/stores/chatStore'
import MessageBubble from './MessageBubble.vue'

const store = useChatStore()
const containerRef = ref<HTMLElement | null>(null)
const bottomRef = ref<HTMLElement | null>(null)

// 滚动到底部函数 - 使用 scrollIntoView 更可靠
function scrollToBottom() {
  if (bottomRef.value) {
    bottomRef.value.scrollIntoView({ behavior: 'smooth', block: 'end' })
  } else if (containerRef.value) {
    containerRef.value.scrollTop = containerRef.value.scrollHeight
  }
}

// 监听消息变化 - 使用 flush: 'post' 确保 DOM 更换后触发
watch(
  () => store.messages.map(m => m.content),
  () => scrollToBottom(),
  { flush: 'post' }
)

// 监听流式状态变化
watch(
  () => store.isStreaming,
  () => scrollToBottom(),
  { flush: 'post' }
)

// 初始化时滚动到底部
onMounted(() => {
  scrollToBottom()
})

// 格式化会话开始时间
const sessionStartTime = computed(() => {
  if (!store.messages.length) return ''
  const firstMsg = store.messages[0]
  return new Date(firstMsg.timestamp).toLocaleString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
})

// 是否显示"正在思考"提示（用户发送后等待AI响应）
const showThinking = computed(() => {
  // 流式状态开启，但最后一条消息不是 assistant 或者 assistant 内容为空
  if (store.isStreaming) {
    const lastMsg = store.lastMessage
    // 如果最后一条是用户消息，说明正在等待 AI 响应
    if (lastMsg?.role === 'user') return true
    // 如果最后一条是 AI 消息但内容为空，也显示思考中
    if (lastMsg?.role === 'assistant' && !lastMsg.content?.trim()) return true
  }
  return false
})
</script>

<template>
  <main ref="containerRef" class="flex-1 overflow-y-auto custom-scrollbar py-8 px-4 bg-slate-50">
    <div class="max-w-chat mx-auto space-y-6">
      
      <!-- 会话开始提示 -->
      <div v-if="store.hasMessages" class="text-center py-4">
        <div class="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2">
          <span class="text-slate-400 text-sm">会话开始于</span>
          <span class="text-slate-700 font-medium text-sm">{{ sessionStartTime }}</span>
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
      <MessageBubble v-for="msg in store.messages" :key="msg.id" :message="msg" />
      
      <!-- 正在思考提示 -->
      <div v-if="showThinking" class="thinking-indicator">
        <div class="avatar-ai">
          <span class="text-sm">🦞</span>
        </div>
        <div class="thinking-content">
          <div class="thinking-dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <span class="thinking-text">正在思考...</span>
        </div>
      </div>
      
      <!-- 底部锚点 - 用于自动滚动 -->
      <div ref="bottomRef" class="scroll-anchor"></div>
      
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

/* 头像样式 */
.avatar-ai {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 1px solid #93c5fd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

/* 正在思考提示 */
.thinking-indicator {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px 20px 20px 6px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  max-width: 200px;
}

.thinking-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.thinking-dots {
  display: flex;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
  animation: thinking-pulse 1.4s ease-in-out infinite;
}

.dot:nth-child(1) { animation-delay: 0s; }
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes thinking-pulse {
  0%, 100% { 
    opacity: 0.4;
    transform: scale(0.8);
  }
  50% { 
    opacity: 1;
    transform: scale(1);
  }
}

.thinking-text {
  font-size: 14px;
  color: #64748b;
}

/* 滚动锚点 */
.scroll-anchor {
  height: 1px;
  clear: both;
}
</style>
