import { ref, watch, onUnmounted } from 'vue'

export function useScrollTrack() {
  const trackRef = ref<HTMLElement | null>(null)
  const canScrollLeft = ref(false)
  const canScrollRight = ref(false)

  function update() {
    const el = trackRef.value
    if (!el) return
    canScrollLeft.value = el.scrollLeft > 100
    canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
  }

  function scrollBy(delta: number) {
    trackRef.value?.scrollBy({ left: delta, behavior: 'smooth' })
  }

  let currentEl: HTMLElement | null = null
  let observer: ResizeObserver | null = null

  function teardown() {
    if (currentEl) {
      currentEl.removeEventListener('scroll', update)
      currentEl = null
    }
    observer?.disconnect()
    observer = null
  }

  // Watch for the element to appear — handles async-rendered sections
  watch(trackRef, (el) => {
    teardown()
    if (!el) return
    currentEl = el
    el.addEventListener('scroll', update, { passive: true })
    observer = new ResizeObserver(update)
    observer.observe(el)
    requestAnimationFrame(update)
  })

  onUnmounted(teardown)

  return { trackRef, canScrollLeft, canScrollRight, scrollBy }
}
