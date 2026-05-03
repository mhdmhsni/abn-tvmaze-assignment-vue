<script setup lang="ts">
import type { CastMember } from '@/types'

defineProps<{ member: CastMember }>()
</script>

<template>
  <div class="cast-card">
    <div class="cast-card__photo">
      <img
        v-if="member.person.image"
        :src="member.person.image.medium"
        :alt="member.person.name"
        loading="lazy"
      />
      <div v-else class="cast-card__placeholder" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      </div>
    </div>
    <p class="cast-card__name">{{ member.person.name }}</p>
    <p class="cast-card__character">{{ member.character.name }}</p>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins' as *;

.cast-card {
  flex-shrink: 0;
  width: 6rem;
  text-align: center;

  &__photo {
    width: 6rem;
    height: 6rem;
    border-radius: var(--radius-full);
    overflow: hidden;
    margin: 0 auto 0.5rem;
    background: var(--color-border);

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
      width: 2.5rem;
      height: 2.5rem;
    }
  }

  &__name {
    font-size: var(--font-size-xs);
    font-weight: 600;
    color: var(--color-text);
    @include truncate(1);
  }

  &__character {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    @include truncate(1);
  }
}
</style>
