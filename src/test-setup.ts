// Global test setup — polyfills not available in JSDOM

class ResizeObserverMock {
  observe() {}
  disconnect() {}
  unobserve() {}
}

global.ResizeObserver = ResizeObserverMock
