import {
  ExternalNotification,
  NotificationComponentProps,
  NotificationT,
  NotificationToDismiss,
} from "./types";
import { CONSTANTS } from "./constant";

let notificationsCounter = 1;

class Observer {
  subscribers: Array<
    (notification: ExternalNotification | NotificationToDismiss) => void
  >;
  notifications: Array<NotificationT | NotificationToDismiss>;
  dismissedNotifications: Array<string | number>;

  constructor() {
    this.subscribers = [];
    this.notifications = [];
    this.dismissedNotifications = [];
  }

  // We use arrow functions to maintain the correct `this` reference
  subscribe = (
    subscriber: (notification: NotificationT | NotificationToDismiss) => void,
  ) => {
    this.subscribers.push(subscriber as any);

    return () => {
      const index = this.subscribers.indexOf(subscriber as any);
      this.subscribers.splice(index, 1);
    };
  };

  publish = (data: NotificationT) => {
    this.subscribers.forEach((subscriber) => subscriber(data));
  };

  addNotification = (data: NotificationT) => {
    this.publish(data);
    this.notifications = [...this.notifications, data];
  };

  removeDismissedId = (id: string | number) => {
    if (this.dismissedNotifications.includes(id)) {
      this.dismissedNotifications.splice(
        this.dismissedNotifications.indexOf(id),
        1,
      );
    }
  };

  create = <T>(
    component: T | ((params: NotificationComponentProps) => T),
    data?: ExternalNotification,
  ) => {
    const id = data?.id || notificationsCounter++;
    if (component) {
      const alreadyExists = this.notifications.find((notification) => {
        return notification.id === id;
      });
      const dismissible =
        data?.dismissible === undefined ? true : data.dismissible;

      this.removeDismissedId(id);

      if (alreadyExists) {
        this.notifications = this.notifications.map((notification) => {
          if (notification.id === id) {
            this.publish({
              ...notification,
              component,
              dismissible,
              id,
              ...data,
            });
            return { ...notification, component, dismissible, id, ...data };
          }

          return notification;
        });
      } else {
        this.addNotification({ component, dismissible, id, ...data });
      }
    }
    return id;
  };

  dismiss = (id?: number | string) => {
    if (id) {
      const index = this.dismissedNotifications.indexOf(id);
      if (index === -1) this.dismissedNotifications.push(id);
      requestAnimationFrame(() =>
        this.subscribers.forEach((subscriber) =>
          subscriber({ id, dismiss: true }),
        ),
      );
    } else {
      this.notifications.forEach((notification) => {
        this.subscribers.forEach((subscriber) =>
          subscriber({ id: notification.id, dismiss: true }),
        );
      });
    }
    this.clearDismissedNotifications();
    return id;
  };

  getActiveNotifications = () => {
    return this.notifications.filter(
      (notification) => !this.dismissedNotifications.includes(notification.id),
    );
  };

  clearDismissedNotifications = () => {
    if (
      this.dismissedNotifications.length >
      CONSTANTS.MAX_SAVED_DISMISSED_NOTIFICATION
    ) {
      const oldDismissedIds = this.dismissedNotifications.splice(
        0,
        this.dismissedNotifications.length -
          CONSTANTS.MAX_SAVED_DISMISSED_NOTIFICATION,
      );
      this.notifications = this.notifications.filter(
        (notification) => !oldDismissedIds.includes(notification.id),
      );
    }
  };
}

export const NotificationState = new Observer();

const basicNotification = NotificationState.create;

const getHistory = () => NotificationState.notifications;
const getNotifications = () => NotificationState.getActiveNotifications();

// We use `Object.assign` to maintain the correct types as we would lose them otherwise
export const notification = Object.assign(
  basicNotification,
  {
    dismiss: NotificationState.dismiss,
  },
  {
    getHistory,
    getNotifications,
  },
);
