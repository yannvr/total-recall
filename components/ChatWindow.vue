<template>
  <div>
    <h1>Chat window x</h1>


    <div v-for="conversation in conversations" :key="conversation.id" class="q-pa-md row justify-center">
      <div style="width: 100%; max-width: 400px">
        <q-chat-message :text="[conversation.text]" :name="'User'" :avatar="'https://cdn.quasar.dev/img/avatar1.jpg'" />
        <div v-for="tag in conversation.tags" :key="tag.id">{{ tag.name }}</div>
        <q-input v-model="newTag" placeholder="Add a tag" @keyup.enter="addTag(conversation.id, newTag)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useConversationsStore } from 'app/stores/conversation';
import { ref } from 'vue'

export default {
  name: 'ChatWindow',
  setup () {
    const store = useConversationsStore()
    const newTag = ref('')

    const addConversation = () => {
      store.addConversation({ id: Date.now(), text: 'New Conversation', tags: [] })
    }

    const addTag = (conversationId: number, tag: string) => {
      console.log('addTag', conversationId, tag)
      store.addTag(conversationId, { id: Date.now(), name: tag })
      newTag.value = ''
    }

    return {
      conversations: store.conversations,
      addConversation,
      addTag,
      newTag
    }
  }
}
</script>
