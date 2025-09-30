# Vue Example

Below is a live example. Click the button to show a notification.

<script setup lang="ts">
import NotificationExample from './components/NotificationExample.vue'
</script>

<NotificationExample />

```vue
<!-- Minimal setup -->
<template>
  <NotifContainer />
  <button @click="notify">Show notification</button>
</template>
<script setup lang="ts">
import { NotifContainer, notif } from '@notifi/vue'

function notify() {
  notif('Hello from Notifi!', { duration: 2500 })
}
</script>
