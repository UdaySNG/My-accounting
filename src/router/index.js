import { createRouter, createWebHistory } from 'vue-router'
import MijnBoekhouder from '../views/MijnBoekhouder.vue'
import Agenda from '../views/Agenda.vue'
import Dashboard from '../views/Dashboard.vue'
import Berichten from '../views/Berichten.vue'
import Documenten from '../views/Documenten.vue'
import Rapportages from '../views/Rapportages.vue'
import Instellingen from '../views/Instellingen.vue'
import Help from '../views/Help.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/mijn-boekhouder'
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
      path: '/mijn-boekhouder',
      name: 'mijn-boekhouder',
      component: MijnBoekhouder
    },
    {
      path: '/agenda',
      name: 'agenda',
      component: Agenda
    },
    {
      path: '/berichten',
      name: 'berichten',
      component: Berichten
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
    }
  ]
})

export default router 