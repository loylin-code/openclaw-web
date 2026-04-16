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
