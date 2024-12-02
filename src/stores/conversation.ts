import { api } from 'src/boot/axios';
import { defineStore } from 'pinia';
import { toRaw } from 'vue';

interface TextBlockParam {
  text: string;
  type: 'text';
}

// Should match ContentBlock
interface Message {
  content: TextBlockParam;
  role: string;
  avatar: string;
}

interface Conversation {
  conversationId?: string;
  name: string;
  tags: string[];
  messages: Message[];
}

export const useConversationsStore = defineStore('conversations', {
  state: () => ({
    conversations: [] as Conversation[],
    selectedConversationId: '',
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
    async editConversationName(conversationId: string, newName: string) {
      console.log('Editing conversation name:', conversationId, newName);
      const conversation = this.conversations.find(
        (c) => c.conversationId === conversationId,
      );
      if (conversation) {
        conversation.name = newName;
        try {
          await api.put('/conversation/name', {
            conversationId,
            newName,
          });
        } catch (error) {
          console.error('Error editing conversation name:', error);
        }
      }
    },
    async deleteConversation(conversationId: string) {
      try {
        await api.delete('/conversation', {
          data: { conversationId },
        });
        this.conversations = this.conversations.filter(
          (c) => c.conversationId !== conversationId,
        );
        console.log('Conversation deleted:', conversationId);
      } catch (error) {
        console.error('Error deleting conversation:', error);
      }
    },
    async addTag(conversationId: string, tag: string) {
      const conversation = this.conversations.find(
        (c) => c.conversationId === conversationId,
      );
      if (conversation) {
        conversation.tags.push(tag);
        try {
          await api.post('/conversation/tag', {
            conversationId,
            tag,
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
            await api.put('/conversation/tag', {
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
            await api.delete('/conversation/tag', {
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
        name: 'New Conversation',
        tags: [],
        messages: [],
      };
      this.addConversation(newConversation);
      this.selectConversation(null);
    },
    async sendMessage(prompt: string) {
      let conversation: Conversation = {
        conversationId: this.nextConversationId.toString(),
        name: prompt.split(' ')[0],
        tags: [],
        messages: [],
      };

      const isMockApi = import.meta.env.VITE_MOCK_API === '1';

      if (!this.selectedConversationId) {
        // Post the new conversation
        try {
          let response;
          if (isMockApi) {
            response = {
              data: {
                conversationId: conversation.conversationId,
                name: 'Mock Conversation',
                tags: [],
                messages: [
                  {
                    content: {
                      text: 'This is a mock response from the server.',
                      type: 'text',
                    },
                    role: 'system',
                    avatar: '',
                  },
                ],
              },
            } as { data: Conversation };
          } else {
            response = await api.post('/conversation', {
              prompt,
              provider: 'anthropic',
            });
          }
          console.log('New conversation response:', response);
          this.conversations.push(response.data); // Add the conversation response to the store
          this.selectedConversationId = response.data.conversationId;
          // conversation.messages.push(response.data.messages.slice(-1)[0]);
        } catch (error) {
          console.error('Error creating new conversation:', error);
        }
      } else {
        const existingConversation = this.conversations.find(
          (c) => c.conversationId === this.selectedConversationId,
        );

        if (!existingConversation) {
          console.warn('Conversation not found', this.selectedConversationId);
        } else {
          conversation = existingConversation;
        }

        // Add user's message to the conversation
        const userMessage: Message = {
          content: { text: prompt, type: 'text' },
          role: 'user',
          avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
        };
        conversation.messages.push(userMessage);

        // Post the message to the existing conversation
        try {
          const response = await api.post('/conversation', {
            conversationId: this.selectedConversationId,
            provider: 'anthropic',
            prompt,
          });
          console.log('Message response:', response);
          Object.assign(conversation, response.data);
        } catch (error) {
          console.error('Error sending message:', error);
        }
      }
    },
  },
});

// Initialize store and fetch conversations
const store = useConversationsStore();
store.init();
