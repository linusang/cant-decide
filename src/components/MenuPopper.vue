<script setup lang="ts">
  import type { Placement } from "@popperjs/core";
  import { createPopper } from "@popperjs/core";
  import { ref } from "vue";

  const props = withDefaults(
    defineProps<{
      placement?: Placement;
    }>(),
    {
      placement: "top-start",
    }
  );

  const popperContainer = ref<HTMLElement>();
  const isOpened = ref<boolean>(false);

  function setupPopper(referenceElement: HTMLElement) {
    if (referenceElement && popperContainer.value) {
      createPopper(referenceElement, popperContainer.value, {
        placement: props.placement,
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 16],
            },
          },
        ],
      });
    }
  }

  function open(referenceElement: HTMLElement) {
    setupPopper(referenceElement);
    isOpened.value = true;
  }

  function close() {
    isOpened.value = false;
  }

  defineExpose({
    open,
    close,
  });
</script>

<template>
  <Transition name="fade">
    <div
      v-show="isOpened"
      ref="popperContainer"
      style="z-index: 2"
      class="popper-container rounded border border-chetwode-blue-500 bg-chetwode-blue-700"
    >
      <div class="arrow" data-popper-arrow></div>
      <div class="rounded bg-chetwode-blue-700 py-2">
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
  .arrow,
  .arrow::before {
    position: absolute;
    width: 16px;
    height: 16px;
    z-index: -1;
  }

  .arrow::before {
    content: "";
    @apply rotate-45 transform;
    @apply bg-chetwode-blue-700;
    @apply border border-chetwode-blue-500;
  }

  .popper-container[data-popper-placement^="top"] > .arrow {
    bottom: -8px;
  }

  .popper-container[data-popper-placement^="bottom"] > .arrow {
    top: -8px;
  }

  .popper-container[data-popper-placement^="left"] > .arrow {
    right: -8px;
  }

  .popper-container[data-popper-placement^="right"] > .arrow {
    left: -8px;
  }
</style>
