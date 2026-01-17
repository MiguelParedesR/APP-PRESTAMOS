<script setup>
defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' }
});
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
    <div v-if="title" class="mb-3 space-y-1">
      <p class="text-sm font-semibold text-slate-900">{{ title }}</p>
      <p v-if="subtitle" class="text-xs text-slate-500">{{ subtitle }}</p>
    </div>
    <slot />
  </div>
</template>
