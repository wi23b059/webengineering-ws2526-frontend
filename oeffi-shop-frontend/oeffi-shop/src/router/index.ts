import { createRouter, createWebHistory } from 'vue-router';

const HomeView = () => import('@/views/HomeView.vue');
const NotFoundView = () => import('@/views/NotFoundView.vue');
const LoginView = () => import('@/views/LoginView.vue');
const RegistrationView = () => import('@/views/RegistrationView.vue');

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
    path: '/:catchAll(.*)',
    component: NotFoundView,
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
