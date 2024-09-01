<template>
  <div class="relative w-32">
    <div class="progress" ref="progressElement"></div>
    <div class="absolute inset-0">
      <slot :animate="animate"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import ProgressBar from "progressbar.js";
import Circle from "progressbar.js/circle";
import { defineComponent, onMounted, ref } from "vue";
import { RadialProgressBarApi } from "./RadialProgressBarApi";

export default defineComponent({
  props: {
    color: {
      type: String,
      default: "#FCB03C",
    },
    duration: {
      type: Number,
      default: 1000,
    },
    easing: {
      type: String,
      default: "easeOut",
    },
    strokeWidth: {
      type: Number,
      default: 1,
    },
  },
  emits: ["animation-end"],
  setup(props, { emit }) {
    let circle: Circle;
    const progressElement = ref<SVGPathElement>();

    function animate(progress = 1) {
      if (circle) {
        const animateOptions: ProgressBar.AnimationOptions = {
          duration: props.duration,
          easing: props.easing,
        };
        circle.animate(progress, animateOptions, () => emit("animation-end"));
      }
    }

    onMounted(() => {
      if (progressElement.value) {
        circle = new ProgressBar.Circle(progressElement.value, {
          color: props.color,
          strokeWidth: props.strokeWidth,
        });
      }
    });

    const exposedApi: RadialProgressBarApi = {
      animate,
    };

    return {
      progressElement,
      ...exposedApi,
    };
  },
});
</script>

<style>
.progress {
  height: 100%;
}

.progress > svg {
  height: 100%;
  display: block;
}
</style>
