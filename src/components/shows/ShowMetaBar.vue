<script setup lang="ts">
import { computed } from 'vue'
import type { Show } from '@/types'

const props = defineProps<{ show: Show }>()

const scheduleLabel = computed(() => {
  const s = props.show.schedule
  if (!s) return null
  const days = s.days.join(', ')
  return days && s.time ? `${days} at ${s.time}` : days || s.time || null
})

const networkLabel = computed(
  () => props.show.network?.name ?? props.show.webChannel?.name ?? null,
)
</script>

<template>
  <section class="meta-bar">
    <span v-if="networkLabel" class="meta-bar__item">{{ networkLabel }}</span>
    <span v-if="show.language" class="meta-bar__item">{{ show.language }}</span>
    <span v-if="show.runtime" class="meta-bar__item">{{ show.runtime }} min</span>
    <span v-if="show.type" class="meta-bar__item">{{ show.type }}</span>
    <span v-if="scheduleLabel" class="meta-bar__item">{{ scheduleLabel }}</span>
    <span v-if="show.premiered" class="meta-bar__item">
      {{ show.premiered }}{{ show.ended ? ` – ${show.ended}` : ' – present' }}
    </span>
    <a
      v-if="show.officialSite"
      :href="show.officialSite"
      target="_blank"
      rel="noopener noreferrer"
      class="meta-bar__link"
      >Official site</a
    >
    <a
      v-if="show.externals?.imdb"
      :href="`https://www.imdb.com/title/${show.externals.imdb}/`"
      target="_blank"
      rel="noopener noreferrer"
      class="meta-bar__link"
      >IMDb</a
    >
  </section>
</template>

<style scoped lang="scss">
.meta-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  padding: 1.25rem var(--page-padding);
  border-bottom: 1px solid var(--color-border);
  max-width: var(--container-max);
  margin: 0 auto;

  &__item {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);

    & + &::before {
      content: '·';
      margin-right: 1.25rem;
    }
  }

  &__link {
    font-size: var(--font-size-sm);
    color: var(--color-accent);
    text-decoration: underline;
    text-underline-offset: 2px;
  }
}
</style>
