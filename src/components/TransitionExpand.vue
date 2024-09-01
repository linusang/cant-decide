<template>
  <transition
    name="expand"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
  >
    <slot></slot>
  </transition>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    function enter(element: Element, _: () => void) {
      const { width } = getComputedStyle(element);

      if (element instanceof HTMLElement) {
        element.style.setProperty("width", width);
        element.style.setProperty("position", "absolute");
        element.style.setProperty("visibility", "hidden");
        element.style.setProperty("height", "auto");
        const { height } = getComputedStyle(element);

        element.style.setProperty("width", null);
        element.style.setProperty("position", null);
        element.style.setProperty("visibility", null);
        element.style.setProperty("height", "0");

        // Force repaint to make sure the
        // animation is triggered correctly.
        getComputedStyle(element).height;
        requestAnimationFrame(() => {
          element.style.setProperty("height", height);
        });
      }
    }

    function afterEnter(element: Element) {
      if (element instanceof HTMLElement) {
        element.style.height = "auto";
      }
    }

    function leave(element: Element, _: () => void) {
      if (element instanceof HTMLElement) {
        const { height } = getComputedStyle(element);
        element.style.setProperty("height", height);
        // Force repaint to make sure the
        // animation is triggered correctly.
        getComputedStyle(element).height;
        requestAnimationFrame(() => {
          element.style.setProperty("height", "0");
        });
      }
    }
    return {
      enter,
      afterEnter,
      leave,
    };
  },
});
</script>

<style scoped>
* {
  will-change: height;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
</style>

<style>
.expand-enter-active,
.expand-leave-active {
  overflow: hidden;
  transition-property: opacity, height;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;
}
.expand-enter-from,
.expand-leave-to {
  height: 0;
  opacity: 0;
}
</style>
