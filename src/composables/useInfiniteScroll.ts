import { onMounted, onUnmounted, type Ref } from 'vue'

export function useInfiniteScroll(sentinel: Ref<HTMLElement | null>, callback: () => void): void {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!sentinel.value) return

    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          callback()
        }
      },
      { rootMargin: '300px' },
    )
    observer.observe(sentinel.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })
}
