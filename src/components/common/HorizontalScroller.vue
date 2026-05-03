<script setup lang="ts">
import { useScrollTrack } from '@/composables/useScrollTrack'
import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon.vue'
import ChevronRightIcon from '@/components/icons/ChevronRightIcon.vue'

withDefaults(
  defineProps<{
    scrollAmount?: number
    compact?: boolean
  }>(),
  { scrollAmount: 500, compact: false },
)

const { trackRef, canScrollLeft, canScrollRight, scrollBy } = useScrollTrack()
</script>

<template>
  <div class="h-scroller">
    <button
      v-show="canScrollLeft"
      class="h-scroller__btn h-scroller__btn--left"
      aria-label="Scroll left"
      @click="scrollBy(-scrollAmount)"
    >
      <ChevronLeftIcon />
    </button>
    <div
      ref="trackRef"
      class="h-scroller__track"
      :class="{ 'h-scroller__track--compact': compact }"
    >
      <slot />
    </div>
    <button
      v-show="canScrollRight"
      class="h-scroller__btn h-scroller__btn--right"
      aria-label="Scroll right"
      @click="scrollBy(scrollAmount)"
    >
      <ChevronRightIcon />
    </button>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins' as *;

.h-scroller {
  position: relative;

  &__track {
    display: flex;
    gap: var(--card-gap);
    overflow-x: auto;
    padding: 16px var(--page-padding) 32px;
    scroll-snap-type: x mandatory;
    @include hide-scrollbar;

    :deep(> *) {
      scroll-snap-align: start;
    }

    &--compact {
      padding: 0.5rem var(--page-padding) 1rem;
    }
  }

  &__btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    width: 4rem;
    height: 4rem;
    border-radius: var(--radius-full);
    background: var(--color-surface-elevated);
    border: 1px solid var(--color-border);
    box-shadow: 0 2px 12px var(--color-shadow);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text);
    transition: background-color var(--transition-fast);

    :deep(svg) {
      width: 1.75rem;
      height: 1.75rem;
    }

    &:hover {
      background-color: var(--color-border);
    }

    &--left {
      left: 0.25rem;
    }

    &--right {
      right: 0.25rem;
    }
  }
}
</style>
