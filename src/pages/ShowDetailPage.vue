<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getShowById, getShowCast, getShowSeasons, getShowImages } from '@/api/tvmaze'
import type { Show, CastMember, Season, ShowImage } from '@/types'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import HorizontalScroller from '@/components/common/HorizontalScroller.vue'
import ShowHero from '@/components/shows/ShowHero.vue'
import ShowMetaBar from '@/components/shows/ShowMetaBar.vue'
import CastCard from '@/components/shows/CastCard.vue'
import SeasonCard from '@/components/shows/SeasonCard.vue'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const show = ref<Show | null>(null)
const cast = ref<CastMember[]>([])
const seasons = ref<Season[]>([])
const images = ref<ShowImage[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const heroImage = computed(() => {
  const bg = images.value.find((img) => img.type === 'background')
  if (bg?.resolutions?.original?.url) return bg.resolutions.original.url
  return show.value?.image?.original ?? null
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
    <ShowHero :show="show" :hero-image="heroImage" @back="router.push('/')" />

    <LoadingSpinner v-if="loading" size="lg" />
    <ErrorMessage v-else-if="error" :message="error" />

    <template v-else-if="show">
      <ShowMetaBar :show="show" />

      <!-- Cast -->
      <section v-if="cast.length > 0" class="detail__section">
        <h2 class="detail__section-title">Cast</h2>
        <HorizontalScroller :compact="true">
          <CastCard v-for="member in cast" :key="member.person.id" :member="member" />
        </HorizontalScroller>
      </section>

      <!-- Seasons -->
      <section v-if="seasons.length > 0" class="detail__section">
        <h2 class="detail__section-title">Seasons</h2>
        <div class="detail__seasons-grid">
          <SeasonCard v-for="season in seasons" :key="season.id" :season="season" />
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

  &__seasons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    gap: 1rem;
    padding: 0 var(--page-padding);
    max-width: var(--container-max);
    margin: 0 auto;
  }
}
</style>
