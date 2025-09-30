import { type NotificationContainerProps, type CSSProperties } from "./types";
import { CONSTANTS } from "./constant";

export function assignOffset(
  defaultOffset: NotificationContainerProps["offset"],
  mobileOffset: NotificationContainerProps["mobileOffset"],
) {
  const styles = {} as CSSProperties;

  [defaultOffset, mobileOffset].forEach((offset, index) => {
    const isMobile = index === 1;
    const prefix = isMobile ? "--notifi-mobile-offset" : "--notifi-offset";
    const defaultValue = isMobile
      ? CONSTANTS.MOBILE_VIEWPORT_OFFSET
      : CONSTANTS.VIEWPORT_OFFSET;

    function assignAll(offset: string | number) {
      ["top", "end", "bottom", "start"].forEach((key) => {
        styles[`${prefix}-${key}`] =
          typeof offset === "number" ? `${offset}px` : offset;
      });
    }

    if (typeof offset === "number" || typeof offset === "string") {
      assignAll(offset);
    } else if (typeof offset === "object") {
      ["top", "end", "bottom", "start"].forEach((key) => {
        if (offset[key as keyof typeof offset] === undefined) {
          styles[`${prefix}-${key}`] = defaultValue;
        } else {
          styles[`${prefix}-${key}`] =
            typeof offset[key as keyof typeof offset] === "number"
              ? `${offset[key as keyof typeof offset]}px`
              : offset[key as keyof typeof offset];
        }
      });
    } else {
      assignAll(defaultValue);
    }
  });

  return styles;
}
