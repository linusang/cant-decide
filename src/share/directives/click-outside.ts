import type { DirectiveBinding } from "vue";

interface ClickOutsideOptions {
  isActive: boolean;
  onClickedOutside: () => void;
}

interface RemoveEventListenerContext {
  removeListeners: () => void;
}

interface HTMLElementExt<T> extends HTMLElement {
  customData: T;
}

export default function clickOutsideFunc(
  el: HTMLElementExt<RemoveEventListenerContext>,
  binding: DirectiveBinding<ClickOutsideOptions>
) {
  const isActive = binding.value.isActive;
  const callback = binding.value.onClickedOutside;
  subscribeToOnClickOutside(el, isActive, callback);
}

function subscribeToOnClickOutside(
  el: HTMLElementExt<RemoveEventListenerContext>,
  isActive: boolean,
  callback: () => void
) {
  if (isActive) {
    const remove = onClickedOutside([el], callback);
    el.customData = {
      removeListeners: remove,
    };
  } else {
    if (el.customData && typeof el.customData.removeListeners === "function") {
      el.customData.removeListeners();
    }
  }
}

function onClickedOutside(elements: Element[], callback: () => void) {
  const handleInput = (e: Event) => {
    const targetElement = e.target as Element;
    if (!targetElement) {
      return;
    }
    if (elements.some((el) => el.contains(targetElement))) {
      return;
    }
    if (typeof callback === "function") {
      callback();
    }
  };

  document.body.addEventListener("mousedown", handleInput, true);
  document.body.addEventListener("touchend", handleInput, true);

  return () => {
    document.body.removeEventListener("mousedown", handleInput);
    document.body.addEventListener("touchend", handleInput);
  };
}
