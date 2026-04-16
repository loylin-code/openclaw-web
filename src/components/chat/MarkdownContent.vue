<script setup lang="ts">
import { computed } from 'vue'
import { marked, Renderer, type Tokens } from 'marked'
import hljs from 'highlight.js'

const props = defineProps<{
  content: string
  streaming?: boolean
}>()

// 创建自定义渲染器以支持代码高亮
const renderer = new Renderer()

// 代码块渲染 - 使用新版 object 参数 API
renderer.code = function({ text, lang }: Tokens.Code) {
  const language = lang || ''
  let highlightedCode: string
  
  if (language && hljs.getLanguage(language)) {
    try {
      highlightedCode = hljs.highlight(text, { language }).value
    } catch {
      highlightedCode = hljs.highlightAuto(text).value
    }
  } else {
    highlightedCode = hljs.highlightAuto(text).value
  }
  
  return `<pre><code class="hljs language-${language}">${highlightedCode}</code></pre>`
}

// 行内代码渲染 - 使用新版 object 参数 API
renderer.codespan = function({ text }: Tokens.Codespan) {
  return `<code class="inline-code">${text}</code>`
}

// 配置 marked
marked.setOptions({
  renderer,
  breaks: true,
  gfm: true
})

// 渲染 Markdown
const renderedContent = computed(() => {
  if (!props.content) return ''
  try {
    return marked.parse(props.content) as string
  } catch {
    return props.content
  }
})
</script>

<template>
  <div class="markdown-content text-sm leading-relaxed text-slate-700">
    <!-- 流式渲染时显示原始文本 + 光标 -->
    <span v-if="streaming" class="typing-cursor">{{ content }}</span>
    <!-- 非流式时渲染 Markdown -->
    <div v-else v-html="renderedContent"></div>
  </div>
</template>

<style scoped>
.markdown-content {
  word-wrap: break-word;
}

/* 代码块样式 */
.markdown-content :deep(pre) {
  background: #1e293b;
  color: #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  overflow-x: auto;
  margin: 12px 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
}

.markdown-content :deep(code) {
  font-family: 'JetBrains Mono', monospace;
}

/* 行内代码样式 */
.markdown-content :deep(p code),
.markdown-content :deep(li code) {
  background: #f1f5f9;
  color: #3b82f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}

/* 代码块内的 code */
.markdown-content :deep(pre code) {
  background: transparent;
  padding: 0;
  color: inherit;
}

/* 段落样式 */
.markdown-content :deep(p) {
  margin: 0 0 12px 0;
}

.markdown-content :deep(p:last-child) {
  margin-bottom: 0;
}

/* 列表样式 */
.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 8px 0;
  padding-left: 20px;
}

.markdown-content :deep(li) {
  margin: 4px 0;
}

/* 标题样式 */
.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4) {
  margin: 16px 0 8px 0;
  font-weight: 600;
  color: #1e293b;
}

.markdown-content :deep(h1) { font-size: 1.5em; }
.markdown-content :deep(h2) { font-size: 1.3em; }
.markdown-content :deep(h3) { font-size: 1.1em; }

/* 链接样式 */
.markdown-content :deep(a) {
  color: #3b82f6;
  text-decoration: underline;
  cursor: pointer;
}

.markdown-content :deep(a:hover) {
  color: #2563eb;
}

/* 引用样式 */
.markdown-content :deep(blockquote) {
  border-left: 3px solid #3b82f6;
  padding-left: 12px;
  margin: 12px 0;
  color: #64748b;
}

/* 表格样式 */
.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  border: 1px solid #e2e8f0;
  padding: 8px 12px;
}

.markdown-content :deep(th) {
  background: #f8fafc;
  font-weight: 600;
}

/* 分隔线 */
.markdown-content :deep(hr) {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 16px 0;
}

/* 流式光标 */
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