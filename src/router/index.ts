import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

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
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path: '/documenten',
    name: 'documenten',
    component: Documenten
  },
  {
    path: '/berichten',
    name: 'berichten',
    component: Berichten
  },
  {
    path: '/mijn-boekhouder',
    name: 'mijn-boekhouder',
    component: MijnBoekhouder
  },
  {
    path: '/rapportages',
    name: 'rapportages',
    component: Rapportages
  },
  {
    path: '/instellingen',
    name: 'instellingen',
    component: Instellingen
  },
  {
    path: '/help',
    name: 'help',
    component: Help
  },
  {
    path: '/agenda',
    name: 'agenda',
    component: Agenda
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router 