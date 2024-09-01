export function watchStyle(
  element: HTMLElement,
  styleAttr: string,
  onChange: (newValue: string, oldValue: string) => void
) {
  let savedOldValue = element.style.getPropertyValue(styleAttr);

  const styleChanged = (mutations: MutationRecord[]) => {
    const newValue = (mutations[0]
      .target as HTMLElement).style.getPropertyValue(styleAttr);
    if (newValue !== savedOldValue) {
      if (onChange) {
        const oldValue = savedOldValue;
        savedOldValue = newValue;
        onChange(newValue, oldValue);
      }
    }
  };

  const observer = new MutationObserver(styleChanged);
  observer.observe(element, {
    attributes: true,
    attributeFilter: ["style"],
  });
  return observer.disconnect;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number,
  waitingCallback?: (isWaiting: boolean) => void
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (typeof waitingCallback === "function") {
      waitingCallback(true);
    }
    timeout = setTimeout(() => {
      if (typeof waitingCallback === "function") {
        waitingCallback(false);
      }
      func(...args);
    }, waitFor);
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>;
};
