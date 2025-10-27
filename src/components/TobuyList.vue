<script setup>
import { ref, onMounted } from 'vue'
import { fetchTobuys } from '../api/tobuyApi'
import TobuyItem from './TobuyItem.vue'

const items = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    items.value = await fetchTobuys()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section>
    <p v-if="loading">Lade…</p>
    <p v-else-if="error">Fehler: {{ error }}</p>
    <ul v-else>
      <!-- M2-Pflicht: Unterkomponente + v-for -->
      <TobuyItem v-for="e in items" :key="e.id" :entry="e" />
    </ul>
  </section>
</template>
