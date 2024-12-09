<template>
  <div>
    <div v-if="typeof value === 'string'">
      <q-input
    :model-value="value"
    @update:model-value="updateValue"
    :label="label"
    dense
    outlined
  />
    </div>
    <div v-else-if="typeof value === 'object'">
      <q-expansion-item :label="label">
        <div class="nested-settings">
          <div v-for="(nestedValue, nestedKey) in value" :key="nestedKey">
            <SettingItem :label="nestedKey" :value="nestedValue" @update="updateNestedSetting(nestedKey, $event)" />
          </div>
        </div>
      </q-expansion-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number, Boolean, Object],
    required: true,
  },
});

const emit = defineEmits(['update']);

function updateValue(newValue) {
  emit('update', newValue);
}

function updateNestedSetting(key, newValue) {
  emit('update', { ...props.value, [key]: newValue });
}
</script>

<style scoped>
.nested-settings {
  margin-left: 20px;
}

.nested-settings-label {
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
