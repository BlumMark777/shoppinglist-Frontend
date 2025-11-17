<script setup>
import { ref, onMounted } from 'vue'
import {
  fetchTobuys,
  createTobuy,
  deleteTobuy,
  togglePurchased,
  toggleFavorite
} from '../api/tobuyApi.js'

// Zustand (State)
const items = ref([])
const nameField = ref('')
const loading = ref(false)
const error = ref('')

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
      return a.favorite ? -1 : 1;
    }

    // 2. Nicht-gekaute oben
    if (a.purchased !== b.purchased) {
      return a.purchased ? 1 : -1;
    }

    // 3. Zuletzt benutzt (lastUsedAt) – neueste zuerst
    return new Date(b.lastUsedAt) - new Date(a.lastUsedAt);
  });
}


// Neuen Eintrag anlegen
async function addItem() {
  if (!nameField.value.trim()) return

  try {
    await createTobuy({ name: nameField.value })
    nameField.value = ''   // Eingabefeld leeren
    await load()           // Liste aktualisieren
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

onMounted(load)
</script>

<template>
  <section class="list-container">
    <h2>🛒 Meine Einkaufsliste</h2>

    <!-- Eingabefeld -->
    <div class="input-area">
      <input v-model="nameField" placeholder="Produktname" type="text" />
      <button @click="addItem">➕ Hinzufügen</button>
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

        <tr v-for="item in items" :key="item.id">
          <!-- FAVORITE -->
          <td>
            <button @click="toggleFavoriteItem(item.id)">
              {{ item.favorite ? "⭐" : "☆" }}
            </button>
          </td>

          <!-- NAME -->
          <td>{{ item.name }}</td>

          <!-- PURCHASED -->
          <td>
            <button @click="togglePurchasedItem(item.id)">
              {{ item.purchased ? "✔️" : "⬜" }}
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

.delete-btn {
  background-color: #dc2626;
}

.delete-btn:hover {
  background-color: #b91c1c;
}

.error {
  color: red;
  font-weight: bold;
  margin-bottom: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  border: 1px solid #ddd;
  padding: 0.5rem;
}
</style>

