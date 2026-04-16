import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles/chat.css'
import 'highlight.js/styles/github-dark.css' // 代码高亮样式

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
