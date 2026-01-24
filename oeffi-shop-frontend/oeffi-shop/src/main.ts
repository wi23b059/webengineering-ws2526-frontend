import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import './assets/main.css'
import { useAuthStore } from './stores/authStore'
import { useProductStore } from './stores/productStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router);

const auth = useAuthStore()
const products = useProductStore()
auth.restoreFromStorage()

app.mount('#app')

import { useCartStore } from '@/stores/cartStore'
const cart = useCartStore()
await products.fetchProducts()
await cart.initCart()
