<template>
  <q-list>
    <q-item>
      <q-item-section>
        <q-input v-model="searchQuery" placeholder="Search conversations..." />
      </q-item-section>
    </q-item>
    <q-item-label header>Conversations</q-item-label>
    <q-item v-for="conversation in filteredConversations" :key="conversation.conversationId"
      :class="{ 'selected-conversation': conversation.conversationId === store.selectedConversationId }">
      <q-item-section @click="selectConversation(conversation.conversationId)">
        <ConversationNameEditor
          :conversationId="conversation.conversationId"
          :conversationName="conversation.name"
        />
        <q-item-label caption>
          <TagEditor v-for="tag in getTags(conversation)" :key="tag" :conversationId="conversation.conversationId" :tag="tag"
             />
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { computed, ref, toRaw } from 'vue';
import { useConversationsStore } from 'src/stores/conversation';
import TagEditor from 'components/TagEditor.vue';
import ConversationNameEditor from './ConversationNameEditor.vue';

const store = useConversationsStore();
const conversations = computed(() => store.conversations);
const searchQuery = ref('');
const filteredConversations = computed(() => {
  const query = searchQuery.value.toLowerCase();
  // console.log('conversations', toRaw(conversations.value));
  if(!query) {
    return conversations.value;
  }
  return conversations.value.filter((conversation) => {
    console.log('conversation.tags', toRaw(conversation.tags));
    // Include conversations without tags or with tags matching the search query
    return (
      conversation.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });
});
function selectConversation(conversationId: string) {
  store.selectConversation(conversationId);
}
function getTags(conversation: { tags: string[] }) {
  if (conversation?.tags?.length === 0) {
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
