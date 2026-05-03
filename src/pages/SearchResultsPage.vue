<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchShows } from '@/api/tvmaze'
import type { Show, FetchStatus } from '@/types'
import ShowCard from '@/components/shows/ShowCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const route = useRoute()
const router = useRouter()

const results = ref<Show[]>([])
const status = ref<FetchStatus>('idle')
const error = ref<string | null>(null)

async function performSearch(query: string) {
  const q = query.trim()
  if (!q) {
    results.value = []
    status.value = 'idle'
    return
  }
  status.value = 'loading'
  error.value = null
  try {
    results.value = await searchShows(q)
    status.value = 'success'
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Search failed'
    status.value = 'error'
  }
}

onMounted(() => {
  performSearch(String(route.query.q ?? ''))
})

watch(
  () => route.query.q,
  (q) => performSearch(String(q ?? '')),
)
</script>

<template>
  <main class="search-page">
    <h1 class="search-page__heading">
      <template v-if="route.query.q">
        Results for <em>"{{ route.query.q }}"</em>
      </template>
      <template v-else>Search</template>
    </h1>

    <LoadingSpinner v-if="status === 'loading'" size="lg" />
    <ErrorMessage v-else-if="status === 'error'" :message="error!" />

    <template v-else-if="status === 'success'">
      <p v-if="results.length === 0" class="search-page__empty">No shows found.</p>
      <div v-else class="search-page__grid">
        <ShowCard
          v-for="show in results"
          :key="show.id"
          :show="show"
          @select="(id) => router.push(`/show/${id}`)"
        />
      </div>
    </template>
  </main>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins' as *;

.search-page {
  padding: calc(var(--header-height) + 32px) var(--page-padding) 48px;
  max-width: var(--container-max);
  margin: 0 auto;
  min-height: 100vh;

  &__heading {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: 24px;

    em {
      font-style: italic;
      color: var(--color-accent);
    }
  }

  &__empty {
    color: var(--color-text-muted);
    font-size: var(--font-size-base);
  }

  &__grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--card-gap);
  }
}
</style>
