<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useShowsStore } from '@/stores/shows'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import GenreRow from '@/components/shows/GenreRow.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const showsStore = useShowsStore()
const route = useRoute()
const router = useRouter()

const pageFromRoute = computed(() => {
  const p = Number(route.query.page ?? 1)
  return Number.isFinite(p) && p >= 1 ? Math.floor(p) : 1
})

// Fetch whenever the URL page param changes (also handles initial mount + browser back/forward)
const mounted = ref(false)
watch(pageFromRoute, (page) => {
  showsStore.fetchPage(page - 1) // API is 0-based
  if (mounted.value) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  mounted.value = true
}, { immediate: true })

function goToPage(page: number) {
  router.push({ query: page > 1 ? { page } : {} })
}
</script>

<template>
  <main class="home">
    <div class="home__container">
      <ErrorMessage v-if="showsStore.error" :message="showsStore.error" />
    </div>

    <template v-if="showsStore.sortedGenres.length > 0">
      <GenreRow
        v-for="genre in showsStore.sortedGenres"
        :key="genre"
        :genre="genre"
        :shows="showsStore.showsByGenre.get(genre) ?? []"
      />
    </template>

    <div class="home__container">
      <LoadingSpinner v-if="showsStore.status === 'loading'" size="lg" />

      <nav v-if="showsStore.status !== 'loading'" class="home__pagination" aria-label="Pagination">
        <button
          class="home__page-btn"
          :disabled="pageFromRoute === 1"
          @click="goToPage(1)"
        >
          « First
        </button>
        <button
          class="home__page-btn"
          :disabled="pageFromRoute === 1"
          @click="goToPage(pageFromRoute - 1)"
        >
          ← Prev
        </button>
        <span class="home__page-indicator">Page {{ pageFromRoute }}</span>
        <button
          class="home__page-btn"
          :disabled="!showsStore.canGoNext"
          @click="goToPage(pageFromRoute + 1)"
        >
          Next →
        </button>
      </nav>
    </div>
  </main>
</template>

<style scoped lang="scss">
.home {
  padding-top: calc(var(--header-height) + 2rem);
  padding-bottom: 3rem;
  min-height: 100vh;

  &__container {
    max-width: var(--container-max);
    margin: 0 auto;
    padding: 0 var(--page-padding);
  }

  &__pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding-top: 2rem;
    flex-wrap: wrap;
  }

  &__page-btn {
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

  &__page-indicator {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    min-width: 4rem;
    text-align: center;
  }
}
</style>

