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
    <div class="code-header px-4 py-2 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-xs text-slate-400">{{ language }}</span>
        <span v-if="filename" class="text-xs text-slate-500">• {{ filename }}</span>
      </div>
      <button @click="handleCopy" class="text-xs text-slate-400 hover:text-white transition">
        {{ copied ? '✓ 已复制' : '📋 复制' }}
      </button>
    </div>
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
