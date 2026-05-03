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
    <polyline points="15 18 9 12 15 6" />
  </svg>
</template>
