<template>
    <q-list>
        <q-item-label header>Conversations</q-item-label>
        <q-item v-for="conversation in conversations" :key="conversation.id">
            <q-item-section>
                <q-item-label>{{ conversation.text }}</q-item-label>
                <q-item-label caption>
                    <q-chip v-for="tag in conversation.tags" :key="tag.id" :label="tag.name"
                        :color="getTagColor(tag.name)" class="q-mr-sm" />
                </q-item-label>
            </q-item-section>
        </q-item>
    </q-list>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useConversationsStore } from 'stores/conversation';

const store = useConversationsStore();
const conversations = computed(() => store.conversations);

const tagColors: Record<string, string> = {
    greeting: 'primary',
    inquiry: 'secondary',
    // Add more tag colors as needed
};

function getTagColor(tagName: string): string {
    return tagColors[tagName] || 'grey';
}
</script>
