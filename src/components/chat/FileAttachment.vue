<script setup lang="ts">
import type { FileAttachment as FileAttachmentType } from '@/types/chat'

const props = defineProps<{
  file: FileAttachmentType
}>()

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function getFileIcon(type: string): string {
  if (type.includes('image')) return '🖼️'
  if (type.includes('pdf')) return '📄'
  if (type.includes('zip') || type.includes('archive')) return '📦'
  if (type.includes('code') || type.includes('script')) return '💻'
  return '📁'
}

function handleDownload() {
  if (props.file.url) window.open(props.file.url, '_blank')
}
</script>

<template>
  <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
      <span class="text-blue-600 text-lg">{{ getFileIcon(file.type) }}</span>
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-slate-800 truncate">{{ file.name }}</p>
      <p class="text-xs text-slate-500">{{ formatSize(file.size) }} • {{ file.type }}</p>
    </div>
    <button v-if="file.url" @click="handleDownload" class="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition">
      ⬇ 下载
    </button>
  </div>
</template>
