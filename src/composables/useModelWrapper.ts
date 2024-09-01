// from https://www.vuemastery.com/blog/vue-3-data-down-events-up/
import { computed } from "vue";

export function useModelWrapper<T>(
  props: Record<string, any>,
  emit: (eventName: any, ...args: any[]) => void,
  name = "modelValue"
) {
  return computed<T>({
    get: () => props[name],
    set: (value) => emit(`update:${name}`, value),
  });
}
