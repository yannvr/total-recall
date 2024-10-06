<template>
  <q-list>
    <q-item>
      <q-item-section>
        <q-input v-model="searchQuery" placeholder="Search conversations..." />
      </q-item-section>
    </q-item>
    <q-item-label header>Conversations</q-item-label>
    <q-item v-for="conversation in filteredConversations" :key="conversation.id" :class="{ 'selected-conversation': conversation.id === store.selectedConversationId }">
      <q-item-section @click="selectConversation(conversation.id)">
        <q-item-label>{{ conversation.text }}</q-item-label>
        <q-item-label caption>
          <q-chip v-for="tag in conversation.tags" :key="tag.id" :label="tag.name" :color="getTagColor(tag.name)" class="q-mr-sm" />
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useConversationsStore } from 'stores/conversation';

const store = useConversationsStore();
const conversations = computed(() => store.conversations);
const searchQuery = ref('');

const filteredConversations = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return conversations.value.filter(conversation => {
    // Include conversations without tags or with tags matching the search query
    return conversation.tags.length === 0 || conversation.tags.some(tag => tag.name.toLowerCase().includes(query));
  });
});

const tagColors: Record<string, string> = {
  greeting: 'primary',
  inquiry: 'secondary',
  joke: 'orange',
  nobel: 'blue',
  inspiration: 'green',
  // Add more tag colors as needed
};

function getTagColor(tagName: string): string {
  return tagColors[tagName] || 'grey';
}

function selectConversation(conversationId: number) {
  console.log('Selected conversation:', conversationId);
  store.selectConversation(conversationId);
}
</script>

<style scoped>
.selected-conversation {
  background-color: #e0f7fa; /* Light cyan background */
}
</style>
