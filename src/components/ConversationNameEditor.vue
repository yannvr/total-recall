<template>
  <div class="name-editor-container" @mouseover="showDeleteIcon = true" @mouseleave="showDeleteIcon = false">
    <span
      v-if="!isEditing"
      class="conversation-name"
      @click.stop="startEditing"
    >
      {{ conversationName || 'unamed' }}
    </span>
    <q-input
      v-else
      v-model="editableName"
      @blur="saveName"
      @keyup.enter="saveName"
      dense
      autofocus
      class="conversation-name-input"
      @click.stop
    />
    <q-icon
      v-if="showDeleteIcon && !isEditing"
      name="delete"
      class="delete-icon"
      @click.stop="deleteConversation"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useConversationsStore } from 'src/stores/conversation';

const props = defineProps<{
  conversationId: string;
  conversationName: string;
}>();
const store = useConversationsStore();
const isEditing = ref(false);
const editableName = ref(props.conversationName);
const showDeleteIcon = ref(false);

const startEditing = () => {
  isEditing.value = true;
};

const saveName = async () => {
  if (editableName.value.trim()) {
    await store.editConversationName(props.conversationId, editableName.value);
  }
  isEditing.value = false;
};

const deleteConversation = async () => {
  await store.deleteConversation(props.conversationId);
};

// Watch for changes in the conversation name and update the editableName accordingly
watch(() => props.conversationName, (newName) => {
  editableName.value = newName;
});
</script>

<style scoped>
.name-editor-container {
  display: flex;
  align-items: center;
  position: relative;
}

.conversation-name {
  cursor: pointer;
  flex-grow: 0;
}

.conversation-name-input {
  flex-grow: 0;
  width: auto;
}

.delete-icon {
  margin-left: 10px;
  cursor: pointer;
  color: var(--q-color-negative);
}
</style>
