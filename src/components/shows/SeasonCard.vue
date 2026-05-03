<script setup lang="ts">
import type { Season } from '@/types'

defineProps<{ season: Season }>()
</script>

<template>
  <div class="season-card">
    <p class="season-card__number">Season {{ season.number }}</p>
    <p v-if="season.episodeOrder" class="season-card__episodes">
      {{ season.episodeOrder }} episodes
    </p>
    <p class="season-card__dates">
      {{ season.premiereDate ?? '?' }}{{ season.endDate ? ` → ${season.endDate}` : '' }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.season-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  padding: 1rem;

  &__number {
    font-size: var(--font-size-sm);
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: 0.25rem;
  }

  &__episodes {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    margin-bottom: 0.25rem;
  }

  &__dates {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
  }
}
</style>
