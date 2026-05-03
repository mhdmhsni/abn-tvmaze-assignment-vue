<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useShowsStore } from '@/stores/shows'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import GenreRow from '@/components/shows/GenreRow.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import PaginationNav from '@/components/common/PaginationNav.vue'

const showsStore = useShowsStore()
const route = useRoute()
const router = useRouter()

const pageFromRoute = computed(() => {
  const p = Number(route.query.page ?? 1)
  return Number.isFinite(p) && p >= 1 ? Math.floor(p) : 1
})

// Fetch whenever the URL page param changes (also handles initial mount + browser back/forward)
const mounted = ref(false)
watch(
  pageFromRoute,
  (page) => {
    showsStore.fetchPage(page - 1) // API is 0-based
    if (mounted.value) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    mounted.value = true
  },
  { immediate: true },
)

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
        @select="(id) => router.push(`/show/${id}`)"
      />
    </template>

    <div class="home__container">
      <LoadingSpinner v-if="showsStore.status === 'loading'" size="lg" />

      <PaginationNav
        v-if="showsStore.status !== 'loading'"
        :current-page="pageFromRoute"
        :can-go-next="showsStore.canGoNext"
        @change="goToPage"
      />
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
}
</style>
