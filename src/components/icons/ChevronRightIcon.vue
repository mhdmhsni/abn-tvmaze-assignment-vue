<script setup lang="ts">
withDefaults(defineProps<{ strokeWidth?: number }>(), { strokeWidth: 2 })
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    aria-hidden="true"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
</template>
