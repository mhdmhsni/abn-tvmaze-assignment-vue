<script setup lang="ts">
defineProps<{
  currentPage: number
  canGoNext: boolean
}>()

defineEmits<{ change: [page: number] }>()
</script>

<template>
  <nav class="pagination" aria-label="Pagination">
    <button class="pagination__btn" :disabled="currentPage === 1" @click="$emit('change', 1)">
      « First
    </button>
    <button
      class="pagination__btn"
      :disabled="currentPage === 1"
      @click="$emit('change', currentPage - 1)"
    >
      ← Prev
    </button>
    <span class="pagination__indicator">Page {{ currentPage }}</span>
    <button
      class="pagination__btn"
      :disabled="!canGoNext"
      @click="$emit('change', currentPage + 1)"
    >
      Next →
    </button>
  </nav>
</template>

<style scoped lang="scss">
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding-top: 2rem;
  flex-wrap: wrap;

  &__btn {
    padding: 0.5rem 1.25rem;
    border-radius: var(--radius-full);
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text);
    font-size: var(--font-size-sm);
    font-weight: 600;
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast),
      border-color var(--transition-fast);

    &:hover:not(:disabled) {
      background-color: var(--color-accent);
      color: #fff;
      border-color: var(--color-accent);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  &__indicator {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    min-width: 4rem;
    text-align: center;
  }
}
</style>
