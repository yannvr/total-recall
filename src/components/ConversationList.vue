<template>
  <q-list>
    <q-item>
      <q-item-section>
        <q-input v-model="searchQuery" placeholder="Search conversations..." />
      </q-item-section>
    </q-item>
    <q-item-label header>Conversations</q-item-label>
    <q-item v-for="conversation in filteredConversations" :key="conversation.id"
      :class="{ 'selected-conversation': conversation.id === store.selectedConversationId }">
      <q-item-section @click="selectConversation(conversation.id)">
        <q-item-label>{{ conversation.name }}</q-item-label>
        <q-item-label caption>
          <TagEditor v-for="tag in getTags(conversation)" :key="tag" :conversationId="conversation.id" :tag="tag"
            :isEditing="tag === 'tag?'" />
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useConversationsStore } from 'src/stores/conversation';
import TagEditor from 'components/TagEditor.vue';

const store = useConversationsStore();
const conversations = computed(() => store.conversations);
const searchQuery = ref('');
const filteredConversations = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return conversations.value.filter((conversation) => {
    // Include conversations without tags or with tags matching the search query
    return (
      conversation.tags.length === 0 ||
      conversation.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });
});
function selectConversation(conversationId: number) {
  store.selectConversation(conversationId);
}
function getTags(conversation: { tags: string }) {
  if (conversation.tags.length === 0) {
    return ['tag?'];
  }
  return conversation.tags;
}
</script>

<style scoped>
.selected-conversation {
  background-color: #e0f7fa;
  /* Light cyan background */
}
</style>
