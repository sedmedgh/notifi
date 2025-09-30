import { notif } from '@notifi/vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- Vue SFC import (handled by Vite plugin)
// @ts-ignore -- Vue SFC import (handled by Vite plugin)
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      notif,
    },
  }
})
