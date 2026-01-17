import { createApp } from 'vue';
import { registerSW } from 'virtual:pwa-register';
import App from './App.vue';
import router from './router';
import './styles/tailwind.css';
import './styles/base.css';

// PWA registration stays minimal for this phase.
registerSW({
  immediate: true
});

createApp(App).use(router).mount('#app');
