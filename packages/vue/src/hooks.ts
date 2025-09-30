import { nextTick, ref, type Ref, onMounted, onBeforeUnmount } from 'vue'
import { type NotificationT, NotificationState } from '@notifi/core'

export function useIsDocumentHidden() {
  const isDocumentHidden = ref(false)

  const callback = () => {
    isDocumentHidden.value = document.hidden
  }
  onMounted(() => {
    document.addEventListener('visibilitychange', callback)
    // مقدار اولیه
    callback()
  })

  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', callback)
  })

  return {
    isDocumentHidden,
  }
}

export function useNotifiVue(): {
  activeNotifications: Ref<NotificationT[]>
} {
  const activeNotifications = ref<NotificationT[]>([])
  let unsubscribe: () => void
  onMounted(() => {
    unsubscribe = NotificationState.subscribe((notification) => {
      if ('dismiss' in notification && notification.dismiss) {
        activeNotifications.value = activeNotifications.value.filter(
          (t) => t.id !== notification.id,
        )
        return
      }

      nextTick(() => {
        const existingNotificationIndex = activeNotifications.value.findIndex(
          (t) => t.id === notification.id,
        )
        if (existingNotificationIndex !== -1) {
          const updatedNotifications = [...activeNotifications.value]
          updatedNotifications[existingNotificationIndex] = {
            ...updatedNotifications[existingNotificationIndex],
            ...notification,
          }

          activeNotifications.value = updatedNotifications
        } else {
          activeNotifications.value = [notification, ...activeNotifications.value]
        }
      })
    })
  })
  onBeforeUnmount(() => unsubscribe?.())

  return {
    activeNotifications,
  }
}
