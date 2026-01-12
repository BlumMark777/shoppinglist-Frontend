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

// State
const items = ref([])
const nameField = ref('')
const loading = ref(false)
const error = ref('')

// Suche
const searchQuery = ref('')

// ⭐ Nur-Favoriten-Filter
const showOnlyFavorites = ref(false)

// Gefilterte + sortierte Items
const filteredItems = computed(() => {
  const filtered = filterTobuys(items.value, searchQuery.value)

  const favFiltered = showOnlyFavorites.value
      ? filtered.filter(item => item.favorite)
      : filtered

  return sortItems([...favFiltered])
})

// Favoritenfilter toggeln
function toggleFavoritesFilter() {
  showOnlyFavorites.value = !showOnlyFavorites.value
}

// Dark Mode
const darkMode = ref(isDarkModeEnabled())

function applyDarkMode(enabled) {
  document.documentElement.classList.toggle('dark', enabled)
}

function handleToggleDarkMode() {
  darkMode.value = toggleDarkMode()
}

watch(darkMode, (val) => applyDarkMode(val))

// Laden
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
    if (a.favorite !== b.favorite) return a.favorite ? -1 : 1
    if (a.purchased !== b.purchased) return a.purchased ? 1 : -1
    return new Date(b.lastUsedAt) - new Date(a.lastUsedAt)
  })
}

// Create
async function addItem() {
  const trimmed = nameField.value.trim()

  // ❗ Fehler, wenn Eingabe leer oder nur Leerzeichen
  if (!trimmed) {
    error.value = '❌ Bitte einen gültigen Produktnamen eingeben.'
    return
  }

  try {
    await createTobuy({ name: trimmed })
    nameField.value = ''
    error.value = '' // Fehler entfernen nach Erfolg
    await load()
  } catch (e) {
    console.error(e)
    error.value = '❌ Fehler beim Hinzufügen.'
  }
}

// Delete
async function removeItem(id) {
  try {
    await deleteTobuy(id)
    await load()
  } catch (e) {
    console.error(e)
    error.value = '❌ Fehler beim Löschen.'
  }
}

// Toggle purchased
async function togglePurchasedItem(id) {
  try {
    await togglePurchased(id)
    await load()
  } catch (e) {
    console.error(e)
    error.value = '❌ Fehler beim Umschalten (Gekauft).'
  }
}

// Toggle favorite
async function toggleFavoriteItem(id) {
  try {
    await toggleFavorite(id)
    await load()
  } catch (e) {
    console.error(e)
    error.value = '❌ Fehler beim Umschalten (Favorit).'
  }
}

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

    <!-- Top Bar: Add + Search -->
    <div class="toolbar">
      <div class="row">
        <input v-model="nameField" placeholder="Produktname" type="text" />
        <button @click="addItem">➕ Hinzufügen</button>
      </div>

      <div class="row search">
        <input v-model="searchQuery" placeholder="🔍 Suchen..." type="text" />
        <button
            class="clear-btn"
            @click="searchQuery = ''"
            :disabled="!searchQuery"
            title="Suche löschen"
        >
          ✖︎
        </button>
      </div>

      <!-- ⭐ Neuer Favoriten-Filter-Button -->
      <div class="row favorites-row">
        <button
            class="favorites-btn"
            :class="{ active: showOnlyFavorites }"
            @click="toggleFavoritesFilter"
        >
          {{ showOnlyFavorites ? '📋 Alle Produkte anzeigen' : '⭐ Favoriten anzeigen' }}
        </button>
      </div>
    </div>

    <p v-if="loading">⏳ Lade Daten…</p>
    <p v-if="error" class="error">{{ error }}</p>

    <table v-if="!loading">
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
        <td>
          <button class="icon-btn" @click="toggleFavoriteItem(item.id)">
            {{ item.favorite ? '⭐' : '☆' }}
          </button>
        </td>

        <td class="name-cell">{{ item.name }}</td>

        <td>
          <button class="icon-btn" @click="togglePurchasedItem(item.id)">
            {{ item.purchased ? '✔️' : '⬜' }}
          </button>
        </td>

        <td>
          <button class="delete-btn" @click="removeItem(item.id)">🗑️ Löschen</button>
        </td>
      </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
/* ===== Tokens (Light) ===== */
:global(:root) {
  --bg: #f6f7fb;
  --card: #ffffff;
  --text: #0f172a;
  --muted: #64748b;

  --border: rgba(15, 23, 42, 0.1);
  --shadow: 0 16px 50px rgba(2, 6, 23, 0.1);

  --primary: #2563eb;
  --primary-hover: #1d4ed8;

  --danger: #ef4444;
  --danger-hover: #dc2626;

  --focus: 0 0 0 4px rgba(37, 99, 235, 0.2);

  --radius: 16px;
  --radius-sm: 12px;
}

/* ===== Tokens (Dark) ===== */
:global(html.dark) {
  --bg: #0b1220;
  --card: #0f172a;
  --text: #e5e7eb;
  --muted: #94a3b8;

  --border: rgba(148, 163, 184, 0.18);
  --shadow: 0 18px 55px rgba(0, 0, 0, 0.5);

  --primary: #3b82f6;
  --primary-hover: #2563eb;

  --danger: #f87171;
  --danger-hover: #ef4444;

  --focus: 0 0 0 4px rgba(59, 130, 246, 0.25);
}

/* Page BG */
:global(body) {
  background: var(--bg);
}

/* Card */
.list-container {
  max-width: 860px;
  margin: 4rem auto;
  padding: 1.25rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  color: var(--text);
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Apple Color Emoji",
  "Segoe UI Emoji";
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

h2 {
  margin: 0;
  font-size: 1.35rem;
  letter-spacing: -0.02em;
}

.mode-btn {
  background: rgba(100, 116, 139, 0.18);
  color: var(--text);
  border: 1px solid var(--border);
  box-shadow: none;
  padding: 0.6rem 0.85rem;
}

:global(html.dark) .mode-btn {
  background: rgba(148, 163, 184, 0.12);
}

/* Toolbar */
.toolbar {
  display: grid;
  gap: 0.75rem;
  margin: 1rem 0 0.5rem;
}

.row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.search {
  align-items: center;
}

/* ⭐ FAVORITEN-BUTTON */
.favorites-row {
  justify-content: center;
}

.favorites-btn {
  background: rgba(234, 179, 8, 0.12);
  color: #b45309;
  border-radius: 999px;
  padding: 0.55rem 1rem;
  font-size: 0.85rem;
  border: 1px solid transparent;
  box-shadow: none;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.favorites-btn:hover {
  background: rgba(234, 179, 8, 0.22);
}

.favorites-btn.active {
  background: rgba(234, 179, 8, 0.28);
  border-color: rgba(234, 179, 8, 0.8);
}

/* Inputs */
input {
  width: min(360px, 90%);
  padding: 0.72rem 0.9rem;
  font-size: 0.95rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  outline: none;
  background: transparent;
  color: var(--text);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

input::placeholder {
  color: var(--muted);
}

input:focus {
  border-color: rgba(37, 99, 235, 0.55);
  box-shadow: var(--focus);
}

/* Buttons */
button {
  border: 1px solid transparent;
  background: var(--primary);
  color: white;
  padding: 0.72rem 1rem;
  font-size: 0.95rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: transform 0.12s ease, background 0.15s ease, opacity 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.2);
}

button:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0px);
  opacity: 0.95;
}

button:focus-visible {
  outline: none;
  box-shadow: var(--focus);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Clear button */
.clear-btn {
  background: rgba(100, 116, 139, 0.18);
  color: var(--text);
  border: 1px solid var(--border);
  box-shadow: none;
  padding: 0.72rem 0.9rem;
}

/* Icon buttons in table */
.icon-btn {
  padding: 0.45rem 0.75rem;
  border-radius: 12px;
  box-shadow: none;
}

/* Delete button */
.delete-btn {
  background: var(--danger);
  box-shadow: 0 10px 25px rgba(239, 68, 68, 0.18);
}

.delete-btn:hover {
  background: var(--danger-hover);
}

/* Text */
.error {
  color: var(--danger);
  font-weight: 600;
  margin: 0.5rem 0 0;
}

p {
  margin: 0.5rem 0 0;
  color: var(--muted);
}

/* Table */
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 1.25rem;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

thead th {
  text-align: left;
  font-size: 0.82rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted);
  padding: 0.95rem 1rem;
  background: rgba(100, 116, 139, 0.06);
}

tbody td {
  padding: 0.9rem 1rem;
  border-top: 1px solid var(--border);
}

tbody tr:hover td {
  background: rgba(37, 99, 235, 0.05);
}

tbody tr td[colspan="4"] {
  text-align: center;
  color: var(--muted);
  padding: 1.2rem;
}

thead th:first-child,
thead th:nth-child(3),
tbody td:first-child,
tbody td:nth-child(3) {
  text-align: center;
  width: 90px;
}

thead th:last-child,
tbody td:last-child {
  width: 180px;
}

.name-cell {
  font-weight: 600;
}

/* Mobile */
@media (max-width: 560px) {
  .list-container {
    margin: 2rem 1rem;
    padding: 1rem;
  }
  button {
    width: 100%;
  }
  input {
    width: 100%;
  }
  .clear-btn {
    width: auto;
  }
}
</style>