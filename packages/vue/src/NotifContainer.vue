<template>
  <section
    :tabIndex="-1"
    aria-live="polite"
    aria-relevant="additions text"
    aria-atomic="false"
    data-notifi-container
    :data-notifi-absolute="props.absolute ? '' : undefined"
    :aria-label="ariaLabel"
    :class="rootClass"
  >
    <ol
      v-for="(pos, index) in possiblePositions"
      :key="pos"
      data-notifi-notifications
      :class="props.class"
      :tabIndex="-1"
      :data-y-position="pos.split('-')[0]"
      :data-x-position="pos.split('-')[1]"
      :style="{
        '--notifi-front-notification-height': `${heights[0]?.height || 0}px`,
        '--notifi-width': `${props.width}px`,
        '--notifi-gap': `${gap}px`,
        ...style,
        ...((attrs as Record<string, Record<string, any>>).style as any),
        ...assignOffset(offset, mobileOffset),
      }"
      v-bind="$attrs"
      @mouseenter="handleMouseEnter"
      @mousemove="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @dragend="handleDragEnd"
      @pointerdown="onPointerDown"
      @pointerup="handlePointerUp"
    >
      <template
        v-for="(notification, idx) in filteredNotifications(pos, index)"
        :key="notification.id"
      >
        <Notification
          :heights="heights"
          :index="idx"
          :isDocumentHidden
          :notification="notification"
          :duration="notificationOptions?.duration ?? duration"
          :class="notificationOptions?.class ?? ''"
          :visibleNotifications="visibleNotifications"
          :interacting="interacting"
          :position="pos"
          :style="notificationOptions?.style"
          :notifications="notificationsByPosition[pos]"
          :expandByDefault="expand"
          :gap="gap"
          :expanded="expanded[pos] || false"
          :swipeDirections="props.swipeDirections"
          @update:heights="updateHeights"
          @update:height="updateHeight"
          @removeNotification="removeNotification"
        />
      </template>
    </ol>
  </section>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'
import {
  type HeightT,
  type Position,
  type NotificationT,
  type NotificationToDismiss,
  type NotificationContainerProps,
  CONSTANTS,
  NotificationState,
  assignOffset,
} from '@notifi/core'
import Notification from './Notification.vue'
import { useIsDocumentHidden } from './hooks'

defineOptions({
  name: 'NotifContainer',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<NotificationContainerProps>(), {
  position: 'bottom-end',
  expand: false,
  class: '',
  offset: CONSTANTS.VIEWPORT_OFFSET,
  width: CONSTANTS.NOTIFICATION_WIDTH,
  mobileOffset: CONSTANTS.MOBILE_VIEWPORT_OFFSET,
  visibleNotifications: CONSTANTS.VISIBLE_NOTIFICATIONS,
  notificationOptions: () => ({}),
  gap: CONSTANTS.GAP,
  ariaLabel: 'Notifications',
})

const { isDocumentHidden } = useIsDocumentHidden()

const attrs = useAttrs()
const notifications = ref<NotificationT[]>([])

const filteredNotificationsById = computed(() => {
  if (props.id) {
    return notifications.value.filter(
      (notification) => notification.notificationContainerId === props.id,
    )
  }
  return notifications.value.filter((notification) => !notification.notificationContainerId)
})

function filteredNotifications(pos: string, index: number) {
  return filteredNotificationsById.value.filter(
    (notification) => (!notification.position && index === 0) || notification.position === pos,
  )
}
const possiblePositions = computed(() => {
  const posList = filteredNotificationsById.value
    .filter((notification) => notification.position)
    .map((notification) => notification.position) as Position[]
  return posList.length > 0
    ? Array.from(new Set([props.position].concat(posList)))
    : [props.position]
})

const notificationsByPosition = computed(() => {
  const result: Record<string, NotificationT[]> = {}
  possiblePositions.value.forEach((pos) => {
    result[pos] = notifications.value.filter((t) => t.position === pos)
  })
  return result
})

const heights = ref<HeightT[]>([])
const expanded = ref<Record<string, boolean>>({})
const interacting = ref(false)

watch(
  possiblePositions,
  (newPositions) => {
    newPositions.forEach((pos) => {
      if (!(pos in expanded.value)) {
        expanded.value[pos] = false
      }
    })
  },
  { immediate: true, deep: false },
)

function removeNotification(notificationToRemove: NotificationT) {
  if (
    !notifications.value.find((notification) => notification.id === notificationToRemove.id)?.delete
  ) {
    NotificationState.dismiss(notificationToRemove.id)
  }

  // First remove notification
  notifications.value = notifications.value.filter(({ id }) => id !== notificationToRemove.id)

  // Delay cleaning heights to give animation time to complete
  setTimeout(() => {
    // Ensure notification has been actually removed before cleaning heights
    if (!notifications.value.find((t) => t.id === notificationToRemove.id)) {
      heights.value = heights.value.filter((h) => h.notificationId !== notificationToRemove.id)
    }
  }, CONSTANTS.TIME_BEFORE_UNMOUNT + 50) // Slightly delay to ensure animation completion
}

function onPointerDown(event: PointerEvent) {
  if (event.target) {
    const isNotDismissible =
      event.target instanceof HTMLElement && event.target.dataset.dismissible === 'false'

    if (isNotDismissible) return
  }
  interacting.value = true
}

let unsubscribe: () => void

onMounted(() => {
  unsubscribe = NotificationState.subscribe((notification) => {
    if ((notification as NotificationToDismiss).dismiss) {
      requestAnimationFrame(() => {
        notifications.value = notifications.value.map((t) =>
          t.id === notification.id ? { ...t, delete: true } : t,
        )
      })
      return
    }

    nextTick(() => {
      const indexOfExistingNotification = notifications.value.findIndex(
        (t) => t.id === notification.id,
      )

      // Update the notification if it already exists
      if (indexOfExistingNotification !== -1) {
        notifications.value = [
          ...notifications.value.slice(0, indexOfExistingNotification),
          { ...notifications.value[indexOfExistingNotification], ...notification },
          ...notifications.value.slice(indexOfExistingNotification + 1),
        ]
      } else {
        notifications.value = [notification, ...notifications.value]
      }
    })
  })
})

onBeforeUnmount(() => unsubscribe?.())

watch(
  () => notifications.value.length,
  (length) => {
    if (length <= 1) {
      // Reset all positions to false
      Object.keys(expanded.value).forEach((pos) => {
        expanded.value[pos] = false
      })
    }
  },
)

function handleMouseEnter(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement
  const position = `${target.getAttribute('data-y-position')}-${target.getAttribute('data-x-position')}`
  expanded.value[position] = true
}
function handleMouseLeave(event: MouseEvent) {
  if (!interacting.value) {
    const target = event.currentTarget as HTMLElement
    const position = `${target.getAttribute('data-y-position')}-${target.getAttribute('data-x-position')}`
    expanded.value[position] = false
  }
}
function handleDragEnd() {
  // Reset all positions to false when drag ends
  Object.keys(expanded.value).forEach((pos) => {
    expanded.value[pos] = false
  })
}
function handlePointerUp() {
  interacting.value = false
}
function updateHeights(h: HeightT[]) {
  heights.value = h
}
function updateHeight(h: HeightT) {
  const index = heights.value.findIndex((item) => item.notificationId === h.notificationId)
  if (index !== -1) {
    heights.value[index] = h
  } else {
    // Insert by position grouping, keeping notifications of the same position contiguous
    const samePositionIndex = heights.value.findIndex((item) => item.position === h.position)
    if (samePositionIndex !== -1) {
      // Insert at the first position of the same position
      heights.value.splice(samePositionIndex, 0, h)
    } else {
      // If no same position exists, add to the beginning
      heights.value.unshift(h)
    }
  }
}
</script>
