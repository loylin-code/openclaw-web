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

// 是否显示消息（只有有内容或有附加内容时才显示）
const shouldShow = computed(() => {
  // 内容不为空
  if (props.message.content?.trim()) return true
  // 有附加内容（工具调用等）
  return hasAttachments.value
})
</script>

<template>
  <div v-if="shouldShow" :class="isUser ? 'flex justify-end items-end gap-2' : 'flex justify-start'">
    <!-- 用户消息 -->
    <div v-if="isUser" class="bubble-user px-5 py-3 max-w-lg shadow-sm">
      <MarkdownContent :content="message.content" />
    </div>
    <!-- 用户头像 -->
    <div v-if="isUser" class="avatar-user">
      <span class="text-sm">👤</span>
    </div>
    
    <!-- AI 消息 -->
    <div v-if="isAI" class="max-w-2xl w-full">
      <div class="flex items-center gap-2 mb-3 ml-1">
        <div class="avatar-ai">
          <span class="text-sm">🦞</span>
        </div>
        <span class="text-sm text-slate-500 font-medium">AI Assistant</span>
        <span class="text-xs text-slate-400">• {{ formattedTime }}</span>
        <span v-if="message.streaming" class="streaming-badge">
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
      </div>
      
      <!-- 操作图标按钮 -->
      <div v-if="!message.streaming && message.content?.trim()" class="action-icons">
        <button class="icon-btn" title="有帮助">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.627c-.176-.14-.378-.277-.605-.407a6 6 0 0 0-8.395 5.407v4h10"/><path d="M14 10h3"/><circle cx="17" cy="10" r="3"/><path d="M21 10h-4"/></svg>
        </button>
        <button class="icon-btn" title="复制">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        </button>
        <button class="icon-btn" title="重新生成">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 头像样式 - 统一浅色风格 */
.avatar-user {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 1px solid #93c5fd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.avatar-ai {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 1px solid #93c5fd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

/* 用户气泡 - 浅蓝色背景 */
.bubble-user {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #bfdbfe;
  border-radius: 20px 20px 6px 20px;
  color: #1e40af;
}

/* 用户气泡文字颜色 */
.bubble-user :deep(p),
.bubble-user :deep(span),
.bubble-user :deep(li) {
  color: #1e40af;
}

.bubble-user :deep(code) {
  background: rgba(59, 130, 246, 0.15);
  color: #1d4ed8;
  padding: 2px 6px;
  border-radius: 4px;
}

.bubble-user :deep(a) {
  color: #2563eb;
  text-decoration: underline;
}

/* AI 气泡 - 白色背景 */
.bubble-ai {
  background: white;
  color: #334155;
  border: 1px solid #e2e8f0;
  border-radius: 20px 20px 20px 6px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}

/* 生成中状态标签 */
.streaming-badge {
  font-size: 12px;
  padding: 2px 8px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #3b82f6;
  border-radius: 12px;
  font-weight: 500;
}

/* 操作图标按钮 */
.action-icons {
  display: flex;
  gap: 6px;
  margin-top: 8px;
  margin-left: 44px;
}

.icon-btn {
  width: 28px;
  height: 28px;
  padding: 6px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background: #f1f5f9;
  border-color: #e2e8f0;
  color: #3b82f6;
}

.icon-btn svg {
  flex-shrink: 0;
}
</style>