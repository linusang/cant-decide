<template>
  <button
    class="flex items-center justify-center p-2 rounded-full shadow-lg focus:outline-none disabled:bg-gray-400"
    ref="rootElement"
  >
    <slot></slot>
  </button>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { ComponentApi } from "@/share/ComponentApi";
export default defineComponent({
  setup() {
    const rootElement = ref<HTMLElement>();
    function getRootElement(): HTMLElement | undefined {
      return rootElement.value;
    }
    const exposedApi: ComponentApi = {
      getRootElement,
    };
    return {
      rootElement,
      ...exposedApi,
    };
  },
});
</script>
