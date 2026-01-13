import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import api from '../services/api'
import { API_BASE_URL } from '@/services/api'
import type { AxiosError } from 'axios'
import { useAuthStore } from './authStore'

export type Salutation = 'MR' | 'MS' | 'MRS' | 'MX'
export type Role = 'USER' | 'ADMIN'
export type Status = 'ACTIVE' | 'INACTIVE' | 'BANNED' | 'DELETED'

export interface User {
  id: string
  salutation: Salutation
  firstName: string
  lastName: string
  countryCode: string
  address: string
  zip: string
  city: string
  email: string
  username: string
  role: Role
  status: Status
  profilePicturePath?: string
}

export const useUserStore = defineStore('user', () => {
  const user = reactive<User>({
    id: '',
    salutation: 'MR',
    firstName: '',
    lastName: '',
    countryCode: '',
    address: '',
    zip: '',
    city: '',
    email: '',
    username: '',
    role: 'USER',
    status: 'ACTIVE'
  })

  const password = ref<string>('')
  const otherSalutation = ref('')
  const loading = ref(false)
  const successMessage = ref('')
  const errorMessage = ref('')
  const users = ref<User[]>([])
  const profileFile = ref<File>()

  interface AdminUpdatePayload extends Partial<User> {
    password?: string
  }

  interface UserUpdatePayload extends Partial<User> {
    password?: string
  }

  // Daten laden
  async function loadUser(userId: string, token: string) {
    loading.value = true
    errorMessage.value = ''
    try {
      const resp = await api.get(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      Object.assign(user, resp.data)

      if (resp.data.salutation === 'MX') {
        otherSalutation.value = ''
      }
    } catch (err) {
      console.error(err)
      errorMessage.value = 'Benutzer konnte nicht geladen werden.'
    } finally {
      loading.value = false
    }
  }

  // Daten speichern
  async function saveUser(token: string) {
    successMessage.value = ''
    errorMessage.value = ''

    const authStore = useAuthStore()

    try {
      let profilePicturePath = user.profilePicturePath

      if (profileFile.value) {
        const formData = new FormData()
        formData.append('file', profileFile.value)

        const uploadResp = await api.post('/api/files/upload', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })

        profilePicturePath = uploadResp.data // Server liefert Key oder Pfad
      }

      let resp
      if (authStore.isAdmin) {
        // Admin-Payload
        const payload: AdminUpdatePayload = {
          salutation: user.salutation,
          firstName: user.firstName,
          lastName: user.lastName,
          countryCode: user.countryCode,
          address: user.address,
          zip: user.zip,
          city: user.city,
          email: user.email,
          username: user.username,
          role: user.role,
          status: user.status,
          password: password.value || undefined, // Passwort optional
          profilePicturePath // Profilbild optional
        }

        resp = await api.put(`/api/users/admin/${user.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        // Normaler User
        const payload: UserUpdatePayload = {
          salutation: user.salutation,
          firstName: user.firstName,
          lastName: user.lastName,
          countryCode: user.countryCode,
          address: user.address,
          zip: user.zip,
          city: user.city,
          password: password.value || undefined, // Passwort optional
          profilePicturePath // Profilbild optional
        }

        resp = await api.put(`/api/users/${user.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }

      Object.assign(user, resp.data)
      successMessage.value = 'Änderungen erfolgreich gespeichert.'

    } catch (err: unknown) {
      console.error(err)

      // Typisieren als AxiosError mit optionalem data.message
      const axiosErr = err as AxiosError<{ message?: string }>
      if (axiosErr.response?.data?.message) {
        errorMessage.value = axiosErr.response.data.message
      } else {
        errorMessage.value = 'Fehler beim Speichern der Änderungen.'
      }
    }
  }

  // Benutzer löschen
  async function deleteUser(token: string) {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
      await api.delete(`/api/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      successMessage.value = 'Benutzerkonto wurde gelöscht.'
    } catch (err: unknown) {
      console.error(err)

      const axiosErr = err as AxiosError<{ message?: string }>
      if (axiosErr.response?.data?.message) {
        errorMessage.value = axiosErr.response.data.message
      } else {
        errorMessage.value = 'Fehler beim Löschen des Benutzerkontos.'
      }
    } finally {
      loading.value = false
    }
  }

  // Benutzer erstellen
  async function createUser(password: string) {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
      const payload = {
        salutation: user.salutation,
        firstName: user.firstName,
        lastName: user.lastName,
        countryCode: user.countryCode,
        address: user.address,
        city: user.city,
        zip: user.zip,
        email: user.email,
        username: user.username,
        password
      }
      const resp = await api.post('/api/users', payload)
      Object.assign(user, resp.data) // ID und eventuell andere Felder übernehmen
      successMessage.value = 'Benutzer erfolgreich erstellt.'
      return true
    } catch (err: unknown) {
      console.error(err)
      const axiosErr = err as AxiosError<{ message?: string }>
      if (axiosErr.response?.data?.message) {
        errorMessage.value = axiosErr.response.data.message
      } else {
        errorMessage.value = 'Fehler beim Erstellen des Benutzers.'
      }
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchUsers(token: string) {
    loading.value = true
    errorMessage.value = ''
    try {
      const resp = await api.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      users.value = resp.data
    } catch {
      errorMessage.value = 'Benutzer konnten nicht geladen werden.'
    } finally {
      loading.value = false
    }
  }

  async function deleteUserById(userId: string, token: string) {
    await api.delete(`/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    users.value = users.value.filter(u => u.id !== userId)
  }

  async function fetchUserById(userId: string, token: string) {
    loading.value = true
    errorMessage.value = ''

    try {
      const resp = await api.get<User>(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      Object.assign(user, resp.data)
    } catch (err) {
      console.error(err)
      errorMessage.value = 'Benutzerdetails konnten nicht geladen werden.'
    } finally {
      loading.value = false
    }
  }

  function getUserImageUrl(user?: User | null) {
    if (!user?.profilePicturePath) return '${API_BASE_URL}/api/files/fallback.png'
    return `${API_BASE_URL}/api/files/${user.profilePicturePath}`
  }

  return {
    user,
    users,
    otherSalutation,
    loading,
    successMessage,
    errorMessage,
    loadUser,
    saveUser,
    deleteUser,
    createUser,
    fetchUsers,
    deleteUserById,
    fetchUserById,
    password,
    getUserImageUrl,
    profileFile,
  }
})
