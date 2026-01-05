<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import DeleteUserModal from '@/components/atoms/DeleteUserModal.vue'

const userStore = useUserStore()
const router = useRouter()

const showDeleteModal = ref(false)
const userToDeleteId = ref<string | null>(null)

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

        <!-- Tabelle -->
        <div class="overflow-x-auto">
          <table
            class="min-w-full border border-gray-200 dark:border-gray-600 text-sm text-left text-gray-700 dark:text-gray-300"
          >
            <thead class="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
            <tr>
              <th class="px-4 py-2 border">ID</th>
              <th class="px-4 py-2 border">Anrede</th>
              <th class="px-4 py-2 border">Vorname</th>
              <th class="px-4 py-2 border">Nachname</th>
              <th class="px-4 py-2 border">E-Mail</th>
              <th class="px-4 py-2 border">Username</th>
              <th class="px-4 py-2 border">Rolle</th>
              <th class="px-4 py-2 border">Status</th>
              <th class="px-4 py-2 border">Aktionen</th>
            </tr>
            </thead>

            <tbody>
            <tr
              v-for="u in userStore.users"
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
