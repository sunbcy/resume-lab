<script setup lang="ts">
import Icon from '../Icon.vue';

withDefaults(
  defineProps<{
    visible: boolean;
    title?: string;
    width?: number;
  }>(),
  { width: 480 },
);

const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-40">
      <div class="absolute inset-0 bg-black/30" @click="emit('close')" />
      <div
        class="absolute right-0 top-0 flex h-full max-w-[92vw] flex-col bg-white shadow-xl"
        :style="{ width: `${width}px` }"
      >
        <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div class="text-[15px] font-medium">
            <slot name="title">{{ title }}</slot>
          </div>
          <button
            class="rounded p-1 text-gray-500 hover:bg-gray-100"
            @click="emit('close')"
          >
            <Icon name="close" size="18" />
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
