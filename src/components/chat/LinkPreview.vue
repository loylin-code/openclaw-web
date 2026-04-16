<script setup lang="ts">
import type { LinkPreview as LinkPreviewType } from '@/types/chat'

const props = defineProps<{
  link: LinkPreviewType
}>()

function getHostname(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function openLink() {
  window.open(props.link.url, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div class="bg-white border border-slate-200 rounded-lg p-3 cursor-pointer hover:border-blue-300 transition" @click="openLink">
    <div class="flex items-start gap-3">
      <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
        <span class="text-blue-500">🔗</span>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-slate-800 truncate">{{ link.title }}</p>
        <p class="text-xs text-slate-400 truncate">{{ link.siteName || getHostname(link.url) }}</p>
        <p v-if="link.description" class="text-xs text-slate-600 mt-1 line-clamp-2">{{ link.description }}</p>
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
