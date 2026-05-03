<script setup lang="ts">
import type { Show } from '@/types'
import ShowCard from '@/components/shows/ShowCard.vue'

defineProps<{
  genre: string
  shows: Show[]
}>()
</script>

<template>
  <section class="genre-row">
    <h2 class="genre-row__title">{{ genre }}</h2>
    <div class="genre-row__track">
      <ShowCard v-for="show in shows.slice(0, 20)" :key="show.id" :show="show" />
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins' as *;

.genre-row {
  margin-bottom: 40px;

  &__title {
    font-size: var(--font-size-xl);
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: 16px;
    padding: 0 var(--page-padding);

    @include respond-to('md') {
      font-size: var(--font-size-2xl);
    }
  }

  &__track {
    display: flex;
    gap: var(--card-gap);
    overflow-x: auto;
    padding: 8px var(--page-padding) 16px;
    scroll-snap-type: x mandatory;
    @include hide-scrollbar;

    > * {
      scroll-snap-align: start;
    }
  }
}
</style>
