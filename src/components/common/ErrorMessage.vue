<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <div class="error" role="alert">
    <svg
      class="error__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
    <span>{{ message }}</span>
  </div>
</template>

<style scoped lang="scss">
.error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: rgba(229, 9, 20, 0.1);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-base);
  color: var(--color-accent);
  font-size: var(--font-size-sm);
  margin: 16px var(--page-padding);

  &__icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
}
</style>
