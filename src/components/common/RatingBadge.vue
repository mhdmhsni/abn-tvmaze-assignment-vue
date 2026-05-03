<script setup lang="ts">
defineProps<{
  rating: number | null
}>()
</script>

<template>
  <span class="rating" :class="{ 'rating--null': rating === null }">
    <svg class="rating__star" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      />
    </svg>
    <span class="rating__value">{{ rating !== null ? rating.toFixed(1) : 'N/A' }}</span>
  </span>
</template>

<style scoped lang="scss">
.rating {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-rating);

  &--null {
    color: var(--color-text-muted);
  }

  &__star {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
  }

  &__value {
    line-height: 1;
  }
}
</style>
