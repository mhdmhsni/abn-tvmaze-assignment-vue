<script setup lang="ts">
import type { Show } from '@/types'
import { useRouter } from 'vue-router'
import RatingBadge from '@/components/common/RatingBadge.vue'

const props = defineProps<{ show: Show }>()
const router = useRouter()

function navigate() {
  router.push(`/show/${props.show.id}`)
}
</script>

<template>
  <article
    class="card"
    role="button"
    tabindex="0"
    :aria-label="`${props.show.name}, rated ${props.show.rating.average ?? 'N/A'}`"
    @click="navigate"
    @keydown.enter="navigate"
  >
    <div class="card__poster">
      <img
        v-if="props.show.image"
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
    </div>
    <div class="card__info">
      <p class="card__title">{{ props.show.name }}</p>
      <RatingBadge :rating="props.show.rating.average" />
    </div>
  </article>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins' as *;

.card {
  width: var(--card-width);
  flex-shrink: 0;
  cursor: pointer;
  border-radius: var(--card-radius);
  overflow: hidden;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 8px var(--color-shadow);
  transition:
    transform var(--transition-base),
    box-shadow var(--transition-base);
  outline: none;

  &:hover,
  &:focus-visible {
    transform: scale(1.04);
    box-shadow: 0 8px 24px var(--color-shadow-hover);
  }

  &__poster {
    width: 100%;
    height: var(--card-height);
    overflow: hidden;
    background-color: var(--color-placeholder);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-muted);

    svg {
      width: 40px;
      height: 40px;
    }
  }

  &__info {
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__title {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--color-text);
    @include truncate(2);
    line-height: 1.3;
  }
}
</style>
