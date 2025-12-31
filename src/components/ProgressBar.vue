<script setup>
import { computed, onMounted, ref } from 'vue';
import gsap from 'gsap';

const props = defineProps({
  value: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  label: { type: String, default: '' }
});

const barRef = ref(null);

const percentage = computed(() => {
  if (props.max <= 0) return 0;
  return Math.min(100, Math.max(0, (props.value / props.max) * 100));
});

const displayPercent = computed(() => Math.round(percentage.value));

onMounted(() => {
  if (!barRef.value) return;
  const targetWidth = `${percentage.value}%`;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    gsap.set(barRef.value, { width: targetWidth });
    return;
  }

  gsap.set(barRef.value, { width: '0%' });
  gsap.to(barRef.value, {
    width: targetWidth,
    duration: 0.5,
    ease: 'power2.out'
  });
});
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between text-xs text-slate-500">
      <span v-if="label">{{ label }}</span>
      <span>{{ displayPercent }}%</span>
    </div>
    <div
      class="h-2 w-full rounded-full bg-slate-200"
      role="progressbar"
      :aria-valuenow="displayPercent"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div ref="barRef" class="h-2 rounded-full bg-sky-600"></div>
    </div>
  </div>
</template>
