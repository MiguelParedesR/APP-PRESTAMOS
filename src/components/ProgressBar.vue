<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import gsap from 'gsap';

const props = defineProps({
  value: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  label: { type: String, default: '' }
});

const barRef = ref(null);
const prefersReduced = ref(false);

const percentage = computed(() => {
  if (props.max <= 0) return 0;
  return Math.min(100, Math.max(0, (props.value / props.max) * 100));
});

const displayPercent = computed(() => Math.round(percentage.value));

const updateBar = (targetWidth, animate = true) => {
  if (!barRef.value) return;
  if (prefersReduced.value || !animate) {
    gsap.set(barRef.value, { width: targetWidth });
    return;
  }

  gsap.to(barRef.value, {
    width: targetWidth,
    duration: 0.4,
    ease: 'power2.out'
  });
};

onMounted(() => {
  if (!barRef.value) return;
  prefersReduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targetWidth = `${percentage.value}%`;

  if (prefersReduced.value) {
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

watch(percentage, (value) => {
  updateBar(`${value}%`);
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
