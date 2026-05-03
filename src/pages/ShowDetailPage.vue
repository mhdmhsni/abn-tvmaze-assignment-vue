<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getShowById, getShowCast, getShowSeasons, getShowImages } from '@/api/tvmaze'
import type { Show, CastMember, Season, ShowImage } from '@/types'
import RatingBadge from '@/components/common/RatingBadge.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import { useScrollTrack } from '@/composables/useScrollTrack'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const show = ref<Show | null>(null)
const cast = ref<CastMember[]>([])
const seasons = ref<Season[]>([])
const images = ref<ShowImage[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const { trackRef: castTrackRef, canScrollLeft: castCanLeft, canScrollRight: castCanRight, scrollBy: castScrollBy } = useScrollTrack()

const heroImage = computed(() => {
  const bg = images.value.find((img) => img.type === 'background')
  if (bg?.resolutions?.original?.url) return bg.resolutions.original.url
  return show.value?.image?.original ?? null
})

const scheduleLabel = computed(() => {
  const s = show.value?.schedule
  if (!s) return null
  const days = s.days.join(', ')
  return days && s.time ? `${days} at ${s.time}` : days || s.time || null
})

onMounted(async () => {
  try {
    const [fetchedShow, fetchedCast, fetchedSeasons, fetchedImages] = await Promise.all([
      getShowById(id),
      getShowCast(id),
      getShowSeasons(id),
      getShowImages(id),
    ])
    show.value = fetchedShow
    cast.value = fetchedCast
    seasons.value = fetchedSeasons
    images.value = fetchedImages
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load show details'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="detail">
    <!-- Hero always rendered so back button is always visible on top of it -->
    <section
      class="detail__hero"
      :style="heroImage ? `background-image: url('${heroImage}')` : undefined"
    >
      <button class="detail__back" @click="router.push('/')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </button>

      <div v-if="show" class="detail__hero-overlay">
        <div class="detail__hero-content">
          <h1 class="detail__title">{{ show.name }}</h1>
          <div class="detail__genres">
            <span v-for="genre in show.genres" :key="genre" class="detail__genre-chip">{{ genre }}</span>
          </div>
          <div class="detail__badges">
            <RatingBadge :rating="show.rating.average" />
            <span
              class="detail__status-badge"
              :class="{
                'detail__status-badge--running': show.status === 'Running',
                'detail__status-badge--ended': show.status === 'Ended',
              }"
            >{{ show.status }}</span>
          </div>
        </div>
      </div>
    </section>

    <LoadingSpinner v-if="loading" size="lg" />
    <ErrorMessage v-else-if="error" :message="error" />

    <template v-else-if="show">
      <!-- Meta -->
      <section class="detail__meta">
        <span v-if="show.language" class="detail__meta-item">{{ show.language }}</span>
        <span v-if="show.runtime" class="detail__meta-item">{{ show.runtime }} min</span>
        <span v-if="show.type" class="detail__meta-item">{{ show.type }}</span>
        <span v-if="scheduleLabel" class="detail__meta-item">{{ scheduleLabel }}</span>
        <span v-if="show.premiered" class="detail__meta-item">
          {{ show.premiered }}{{ show.ended ? ` – ${show.ended}` : ' – present' }}
        </span>
        <a
          v-if="show.officialSite"
          :href="show.officialSite"
          target="_blank"
          rel="noopener noreferrer"
          class="detail__meta-link"
        >Official site</a>
      </section>

      <!-- Cast -->
      <section v-if="cast.length > 0" class="detail__section">
        <h2 class="detail__section-title">Cast</h2>
        <div class="detail__scroll-wrap">
          <button
            v-show="castCanLeft"
            class="detail__scroll-btn detail__scroll-btn--left"
            aria-label="Scroll left"
            @click="castScrollBy(-500)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div ref="castTrackRef" class="detail__cast-track">
            <div v-for="member in cast" :key="member.person.id" class="detail__cast-card">
              <div class="detail__cast-photo">
                <img
                  v-if="member.person.image"
                  :src="member.person.image.medium"
                  :alt="member.person.name"
                  loading="lazy"
                />
                <div v-else class="detail__cast-placeholder" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </div>
              </div>
              <p class="detail__cast-name">{{ member.person.name }}</p>
              <p class="detail__cast-character">{{ member.character.name }}</p>
            </div>
          </div>
          <button
            v-show="castCanRight"
            class="detail__scroll-btn detail__scroll-btn--right"
            aria-label="Scroll right"
            @click="castScrollBy(500)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </section>

      <!-- Seasons -->
      <section v-if="seasons.length > 0" class="detail__section">
        <h2 class="detail__section-title">Seasons</h2>
        <div class="detail__seasons-grid">
          <div v-for="season in seasons" :key="season.id" class="detail__season-card">
            <p class="detail__season-number">Season {{ season.number }}</p>
            <p v-if="season.episodeOrder" class="detail__season-episodes">{{ season.episodeOrder }} episodes</p>
            <p class="detail__season-dates">
              {{ season.premiereDate ?? '?' }}{{ season.endDate ? ` → ${season.endDate}` : '' }}
            </p>
          </div>
        </div>
      </section>
    </template>
  </main>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins' as *;

.detail {
  padding-top: 0;
  min-height: 100vh;

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

    svg {
      width: 1.125rem;
      height: 1.125rem;
    }

    &:hover {
      background: rgba(0, 0, 0, 0.75);
      border-color: rgba(255, 255, 255, 0.5);
    }
  }

  &__hero {
    position: relative;
    min-height: 400px;
    background-color: var(--color-surface);
    background-size: cover;
    background-position: center top;

    @include respond-to('md') {
      min-height: 520px;
    }
  }

  &__hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.4) 55%, transparent 100%);
    display: flex;
    align-items: flex-end;
    padding: 2rem var(--page-padding);
  }

  &__hero-content {
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

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.25rem;
    padding: 1.25rem var(--page-padding);
    border-bottom: 1px solid var(--color-border);
    max-width: var(--container-max);
    margin: 0 auto;
  }

  &__meta-item {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);

    & + &::before {
      content: '·';
      margin-right: 1.25rem;
    }
  }

  &__meta-link {
    font-size: var(--font-size-sm);
    color: var(--color-accent);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  &__section {
    padding: 2rem 0;
    border-bottom: 1px solid var(--color-border);
    max-width: var(--container-max);
    margin: 0 auto;
  }

  &__section-title {
    font-size: var(--font-size-xl);
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: 1rem;
    padding: 0 var(--page-padding);

    @include respond-to('md') {
      font-size: var(--font-size-2xl);
    }
  }

  &__scroll-wrap {
    position: relative;
  }

  &__cast-track {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding: 0.5rem var(--page-padding) 1rem;
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

    svg {
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

  &__cast-card {
    flex-shrink: 0;
    width: 6rem;
    text-align: center;
  }

  &__cast-photo {
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

  &__cast-placeholder {
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

  &__cast-name {
    font-size: var(--font-size-xs);
    font-weight: 600;
    color: var(--color-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__cast-character {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__seasons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    gap: 1rem;
    padding: 0 var(--page-padding);
    max-width: var(--container-max);
    margin: 0 auto;
  }

  &__season-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-base);
    padding: 1rem;
  }

  &__season-number {
    font-size: var(--font-size-sm);
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: 0.25rem;
  }

  &__season-episodes {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    margin-bottom: 0.25rem;
  }

  &__season-dates {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
  }
}
</style>

