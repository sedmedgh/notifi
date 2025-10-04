import * as CSS from "csstype";

export interface CSSProperties
  extends CSS.Properties<string | number>,
    CSS.PropertiesHyphen<string | number> {
  /**
   * The index signature was removed to enable closed typing for style
   * using CSSType. You're able to use type assertion or module augmentation
   * to add properties or an index signature of your own.
   *
   * For examples and more information, visit:
   * https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
   */
  [v: `--${string}`]: string | number | undefined;
}

interface NotificationBase {
  class?: string;
  style?: CSSProperties;
  duration?: number;
}

export interface NotificationOptions extends NotificationBase {
  notificationContainerId?: string;
}

export interface NotificationT<T = any> extends NotificationOptions {
  id: number | string;
  component?: T;
  dismissible?: boolean;
  // just use for NotifContainer to call Notification remove function on outside dismisses
  delete?: boolean;
  noPauseOnHover?: boolean;
  onDismiss?: (notification: NotificationT) => void;
  onAutoClose?: (notification: NotificationT) => void;
  position?: Position;
  testId?: string;
}

export type Position =
  | "top-start"
  | "top-end"
  | "bottom-start"
  | "bottom-end"
  | "top-center"
  | "bottom-center";

export interface HeightT {
  height: number;
  notificationId: number | string;
  position: Position;
}

type Offset =
  | {
      top?: string | number;
      end?: string | number;
      bottom?: string | number;
      start?: string | number;
    }
  | string
  | number;

export interface NotificationContainerProps extends NotificationBase {
  id?: string;
  position?: Position;
  expand?: boolean;
  gap?: number;
  width?: number;
  visibleNotifications?: number;
  notificationOptions?: NotificationOptions;
  rootClass?: string;
  ariaLabel?: string;
  offset?: Offset;
  mobileOffset?: Offset;
  absolute?: boolean;
  swipeDirections?: SwipeDirection[];
}

export type SwipeDirection = "top" | "right" | "bottom" | "left";

export interface NotificationProps extends NotificationBase {
  notification: NotificationT;
  notifications: NotificationT[];
  index: number;
  swipeDirections?: SwipeDirection[];
  expanded: boolean;
  isDocumentHidden: boolean;
  heights: HeightT[];
  gap?: number;
  position: Position;
  visibleNotifications: number;
  expandByDefault: boolean;
  interacting: boolean;
}

export interface NotificationToDismiss {
  id: number | string;
  dismiss: boolean;
}

export type ExternalNotification<T = any> = Omit<
  NotificationT<T>,
  "id" | "delete" | "component"
> & {
  id?: number | string;
  notificationContainerId?: string;
};

export interface NotificationComponentProps {
  paused: boolean;
  onCloseNotification: () => void;
  onUpdateHeight: () => void;
  duration: number;
  /* the remaining time of the notification is not reactive (update on pause and resume) */
  remainingTime: number;
}
