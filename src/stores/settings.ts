import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSettingsStore = defineStore('settings', () => {
  const gptSettings = ref({
    openai: { apiKey: '' },
    anthropic: { apiKey: '' },
    engine3: { apiKey: '' },
  });

  function setApiKey(engine: string, apiKey: string) {
    if (gptSettings.value[engine]) {
      gptSettings.value[engine].apiKey = apiKey;
    } else {
      gptSettings.value[engine] = { apiKey };
    }
  }

  function getApiKey(engine: string): string {
    return gptSettings.value[engine]?.apiKey || '';
  }

  return { gptSettings, setApiKey, getApiKey };
});
