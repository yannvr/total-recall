import { defineStore } from 'pinia'

export interface Tag {
  id: number;
  name: string;
}

export interface Conversation {
  id: number;
  text: string;
  tags: Tag[];
}

export const useConversationsStore = defineStore('conversations', {
  state: () => ({
    conversations: [] as Conversation[],
    tags: [] as Tag[]
  }),
  actions: {
    addConversation (conversation: Conversation) {
      this.conversations.push(conversation)
    },
    addTag (conversationId: number, tag: Tag) {
      console.log('Adding tag', tag, 'to conversation', conversationId)
      const conversation = this.conversations.find(
        (c) => c.id === conversationId
      )
      if (conversation) {
        conversation.tags.push(tag)
      }
    }
  }
})

// Mock conversations
const mockConversations: Conversation[] = [
  {
    id: 1,
    text: 'Hello, how can I help you today?',
    tags: [{ id: 1, name: 'greeting' }]
  },
  {
    id: 2,
    text: 'Can you tell me more about your services?',
    tags: [{ id: 2, name: 'inquiry' }]
  }
]

// Initialize store with mock conversations
const store = useConversationsStore()
store.$patch({
  conversations: mockConversations
})
