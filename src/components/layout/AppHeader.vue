<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import SearchBar from '@/components/layout/SearchBar.vue'

const themeStore = useThemeStore()
const router = useRouter()

function onSearch(query: string) {
  router.push(query ? { path: '/search', query: { q: query } } : '/')
}
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <RouterLink to="/" class="header__logo">
        <svg class="header__logo-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path
            d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"
          />
        </svg>
        <span>TVGuide</span>
      </RouterLink>

      <SearchBar @search="onSearch" />

      <button
        class="header__theme-btn"
        @click="themeStore.toggleTheme()"
        :aria-label="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <!-- Sun — shown in dark mode -->
        <svg
          v-if="themeStore.isDark"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        <!-- Moon — shown in light mode -->
        <svg
          v-else
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins' as *;

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 1px 8px var(--color-shadow);
  z-index: 100;
  transition:
    background-color var(--transition-base),
    border-color var(--transition-base);

  &__inner {
    max-width: var(--container-max);
    margin: 0 auto;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 0 var(--page-padding);
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: var(--font-size-xl);
    font-weight: 800;
    color: var(--color-accent);
    letter-spacing: -0.5px;
    flex-shrink: 0;

    span {
      display: none;

      @include respond-to('sm') {
        display: inline;
      }
    }

    &-icon {
      width: 28px;
      height: 28px;
    }
  }

  &__theme-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: var(--radius-full);
    color: var(--color-text-muted);
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast);

    &:hover {
      background-color: var(--color-border);
      color: var(--color-text);
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
