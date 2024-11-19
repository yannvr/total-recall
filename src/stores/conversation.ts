import { api } from 'src/boot/axios';
import { defineStore } from 'pinia';
import { toRaw } from 'vue';

interface Message {
  text: string;
  role: string;
  avatar: string;
}

interface Conversation {
  conversationId: string;
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
    async init() {
      try {
        const response = await api.get('/conversations');
        this.conversations = response.data;
        console.log('Conversations fetched:', toRaw(this.conversations));
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    },
    addConversation(conversation: Conversation) {
      this.conversations.push(conversation);
      console.log('Conversation added:', conversation);
    },
    async addTag(conversationId: string, tag: string) {
      const conversation = this.conversations.find(
        (c) => c.conversationId === conversationId,
      );
      if (conversation) {
        conversation.tags.push(tag);
        try {
          await api.put('/tag', {
            conversationId,
            oldTag: null,
            newTag: tag,
          });
        } catch (error) {
          console.error('Error adding tag:', error);
        }
      }
    },
    async editTag(conversationId: string, oldTag: string, newTag: string) {
      const conversation = this.conversations.find(
        (c) => c.conversationId === conversationId,
      );
      if (conversation) {
        const tagIndex = conversation.tags.indexOf(oldTag);
        if (tagIndex !== -1) {
          conversation.tags[tagIndex] = newTag;
          try {
            await api.put('/tag', {
              conversationId,
              oldTag,
              newTag,
            });
          } catch (error) {
            console.error('Error editing tag:', error);
          }
        }
      }
    },
    async removeTag(conversationId: string, tag: string) {
      const conversation = this.conversations.find(
        (c) => c.conversationId === conversationId,
      );
      if (conversation) {
        const tagIndex = conversation.tags.indexOf(tag);
        if (tagIndex !== -1) {
          conversation.tags.splice(tagIndex, 1);
          try {
            await api.delete('/tag', {
              data: {
                conversationId,
                tag,
              },
            });
          } catch (error) {
            console.error('Error deleting tag:', error);
          }
        }
      }
    },
    selectConversation(conversationId: string) {
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
      this.selectConversation(newconversation.conversationId);
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
        this.selectedConversationId = conversation.conversationId;
      } else {
        const existingConversation = this.conversations.find(
          (c) => c.conversationId === this.selectedConversationId,
        );

        if (!existingConversation) {
          console.warn('Conversation not found', this.selectedConversationId);
        } else {
          conversation = existingConversation;
        }
      }

      // Add user's message to the conversation
      const userMessage: Message = {
        id: Date.now(),
        text: prompt,
        role: 'user',
        avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
      };
      conversation.messages.push(userMessage);

      // Check environment variable
      console.log('isMockApi:', import.meta.env.VITE_MOCK_API);
      const isMockApi = import.meta.env.VITE_MOCK_API === '1';

      try {
        let response;
        // Mockup response from the server
        if (isMockApi) {
          response = {
            data: 'This is a mock response from the server.',
          };
        } else {
          response = await api.post('/conversation', {
            conversationId: this.selectedConversationId,
            prompt,
            provider: 'anthropic',
          });
          console.log('response:', response);
        }
        conversation.messages.push(response.data.messages.slice(-1)[0]);
      } catch (error) {
        console.error('Error sending query:', error);
      }
    },
  },
});

// Initialize store and fetch conversations
const store = useConversationsStore();
store.init();
