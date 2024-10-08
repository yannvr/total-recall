<template>
  <div @click="handleClick">
    <q-chip
      v-if="!isEditing"
      :label="tag.name"
      :color="getTagColor(tag.name)"
      class="q-mr-sm tag-editor-chip"
    />
    <q-input
      v-else
      v-model="editableTagName"
      @blur="saveTag"
      @keyup.enter="saveTag"
      dense
      autofocus
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useConversationsStore } from 'src/stores/conversation';
import { Tag } from 'src/stores/conversation';

const props = defineProps<{ conversationId: number; tag: Tag }>();
const store = useConversationsStore();
const isEditing = ref(false);
const editableTagName = ref(props.tag.name);

const handleClick = () => {
  if (!isEditing.value) {
    startEditing();
  }
};

const startEditing = () => {
  isEditing.value = true;
};

const saveTag = () => {
  if (editableTagName.value.trim()) {
    store.editTag(props.conversationId, props.tag.id, editableTagName.value);
  }
  isEditing.value = false;
};

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
</script>

<style scoped>
.tag-editor-chip {
  background-color: var(--q-color-accent);
  color: var(--q-color-text);
}
</style>
