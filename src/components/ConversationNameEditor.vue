<template>
  <div @click="handleClick" class="name-editor-container">
    <q-chip
      v-if="!isEditing"
      :label="conversationName || 'unamed'"
      class="q-mr-sm name-editor-chip"
      @mouseover="showEditIcon = true"
      @mouseleave="showEditIcon = false"
    >
      <q-icon
        v-if="showEditIcon"
        name="edit"
        class="edit-icon"
        @click.stop="startEditing"
      />
    </q-chip>
    <q-input
      v-else
      v-model="editableName"
      @blur="saveName"
      @keyup.enter="saveName"
      dense
      autofocus
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
const showEditIcon = ref(false);

const handleClick = () => {
  if (!isEditing.value) {
    startEditing();
  }
};

const startEditing = () => {
  isEditing.value = true;
};

const saveName = async () => {
  if (editableName.value.trim()) {
    console.log('editableName', editableName.value);
    await store.editConversationName(props.conversationId, editableName.value);
  }
  isEditing.value = false;
};

// Watch for changes in the conversation name and update the editableName accordingly
watch(
  () => props.conversationName,
  (newName) => {
    editableName.value = newName;
  },
);
</script>

<style scoped>
.name-editor-container {
  position: relative;
}

.name-editor-chip {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.edit-icon {
  margin-left: 5px;
  cursor: pointer;
  color: var(--q-color-primary);
}
</style>
