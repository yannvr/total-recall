<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card>
      <q-card-section>
  <div class="text-h6">Enter API Key for {{ selectedEngineName }}</div>
</q-card-section>

      <q-card-section>
        <q-form @submit="submitApiKey" ref="apiKeyForm">
          <q-input
            v-model="apiKey"
            label="API Key"
            type="password"
            autofocus
            outlined
            :rules="[(val) => !!val || 'API Key is required']"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" @click="closeModal" />
        <q-btn
          flat
          label="Submit"
          color="primary"
          @click="submitApiKey"
          :loading="isSubmitting"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
// @ts-ignore-next-line
import { useQuasar } from 'quasar';
import { useSettingsStore } from 'src/stores/settings';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  selectedEngine: {
    type: String,
    required: true,
  },
});

const selectedEngineName = computed(() => {
  switch (props.selectedEngine) {
    case 'openai':
      return 'OpenAI';
    case 'anthropic':
      return 'Anthropic';
    default:
      return 'Selected Engine';
  }
});

const emit = defineEmits(['update:modelValue']);

const $q = useQuasar();
const settingsStore = useSettingsStore();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});
const apiKey = ref('');
const isSubmitting = ref(false);
const apiKeyForm = ref(null);

watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal;
});

function closeModal() {
  isOpen.value = false;
  emit('update:modelValue', false);
}

async function submitApiKey() {
  if (apiKeyForm.value && apiKeyForm.value.validate()) {
    isSubmitting.value = true;
    try {
      settingsStore.setApiKey(props.selectedEngine, apiKey.value);
      $q.notify({
        type: 'positive',
        message: 'API Key saved successfully!',
        position: 'top',
      });
      closeModal();
    } catch (error) {
      console.error('Error saving API Key:', error);
      $q.notify({
        type: 'negative',
        message: 'Failed to save API Key.',
        position: 'top',
      });
    } finally {
      isSubmitting.value = false;
    }
  }
}
</script>
