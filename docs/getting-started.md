# Getting Started


## Install

```bash
npm install @notifi/vue
```

## Headless by design

Notifi is headless and ships **no styles**. You can render plain text, or integrate any UI kit/component (e.g., your design system) as the notification content.

## Mount

Use the `NotifContainer` component to render and manage notifications.

```vue
<template>
  <NotifContainer />
</template>
<script setup lang="ts">
import { NotifContainer } from '@notifi/vue'
</script>
```

## Show a notification

```ts
import { notif } from '@notifi/vue'

const id = notif('Hello Notifi!', { duration: 2500 })

function closeNotification() {
  notif.dismiss(id)
}

function closeAllNotifications() {
  notif.dismiss()
}
```

## API

```ts
import { notif } from '@notifi/vue'

// Dismiss by id
notif.dismiss(id)

// Dismiss all
notif.dismiss()

// Get full history (including dismissed until cleaned)
const history = notif.getHistory()

// Get active notifications (not dismissed)
const active = notif.getNotifications()
```

## Notification parameters (ExternalNotification)

| name            | type                                                                                             | default                    | description |
|-----------------|--------------------------------------------------------------------------------------------------|----------------------------|-------------|
| id              | `string \| number`                                                                               | auto-generated             | Optional custom id for the notification. Useful for targeted dismiss/update. |
| class           | `string`                                                                                         | -                          | Extra class applied to the notification root. |
| style           | `CSSProperties`                                                                                  | -                          | Inline styles; supports CSS variables like `--notifi-*`. |
| duration        | `number`                                                                                         | library default            | Auto close delay in ms. Use `Infinity` to disable auto close. |
| dismissible     | `boolean`                                                                                        | `true`                     | Whether the notification can be dismissed via swipe/click. |
| noPauseOnHover  | `boolean`                                                                                        | `false`                    | If true, hovering will not pause the auto-close timer. |
| onDismiss       | `(notification) => void`                                                                         | -                          | Called when the notification is dismissed manually or by swipe. |
| onAutoClose     | `(notification) => void`                                                                         | -                          | Called when the notification is closed by timer. |
| position        | `'top-start' \| 'top-center' \| 'top-end' \| 'bottom-start' \| 'bottom-center' \| 'bottom-end'` | container default          | Position override per notification. |
| testId          | `string`                                                                                         | -                          | Testing id set on the notification element. |
| notificationContainerId | `string`                                                                                 | -                          | Send notification to a specific `NotifContainer` instance with matching `id`. |

## NotifContainer props (NotificationContainerProps)

| name           | type                                                                                             | default                  | description |
|----------------|--------------------------------------------------------------------------------------------------|--------------------------|-------------|
| id             | `string`                                                                                         | -                        | Identifier to isolate notifications for this `NotifContainer` instance. |
| position       | `'top-start' \| 'top-center' \| 'top-end' \| 'bottom-start' \| 'bottom-center' \| 'bottom-end'`  | `'bottom-end'`           | Default position for notifications without an explicit position. |
| expand         | `boolean`                                                                                        | `false`                  | Expand the stack on hover/interact. |
| gap            | `number`                                                                                         | `8`                      | Gap between stacked notifications (px). |
| width          | `number`                                                                                         | `448`                    | Width of the notification list (px). |
| visibleNotifications  | `number`                                                                                  | `5`                      | How many notifications are visible in the stack. |
| duration       | `number`                                                                                         | -                        | Default duration for notifications created while this container is mounted. |
| notificationOptions   | `NotificationOptions`                                                                     | `{}`                     | Default options applied to each created notification. |
| class          | `string`                                                                                         | ``                       | Extra class on the notification list (`ol[data-notifi-notifer]`). |
| rootClass      | `string`                                                                                         | ``                       | Extra class on the outer container `section[data-notifi-container]`. |
| style          | `CSSProperties`                                                                                  | -                        | Inline styles; can provide `--notifi-*` CSS variables per container. |
| ariaLabel      | `string`                                                                                         | `"Notifications"`        | Accessible label for the live region. |
| offset         | `{ top?; end?; bottom?; start? } \| string \| number`                                            | `32` (px)                | Viewport offsets for desktop. Numbers are px; strings accept any CSS length. |
| mobileOffset   | `{ top?; end?; bottom?; start? } \| string \| number`                                            | `16` (px)                | Viewport offsets for mobile (applied under 600px). |
| absolute       | `boolean`                                                                                        | `false`                  | Position container absolutely instead of fixed. |
| swipeDirections| `Array<'top' \| 'right' \| 'bottom' \| 'left'>`                                                  | `['left','right']`       | Allowed swipe-to-dismiss directions. |
