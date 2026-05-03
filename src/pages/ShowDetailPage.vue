<script setup lang="ts">
defineProps<{
  id: string
}>()
</script>

<template>
  <main class="detail">
    <p>Show #{{ id }} — detail page coming in Step 2.</p>
  </main>
</template>

<style scoped lang="scss">
.detail {
  padding: calc(var(--header-height) + 32px) var(--page-padding) 48px;
}
</style>
