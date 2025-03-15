import { createRouter, createWebHistory } from 'vue-router'
import MainRoutes from './MainRoutes'
import AuthRoutes from './AuthRoutes'
import { useAuthStore } from '@/stores/AuthStore'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/app'
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: () => import('@/pages/maintenance/error/Error404Page.vue'),
    },
    {
      path: '/verifyPrimeVue',
      name: 'verifyPrimeVue',
      component: () => import('@/pages/maintenance/VerifyPrimeVue.vue'),
    },
    AuthRoutes,
    MainRoutes,
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      next({ path: '/auth/login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
