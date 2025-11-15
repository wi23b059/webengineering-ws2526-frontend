import { createRouter, createWebHistory } from 'vue-router';

const HomeView = () => import('@/views/HomeView.vue');
const NotFoundView = () => import('@/views/NotFoundView.vue');
const LoginView = () => import('@/views/LoginView.vue');
const RegistrationView = () => import('@/views/RegistrationView.vue');
const ImprintView = () => import('@/views/ImprintView.vue');
const HelpView = () => import('@/views/HelpView.vue');
const ProductsView =() => import('@/views/ProductsView.vue');

const routes = [
  {
    path: '/',
    component: HomeView,
  },
  {
    path: '/login',
    component: LoginView,
  },
  {
    path: '/registration',
    component: RegistrationView,
  },
  {
    path: '/products',
    component: ProductsView,
  },
  {
    path: '/imprint',
    component: ImprintView,
  },
  {
    path: '/help',
    component: HelpView,
  },
  {
    path: '/:catchAll(.*)',
    component: NotFoundView,
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
