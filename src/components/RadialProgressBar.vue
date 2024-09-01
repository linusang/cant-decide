<script setup lang="ts">
  import ProgressBar from "progressbar.js";
  import type Circle from "progressbar.js/circle";
  import { onMounted, ref } from "vue";

  const props = withDefaults(
    defineProps<{
      color?: string;
      duration?: number;
      easing?: string;
      strokeWidth?: number;
    }>(),
    {
      color: "#FCB03C",
      duration: 1000,
      easing: "easeOut",
      strokeWidth: 1,
    }
  );

  const emit = defineEmits<{
    "animation-end": [];
  }>();

  let circle: Circle;
  const progressElement = ref<HTMLElement>();

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

  defineExpose({
    animate,
  });
</script>

<template>
  <div class="relative w-32">
    <div ref="progressElement" class="progress"></div>
    <div class="absolute inset-0">
      <slot :animate="animate"></slot>
    </div>
  </div>
</template>

<style>
  .progress {
    height: 100%;
  }

  .progress > svg {
    height: 100%;
    display: block;
  }
</style>
