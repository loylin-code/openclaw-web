# OpenClaw Chat UI 设计规范

**日期**: 2026-04-16
**技术栈**: Vue 3 + Vite + TypeScript + openclaw-webchat SDK
**状态**: 已确认

---

## 1. 设计目标

构建一个现代化、简洁的聊天 UI，完整支持 OpenClaw 的消息类型展示。

### 核心要求

- 文本消息（支持流式输出）
- 代码片段（语法高亮、复制功能）
- 多媒体内容（图片、文件附件、链接预览）
- Agent 工具调用状态（思考状态、工具执行进度）

---

## 2. 视觉设计

### 2.1 布局方案

**全宽纯净居中布局**

```
┌────────────────────────────────────────────────────────────┐
│  Header (Logo + Agent Selector + Actions)                  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│     ┌─────────────────────────────────────────┐            │
│     │  Messages Area (max-width: 768px)       │            │
│     │  - 左右分列气泡                          │            │
│     │  - 居中显示                              │            │
│     └─────────────────────────────────────────┘            │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  Input Area (Attachment + Input + Voice + Send)            │
└────────────────────────────────────────────────────────────┘
```

**优势**:
- 阅读体验最佳
- 长代码展示友好
- 移动端响应式友好

### 2.2 颜色主题

**白蓝配色**

| 元素 | 颜色值 | 用途 |
|------|--------|------|
| 主色蓝 | `#3b82f6` → `#2563eb` | 用户消息气泡、按钮、强调元素 |
| 背景 | `#ffffff` / `#f8fafc` | 主背景、消息区域 |
| 边框 | `#e2e8f0` / `#cbd5e1` | 卡片边框、分割线 |
| 文字 | `#334155` (主) / `#64748b` (次) | 正文、辅助文字 |
| 代码块 | `#1e293b` | 深色背景保持对比度 |
| 成功 | `#22c55e` | 工具完成、连接状态 |
| 警告 | `#f59e0b` | 工具执行中 |
| 错误 | `#ef4444` | 错误状态 |

### 2.3 消息气泡

**左右分列样式**

- **用户消息**: 右对齐，蓝色渐变背景，圆角 `20px 20px 6px 20px`
- **AI消息**: 左对齐，白色背景，浅灰边框，圆角 `20px 20px 20px 6px`

---

## 3. 组件规格

### 3.1 Header

```
高度: 64px
背景: #ffffff
边框: 1px solid #e2e8f0

左侧:
  - Logo (40x40, 蓝色渐变圆角)
  - 标题 "OpenClaw Chat" + 副标题
  - Agent 选择器 (下拉，边框样式)

右侧:
  - "新建会话" 按钮 (蓝色渐变填充)
  - 设置按钮 (图标，边框样式)
```

### 3.2 消息区域

```
背景: #f8fafc
最大宽度: 768px (居中)
内边距: 32px 16px
消息间距: 24px
滚动条: 6px 宽度，灰色，圆角
```

### 3.3 消息组件

#### AI 消息气泡

```
背景: #ffffff
边框: 1px solid #e2e8f0
圆角: 20px 20px 20px 6px
内边距: 20px
阴影: 0 1px 3px rgba(0,0,0,0.05)

结构:
  - Avatar (32x32 蓝色圆)
  - 名称 + 时间戳
  - 消息内容
  - 操作按钮区 (有帮助 / 重新生成 / 自动修复)
```

#### 代码块

```
背景: #1e293b
Header 背景: #334155
圆角: 12px
字体: JetBrains Mono
字号: 14px
Header 内容: 语言标签 + 文件名 + 复制按钮
```

#### 工具状态

```
执行中:
  背景: #dbeafe
  边框: 1px solid #3b82f6
  颜色: #1d4ed8
  动画: 三点脉冲

完成:
  背景: #dcfce7
  边框: 1px solid #22c55e
  颜色: #166534
```

#### 图片网格

```
布局: 3列 grid
间距: 12px
圆角: 8px
比例: 1:1
```

#### 链接预览

```
背景: #ffffff
边框: 1px solid #e2e8f0
圆角: 12px
内边距: 12px
结构: 图标 + 标题 + 来源 + 描述
```

#### 文件附件

```
背景: #eff6ff (blue-50)
边框: 1px solid #bfdbfe (blue-200)
圆角: 8px
结构: 文件图标 + 名称/大小 + 下载按钮
```

### 3.4 输入区域

```
背景: #ffffff
边框: 顶部 1px solid #e2e8f0
高度: 72px (含提示行)

输入框:
  背景: #ffffff
  边框: 1px solid #e2e8f0
  圆角: 12px
  焦点: 蓝色光环 (box-shadow)

按钮:
  - 附件: 40x40 圆形，灰色背景 hover 蓝色
  - 语音: 40x40 圆形，灰色背景 hover 蓝色
  - 发送: 40x40 圆形，蓝色渐变，阴影

底部提示:
  左: "支持 Markdown、代码块、@提及 Agent"
  右: 连接状态 + Token 计数
```

---

## 4. 动效

| 动效 | 说明 |
|------|------|
| 流式光标 | `▊` 字符，1s blink 动画，蓝色 |
| 工具脉冲 | 三点动画，1.5s cycle，opacity 变化 |
| 按钮 hover | 上移 1px + 阴影增强 |
| 焦点环 | 3px blue ring，0.2s transition |

---

## 5. 响应式

| 断点 | 宽度 | 调整 |
|------|------|------|
| Desktop | ≥1024px | 768px 居中 |
| Tablet | 768-1024px | 90% 宽度 |
| Mobile | <768px | 100% 宽度，紧凑间距 |

---

## 6. 组件清单

| 组件 | 文件 | 说明 |
|------|------|------|
| `ChatHeader` | `ChatHeader.vue` | 顶部导航 |
| `MessageList` | `MessageList.vue` | 消息列表容器 |
| `MessageBubble` | `MessageBubble.vue` | 消息气泡（用户/AI） |
| `CodeBlock` | `CodeBlock.vue` | 代码块 + 语法高亮 |
| `ToolStatus` | `ToolStatus.vue` | 工具执行状态 |
| `MediaGrid` | `MediaGrid.vue` | 图片网格 |
| `LinkPreview` | `LinkPreview.vue` | 链接预览卡片 |
| `FileAttachment` | `FileAttachment.vue` | 文件附件卡片 |
| `StreamingText` | `StreamingText.vue` | 流式文本 + 光标 |
| `ChatInput` | `ChatInput.vue` | 输入框 + 按钮 |
| `ChatContainer` | `ChatContainer.vue` | 主容器 |

---

## 7. 技术集成

### openclaw-webchat SDK

```typescript
// 安装
pnpm add openclaw-webchat

// 使用
import { OpenClawClient } from 'openclaw-webchat';

const client = new OpenClawClient({
  gateway: 'wss://localhost:18789',
  token: config.gatewayToken
});

// 事件监听
client.on('message', (msg) => { ... });
client.on('streamChunk', (id, chunk) => { ... });
client.on('toolUse', (tool) => { ... });
```

### 状态管理

```typescript
// stores/chatStore.ts (Pinia)
interface ChatState {
  messages: Message[];
  isConnected: boolean;
  isStreaming: boolean;
  currentTool: ToolStatus | null;
  tokenCount: number;
}
```

---

## 8. 文件结构

```
src/
├── components/
│   └── chat/
│       ├── ChatContainer.vue
│       ├── ChatHeader.vue
│       ├── MessageList.vue
│       ├── MessageBubble.vue
│       ├── CodeBlock.vue
│       ├── ToolStatus.vue
│       ├── MediaGrid.vue
│       ├── LinkPreview.vue
│       ├── FileAttachment.vue
│       ├── StreamingText.vue
│       └── ChatInput.vue
├── composables/
│   └── useOpenClawChat.ts    # SDK集成Hook
├── stores/
│   └── chatStore.ts          # Pinia状态
├── types/
│   └── chat.ts               # 类型定义
└── styles/
    └── chat.css              # 组件样式
```

---

## 9. 下一步

- [ ] 使用 writing-plans skill 创建实施计划
- [ ] 初始化 Vue 3 + Vite 项目
- [ ] 安装依赖
- [ ] 按组件清单逐一实现

---

**审核状态**: 待用户确认