<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import DeleteUserModal from '@/components/atoms/DeleteUserModal.vue'

const userStore = useUserStore()
const router = useRouter()

const showDeleteModal = ref(false)
const userToDeleteId = ref<string | null>(null)

const searchQuery = ref('')
const sortKey = ref<keyof typeof userStore.user | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')

// Beispiel: Token kommt evtl. aus Auth-Store
const token =
  localStorage.getItem('auth_token') ??
  sessionStorage.getItem('auth_token')

onMounted(() => {
  if (token) {
    userStore.fetchUsers(token)
  }
})

function viewUserDetails(id: string) {
  router.push(`/admin/users/${id}/details`)
}

function editUser(id: string) {
  router.push(`/admin/users/${id}`)
}

function openDeleteModal(id: string) {
  userToDeleteId.value = id
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!userToDeleteId.value || !token) return

  await userStore.deleteUserById(userToDeleteId.value, token)
  showDeleteModal.value = false
  userToDeleteId.value = null
}

const filteredAndSortedUsers = computed(() => {
  let result = [...userStore.users]

  // 🔍 Suche über alle Felder
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()

    result = result.filter(user =>
      Object.values(user).some(value =>
        String(value).toLowerCase().includes(q)
      )
    )
  }

  // ↕️ Sortierung
  if (sortKey.value) {
    result.sort((a, b) => {
      const aVal = String(a[sortKey.value] ?? '').toLowerCase()
      const bVal = String(b[sortKey.value] ?? '').toLowerCase()

      if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return result
})

function sortBy(key: keyof typeof userStore.user) {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}
</script>

<template>
  <section
    class="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center px-6 py-8"
  >
    <div
      class="w-full bg-white rounded-lg shadow dark:border sm:max-w-6xl xl:p-0 dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1
          class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
        >
          Benutzerübersicht
        </h1>

        <!-- Lade- und Fehlermeldungen -->
        <div
          v-if="userStore.loading"
          class="text-gray-700 dark:text-gray-300"
        >
          Lade Benutzer...
        </div>

        <div
          v-if="userStore.errorMessage"
          class="rounded-lg bg-red-100 border border-red-400 p-4 text-red-700 text-sm"
        >
          {{ userStore.errorMessage }}
        </div>

        <input
          v-model="searchQuery"
          type="text"
          placeholder="Suchen nach ID, Name, E-Mail, Rolle, Status ..."
          class="mb-4 w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600"
        />

        <!-- Tabelle -->
        <div class="overflow-x-auto">
          <table
            class="min-w-full border border-gray-200 dark:border-gray-600 text-sm text-left text-gray-700 dark:text-gray-300"
          >
            <thead class="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
            <tr>
              <th class="px-4 py-2 border cursor-pointer select-none" @click="sortBy('id')">ID</th>
              <th class="px-4 py-2 border cursor-pointer select-none" @click="sortBy('salutation')">Anrede</th>
              <th class="px-4 py-2 border cursor-pointer select-none" @click="sortBy('firstName')">Vorname</th>
              <th class="px-4 py-2 border cursor-pointer select-none" @click="sortBy('lastName')">Nachname</th>
              <th class="px-4 py-2 border cursor-pointer select-none" @click="sortBy('email')">E-Mail</th>
              <th class="px-4 py-2 border cursor-pointer select-none" @click="sortBy('username')">Username</th>
              <th class="px-4 py-2 border cursor-pointer select-none" @click="sortBy('role')">Rolle</th>
              <th class="px-4 py-2 border cursor-pointer select-none" @click="sortBy('status')">Status</th>
              <th class="px-4 py-2 border">Aktionen</th>
            </tr>
            </thead>

            <tbody>
            <tr
              v-for="u in filteredAndSortedUsers"
              :key="u.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-4 py-2 border">{{ u.id }}</td>
              <td class="px-4 py-2 border">{{ u.salutation }}</td>
              <td class="px-4 py-2 border">{{ u.firstName }}</td>
              <td class="px-4 py-2 border">{{ u.lastName }}</td>
              <td class="px-4 py-2 border">{{ u.email }}</td>
              <td class="px-4 py-2 border">{{ u.username }}</td>
              <td class="px-4 py-2 border">{{ u.role }}</td>
              <td class="px-4 py-2 border">
                  <span
                    :class="{
                      'text-green-600': u.status === 'ACTIVE',
                      'text-yellow-600': u.status === 'INACTIVE',
                      'text-red-600': u.status === 'BANNED',
                      'text-gray-400': u.status === 'DELETED'
                    }"
                  >
                    {{ u.status }}
                  </span>
              </td>

              <td class="px-4 py-2 border">
                <button
                  class="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium mr-2"
                  @click="viewUserDetails(u.id)"
                >
                  Details
                </button>

                <button
                  class="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium mr-2"
                  @click="editUser(u.id)"
                >
                  Bearbeiten
                </button>

                <button
                  class="text-red-600 hover:text-red-800 font-medium"
                  @click="openDeleteModal(u.id)"
                >
                  Löschen
                </button>
              </td>
            </tr>
            </tbody>
          </table>

          <DeleteUserModal
            :open="showDeleteModal"
            @confirm="confirmDelete"
            @cancel="showDeleteModal = false"
          />
        </div>
      </div>
    </div>
  </section>
</template>
