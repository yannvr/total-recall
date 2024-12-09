import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

export const settingsStore = defineStore('settings', {
  state: () => ({
    settings: {
      'OpenAI API key': '',
      'Anthropic API key': '',
      'Perplexity API key': '',
      account: {
        type: 'free',
        expires: '',
      },
    },
  }),
  actions: {
    async saveSettings(key: string, value: string) {
      this.settings[key] = value;
      await api.post('/settings', { userId: 'test', settings: this.settings });
    },
  },
});
