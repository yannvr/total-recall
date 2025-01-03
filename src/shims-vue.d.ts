/* eslint-disable */

/// <reference types="vite/client" />

declare module 'quasar'; // Suppress errors for Quasar imports

// Mocks all files ending in `.vue` showing them as plain Vue instances
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
