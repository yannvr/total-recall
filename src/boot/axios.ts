import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Determine the baseURL based on the environment variable
const isMockApi = import.meta.env.VITE_MOCK_API === '1';
const baseURL = isMockApi ? 'https://dreamcatcher.run/api' : 'http://localhost:3010';

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'x-api-key': '0x1eb4aC0CD307aB4c7dB6c25a78029E035670ac95',
  },
});

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
