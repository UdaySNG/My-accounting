import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

console.log('MAIN: Starting application initialization')

const app = createApp(App)
const pinia = createPinia()

// Use plugins
app.use(pinia)
app.use(router)

// Debug router configuration
console.log('MAIN: Router configuration:', router.getRoutes().map(route => ({
  path: route.path,
  name: route.name,
  children: route.children?.map(child => ({
    path: child.path,
    name: child.name
  }))
})))

// Mount the app
app.mount('#app')

console.log('MAIN: Application mounted')
