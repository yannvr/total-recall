<template>
  <q-page class="row items-center justify-evenly">
    <chat-window></chat-window>
  </q-page>

</template>

<script setup lang="ts">
import ChatWindow from 'src/components/ChatWindow.vue';
defineOptions({
  name: 'IndexPage'
});

</script>
