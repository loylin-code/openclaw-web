<script setup lang="ts">
import { useChatStore } from '@/stores/chatStore'
import { computed } from 'vue'

const store = useChatStore()

const agentOptions = computed(() => store.agents)

function handleNewSession() {
  store.clearMessages()
  store.setSessionId('')
}

function handleAgentChange(event: Event) {
  const target = event.target as HTMLSelectElement
  store.selectAgent(target.value)
}
</script>

<template>
  <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
    <!-- 左侧: Logo + Agent 选择器 -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center">
          <span class="text-white text-xl">🦞</span>
        </div>
        <div>
          <h1 class="text-slate-800 font-semibold text-sm">OpenClaw Chat</h1>
          <p class="text-slate-400 text-xs">AI Assistant</p>
        </div>
      </div>
      
      <!-- Agent 选择器 -->
      <div class="ml-6 flex items-center gap-2 border border-slate-200 rounded-full px-4 py-2 hover:border-blue-300 transition cursor-pointer">
        <span class="text-slate-500 text-sm">Agent:</span>
        <select 
          class="bg-transparent text-slate-700 font-medium text-sm outline-none cursor-pointer"
          :value="store.currentAgent"
          @change="handleAgentChange"
        >
          <option value="default">Default Agent</option>
          <option v-for="agent in agentOptions" :key="agent.id" :value="agent.id">
            {{ agent.name }}
          </option>
        </select>
        <span class="text-slate-400 text-xs">▼</span>
      </div>
    </div>
    
    <!-- 右侧: 操作按钮 -->
    <div class="flex items-center gap-3">
      <button 
        @click="handleNewSession"
        class="px-4 py-2 gradient-blue text-white rounded-full text-sm font-medium btn-hover"
      >
        + 新建会话
      </button>
      <button class="w-9 h-9 border border-slate-200 rounded-full text-slate-500 flex items-center justify-center hover:border-blue-300 hover:text-blue-500 transition">
        ⚙
      </button>
    </div>
  </header>
</template>

<style scoped>
.gradient-blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}
</style>
