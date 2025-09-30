<p align="center">
  <img src="public/logo.svg" alt="Notifi logo" width="120" />
</p>

# @notifi/vue

Vue 3 adapter for Notifi (headless notifications manager).

- Headless: no styles provided
- Components: `NotifContainer`
- API: `notif`

## Install

```bash
npm install @notifi/vue
```

## Basic usage

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

## Register globally (optional)

```ts
import { createApp } from 'vue'
import NotifiVue from '@notifi/vue'
import App from './App.vue'

createApp(App).use(NotifiVue).mount('#app')
```

This adds `$notif` and registers `NotifContainer` globally.

## Custom component content

```ts
import { notif } from '@notifi/vue'
import { h } from 'vue'
import Toast from './Toast.vue'

notif(h(Toast, { title: 'Saved', description: 'All good.' }), { duration: 3000 })
```

Or pass a factory to receive live props (e.g., to read `duration`, `paused`, etc.):

```ts
import { notif, type ExternalNotification } from '@notifi/vue'
import { h } from 'vue'
import Toast from './Toast.vue'

notif((params: ExternalNotification) => h(Toast, params), { id: 'custom' })
```

## Target a specific container

```vue
<NotifContainer id="sidebar" />
```

```ts
notif('Side message', { notificationContainerId: 'sidebar' })
```

## Dismiss

```ts
const id = notif('Closable', { duration: Infinity })
notif.dismiss(id) // single
notif.dismiss()   // all
```

## Types

Re-exports from `@notifi/core`:
- `ExternalNotification`, `NotificationT`, `NotificationContainerProps`, `NotificationComponentProps`

## License

MIT
