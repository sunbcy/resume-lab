<script setup lang="ts">
import { computed } from 'vue';
import Icon from './Icon.vue';

const props = withDefaults(defineProps<{ value?: number }>(), { value: 0 });

const STAR_PATH =
  'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z';

/** skill_level 为 0-100，换算成 5 星（对应原项目 Rate value = level / 20） */
const clips = computed(() => {
  const score = (props.value ?? 0) / 20;
  return Array.from({ length: 5 }, (_, i) => {
    if (score >= i + 1) return 'inset(0 0 0 0)';
    if (score >= i + 0.5) return 'inset(0 50% 0 0)';
    return 'inset(0 100% 0 0)';
  });
});
</script>

<template>
  <span class="inline-flex items-center gap-[2px] align-middle">
    <span
      v-for="(clip, idx) in clips"
      :key="idx"
      class="relative inline-block h-[14px] w-[14px]"
    >
      <Icon name="star" size="14px" class="absolute inset-0 text-gray-300" />
      <Icon
        name="star"
        size="14px"
        class="absolute inset-0 text-amber-500"
        :style="{ clipPath: clip }"
      />
    </span>
  </span>
</template>
