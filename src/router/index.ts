import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'

const MijnBoekhouder = () => import('../views/MijnBoekhouder.vue' as any)
const Agenda = () => import('../views/Agenda.vue' as any)
const Dashboard = () => import('../views/Dashboard.vue' as any)
const Berichten = () => import('../views/Berichten.vue' as any)
const Documenten = () => import('../views/Documenten.vue' as any)
const Rapportages = () => import('../views/Rapportages.vue')
const Instellingen = () => import('../views/Instellingen.vue')
const Help = () => import('../views/Help.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../pages/ForgotPassword.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/documenten',
    name: 'documenten',
    component: Documenten,
    meta: { requiresAuth: true }
  },
  {
    path: '/berichten',
    name: 'berichten',
    component: Berichten,
    meta: { requiresAuth: true }
  },
  {
    path: '/mijn-boekhouder',
    name: 'mijn-boekhouder',
    component: MijnBoekhouder,
    meta: { requiresAuth: true }
  },
  {
    path: '/rapportages',
    name: 'rapportages',
    component: Rapportages,
    meta: { requiresAuth: true }
  },
  {
    path: '/instellingen',
    name: 'instellingen',
    component: Instellingen,
    meta: { requiresAuth: true }
  },
  {
    path: '/help',
    name: 'help',
    component: Help,
    meta: { requiresAuth: true }
  },
  {
    path: '/agenda',
    name: 'agenda',
    component: Agenda,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthPage = to.path === '/login' || to.path === '/register' || to.path === '/forgot-password'

  if (requiresAuth && !token) {
    // Redirect naar login met de originele URL als query parameter
    next({ 
      path: '/login', 
      query: { redirect: to.fullPath }
    })
  } else if (token && isAuthPage) {
    // Als gebruiker is ingelogd en probeert auth pagina's te bezoeken
    next('/dashboard')
  } else {
    next()
  }
})

export default router 