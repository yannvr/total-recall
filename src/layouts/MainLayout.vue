<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="text-white"
        />
        <q-toolbar-title class="text-white">Total Recall</q-toolbar-title>
        <div class="toolbar-content">
          <q-btn
            flat
            dense
            round
            @click="startNewConversation"
            class="text-white"
          >
            <q-icon name="add" class="text-white" />
            <span class="q-ml-sm text-white">New Conversation</span>
          </q-btn>
          <q-btn
            flat
            round
            dense
            :icon="themeIcon"
            @click="toggleDarkMode"
            class="text-white"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="drawerWidth"
    >
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

    <!-- Include the Settings Modal -->
    <SettingsModal v-model="settingsModalOpen" :selectedEngine="selectedEngine" />
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import ConversationList from 'src/components/ConversationList.vue';
import SettingsModal from 'src/components/SettingsModal.vue';
import { useConversationsStore } from 'src/stores/conversation';

const $q = useQuasar();
const store = useConversationsStore();

const leftDrawerOpen = ref(false);
const settingsModalOpen = ref(false);
const selectedEngine = ref('openai');
const isDark = computed(() => $q.dark.isActive);
const themeIcon = computed(() => (isDark.value ? 'dark_mode' : 'light_mode'));

function startNewConversation() {
  store.createNewConversation();
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function openSettingsModal() {
  settingsModalOpen.value = true;
}

function toggleDarkMode() {
  $q.dark.toggle();
}

const drawerWidth = ref(300); // Initial width of the drawer

function startResize(event: MouseEvent) {
  const startX = event.clientX;
  const startWidth = drawerWidth.value;

  function onMouseMove(e: MouseEvent) {
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
