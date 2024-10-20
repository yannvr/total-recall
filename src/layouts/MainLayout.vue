<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title class="toolbar-title">Total Recall</q-toolbar-title>
        <div class="toolbar-content">
          <q-btn flat dense round @click="startNewConversation">
            <q-icon name="add" />
            <span class="q-ml-sm">New Conversation</span>
          </q-btn>
          <q-btn flat round dense :icon="isDark ? 'light_mode' : 'dark_mode'" @click="toggleDarkMode" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <conversation-list />
      <div class="drawer-bottom">
        <q-item clickable @click="openSettingsModal">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Settings</q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Inline Settings Modal -->
    <q-dialog v-model="settingsModalOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Settings</div>
        </q-card-section>
        <q-card-section>
          <q-select v-model="selectedEngine" :options="aiEngines" label="AI Engine" />
        </q-card-section>
        <!-- <q-card-section>
          <theme-settings />
        </q-card-section> -->
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="OK" color="primary" @click="saveSettings" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import ConversationList from 'src/components/ConversationList.vue';
// import ThemeSettings from 'src/components/ThemeSettings.vue';
import { useThemeStore } from 'src/stores/theme';
import { useConversationsStore } from 'src/stores/conversation';

const $q = useQuasar();
const store = useConversationsStore();
const themeStore = useThemeStore();
const leftDrawerOpen = ref(false);
const settingsModalOpen = ref(false);
const selectedEngine = ref('');
const aiEngines = ref([
  { label: 'Open AI', value: 'Open AI' },
  { label: 'Anthropic', value: 'Anthropic' },
  { label: 'Engine 3', value: 'engine3' }
]);

const isDark = ref($q.dark.isActive);


function startNewConversation() {
  // Logic to start a new conversation
  console.log('Starting a new conversation...');
  // You can add more logic here to actually start a new conversation
  store.createNewConversation();
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function openSettingsModal() {
  settingsModalOpen.value = true;
}

function saveSettings() {
  // Save the selected AI engine settings
  console.log('Selected AI Engine:', selectedEngine.value);
  settingsModalOpen.value = false;
}

function toggleDarkMode() {
  $q.dark.toggle();
  isDark.value = $q.dark.isActive;
}
</script>

<style scoped>
.drawer-bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
}
.toolbar-title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.toolbar-content {
  display: flex;
  align-items: center;
  gap: 1rem; /* Adjust the gap as needed */
}
</style>
