import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Solicitudes from '../views/Solicitudes.vue';
import Usuarios from '../views/Usuarios.vue';
import { requireAdmin } from '../state/auth';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAdmin: true } },
  { path: '/solicitudes', name: 'Solicitudes', component: Solicitudes, meta: { requiresAdmin: true } },
  { path: '/usuarios', name: 'Usuarios', component: Usuarios, meta: { requiresAdmin: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach(async (to) => {
  if (to.name === 'Login') {
    const result = await requireAdmin();
    if (result.ok) return { name: 'Dashboard' };
    return true;
  }

  if (!to.meta.requiresAdmin) return true;
  const result = await requireAdmin();
  if (result.ok) return true;
  return { name: 'Login', query: { reason: result.reason || 'unauthorized' } };
});

export default router;
