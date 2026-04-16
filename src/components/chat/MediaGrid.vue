<script setup lang="ts">
import type { MediaContent } from '@/types/chat'

const props = defineProps<{
  items: MediaContent[]
}>()
</script>

<template>
  <div class="grid grid-cols-3 gap-3">
    <div v-for="(item, idx) in items" :key="idx" class="aspect-square rounded-lg overflow-hidden bg-slate-200">
      <img v-if="item.type === 'image'" :src="item.url" :alt="`Media ${idx + 1}`" class="w-full h-full object-cover" />
      <div v-if="item.type === 'video'" class="w-full h-full flex items-center justify-center bg-slate-300">
        <span class="text-2xl">🎬</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.aspect-square { aspect-ratio: 1; }
</style>
