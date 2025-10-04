<template>
  <li
    ref="notificationRef"
    :class="[props.class, notificationCls]"
    data-notifi-notification=""
    :data-mounted="mounted"
    :data-swiped="swiped"
    :data-removed="removed"
    :data-visible="isVisible"
    :data-y-position="y"
    :data-paused="paused ? '' : undefined"
    :data-x-position="x"
    :data-index="index"
    :data-front="isFront"
    :data-swiping="swiping"
    :data-dismissible="dismissible"
    :data-swipe-out="swipeOut"
    :data-swipe-direction="swipeOutDirection"
    :data-expanded="Boolean(expanded || (expandByDefault && mounted))"
    :data-testid="notification.testId"
    :style="{
      '--notifi-index': index,
      '--notifi-notifications-before': index,
      '--notifi-z-index': notifications.length - index,
      '--notifi-offset': `${removed ? offsetBeforeRemove : offset}px`,
      '--notifi-initial-height': expandByDefault ? 'auto' : `${initialHeight}px`,
      ...(style ?? {}),
      ...(props.notification.style ?? {}),
    }"
    @dragend="handleDragEnd"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @pointermove="onPointerMove"
  >
    <Render />
  </li>
</template>

<script lang="ts" setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  nextTick,
  isVNode,
  h,
  type Component,
} from 'vue'
import {
  type HeightT,
  type NotificationProps,
  type NotificationT,
  CONSTANTS,
  type NotificationComponentProps,
} from '@notifi/core'

const props = defineProps<NotificationProps>()

const emit = defineEmits<{
  (e: 'update:heights', heights: HeightT[]): void
  (e: 'update:height', height: HeightT): void
  (e: 'removeNotification', notification: NotificationT): void
}>()

// State
const swipeDirection = ref<'x' | 'y' | null>(null)
const swipeOutDirection = ref<'left' | 'right' | 'up' | 'down' | null>(null)
const mounted = ref(false)
const removed = ref(false)
const swiping = ref(false)
const swipeOut = ref(false)
const swiped = ref(false)
const offsetBeforeRemove = ref(0)
const initialHeight = ref(0)
const remainingTime = ref(
  props.notification.duration || props.duration || CONSTANTS.NOTIFICATION_DURATION,
)
const dragStartTime = ref<Date | null>(null)
const notificationRef = ref<HTMLLIElement | null>(null)
const isFront = computed(() => props.index === 0)
const isVisible = computed(() => props.index + 1 <= props.visibleNotifications)
const dismissible = computed(() => props.notification.dismissible !== false)
const notificationCls = computed(() => props.notification.class || '')

const heightIndex = computed(() => {
  // Only calculate the index of notifications in the same position
  const currentPosition = props.notification.position || props.position
  const samePositionHeights = props.heights.filter((h) => h.position === currentPosition)
  const index = samePositionHeights.findIndex(
    (height) => height.notificationId === props.notification.id,
  )
  return index >= 0 ? index : 0
})

const notificationsHeightBefore = computed(() => {
  // Only calculate the height of notifications in the same position and before the current notification
  const currentPosition = props.notification.position || props.position
  const samePositionHeights = props.heights.filter((h) => h.position === currentPosition)

  return samePositionHeights.reduce((prev, curr, reducerIndex) => {
    // Calculate offset up until current notification
    if (reducerIndex >= heightIndex.value) {
      return prev
    }

    return prev + curr.height
  }, 0)
})

const offset = computed(() => heightIndex.value * props.gap! + notificationsHeightBefore.value || 0)

const duration = computed(
  () => props.notification.duration || props.duration || CONSTANTS.NOTIFICATION_DURATION,
)

const closeTimerStartTimeRef = ref(0)
const lastCloseTimerStartTimeRef = ref(0)
const pointerStartRef = ref<{ x: number; y: number } | null>(null)
const coords = computed(() => props.position.split('-'))
const y = computed(() => coords.value[0])
const x = computed(() => coords.value[1])

onMounted(() => {
  mounted.value = true
  remainingTime.value = duration.value
})

const onUpdateHeight = async () => {
  if (!mounted.value || !notificationRef.value) return

  // Wait for DOM update to complete
  await nextTick()
  const notificationNode = notificationRef.value
  const originalHeight = notificationNode.style.height
  notificationNode.style.height = 'auto'
  const newHeight = notificationNode.getBoundingClientRect().height
  notificationNode.style.height = originalHeight as string

  initialHeight.value = newHeight

  // Simplified: only report current notification's height information
  emit('update:height', {
    notificationId: props.notification.id,
    height: newHeight,
    position: props.notification.position || props.position,
  })
}

watch([mounted, notificationRef], onUpdateHeight, { deep: true, immediate: true })

function deleteNotification() {
  // Save the offset for the exit swipe animation
  removed.value = true
  offsetBeforeRemove.value = offset.value

  // No longer directly manipulate heights array, let NotifContainer component handle it uniformly after receiving removeNotification event
  setTimeout(() => {
    emit('removeNotification', props.notification)
  }, CONSTANTS.TIME_BEFORE_UNMOUNT)
}

function onCloseNotification() {
  deleteNotification()
  props.notification.onDismiss?.(props.notification)
}

function onPointerDown(event: PointerEvent) {
  if (event.button === 2) return // Return early on right click
  if (!dismissible.value) return
  dragStartTime.value = new Date()
  offsetBeforeRemove.value = offset.value
  // Ensure we maintain correct pointer capture even when going outside of the notification (e.g. when swiping)
  ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
  if ((event.target as HTMLElement).tagName === 'BUTTON') return
  swiping.value = true
  pointerStartRef.value = { x: event.clientX, y: event.clientY }
}

function onPointerUp() {
  if (swipeOut.value || !dismissible.value) return
  pointerStartRef.value = null

  const swipeAmountX = Number(
    notificationRef.value?.style.getPropertyValue('--notifi-swipe-amount-x').replace('px', '') || 0,
  )
  const swipeAmountY = Number(
    notificationRef.value?.style.getPropertyValue('--notifi-swipe-amount-y').replace('px', '') || 0,
  )
  const timeTaken = Date.now() - (dragStartTime.value?.getTime() || 0)

  const swipeAmount = swipeDirection.value === 'x' ? swipeAmountX : swipeAmountY
  const velocity = Math.abs(swipeAmount) / timeTaken

  if (Math.abs(swipeAmount) >= CONSTANTS.SWIPE_THRESHOLD || velocity > 0.11) {
    offsetBeforeRemove.value = offset.value

    props.notification.onDismiss?.(props.notification)

    if (swipeDirection.value === 'x') {
      swipeOutDirection.value = swipeAmountX > 0 ? 'right' : 'left'
    } else {
      swipeOutDirection.value = swipeAmountY > 0 ? 'down' : 'up'
    }

    deleteNotification()
    swipeOut.value = true

    return
  }
  notificationRef.value?.style.setProperty('--notifi-swipe-amount-x', `0px`)
  notificationRef.value?.style.setProperty('--notifi-swipe-amount-y', `0px`)

  swiped.value = false
  swiping.value = false
  swipeDirection.value = null
}

function onPointerMove(event: PointerEvent) {
  if (!pointerStartRef.value || !dismissible.value) return

  const isHighlighted = window?.getSelection()?.toString()?.length ?? false

  if (isHighlighted) return

  const yDelta = event.clientY - pointerStartRef.value.y
  const xDelta = event.clientX - pointerStartRef.value.x

  const swipeDirections = props.swipeDirections ?? ['left', 'right']

  if (!swipeDirection.value && (Math.abs(xDelta) > 1 || Math.abs(yDelta) > 1)) {
    swipeDirection.value = Math.abs(xDelta) > Math.abs(yDelta) ? 'x' : 'y'
  }

  const swipeAmount = { x: 0, y: 0 }

  const getDampening = (delta: number) => {
    const factor = Math.abs(delta) / 20

    return 1 / (1.5 + factor)
  }

  // Only apply swipe in the locked direction
  if (swipeDirection.value === 'y') {
    // Handle vertical swipes
    if (swipeDirections.includes('top') || swipeDirections.includes('bottom')) {
      if (
        (swipeDirections.includes('top') && yDelta < 0) ||
        (swipeDirections.includes('bottom') && yDelta > 0)
      ) {
        swipeAmount.y = yDelta
      } else {
        // Smoothly transition to dampened movement
        const dampenedDelta = yDelta * getDampening(yDelta)
        // Ensure we don't jump when transitioning to dampened movement
        swipeAmount.y = Math.abs(dampenedDelta) < Math.abs(yDelta) ? dampenedDelta : yDelta
      }
    }
  } else if (swipeDirection.value === 'x') {
    // Handle horizontal swipes
    if (swipeDirections.includes('left') || swipeDirections.includes('right')) {
      if (
        (swipeDirections.includes('left') && xDelta < 0) ||
        (swipeDirections.includes('right') && xDelta > 0)
      ) {
        swipeAmount.x = xDelta
      } else {
        // Smoothly transition to dampened movement
        const dampenedDelta = xDelta * getDampening(xDelta)
        // Ensure we don't jump when transitioning to dampened movement
        swipeAmount.x = Math.abs(dampenedDelta) < Math.abs(xDelta) ? dampenedDelta : xDelta
      }
    }
  }

  if (Math.abs(swipeAmount.x) > 0 || Math.abs(swipeAmount.y) > 0) {
    swiped.value = true
  }

  // Apply transform using both x and y values
  notificationRef.value?.style.setProperty('--notifi-swipe-amount-x', `${swipeAmount.x}px`)
  notificationRef.value?.style.setProperty('--notifi-swipe-amount-y', `${swipeAmount.y}px`)
}

let timeoutId: ReturnType<typeof setTimeout> | undefined

// Lifecycle hooks
onMounted(() => {
  mounted.value = true

  if (!notificationRef.value) return

  const height = notificationRef.value.getBoundingClientRect().height
  initialHeight.value = height

  const newHeights = [
    { notificationId: props.notification.id, height, position: props.notification.position! },
    ...props.heights,
  ]
  emit('update:heights', newHeights)
})

const clearTimeoutId = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = undefined
  }
}

onBeforeUnmount(() => {
  // Notify NotifContainer to remove corresponding height record when component unmounts
  if (notificationRef.value) {
    emit('removeNotification', props.notification)
  }
  clearTimeoutId()
})

// Watchers
watch(
  () => [props.expanded, props.interacting, props.isDocumentHidden, duration.value],
  () => {
    if (duration.value === Infinity) {
      return
    }

    const pauseTimer = () => {
      clearTimeoutId()
      if (lastCloseTimerStartTimeRef.value < closeTimerStartTimeRef.value) {
        const elapsedTime = Date.now() - closeTimerStartTimeRef.value
        remainingTime.value = remainingTime.value - elapsedTime
      }
      lastCloseTimerStartTimeRef.value = Date.now()
    }

    const startTimer = () => {
      if (remainingTime.value === Infinity) return
      closeTimerStartTimeRef.value = Date.now()
      clearTimeoutId()
      timeoutId = setTimeout(() => {
        props.notification.onAutoClose?.(props.notification)
        deleteNotification()
      }, remainingTime.value)
    }

    if (
      !props.notification.noPauseOnHover &&
      (props.expanded || props.interacting || props.isDocumentHidden)
    ) {
      pauseTimer()
    } else {
      startTimer()
    }
  },
  { immediate: true },
)

watch(
  () => props.notification.delete,
  (value) => {
    if (value !== undefined && value) {
      deleteNotification()
      props.notification.onDismiss?.(props.notification)
    }
  },
)

function handleDragEnd() {
  swiping.value = false
  swipeDirection.value = null
  pointerStartRef.value = null
}

const paused = computed(() =>
  props.notification.noPauseOnHover
    ? false
    : props.expanded || props.interacting || props.isDocumentHidden,
)

const Render = () => {
  const isComponent =
    typeof props.notification.component === 'object' ||
    isVNode(props.notification.component) ||
    typeof props.notification.component === 'function'
  if (isComponent) {
    return h(
      props.notification.component as Component,
      {
        paused: paused.value,
        onCloseNotification,
        onUpdateHeight,
        duration: duration.value,
        remainingTime: remainingTime.value,
      } as NotificationComponentProps,
    )
  }
  return props.notification.component
}
</script>
