<template>
  <h3>{{ title }}</h3>

  <div>
    <input v-model="nameField" placeholder="Name" type="text">
    <input v-model="priceField" placeholder="Preis" @keyup.enter="save">
    <button @click="save">Speichern</button>
  </div>

  <table>
    <thead>
      <tr><th>Name</th><th>Preis</th></tr>
    </thead>
    <tbody>
      <tr v-if="items.length === 0">
        <td colspan="2">Noch keine Einträge</td>
      </tr>
      <tr v-for="item in items" :key="item.id">
        <td>{{ item.name }}</td>
        <td>{{ item.price }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

defineProps({ title: String })

const items = ref([])
const nameField = ref('')
const priceField = ref(0)

async function loadThings() {
  const response = await axios.get('http://localhost:8080/tobuys')
  items.value = response.data
}

async function save() {
  const data = { name: nameField.value, price: priceField.value }
  const response = await axios.post('http://localhost:8080/tobuys', data)
  console.log('Gespeichert:', response.data)
  await loadThings()
}

onMounted(loadThings)
</script>
