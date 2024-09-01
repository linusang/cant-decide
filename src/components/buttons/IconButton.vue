<script setup lang="ts">
  import { ref } from "vue";

  const rootElement = ref<HTMLElement>();
  function getRootElement(): HTMLElement | undefined {
    return rootElement.value;
  }
  defineExpose({
    getRootElement,
  });
</script>

<template>
  <button
    ref="rootElement"
    class="flex items-center justify-center rounded-full p-2 shadow-lg focus:outline-none disabled:bg-gray-400"
  >
    <slot></slot>
  </button>
</template>
