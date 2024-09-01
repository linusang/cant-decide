import { onMounted, onUnmounted, ref } from "vue";

export function useWheelSizer() {
  const container = ref<HTMLElement>();
  const size = ref<string>("auto");
  let observer: ResizeObserver;

  function onResized() {
    if (container.value) {
      const width = container.value.getBoundingClientRect().width;
      const height = container.value.getBoundingClientRect().height;
      const paddingTop = getComputedStyle(container.value, null).paddingTop;
      const paddingBottom = getComputedStyle(
        container.value,
        null
      ).paddingBottom;
      size.value = `calc(${Math.min(
        width,
        height
      )}px - ${paddingTop} - ${paddingBottom})`;
    }
  }

  onMounted(() => {
    if (container.value) {
      observer = new ResizeObserver(() => onResized());
      observer.observe(container.value);
      onResized();
    }
  });

  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  return {
    container,
    size,
  };
}
