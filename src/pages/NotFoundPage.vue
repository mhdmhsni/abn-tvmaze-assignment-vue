<template>
  <main class="not-found">
    <h1 class="not-found__code">404</h1>
    <p class="not-found__message">Page not found</p>
    <RouterLink to="/" class="not-found__link">Back to home</RouterLink>
  </main>
</template>

<style scoped lang="scss">
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1rem;
  text-align: center;
  padding: var(--page-padding);

  &__code {
    font-size: 6rem;
    font-weight: 700;
    color: var(--color-accent);
    line-height: 1;
  }

  &__message {
    font-size: var(--font-size-xl);
    color: var(--color-text-muted);
  }

  &__link {
    margin-top: 0.5rem;
    font-size: var(--font-size-base);
    color: var(--color-accent);
    text-decoration: underline;
    text-underline-offset: 3px;

    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
