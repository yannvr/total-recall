import { api } from 'src/boot/axios';
import { defineStore } from 'pinia';

interface Message {
  id: number;
  text: string;
  name: string;
  avatar: string;
}

interface Conversation {
  id: number;
  name: string;
  tags: string[];
  messages: Message[];
}

export const useConversationsStore = defineStore('conversations', {
  state: () => ({
    conversations: [] as Conversation[],
    selectedConversationId: null as number | null,
    nextConversationId: 7, // Updated to account for new conversations
  }),
  actions: {
    addConversation(conversation: Conversation) {
      this.conversations.push(conversation);
      console.log('Conversation added:', conversation);
    },
    addTag(conversationId: number, tag: string) {
      const conversation = this.conversations.find(
        (c) => c.id === conversationId,
      );
      if (conversation) {
        conversation.tags.push(tag);
      }
    },
    editTag(conversationId: number, oldTag: string, newTag: string) {
      const conversation = this.conversations.find(
        (c) => c.id === conversationId,
      );
      if (conversation) {
        const tagIndex = conversation.tags.indexOf(oldTag);
        if (tagIndex !== -1) {
          conversation.tags[tagIndex] = newTag;
        }
      }
    },
    selectConversation(conversationId: number) {
      this.selectedConversationId = conversationId;
      console.log('Selected conversation ID updated:', conversationId);
    },
    createNewConversation() {
      const newConversation: Conversation = {
        id: this.nextConversationId++,
        name: 'New Conversation',
        tags: [],
        messages: [],
      };
      this.addConversation(newConversation);
      this.selectConversation(newConversation.id);
    },
    async sendPrompt(prompt: string) {
      let conversation = {
        id: this.nextConversationId++,
        name: prompt.split(' ')[0],
        tags: [],
        messages: [],
      };

      if (this.selectedConversationId === null) {
        // Create a new conversation if none is selected
        this.addConversation(conversation);
        this.selectedConversationId = conversation.id;
      } else {
        conversation = this.conversations.find(
          (c) => c.id === this.selectedConversationId,
        );

        if (!conversation) {
          console.warn('Conversation not found');
        }

        // Update the conversation name to the first user prompt if it hasn't been set yet
        if (conversation.name === 'New Conversation') {
          conversation.name = prompt;
        }
      }

      // Add user's message to the conversation
      const userMessage: Message = {
        id: Date.now(),
        text: prompt,
        name: 'User',
        avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
      };
      conversation.messages.push(userMessage);

      // Mockup response from the server
      const mockResponse = {
        data: 'This is a mock response from the server.',
      };

      // Check environment variable
      console.log('isMockApi:', import.meta.env.VITE_MOCK_API);
      const isMockApi = import.meta.env.VITE_MOCK_API === '1';

      try {
        let response;
        if (isMockApi) {
          response = mockResponse;
        } else {
          response = await api.post('/sendPrompt', {
            conversationId: conversation.id,
            prompt,
            provider: 'anthropic',
          });
          console.log('response:', response);
        }
        const botMessage: Message = {
          id: Date.now() + 1,
          text: response.data,
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
      name: 'The only way to do great work is to love what you do.',
      tags: ['inspiration'],
      messages: [
        {
          id: 1,
          text: 'The only way to do great work is to love what you do. - Steve Jobs',
          name: 'Bot',
          avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
        },
      ],
    },
    {
      id: 2,
      name: 'The best time to plant a tree was 20 years ago. The second best time is now.',
      tags: ['inspiration'],
      messages: [
        {
          id: 2,
          text: 'The best time to plant a tree was 20 years ago. The second best time is now. - Chinese Proverb',
          name: 'Bot',
          avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
        },
      ],
    },
    {
      id: 3,
      name: "Your time is limited, don't waste it living someone else's life.",
      tags: ['inspiration'],
      messages: [
        {
          id: 3,
          text: "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
          name: 'Bot',
          avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
        },
      ],
    },
    {
      id: 4,
      name: 'Peace cannot be kept by force; it can only be achieved by understanding.',
      tags: ['nobel'],
      messages: [
        {
          id: 4,
          text: 'Peace cannot be kept by force; it can only be achieved by understanding. - Albert Einstein',
          name: 'Bot',
          avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
        },
      ],
    },
    {
      id: 5,
      name: 'The best way to find yourself is to lose yourself in the service of others.',
      tags: ['nobel'],
      messages: [
        {
          id: 5,
          text: 'The best way to find yourself is to lose yourself in the service of others. - Mahatma Gandhi',
          name: 'Bot',
          avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
        },
      ],
    },
    {
      id: 6,
      name: 'Education is the most powerful weapon which you can use to change the world.',
      tags: ['nobel'],
      messages: [
        {
          id: 6,
          text: 'Education is the most powerful weapon which you can use to change the world. - Nelson Mandela',
          name: 'Bot',
          avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
        },
      ],
    },
  ],
});
