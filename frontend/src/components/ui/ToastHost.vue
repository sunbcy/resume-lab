<script setup lang="ts">
import { useToast } from '@/composables/useToast';

const { toasts } = useToast();

const bgClass = (type: string) =>
  ({
    success: 'bg-green-600',
    error: 'bg-red-600',
    warn: 'bg-amber-500',
    info: 'bg-brand',
  })[type] ?? 'bg-brand';
</script>

<template>
  <Teleport to="body">
    <div
      class="no-print fixed left-1/2 top-4 z-[60] flex -translate-x-1/2 flex-col items-center gap-2"
    >
      <div
        v-for="item in toasts"
        :key="item.id"
        class="rounded px-4 py-2 text-[13px] text-white shadow-lg"
        :class="bgClass(item.type)"
      >
        {{ item.text }}
      </div>
    </div>
  </Teleport>
</template>
