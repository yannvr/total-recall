import { defineStore } from 'pinia';
import axios from 'axios';

interface Tag {
  id: number;
  name: string;
}

interface Conversation {
  id: number;
  text: string;
  tags: Tag[];
}

export const useConversationsStore = defineStore('conversations', {
  state: () => ({
    conversations: [] as Conversation[],
    messages: [] as {
      id: number;
      text: string;
      name: string;
      avatar: string;
    }[],
  }),
  actions: {
    addConversation(conversation: Conversation) {
      this.conversations.push(conversation);
    },
    addTag(conversationId: number, tag: Tag) {
      const conversation = this.conversations.find(
        (c) => c.id === conversationId,
      );
      if (conversation) {
        conversation.tags.push(tag);
      }
    },
    async sendPrompt(prompt: string) {
      // Add user's message to the chat
      const userMessage = {
        id: Date.now(),
        text: prompt,
        name: 'User',
        avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
      };
      this.messages.push(userMessage);

      // Mockup response from the server
      const mockResponse = {
        data: {
          reply: 'This is a mock response from the server.',
        },
      };

      // Simulate an API request
      try {
        // const response = await axios.post('https://dreamcatcher.run/api/sendPrompt', { prompt });
        const response = mockResponse; // Use mock response for now
        const botMessage = {
          id: Date.now() + 1,
          text: response.data.reply,
          name: 'Bot',
          avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
        };
        this.messages.push(botMessage);
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
    },
    {
      id: 2,
      text: 'Can you tell me more about your services?',
      tags: [{ id: 2, name: 'inquiry' }],
    },
  ],
});