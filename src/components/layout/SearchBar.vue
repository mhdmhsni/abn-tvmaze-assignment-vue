<script setup lang="ts">
import { ref } from 'vue'
import ChevronRightIcon from '@/components/icons/ChevronRightIcon.vue'

const emit = defineEmits<{ search: [query: string] }>()
const searchQuery = ref('')

function submitSearch() {
  emit('search', searchQuery.value.trim())
}
</script>

<template>
  <form class="search-bar" role="search" @submit.prevent="submitSearch">
    <svg
      class="search-bar__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
    <input
      v-model="searchQuery"
      class="search-bar__input"
      type="search"
      placeholder="Search and press Enter…"
      aria-label="Search shows"
    />
    <button
      v-if="searchQuery.trim()"
      type="submit"
      class="search-bar__submit"
      aria-label="Submit search"
    >
      <ChevronRightIcon :stroke-width="2.5" />
    </button>
  </form>
</template>

<style scoped lang="scss">
.search-bar {
  flex: 1;
  min-width: 0;
  max-width: 400px;
  position: relative;
  display: flex;
  align-items: center;

  &__icon {
    position: absolute;
    left: 14px;
    width: 18px;
    height: 18px;
    color: var(--color-text-muted);
    pointer-events: none;
  }

  &__input {
    width: 100%;
    height: 44px;
    padding: 0 48px 0 42px;
    border-radius: var(--radius-full);
    border: 1px solid var(--color-border);
    background: var(--color-bg);
    color: var(--color-text);
    font-size: var(--font-size-sm);
    outline: none;
    transition:
      border-color var(--transition-fast),
      box-shadow var(--transition-fast);

    &::placeholder {
      color: var(--color-text-muted);
    }

    &:focus {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.15);
    }
  }

  &__submit {
    position: absolute;
    right: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: var(--radius-full);
    background: var(--color-accent);
    color: #fff;
    transition: background-color var(--transition-fast);

    :deep(svg) {
      width: 16px;
      height: 16px;
    }

    &:hover {
      background-color: var(--color-accent-hover);
    }
  }
}
</style>
