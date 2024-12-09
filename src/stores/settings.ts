import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

export const settingsStore = defineStore('settings', {
  state: () => ({
    settings: {
      'OpenAI API key': '',
      'Anthropic API key': '',
      'Perplexity API key': '',
      'account': {
        'type': 'free',
        'expires': '',
      }
    },
  }),
  actions: {
    async setSetting(key: string, value: string) {
      this.settings[key] = value;
      await api.post('/settings', { key, value });
    },
  },
});
