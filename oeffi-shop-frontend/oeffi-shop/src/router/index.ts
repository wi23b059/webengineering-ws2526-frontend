import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const HomeView = () => import('@/views/HomeView.vue');
const NotFoundView = () => import('@/views/NotFoundView.vue');
const LoginView = () => import('@/views/AuthView/LoginView.vue');
const RegistrationView = () => import('@/views/AuthView/RegistrationView.vue');
const ImprintView = () => import('@/views/ImprintView.vue');
const HelpView = () => import('@/views/HelpView.vue');
const ProductsView =() => import('@/views/ProductView/ProductsView.vue');
const UserAccountView = () => import('@/views/UserView/UserAccountView.vue');
const ProductAdministrationView = () => import('@/views/ProductView/ProductAdministrationView.vue');
const ProductCreateView = () => import('@/views/ProductView/ProductCreateView.vue');
const ProductEditView = () => import('@/views/ProductView/ProductEditView.vue');
const ProductDetailsView = () => import('@/views/ProductView/ProductDetailsView.vue');
const UserAdministrationView = () => import('@/views/UserView/UserAdministrationView.vue');
const UserEditView = () => import('@/views/UserView/UserEditView.vue');
const UserCreateView = () => import('@/views/UserView/UserCreateView.vue');
const UserDetailsView = () => import('@/views/UserView/UserDetailsView.vue');

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'LoginView',
    component: LoginView,
  },
  {
    path: '/registration',
    name: 'RegistrationView',
    component: RegistrationView,
  },
  {
    path: '/user-account',
    name: 'UserAccountView',
    component: UserAccountView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/products',
    name: 'ProductsView',
    component: ProductsView,
  },
  {
    path: '/admin/products',
    name: 'ProductAdministrationView',
    component: ProductAdministrationView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: '/admin/products/create',
    name: 'ProductCreateView',
    component: ProductCreateView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: '/admin/products/:id/details',
    name: 'ProductDetailsView',
    component: ProductDetailsView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: '/admin/products/:id',
    name: 'ProductEditView',
    component: ProductEditView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    },
  },
  {
    path: '/admin/users',
    name: 'UserAdministrationView',
    component: UserAdministrationView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: '/admin/users/create',
    name: 'UserCreateView',
    component: UserCreateView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: '/admin/users/:id/details',
    name: 'UserDetailsView',
    component: UserDetailsView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: '/admin/users/:id',
    name: 'UserEditView',
    component: UserEditView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    },
  },
  {
    path: '/imprint',
    name: 'ImprintView',
    component: ImprintView,
  },
  {
    path: '/help',
    name: 'HelpView',
    component: HelpView,
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFoundView',
    component: NotFoundView,
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, _from, next) => {
  const auth = useAuthStore()

  // Token vorhanden, aber User noch nicht geladen (Refresh-Fall)
  if (auth.token && !auth.user) {
    try {
      await auth.fetchMe()
    } catch {
      auth.logout()
      return next('/login')
    }
  }

  // 🔒 Login erforderlich
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/login')
  }

  // 🔒 Admin-Seiten
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return next('/')
  }

  // 🔒 User-Seiten (Admins ausgeschlossen)
  if (to.meta.requiresUser && auth.isAdmin) {
    return next('/')
  }

  next()
})

