<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">Settings</div>
      </q-card-section>
      <q-card-section>
        <div v-for="(value, key) in store.settings" :key="key">
          <SettingItem :label="key" :value="value" @update="updateSetting(key, $event)" />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" @click="closeModal" />
        <q-btn flat label="Save" color="primary" @click="saveSettings" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { settingsStore } from 'src/stores/settings';
import SettingItem from 'src/components/SettingItem.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const $q = useQuasar();
const store = settingsStore();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});

function updateSetting(key, value) {
  store.settings[key] = value;
}

async function saveSettings() {
  try {
    for (const [key, value] of Object.entries(store.settings)) {
      await store.saveSettings(key, value);
    }
    $q.notify({
      type: 'positive',
      message: 'Settings saved successfully!',
      position: 'top',
    });
    closeModal();
  } catch (error) {
    console.error('Error saving settings:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to save settings.',
      position: 'top',
    });
  }
}

function closeModal() {
  isOpen.value = false;
}
</script>
