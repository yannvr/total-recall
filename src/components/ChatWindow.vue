<template>
  <div class="chat-window">
    <q-list v-if="selectedConversationMessages.length" class="message-list">
      <q-chat-message
        v-for="message in selectedConversationMessages"
        :key="message.content.text"
        :text="[message.content.text]"
        :sent="message.role === 'user'"
        :received="message.role === 'assistant'"
        :class="{
          'assistant-message': message.role === 'assistant',
          'user-message': message.role === 'user',
        }"
      />
    </q-list>
    <div class="prompt-container">
      <q-btn icon="add" flat round dense @click="createNewConversation" />
      <q-input
        v-model="prompt"
        placeholder="Type a message..."
        @keyup.enter="sendMessage"
        class="prompt-input"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConversationsStore } from 'stores/conversation';
import { computed, ref, toRaw } from 'vue';

const store = useConversationsStore();
const prompt = ref('');

const selectedConversationMessages = computed(() => {
  const conversation = store.conversations.find(
    (c) => c.conversationId == String(store.selectedConversationId),
  );
  console.log('conversation selected', toRaw(conversation));
  console.log('conversation message selected', toRaw(conversation?.messages));
  return conversation ? conversation.messages : [];
});

function sendMessage() {
  if (prompt.value.trim()) {
    store.sendMessage(prompt.value);
    prompt.value = '';
  }
}

function createNewConversation() {
  store.createNewConversation();
}
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.message-list {
  flex: 1;
  overflow-y: auto;
}

.prompt-container {
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ccc;
}

.prompt-input {
  flex: 1;
  margin-left: 10px;
}

.user-message .q-message__content {
  background-color: var(--q-color-primary);
  color: var(--q-color-primary-contrast);
  border-radius: 10px;
  padding: 10px;
  margin: 5px 0;
  align-self: flex-start;
}

.assistant-message .q-message__content {
  background-color: var(--q-color-secondary);
  color: var(--q-color-secondary-contrast);
  border-radius: 10px;
  padding: 10px;
  margin: 5px 0;
  align-self: flex-end;
}
</style>
