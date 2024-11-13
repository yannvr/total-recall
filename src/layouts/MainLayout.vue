<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" class="text-white" />
        <q-toolbar-title class="text-white">Total Recall</q-toolbar-title>
        <div class="toolbar-content">
          <q-btn flat dense round @click="startNewConversation" class="text-white">
            <q-icon name="add" class="text-white" />
            <span class="q-ml-sm text-white">New Conversation</span>
          </q-btn>
          <q-btn flat round dense :icon="themeIcon" @click="toggleDarkMode" class="text-white" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="drawerWidth">
      <div class="resizable-drawer">
        <conversation-list />
        <div class="drawer-resize-handle" @mousedown="startResize"></div>
      </div>
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
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" @click="settingsModalOpen = false" />
          <q-btn flat label="Save" color="primary" @click="saveSettings" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ConversationList from 'src/components/ConversationList.vue';
// import ThemeSettings from 'src/components/ThemeSettings.vue';
import { useConversationsStore } from 'src/stores/conversation';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const store = useConversationsStore();
const leftDrawerOpen = ref(false);
const settingsModalOpen = ref(false);
const selectedEngine = ref('');
const aiEngines = ref([
  { label: 'Open AI', value: 'Open AI' },
  { label: 'Anthropic', value: 'Anthropic' },
  { label: 'Engine 3', value: 'engine3' }
]);

const isDark = computed(() => $q.dark.isActive);
const themeIcon = computed(() => (isDark.value ? 'dark_mode' : 'light_mode'));

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
}

const drawerWidth = ref(300); // Initial width of the drawer

function startResize(event) {
  const startX = event.clientX;
  const startWidth = drawerWidth.value;

  function onMouseMove(e) {
    const newWidth = startWidth + (e.clientX - startX);
    drawerWidth.value = Math.max(200, newWidth); // Minimum width of 200px
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
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
}
.resizable-drawer {
  position: relative;
  height: 100%;
}
.drawer-resize-handle {
  position: absolute;
  top: 0;
  right: 0;
  width: 5px;
  height: 100%;
  cursor: ew-resize;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
