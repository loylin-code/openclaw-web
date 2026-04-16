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
</script>

<template>
  <div :class="['px-4 py-2 rounded-xl flex items-center gap-3', statusClass]">
    <div v-if="tool.status === 'running'" class="flex gap-1">
      <span class="w-2 h-2 rounded-full bg-blue-500 streaming-dot"></span>
      <span class="w-2 h-2 rounded-full bg-blue-500 streaming-dot" style="animation-delay: 0.3s"></span>
      <span class="w-2 h-2 rounded-full bg-blue-500 streaming-dot" style="animation-delay: 0.6s"></span>
    </div>
    <span v-else class="text-sm">{{ statusIcon }}</span>
    
    <div>
      <p class="text-sm font-medium">{{ tool.name }}</p>
      <p class="text-xs opacity-70">{{ tool.status }} • {{ tool.id }}</p>
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
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
}
</style>
