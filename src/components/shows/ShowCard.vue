<script setup lang="ts">
import type { Show } from '@/types'
import RatingBadge from '@/components/common/RatingBadge.vue'

const props = defineProps<{ show: Show }>()
const emit = defineEmits<{ select: [id: number] }>()
</script>

<template>
  <article
    class="card"
    role="button"
    tabindex="0"
    :aria-label="`${props.show.name}, rated ${props.show.rating.average ?? 'N/A'}`"
    @click="emit('select', props.show.id)"
    @keydown.enter="emit('select', props.show.id)"
  >
    <img
      v-if="props.show.image"
      class="card__image"
      :src="props.show.image.medium"
      :alt="props.show.name"
      loading="lazy"
    />
    <div v-else class="card__placeholder" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
        <rect x="2" y="2" width="20" height="20" rx="2" />
        <path d="M8 12l4-4 4 4M12 8v8" />
      </svg>
    </div>

    <div class="card__rating">
      <RatingBadge :rating="props.show.rating.average" />
    </div>

    <div class="card__footer">
      <p class="card__title">{{ props.show.name }}</p>
    </div>
  </article>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins' as *;

.card {
  position: relative;
  width: var(--card-width);
  height: var(--card-height);
  flex-shrink: 0;
  cursor: pointer;
  border-radius: var(--card-radius);
  overflow: hidden;
  background-color: var(--color-placeholder);
  box-shadow: 0 2px 8px var(--color-shadow);
  transition:
    transform var(--transition-base),
    box-shadow var(--transition-base);
  outline: none;

  &:hover,
  &:focus-visible {
    transform: scale(1.04);
    box-shadow: 0 8px 20px var(--color-shadow-hover);
  }

  &__image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-muted);

    svg {
      width: 3rem;
      height: 3rem;
    }
  }

  &__rating {
    position: absolute;
    top: 0.625rem;
    left: 0.625rem;
    background: rgba(0, 0, 0, 0.65);
    border-radius: var(--radius-full);
    padding: 0.2rem 0.5rem;
    backdrop-filter: blur(4px);
  }

  &__footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 3rem 0.75rem 0.875rem;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.82) 0%, transparent 100%);
  }

  &__title {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: #fff;
    line-height: 1.3;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
    @include truncate(2);
  }
}
</style>
