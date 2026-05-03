<script setup lang="ts">
import type { Show } from '@/types'
import RatingBadge from '@/components/common/RatingBadge.vue'
import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon.vue'

defineProps<{
  show: Show | null
  heroImage: string | null
}>()

defineEmits<{ back: [] }>()
</script>

<template>
  <section class="hero" :style="heroImage ? `background-image: url('${heroImage}')` : undefined">
    <button class="hero__back" @click="$emit('back')">
      <ChevronLeftIcon />
      Back
    </button>

    <div v-if="show" class="hero__overlay">
      <div class="hero__content">
        <h1 class="hero__title">{{ show.name }}</h1>
        <div class="hero__genres">
          <span v-for="genre in show.genres" :key="genre" class="hero__genre-chip">{{
            genre
          }}</span>
        </div>
        <div class="hero__badges">
          <RatingBadge :rating="show.rating.average" />
          <span
            class="hero__status-badge"
            :class="{
              'hero__status-badge--running': show.status === 'Running',
              'hero__status-badge--ended': show.status === 'Ended',
            }"
            >{{ show.status }}</span
          >
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins' as *;

.hero {
  position: relative;
  min-height: 400px;
  background-color: var(--color-surface);
  background-size: cover;
  background-position: center top;

  @include respond-to('md') {
    min-height: 520px;
  }

  &__back {
    position: absolute;
    top: calc(var(--header-height) + 1rem);
    left: var(--page-padding);
    z-index: 10;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(6px);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: var(--radius-full);
    color: #fff;
    font-size: var(--font-size-sm);
    font-weight: 600;
    transition:
      background-color var(--transition-fast),
      border-color var(--transition-fast);

    :deep(svg) {
      width: 1.125rem;
      height: 1.125rem;
    }

    &:hover {
      background: rgba(0, 0, 0, 0.75);
      border-color: rgba(255, 255, 255, 0.5);
    }
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.88) 0%,
      rgba(0, 0, 0, 0.4) 55%,
      transparent 100%
    );
    display: flex;
    align-items: flex-end;
    padding: 2rem var(--page-padding);
  }

  &__content {
    max-width: var(--container-max);
    width: 100%;
    margin: 0 auto;
  }

  &__title {
    font-size: var(--font-size-2xl);
    font-weight: 800;
    color: #fff;
    margin-bottom: 0.625rem;

    @include respond-to('md') {
      font-size: 2.75rem;
    }
  }

  &__genres {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  &__genre-chip {
    font-size: var(--font-size-xs);
    font-weight: 600;
    color: #fff;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.35);
    border-radius: var(--radius-full);
    padding: 0.2rem 0.625rem;
  }

  &__badges {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__status-badge {
    font-size: var(--font-size-xs);
    font-weight: 700;
    color: #fff;
    background: var(--color-accent);
    border-radius: var(--radius-full);
    padding: 0.2rem 0.625rem;
    letter-spacing: 0.02em;

    &--running {
      background: var(--color-status-running);
    }

    &--ended {
      background: var(--color-status-ended);
    }
  }
}
</style>
