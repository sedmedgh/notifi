import NotifContainer from './NotifContainer.vue'
import notif from './notif'
import { type App, type Plugin } from 'vue'

const notifiVue: Plugin = {
  install(app: App) {
    app.config.globalProperties.$notif = notif
    app.component('NotifContainer', NotifContainer)
    app.provide('notif', notif)
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- Assign variable to window
      // @ts-ignore -- Assign variable to window
      window.vueNotif = notif
    }
  },
}

export default notifiVue
