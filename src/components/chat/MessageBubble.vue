<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '@/types/chat'

const props = defineProps<{
  message: Message
}>()

const isUser = computed(() => props.message.role === 'user')
const isAI = computed(() => props.message.role === 'assistant')

const formattedTime = computed(() => {
  const date = new Date(props.message.timestamp)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
})
</script>

<template>
  <div :class="isUser ? 'flex justify-end' : 'flex justify-start'">
    <!-- 用户消息 -->
    <div v-if="isUser" class="bubble-user px-5 py-3 max-w-lg shadow-md">
      <p class="text-sm leading-relaxed">{{ message.content }}</p>
    </div>
    
    <!-- AI 消息 -->
    <div v-if="isAI" class="max-w-2xl w-full">
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
      
      <div class="bubble-ai p-5">
        <p class="text-sm leading-relaxed text-slate-700">
          {{ message.content }}
          <span v-if="message.streaming" class="typing-cursor"></span>
        </p>
        
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
