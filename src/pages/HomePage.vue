<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useShowsStore } from '@/stores/shows'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import GenreRow from '@/components/shows/GenreRow.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const showsStore = useShowsStore()
const sentinel = ref<HTMLElement | null>(null)

useInfiniteScroll(sentinel, () => showsStore.fetchNextPage())

onMounted(() => {
  if (showsStore.shows.length === 0) {
    showsStore.fetchNextPage()
  }
})
</script>

<template>
  <main class="home">
    <ErrorMessage v-if="showsStore.error" :message="showsStore.error" />

    <template v-if="showsStore.sortedGenres.length > 0">
      <GenreRow
        v-for="genre in showsStore.sortedGenres"
        :key="genre"
        :genre="genre"
        :shows="showsStore.showsByGenre.get(genre) ?? []"
      />
    </template>

    <LoadingSpinner v-if="showsStore.status === 'loading'" size="lg" />

    <div
      v-if="showsStore.hasMore && showsStore.status !== 'loading'"
      ref="sentinel"
      class="home__sentinel"
      aria-hidden="true"
    />
  </main>
</template>

<style scoped lang="scss">
.home {
  padding-top: calc(var(--header-height) + 32px);
  padding-bottom: 48px;
  min-height: 100vh;

  &__sentinel {
    height: 1px;
  }
}
</style>
