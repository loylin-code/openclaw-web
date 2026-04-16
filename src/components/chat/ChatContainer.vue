<script setup lang="ts">
import ChatHeader from './ChatHeader.vue'
import MessageList from './MessageList.vue'
import ChatInput from './ChatInput.vue'
import { useOpenClawChat } from '@/composables/useOpenClawChat'

// 初始化 SDK 连接
useOpenClawChat()
</script>

<template>
  <div class="w-full h-screen flex flex-col bg-white">
    <ChatHeader />
    <MessageList />
    <ChatInput />
  </div>
</template>
