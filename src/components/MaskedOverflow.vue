<template>
  <div class="masked-overflow" ref="el" :style="style">
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useResizeObserver } from "../composables/useResizeObserver";

const el = ref<HTMLElement>();
const hasTopOverflow = ref<boolean>(false);
const hasBottomOverflow = ref<boolean>(false);
let disconnectResizeObserver: () => void;

const props = defineProps({
    spaceBetweenContentAndScrollbar: {
        type: Number,
        default: 8
    }
});

function onScroll() {
  if (el.value) {
    const scrollTop = el.value.scrollTop;
    const scrollBottom =
      el.value.scrollHeight - el.value.scrollTop - el.value.clientHeight;
    hasTopOverflow.value = scrollTop > 0;
    hasBottomOverflow.value = scrollBottom > 0;
  }
}

onMounted(() => {
  if (el.value) {
    el.value.addEventListener("scroll", onScroll);
    disconnectResizeObserver = useResizeObserver(el.value, onScroll);
  }
});

onUnmounted(() => {
  if (el.value) {
    el.value.removeEventListener("scroll", onScroll);
    disconnectResizeObserver();
  }
});

const style = computed<any>(() => {
  return {
    "--top-gradient-stop": hasTopOverflow.value ? "transparent" : "black",
    "--bottom-gradient-stop": hasBottomOverflow.value ? "transparent" : "black",
    "--space-between-content-and-scrollbar": `${props.spaceBetweenContentAndScrollbar}px`
  };
});
</script>
<style scoped>
/*article from: https://pqina.nl/blog/fade-out-overflow-using-css-mask-image/*/
.masked-overflow {
  /* scroll bar width, for use in mask calculations */
  --scrollbar-width: 6px;

  /* mask fade distance, for use in mask calculations */
  --mask-height: 32px;

  --space-between-content-and-scrollbar: 8px;

  /* If content exceeds height of container, overflow! */
  overflow-y: auto;
  overflow-x: hidden;

  /* Keep some space between content and scrollbar */
  padding-right: var(--spaceBetweenContentAndScrollbar);

  /* The CSS mask */

  /* The content mask is a linear gradient from top to bottom */
  /* top-gradient-stop and bottom-gradient-stop provided by computed style  */
  --mask-image-content: linear-gradient(
    to bottom,
    var(--top-gradient-stop),
    black var(--mask-height),
    black calc(100% - var(--mask-height)),
    var(--bottom-gradient-stop)
  );

  /* Here we scale the content gradient to the width of the container 
    minus the scrollbar width. The height is the full container height */
  --mask-size-content: calc(100% - var(--scrollbar-width)) 100%;

  /* The scrollbar mask is a black pixel */
  --mask-image-scrollbar: linear-gradient(black, black);

  /* The width of our black pixel is the width of the scrollbar.
    The height is the full container height */
  --mask-size-scrollbar: var(--scrollbar-width) 100%;

  /* Apply the mask image and mask size variables */
  mask-image: var(--mask-image-content), var(--mask-image-scrollbar);
  mask-size: var(--mask-size-content), var(--mask-size-scrollbar);

  /* Position the content gradient in the top left, and the 
    scroll gradient in the top right */
  mask-position: 0 0, 100% 0;

  /* We don't repeat our mask images */
  mask-repeat: no-repeat, no-repeat;
}

/* Firefox */
.masked-overflow {
  scrollbar-width: thin; /* can also be normal, or none, to not render scrollbar */
  scrollbar-color: currentColor transparent; /* foreground background */
}

/* Webkit / Blink */
.masked-overflow::-webkit-scrollbar {
  width: var(--scrollbar-width);
}

.masked-overflow::-webkit-scrollbar-thumb {
  background-color: currentColor;
  border-radius: 9999px; /* always round */
}

.masked-overflow::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
