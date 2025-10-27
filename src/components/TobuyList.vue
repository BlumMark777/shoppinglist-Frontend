<template>
  <h2>🛒 Meine Einkaufsliste</h2>

  <!-- Eingabefelder für neue Items -->
  <div class="input-area">
    <input v-model="nameField" placeholder="Produktname" type="text" />
    <input v-model.number="quantityField" placeholder="Menge" type="number" />
    <button @click="addItem">Hinzufügen</button>
  </div>

  <!-- Liste der Einträge -->
  <table>
    <thead>
      <tr>
        <th>Produkt</th>
        <th>Menge</th>
        <th>Gekauft?</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="items.length === 0">
        <td colspan="3">🧺 Noch keine Produkte in der Liste</td>
      </tr>
      <tr v-for="item in items" :key="item.name">
        <td>{{ item.name }}</td>
        <td>{{ item.quantity }}</td>
        <td>
          <input type="checkbox" v-model="item.purchased" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ref } from 'vue'

// Testdaten (nur sichtbar, wenn kein Backend läuft)
const items = ref([
  { name: "Äpfel", quantity: 3, purchased: false },
  { name: "Milch", quantity: 1, purchased: true },
  { name: "Brot", quantity: 2, purchased: false }
])

// Eingabefelder
const nameField = ref('')
const quantityField = ref(1)

// Neues Item hinzufügen
function addItem() {
  if (nameField.value.trim() === '') return
  items.value.push({
    name: nameField.value,
    quantity: quantityField.value,
    purchased: false
  })
  nameField.value = ''
  quantityField.value = 1
}
</script>

<style scoped>
h2 {
  text-align: center;
  color: #1e3a8a;
  margin-bottom: 1rem;
}

.input-area {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

table {
  margin: 0 auto;
  border-collapse: collapse;
  width: 60%;
}

th, td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: center;
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
</style>

