// src/stores/authStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios, { AxiosError } from 'axios'
import api from '../services/api'

export interface AuthUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'ADMIN' | 'USER'
  profilePicturePath?: string | null
}

const STORAGE_KEY = 'auth_token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(STORAGE_KEY))
  const user = ref<AuthUser | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const fullName = computed(() => user.value ? `${user.value.firstName} ${user.value.lastName}` : '')
  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  function setAuthorizationHeader(t: string | null) {
    if (t) {
      api.defaults.headers.common['Authorization'] = `Bearer ${t}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }

  async function login(payload: { emailOrUsername: string; password: string; remember: boolean }) {
    loading.value = true
    error.value = null

    try {
      // 1. Token abrufen
      const resp = await api.post<{ token?: string }>('/auth/token', {
        username: payload.emailOrUsername,
        password: payload.password
      })

      const t = resp.data.token ?? null

      if (!t) throw new Error('Token in Antwort nicht gefunden.')

      token.value = t
      setAuthorizationHeader(t)

      // 2. Userdaten abrufen
      const meResp = await api.get<AuthUser>('/api/users/me', {
        headers: { Authorization: `Bearer ${t}` }
      })
      user.value = meResp.data

      // 3. Token speichern
      if (payload.remember) localStorage.setItem(STORAGE_KEY, t)
      else sessionStorage.setItem(STORAGE_KEY, t)

      return { ok: true }
    } catch (err: unknown) {
      let message = 'Login fehlgeschlagen'

      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError
        message = (axiosErr.response?.data as { message?: string })?.message ?? axiosErr.message ?? message
      } else if (err instanceof Error) {
        message = err.message
      } else {
        message = String(err)
      }

      error.value = message
      token.value = null
      user.value = null
      setAuthorizationHeader(null)
      localStorage.removeItem(STORAGE_KEY)
      sessionStorage.removeItem(STORAGE_KEY)

      return { ok: false, error: message }
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    setAuthorizationHeader(null)
    localStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem(STORAGE_KEY)
  }

  function restoreFromStorage() {
    const t = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY)
    if (t) {
      token.value = t
      setAuthorizationHeader(t)
      return true
    }
    return false
  }

  async function fetchMe() {
    if (!token.value) return
    const res = await axios.get<AuthUser>('http://localhost:8081/api/users/me', {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    user.value = res.data
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    fullName,
    isAdmin,
    login,
    logout,
    restoreFromStorage,
    fetchMe
  }
})
