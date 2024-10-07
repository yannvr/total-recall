// src/stores/theme.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useQuasar } from 'quasar';

export const useThemeStore = defineStore('theme', () => {
  const $q = useQuasar();
  const isDark = ref($q.dark.isActive);

  function toggleTheme() {
    $q.dark.toggle();
    isDark.value = $q.dark.isActive;
    applyTheme();
  }

  function applyTheme() {
    document.body.classList.toggle('dark', isDark.value);
    document.body.classList.toggle('light', !isDark.value);
  }

  return { isDark, toggleTheme, applyTheme };
});
