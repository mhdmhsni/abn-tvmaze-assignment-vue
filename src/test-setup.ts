// Global test setup — polyfills not available in JSDOM

class ResizeObserverMock {
  observe() {}
  disconnect() {}
  unobserve() {}
}

globalThis.ResizeObserver = ResizeObserverMock
