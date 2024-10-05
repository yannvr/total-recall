<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          Total Recall
        </q-toolbar-title>
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

    <q-dialog v-model="settingsModalOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Select AI Engine</div>
        </q-card-section>
        <q-card-section>
          <q-select v-model="selectedEngine" :options="aiEngines" label="AI Engine" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="OK" color="primary" @click="saveSettings" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup lang="ts">
import ConversationList from 'src/components/ConversationList.vue';
import { ref } from 'vue';

defineOptions({
  name: 'MainLayout'
});

const leftDrawerOpen = ref(false);
const settingsModalOpen = ref(false);
const selectedEngine = ref('');
const aiEngines = ref([
  { label: 'Open AI', value: 'Open AI' },
  { label: 'Anthropic', value: 'Anthropic' },
  { label: 'Engine 3', value: 'engine3' }
]);

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
</script>

<style scoped>
.drawer-bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
