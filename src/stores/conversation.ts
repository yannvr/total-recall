import { api } from 'src/boot/axios';
import { defineStore } from 'pinia';

export interface Tag {
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
    nextConversationId: 7, // Updated to account for new conversations
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
    editTag(conversationId: number, tagId: number, newName: string) {
      const conversation = this.conversations.find(
        (c) => c.id === conversationId,
      );
      if (conversation) {
        const tag = conversation.tags.find((t) => t.id === tagId);
        if (tag) {
          tag.name = newName;
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
        text: 'New Conversation',
        tags: [],
        messages: [],
      };
      this.addConversation(newConversation);
      this.selectConversation(newConversation.id);
    },
    async sendPrompt(prompt: string) {
      let conversation;
      console.log('this.selectedConversationId', this.selectedConversationId);

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

        // Update the conversation name to the first user prompt if it hasn't been set yet
        if (conversation.text === 'New Conversation') {
          conversation.text = prompt;
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
      text: 'The only way to do great work is to love what you do.',
      tags: [{ id: 1, name: 'inspiration' }],
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
      text: 'The best time to plant a tree was 20 years ago. The second best time is now.',
      tags: [{ id: 2, name: 'inspiration' }],
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
      text: "Your time is limited, don't waste it living someone else's life.",
      tags: [{ id: 3, name: 'inspiration' }],
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
      text: 'Peace cannot be kept by force; it can only be achieved by understanding.',
      tags: [{ id: 4, name: 'nobel' }],
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
      text: 'The best way to find yourself is to lose yourself in the service of others.',
      tags: [{ id: 5, name: 'nobel' }],
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
      text: 'Education is the most powerful weapon which you can use to change the world.',
      tags: [{ id: 6, name: 'nobel' }],
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
