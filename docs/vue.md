# Vue Usage

## Register NotifContainer
```vue
<template>
  <NotifContainer :position="'bottom-end'" :visible-notifications="3" />
</template>
<script setup lang="ts">
import { NotifContainer } from '@notifi/vue'
</script>
```

## Create a notification
```ts
import { notif } from '@notifi/vue'
// headless: notifications have no built-in styles
notif('Hello from Notifi!', {
  id: crypto.randomUUID(),
  duration: 3000,
})
```

## Custom component content
```ts
import HelloNotification from './HelloNotification.vue'
import { h } from 'vue'

notif(h(HelloNotification), { id: 'custom', duration: 4000 })
```

## Custom component content (factory with notification params)
```ts
import HelloNotification from './HelloNotification.vue'
import type { ExternalNotification } from '@notifi/vue'
import { h } from 'vue'

notif((params: ExternalNotification) => h(HelloNotification, params), {
  id: 'custom',
  duration: 4000,
})
```

## Integrate with a UI library (example)
```ts
import { notif } from '@notifi/vue'
import { h } from 'vue'
import { Toast, Button } from '@your-ui/vue'

notif(
  h(Toast, { type: 'info', title: 'Saved', description: 'Your changes were saved.' }, {
    actions: [h(Button, { text: 'Undo', size: 'sm', onClick: () => {/* ... */} })],
  }),
  { duration: 2500 },
)
```
