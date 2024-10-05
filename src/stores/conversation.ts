import { api } from 'app/boot/axios';
import { defineStore } from 'pinia';

interface Tag {
  id: number;
  name: string;
}

interface Message {
  id: number;
  text: string;
  name: string;
  avatar: string;
}

interface Conversation {
  id: number;
  text: string;
  tags: Tag[];
  messages: Message[];
}

export const useConversationsStore = defineStore('conversations', {
  state: () => ({
    conversations: [] as Conversation[],
    selectedConversationId: null as number | null,
    nextConversationId: 3, // Assuming you have 2 initial conversations
  }),
  actions: {
    addConversation(conversation: Conversation) {
      this.conversations.push(conversation);
      console.log('Conversation added:', conversation);
    },
    addTag(conversationId: number, tag: Tag) {
      const conversation = this.conversations.find(
        (c) => c.id === conversationId,
      );
      if (conversation) {
        conversation.tags.push(tag);
      }
    },
    selectConversation(conversationId: number) {
      this.selectedConversationId = conversationId;
    },
    async sendPrompt(prompt: string) {
      let conversation;
      console.log('this.selectedConversationId', this.selectedConversationId)

      if (this.selectedConversationId === null) {
        // Create a new conversation if none is selected
        conversation = {
          id: this.nextConversationId++,
          text: prompt,
          tags: [],
          messages: [],
        };
        this.addConversation(conversation);
        this.selectedConversationId = conversation.id;
      } else {
        conversation = this.conversations.find(
          (c) => c.id === this.selectedConversationId,
        );

        if (!conversation) {
          console.error('Conversation not found');
          return;
        }
      }

      // Add user's message to the conversation
      const userMessage = {
        id: Date.now(),
        text: prompt,
        name: 'User',
        avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
      };
      conversation.messages.push(userMessage);

      // Mockup response from the server
      const mockResponse = {
        data: {
          reply: 'This is a mock response from the server.',
        },
      };

      // Check environment variable
      console.log('isMockApi:', import.meta.env);
      const isMockApi = import.meta.env.VITE_MOCK_API === '1';

      try {
        let response;
        if (isMockApi) {
          response = mockResponse;
        } else {
          response = await api.post('/sendPrompt', {
            prompt,
            provider: 'anthropic',
          });
        }
        const botMessage = {
          id: Date.now() + 1,
          text: response.data.reply,
          name: 'Bot',
          avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
        };
        conversation.messages.push(botMessage);
      } catch (error) {
        console.error('Error sending prompt:', error);
      }
    },
  },
});

// Initialize store with mock conversations
const store = useConversationsStore();
store.$patch({
  conversations: [
    {
      id: 1,
      text: 'Hello, how can I help you today?',
      tags: [{ id: 1, name: 'greeting' }],
      messages: [],
    },
    {
      id: 2,
      text: 'Can you tell me more about your services?',
      tags: [{ id: 2, name: 'inquiry' }],
      messages: [],
    },
  ],
});
