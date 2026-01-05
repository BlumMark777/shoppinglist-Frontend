<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import {
  fetchTobuys,
  createTobuy,
  deleteTobuy,
  togglePurchased,
  toggleFavorite,
  filterTobuys,
  toggleDarkMode,
  isDarkModeEnabled,
} from '../api/tobuyApi.js'

// Zustand (State)
const items = ref([])
const nameField = ref('')
const loading = ref(false)
const error = ref('')

// Suche
const searchQuery = ref('')
const filteredItems = computed(() => {
  // optional: gefilterte Liste auch sortieren
  const filtered = filterTobuys(items.value, searchQuery.value)
  return sortItems([...filtered])
})

// Dark Mode
const darkMode = ref(isDarkModeEnabled())

function applyDarkMode(enabled) {
  document.documentElement.classList.toggle('dark', enabled)
}

function handleToggleDarkMode() {
  darkMode.value = toggleDarkMode()
}

watch(darkMode, (val) => applyDarkMode(val))

// Liste laden
async function load() {
  loading.value = true
  error.value = ''
  try {
    items.value = sortItems(await fetchTobuys())
  } catch (e) {
    console.error(e)
    error.value = '❌ Fehler beim Laden der Einträge.'
  } finally {
    loading.value = false
  }
}

function sortItems(list) {
  return list.sort((a, b) => {
    // 1. Favoriten oben
    if (a.favorite !== b.favorite) {
      return a.favorite ? -1 : 1
    }

    // 2. Nicht-gekaufte oben
    if (a.purchased !== b.purchased) {
      return a.purchased ? 1 : -1
    }

    // 3. Zuletzt benutzt (lastUsedAt) – neueste zuerst
    return new Date(b.lastUsedAt) - new Date(a.lastUsedAt)
  })
}

// Neuen Eintrag anlegen
async function addItem() {
  if (!nameField.value.trim()) return

  try {
    await createTobuy({ name: nameField.value })
    nameField.value = '' // Eingabefeld leeren
    await load() // Liste aktualisieren
  } catch (e) {
    console.error(e)
    error.value = '❌ Fehler beim Hinzufügen.'
  }
}

// Eintrag löschen
async function removeItem(id) {
  try {
    await deleteTobuy(id)
    await load()
  } catch (e) {
    console.error(e)
    error.value = '❌ Fehler beim Löschen.'
  }
}

// Purchased toggeln
async function togglePurchasedItem(id) {
  try {
    await togglePurchased(id)
    await load()
  } catch (e) {
    console.error(e)
    error.value = '❌ Fehler beim Umschalten (Gekauft).'
  }
}

// Favorite toggeln
async function toggleFavoriteItem(id) {
  try {
    await toggleFavorite(id)
    await load()
  } catch (e) {
    console.error(e)
    error.value = '❌ Fehler beim Umschalten (Favorit).'
  }
}

// Initial
onMounted(() => {
  applyDarkMode(darkMode.value)
  load()
})
</script>

<template>
  <section class="list-container">
    <div class="header">
      <h2>🛒 Meine Einkaufsliste</h2>

      <button class="mode-btn" @click="handleToggleDarkMode">
        {{ darkMode ? '☀️ Light' : '🌙 Dark' }}
      </button>
    </div>

    <!-- Eingabefeld: hinzufügen -->
    <div class="input-area">
      <input v-model="nameField" placeholder="Produktname" type="text" />
      <button @click="addItem">➕ Hinzufügen</button>
    </div>

    <!-- Suche -->
    <div class="input-area">
      <input v-model="searchQuery" placeholder="🔍 Suchen..." type="text" />
      <button class="clear-btn" @click="searchQuery = ''" :disabled="!searchQuery">
        ✖︎
      </button>
    </div>

    <p v-if="loading">⏳ Lade Daten…</p>
    <p v-if="error" class="error">{{ error }}</p>

    <!-- Tabelle -->
    <table v-if="!loading && !error">
      <thead>
      <tr>
        <th>⭐</th>
        <th>Produkt</th>
        <th>✔️</th>
        <th>Aktion</th>
      </tr>
      </thead>

      <tbody>
      <tr v-if="items.length === 0">
        <td colspan="4">🧺 Noch keine Einträge vorhanden</td>
      </tr>

      <tr v-else-if="filteredItems.length === 0">
        <td colspan="4">🔎 Keine Treffer</td>
      </tr>

      <tr v-for="item in filteredItems" :key="item.id">
        <!-- FAVORITE -->
        <td>
          <button @click="toggleFavoriteItem(item.id)">
            {{ item.favorite ? '⭐' : '☆' }}
          </button>
        </td>

        <!-- NAME -->
        <td>{{ item.name }}</td>

        <!-- PURCHASED -->
        <td>
          <button @click="togglePurchasedItem(item.id)">
            {{ item.purchased ? '✔️' : '⬜' }}
          </button>
        </td>

        <!-- DELETE -->
        <td>
          <button class="delete-btn" @click="removeItem(item.id)">
            🗑️ Löschen
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.list-container {
  max-width: 700px;
  margin: 2rem auto;
  text-align: center;
  font-family: system-ui, sans-serif;
  background: white;
  color: #111827;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid #e5e7eb;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.input-area {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

input {
  padding: 0.4rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
}

button {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #1d4ed8;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.mode-btn {
  background: #111827;
}

.mode-btn:hover {
  background: #0b1220;
}

.clear-btn {
  background: #6b7280;
  padding: 0.5rem 0.75rem;
}

.clear-btn:hover {
  background: #4b5563;
}

.delete-btn {
  background-color: #dc2626;
}

.delete-btn:hover {
  background-color: #b91c1c;
}

.error {
  color: #dc2626;
  font-weight: bold;
  margin-bottom: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th,
td {
  border: 1px solid #ddd;
  padding: 0.5rem;
}

/* Dark Mode via <html class="dark"> */
:global(html.dark) .list-container {
  background: #0b1220;
  color: #e5e7eb;
  border-color: #374151;
}

:global(html.dark) input {
  background: #111827;
  color: #e5e7eb;
  border-color: #374151;
}

:global(html.dark) table,
:global(html.dark) th,
:global(html.dark) td {
  border-color: #374151;
}

:global(html.dark) .mode-btn {
  background: #f59e0b;
  color: #111827;
}

:global(html.dark) .mode-btn:hover {
  background: #d97706;
}

:global(html.dark) .clear-btn {
  background: #374151;
}

:global(html.dark) .clear-btn:hover {
  background: #1f2937;
}
</style>