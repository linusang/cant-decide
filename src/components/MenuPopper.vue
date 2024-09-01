<template>
  <transition name="fade">
    <div
      v-show="isOpened"
      ref="popperContainer"
      style="z-index: 2"
      class="border rounded border-chetwode-blue-500 bg-chetwode-blue-700 popper-container"
    >
      <div class="arrow" data-popper-arrow></div>
      <div class="py-2 rounded bg-chetwode-blue-700">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { createPopper, Placement } from "@popperjs/core";
import { MenuPopperApi } from "./MenuPopperApi";

export default defineComponent({
  props: {
    placement: {
      type: String as PropType<Placement>,
      default: "top-start",
    },
  },
  setup(props) {
    const popperContainer = ref<HTMLElement>();
    const isOpened = ref<boolean>(false);

    function setupPopper(referenceElement: HTMLElement) {
      if (referenceElement && popperContainer.value) {
        console.log({ placement: props.placement });
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

    const exposedApi: MenuPopperApi = {
      open,
      close,
    };

    return {
      popperContainer,
      isOpened,
      ...exposedApi,
    };
  },
});
</script>

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
  @apply transform rotate-45;
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
