<template>
  <div>
    <div v-if="typeof value === 'string'">
      <SettingInput :label="label" :value="value" @update:value="updateValue" />
    </div>
    <!-- <div v-else-if="typeof value === 'number'">
      <SettingInput :label="label" :value="value" @update:value="updateValue" />
    </div>
    <div v-else-if="typeof value === 'boolean'">
      <q-checkbox :label="label" v-model="value" @update:model-value="updateValue" />
    </div> -->
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
import SettingInput from 'src/components/SettingInput.vue';

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
