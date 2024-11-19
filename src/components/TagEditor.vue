<template>
  <div @click="handleClick" class="tag-editor-container">
    <q-chip
      v-if="!isEditing"
      :label="tag"
      :color="getTagColor(tag)"
      class="q-mr-sm tag-editor-chip"
      @mouseover="showDeleteIcon = true"
      @mouseleave="showDeleteIcon = false"
    >
      <q-icon
        v-if="showDeleteIcon"
        name="delete"
        class="delete-icon"
        @click.stop="deleteTag"
      />
    </q-chip>
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
import { ref, watch } from 'vue';
import { useConversationsStore } from 'src/stores/conversation';

const props = defineProps<{ conversationId: string; tag: string }>();
const store = useConversationsStore();
const isEditing = ref(false);
const editableTagName = ref(props.tag);
const showDeleteIcon = ref(false);

const handleClick = () => {
  if (!isEditing.value) {
    startEditing();
  }
};

const startEditing = () => {
  isEditing.value = true;
};

const saveTag = async () => {
  if (editableTagName.value.trim()) {
    if (props.tag === 'tag?') {
      // Add the new tag and remove the placeholder
      await store.addTag(props.conversationId, editableTagName.value);
    } else {
      await store.editTag(props.conversationId, props.tag, editableTagName.value);
    }
  }
  isEditing.value = false;
};

const deleteTag = async () => {
  await store.removeTag(props.conversationId, props.tag);
};

// Watch for changes in the tag name and update the editableTagName accordingly
watch(() => props.tag, (newName) => {
  editableTagName.value = newName;
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
</script>

<style scoped>
.tag-editor-container {
  position: relative;
}

.tag-editor-chip {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.delete-icon {
  margin-left: 5px;
  cursor: pointer;
  color: var(--q-color-negative);
}
</style>
