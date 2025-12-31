<template>
  <div class="min-h-screen bg-transparent text-slate-900">
    <Header />
    <main class="mx-auto w-full max-w-6xl px-5 py-6">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
</script>
