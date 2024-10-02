<template>
  <div>
    <!-- <div v-for="conversation in conversations" :key="conversation.id" class="q-pa-md row justify-center">
      <div style="width: 100%; max-width: 400px">
        <q-chat-message :text="[conversation.text]" :name="'User'" :avatar="'https://cdn.quasar.dev/img/avatar1.jpg'" />
        <div v-for="tag in conversation.tags" :key="tag.id">{{ tag.name }}</div>
        <q-input v-model="newTag" placeholder="Add a tag" @keyup.enter="addTag(conversation.id, newTag)" />
      </div>
    </div> -->
    <div class="q-pa-md row justify-center">
      <div style="width: 100%; max-width: 400px">
        <q-chat-message v-for="message in messages" :key="message.id" :text="[message.text]" :name="message.name"
          :avatar="message.avatar" />
        <q-input v-model="prompt" placeholder="Type a message" @keyup.enter="sendPrompt" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useConversationsStore } from 'src/stores/conversation';
import { ref } from 'vue';

export default {
  name: 'ChatWindow',
  setup() {
    const store = useConversationsStore();
    const newTag = ref('');
    const prompt = ref('');

    const addConversation = () => {
      store.addConversation({ id: Date.now(), text: 'New Conversation', tags: [] });
    };

    const addTag = (conversationId: number, tag: string) => {
      console.log('addTag', conversationId, tag);
      store.addTag(conversationId, { id: Date.now(), name: tag });
      newTag.value = '';
    };

    const sendPrompt = async () => {
      if (prompt.value.trim() === '') return;
      await store.sendPrompt(prompt.value);
      prompt.value = '';
    };

    return {
      conversations: store.conversations,
      messages: store.messages,
      addConversation,
      addTag,
      newTag,
      prompt,
      sendPrompt
    };
  }
};
</script>

<style scoped>
.q-pa-md {
  padding: 16px;
}

.row {
  display: flex;
  flex-direction: row;
}

.justify-center {
  justify-content: center;
}
</style>
