<script setup lang="ts">
import { useThemeStore } from './stores/theme'
import { onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'

const themeStore = useThemeStore()
onMounted(() => themeStore.initTheme())
</script>

<template>
  <AppHeader />
  <RouterView />
</template>

<style scoped></style>
