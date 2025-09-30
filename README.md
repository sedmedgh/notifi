<p align="center">
  <img src="docs/public/logo.svg" alt="Notifi logo" width="120" />
</p>

# Notifi

Headless notifications manager. Bring your own UI.

- **Headless & style-free**: No styles, no opinions. Use any UI/component library.
- **Core + adapters**: Framework-agnostic core with framework adapters.
- **Today**: Vue 3 adapter. React/Svelte planned.

## Packages

- `packages/core`: Framework-agnostic core state and types
- `packages/vue`: Vue 3 adapter (`NotifContainer` component + `notif` API)

## Quick start (Vue 3)

```bash
npm install @notifi/vue
```

```vue
<template>
  <NotifContainer />
  <button @click="notify">Notify</button>
</template>
<script setup lang="ts">
import { NotifContainer, notif } from '@notifi/vue'

function notify() {
  notif('Hello Notifi!', { duration: 2500 })
}
</script>
```

## Concept

- Create notifications with `notif(content, options)`.
- Render and manage them via the framework adapter container (e.g. `NotifContainer` in Vue).
- Content can be plain text or any component from your design system.

## License

MIT
