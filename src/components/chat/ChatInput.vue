<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChatStore } from '@/stores/chatStore'
import { useOpenClawChat } from '@/composables/useOpenClawChat'

const store = useChatStore()
const { sendMessage } = useOpenClawChat()

const inputText = ref('')
const isFocused = ref(false)

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
</script>

<template>
  <footer class="bg-white border-t border-slate-200 p-4">
    <div class="max-w-chat mx-auto">
      <div 
        class="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-slate-200 transition"
        :class="{ 'border-blue-300 shadow-[0_0_0_3px_rgba(59,130,246,0.2)]': isFocused }"
      >
        <button class="w-10 h-10 rounded-full bg-slate-50 hover:bg-blue-50 flex items-center justify-center text-slate-400 hover:text-blue-500 transition">
          📎
        </button>
        
        <input 
          v-model="inputText"
          type="text"
          placeholder="输入消息，按 Enter 发送..."
          class="flex-1 bg-transparent text-slate-700 text-sm outline-none placeholder:text-slate-400"
          :disabled="store.isStreaming || store.isConnected !== 'connected'"
          @keydown="handleKeydown"
          @focus="isFocused = true"
          @blur="isFocused = false"
        />
        
        <button class="w-10 h-10 rounded-full bg-slate-50 hover:bg-blue-50 flex items-center justify-center text-slate-400 hover:text-blue-500 transition">
          🎤
        </button>
        
        <button 
          @click="handleSend"
          :disabled="!inputText.trim() || store.isStreaming || store.isConnected !== 'connected'"
          class="w-10 h-10 rounded-full gradient-blue text-white flex items-center justify-center btn-hover shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span class="text-lg">→</span>
        </button>
      </div>
      
      <div class="flex items-center justify-between mt-2 text-xs text-slate-400">
        <span>支持 Markdown、代码块</span>
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded border" :class="connectionColor">
            {{ store.isConnected === 'connected' ? '🟢' : store.isConnected === 'error' ? '🔴' : '🟡' }} 
            {{ connectionText }}
          </span>
          <span class="text-slate-500">Token: {{ store.tokenCount }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.gradient-blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.max-w-chat {
  max-width: 768px;
}
</style>
