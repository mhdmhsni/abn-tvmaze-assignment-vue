<script setup lang="ts">
import type { Show } from '@/types'
import ShowCard from '@/components/shows/ShowCard.vue'
import HorizontalScroller from '@/components/common/HorizontalScroller.vue'

defineProps<{
  genre: string
  shows: Show[]
}>()

const emit = defineEmits<{ select: [id: number] }>()
</script>

<template>
  <section class="genre-row">
    <h2 class="genre-row__title">{{ genre }}</h2>
    <HorizontalScroller class="genre-row__scroll-wrap">
      <ShowCard
        v-for="show in shows.slice(0, 20)"
        :key="show.id"
        :show="show"
        @select="(id) => emit('select', id)"
      />
    </HorizontalScroller>
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
    max-width: var(--container-max);
    margin-left: auto;
    margin-right: auto;

    @include respond-to('md') {
      font-size: var(--font-size-2xl);
    }
  }

  &__scroll-wrap {
    max-width: var(--container-max);
    margin: 0 auto;
  }
}
</style>
