<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '@/types/chat'
import MarkdownContent from './MarkdownContent.vue'
import CodeBlock from './CodeBlock.vue'
import ToolStatus from './ToolStatus.vue'
import MediaGrid from './MediaGrid.vue'
import LinkPreview from './LinkPreview.vue'
import FileAttachment from './FileAttachment.vue'

const props = defineProps<{
  message: Message
}>()

const isUser = computed(() => props.message.role === 'user')
const isAI = computed(() => props.message.role === 'assistant')

const formattedTime = computed(() => {
  const date = new Date(props.message.timestamp)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
})

// 是否有附加内容
const hasAttachments = computed(() => {
  return props.message.codeBlocks?.length ||
         props.message.media?.length ||
         props.message.links?.length ||
         props.message.files?.length ||
         props.message.toolCalls?.length
})
</script>

<template>
  <div :class="isUser ? 'flex justify-end' : 'flex justify-start'">
    <!-- 用户消息 -->
    <div v-if="isUser" class="bubble-user px-5 py-3 max-w-lg shadow-md">
      <MarkdownContent :content="message.content" />
    </div>
    
    <!-- AI 消息 -->
    <div v-if="isAI" class="max-w-2xl w-full">
      <div class="flex items-center gap-2 mb-3 ml-1">
        <div class="w-8 h-8 gradient-blue rounded-full flex items-center justify-center">
          <span class="text-white text-sm">🦞</span>
        </div>
        <span class="text-sm text-slate-500 font-medium">AI Assistant</span>
        <span class="text-xs text-slate-400">• {{ formattedTime }}</span>
        <span v-if="message.streaming" class="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded font-medium">
          生成中...
        </span>
      </div>
      
      <div class="bubble-ai p-5">
        <!-- Markdown 内容渲染 -->
        <MarkdownContent :content="message.content" :streaming="message.streaming" />
        
        <!-- 附加内容 -->
        <div v-if="hasAttachments && !message.streaming">
          <!-- 代码块 -->
          <div v-if="message.codeBlocks?.length" class="mt-4 space-y-3">
            <CodeBlock 
              v-for="(block, idx) in message.codeBlocks" 
              :key="idx"
              :code="block.code"
              :language="block.language"
              :filename="block.filename"
            />
          </div>
          
          <!-- 图片网格 -->
          <MediaGrid v-if="message.media?.length" :items="message.media" class="mt-4" />
          
          <!-- 链接预览 -->
          <div v-if="message.links?.length" class="mt-3 space-y-2">
            <LinkPreview v-for="(link, idx) in message.links" :key="idx" :link="link" />
          </div>
          
          <!-- 文件附件 -->
          <div v-if="message.files?.length" class="mt-3 space-y-2">
            <FileAttachment v-for="(file, idx) in message.files" :key="idx" :file="file" />
          </div>
          
          <!-- 工具调用 -->
          <div v-if="message.toolCalls?.length" class="mt-4 space-y-2">
            <ToolStatus v-for="(tool, idx) in message.toolCalls" :key="idx" :tool="tool" />
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div v-if="!message.streaming" class="flex gap-2 mt-4 pt-4 border-t border-slate-100">
          <button class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-blue-300 hover:text-blue-600 transition">
            👍 有帮助
          </button>
          <button class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-blue-300 hover:text-blue-600 transition">
            🔄 重新生成
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gradient-blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.bubble-user {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-radius: 20px 20px 6px 20px;
}

.bubble-ai {
  background: white;
  color: #334155;
  border: 1px solid #e2e8f0;
  border-radius: 20px 20px 20px 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
</style>