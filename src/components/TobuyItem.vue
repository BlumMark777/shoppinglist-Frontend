<script setup>
defineProps({ entry: Object })
</script>

<template>
  <li>{{ entry.name }}</li>
</template>

<style scoped>
li { list-style: none; padding: 4px; }
</style>
