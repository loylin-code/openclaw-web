<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
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
const sessionStartTime = computed(() => {
  if (!store.messages.length) return ''
  const firstMsg = store.messages[0]
  return new Date(firstMsg.timestamp).toLocaleString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
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
