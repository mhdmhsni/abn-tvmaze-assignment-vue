<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'lg'
}>()
</script>

<template>
  <div class="spinner" :class="`spinner--${size ?? 'sm'}`" role="status" aria-label="Loading">
    <div class="spinner__ring" />
  </div>
</template>

<style scoped lang="scss">
.spinner {
  display: flex;
  justify-content: center;
  align-items: center;

  &--sm {
    padding: 16px;
  }
  &--lg {
    padding: 48px;
  }

  &__ring {
    border: 3px solid var(--color-border);
    border-top-color: var(--color-accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;

    .spinner--sm & {
      width: 24px;
      height: 24px;
    }

    .spinner--lg & {
      width: 48px;
      height: 48px;
      border-width: 4px;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
