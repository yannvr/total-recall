<template>
  <div>
    <q-list v-if="selectedConversationMessages.length">
      <q-item v-for="message in selectedConversationMessages" :key="message.id">
        <q-item-section avatar>
          <q-avatar>
            <img :src="message.avatar" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ message.name }}</q-item-label>
          <q-item-label caption>{{ message.text }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-input v-model="prompt" placeholder="Type a message..." @keyup.enter="sendPrompt" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useConversationsStore } from 'stores/conversation';

const store = useConversationsStore();
const prompt = ref('');

const selectedConversationMessages = computed(() => {
  const conversation = store.conversations.find(
    (c) => c.id === store.selectedConversationId,
  );
  return conversation ? conversation.messages : [];
});

function sendPrompt() {
  if (prompt.value.trim()) {
    store.sendPrompt(prompt.value);
    prompt.value = '';
  }
}

// Watch for changes in the selected conversation ID and update the messages
watch(() => store.selectedConversationId, (newId) => {
  console.log('Selected conversation ID changed:', newId);
});

// Watch for changes in the messages
watch(selectedConversationMessages, () => {
  console.log('Messages updated');
});
</script>
