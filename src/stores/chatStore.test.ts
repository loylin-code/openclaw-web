import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useChatStore } from './chatStore'
import type { Message, ToolCall, Agent } from '@/types/chat'

describe('chatStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('state initialization', () => {
    it('should initialize with empty messages', () => {
      const store = useChatStore()
      expect(store.messages).toEqual([])
    })

    it('should initialize with disconnected state', () => {
      const store = useChatStore()
      expect(store.isConnected).toBe('disconnected')
    })

    it('should initialize with isStreaming false', () => {
      const store = useChatStore()
      expect(store.isStreaming).toBe(false)
    })

    it('should initialize with empty tokenCount', () => {
      const store = useChatStore()
      expect(store.tokenCount).toBe(0)
    })

    it('should initialize with empty agents list', () => {
      const store = useChatStore()
      expect(store.agents).toEqual([])
    })

    it('should initialize with default agent', () => {
      const store = useChatStore()
      expect(store.currentAgent).toBe('default')
    })

    it('should initialize with empty sessionId', () => {
      const store = useChatStore()
      expect(store.sessionId).toBe('')
    })
  })

  describe('addMessage', () => {
    it('should add a message to the messages array', () => {
      const store = useChatStore()
      const message: Message = {
        id: '1',
        role: 'user',
        content: 'Hello',
        timestamp: Date.now()
      }

      store.addMessage(message)

      expect(store.messages).toHaveLength(1)
      expect(store.messages[0]).toEqual(message)
    })
  })

  describe('updateMessageContent', () => {
    it('should update message content by id', () => {
      const store = useChatStore()
      const message: Message = {
        id: '1',
        role: 'assistant',
        content: 'Initial',
        timestamp: Date.now()
      }
      store.addMessage(message)

      store.updateMessageContent('1', 'Updated content')

      expect(store.messages[0].content).toBe('Updated content')
    })
  })

  describe('finishMessage', () => {
    it('should mark message as not streaming', () => {
      const store = useChatStore()
      const message: Message = {
        id: '1',
        role: 'assistant',
        content: 'Streaming...',
        timestamp: Date.now(),
        streaming: true
      }
      store.addMessage(message)
      store.setStreaming(true)

      store.finishMessage('1')

      expect(store.messages[0].streaming).toBe(false)
      expect(store.isStreaming).toBe(false)
    })
  })

  describe('addToolCall', () => {
    it('should add tool call to last assistant message', () => {
      const store = useChatStore()
      const assistantMsg: Message = {
        id: '1',
        role: 'assistant',
        content: 'Let me check',
        timestamp: Date.now()
      }
      store.addMessage(assistantMsg)

      const tool: ToolCall = {
        id: 'tool-1',
        name: 'search',
        status: 'pending'
      }
      store.addToolCall(tool)

      expect(store.messages[0].toolCalls).toHaveLength(1)
      expect(store.currentTool).toEqual(tool)
    })
  })

  describe('updateToolStatus', () => {
    it('should update tool status and optionally set output', () => {
      const store = useChatStore()
      const assistantMsg: Message = {
        id: '1',
        role: 'assistant',
        content: 'Processing',
        timestamp: Date.now(),
        toolCalls: [{
          id: 'tool-1',
          name: 'search',
          status: 'running'
        }]
      }
      store.addMessage(assistantMsg)

      store.updateToolStatus('tool-1', 'completed', 'Search results')

      const tool = store.messages[0].toolCalls![0]
      expect(tool.status).toBe('completed')
      expect(tool.output).toBe('Search results')
      expect(tool.completedAt).toBeDefined()
    })
  })

  describe('clearMessages', () => {
    it('should clear all messages and reset token count', () => {
      const store = useChatStore()
      store.addMessage({ id: '1', role: 'user', content: 'Hi', timestamp: Date.now() })
      store.addMessage({ id: '2', role: 'assistant', content: 'Hello', timestamp: Date.now() })
      store.incrementTokens(100)

      store.clearMessages()

      expect(store.messages).toEqual([])
      expect(store.tokenCount).toBe(0)
    })
  })

  describe('setConnectionState', () => {
    it('should update connection state', () => {
      const store = useChatStore()
      store.setConnectionState('connecting')
      expect(store.isConnected).toBe('connecting')

      store.setConnectionState('connected')
      expect(store.isConnected).toBe('connected')
    })
  })

  describe('setStreaming', () => {
    it('should update streaming state', () => {
      const store = useChatStore()
      store.setStreaming(true)
      expect(store.isStreaming).toBe(true)

      store.setStreaming(false)
      expect(store.isStreaming).toBe(false)
    })
  })

  describe('incrementTokens', () => {
    it('should increase token count', () => {
      const store = useChatStore()
      store.incrementTokens(10)
      expect(store.tokenCount).toBe(10)

      store.incrementTokens(5)
      expect(store.tokenCount).toBe(15)
    })
  })

  describe('setAgents', () => {
    it('should set the agents list', () => {
      const store = useChatStore()
      const agentList: Agent[] = [
        { id: '1', name: 'Assistant 1' },
        { id: '2', name: 'Assistant 2' }
      ]

      store.setAgents(agentList)

      expect(store.agents).toEqual(agentList)
    })
  })

  describe('selectAgent', () => {
    it('should select an agent by id', () => {
      const store = useChatStore()
      store.selectAgent('agent-123')
      expect(store.currentAgent).toBe('agent-123')
    })
  })

  describe('setSessionId', () => {
    it('should set the session id', () => {
      const store = useChatStore()
      store.setSessionId('session-abc')
      expect(store.sessionId).toBe('session-abc')
    })
  })

  describe('computed properties', () => {
    describe('lastMessage', () => {
      it('should return the last message', () => {
        const store = useChatStore()
        store.addMessage({ id: '1', role: 'user', content: 'First', timestamp: Date.now() })
        store.addMessage({ id: '2', role: 'assistant', content: 'Second', timestamp: Date.now() })

        expect(store.lastMessage?.id).toBe('2')
      })
    })

    describe('hasMessages', () => {
      it('should return true when there are messages', () => {
        const store = useChatStore()
        expect(store.hasMessages).toBe(false)

        store.addMessage({ id: '1', role: 'user', content: 'Hi', timestamp: Date.now() })
        expect(store.hasMessages).toBe(true)
      })
    })
  })
})
