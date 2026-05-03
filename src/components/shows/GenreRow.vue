<script setup lang="ts">
import type { Show } from '@/types'
import ShowCard from '@/components/shows/ShowCard.vue'
import { useScrollTrack } from '@/composables/useScrollTrack'

defineProps<{
  genre: string
  shows: Show[]
}>()

const { trackRef, canScrollLeft, canScrollRight, scrollBy } = useScrollTrack()
</script>

<template>
  <section class="genre-row">
    <h2 class="genre-row__title">{{ genre }}</h2>
    <div class="genre-row__scroll-wrap">
      <button
        v-show="canScrollLeft"
        class="genre-row__scroll-btn genre-row__scroll-btn--left"
        aria-label="Scroll left"
        @click="scrollBy(-500)"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <div ref="trackRef" class="genre-row__track">
        <ShowCard v-for="show in shows.slice(0, 20)" :key="show.id" :show="show" />
      </div>
      <button
        v-show="canScrollRight"
        class="genre-row__scroll-btn genre-row__scroll-btn--right"
        aria-label="Scroll right"
        @click="scrollBy(500)"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
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
    max-width: var(--container-max);
    margin-left: auto;
    margin-right: auto;

    @include respond-to('md') {
      font-size: var(--font-size-2xl);
    }
  }

  &__scroll-wrap {
    position: relative;
    max-width: var(--container-max);
    margin: 0 auto;
  }

  &__track {
    display: flex;
    gap: var(--card-gap);
    overflow-x: auto;
    padding: 16px var(--page-padding) 32px;
    scroll-snap-type: x mandatory;
    @include hide-scrollbar;

    > * {
      scroll-snap-align: start;
    }
  }

  &__scroll-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    width: 56px;
    height: 56px;
    border-radius: var(--radius-full);
    background: var(--color-surface-elevated);
    border: 1px solid var(--color-border);
    box-shadow: 0 2px 12px var(--color-shadow);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text);
    transition: background-color var(--transition-fast);

    svg {
      width: 28px;
      height: 28px;
    }

    &:hover {
      background-color: var(--color-border);
    }

    &--left {
      left: 4px;
    }

    &--right {
      right: 4px;
    }
  }
}
</style>
