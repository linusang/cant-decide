<template>
  <div>
    <div class="relative w-full h-full">
      <div
        class="absolute w-full h-full"
        :class="{
          'bg-gradient': gradientType === 'linear',
          'bg-radial-gradient': gradientType === 'radial',
          'bg-gradient-none': gradientType === 'none'
        }"
      ></div>
      <div
        class="absolute w-full h-full opacity-40"
        :style="{
          background: dataUrl,
          backgroundPosition: computedPosition,
          transitionProperty: 'background-position',
          transitionDuration: computedTransitionDuration
        }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { dataUrl } from "./PatternBackgroundDataUrl";

type GradientType = "linear" | "radial" | "none";

export default defineComponent({
  props: {
    xProgress: {
      type: Number,
      default: 0
    },
    transitionDuration: {
      type: Number,
      default: 0
    },
    gradientType: {
      type: String as PropType<GradientType>,
      default: "linear"
    }
  },
  setup(props) {
    const maxTranslateDistance = 200;
    const decelerateBy = 0.6;

    const computedPosition = computed(() => {
      const result = props.xProgress * maxTranslateDistance * decelerateBy * -1;
      return `${result}px 0`;
    });

    const computedTransitionDuration = computed(() => {
      return `${props.transitionDuration}ms`;
    });

    return {
      dataUrl,
      computedPosition,
      computedTransitionDuration
    };
  }
});

</script>

<style scoped>
.bg-gradient-none {
  background: rgba(39, 58, 156, 1);
}
.bg-gradient {
  background: linear-gradient(
    180deg,
    rgba(39, 58, 156, 1) 0%,
    rgba(15, 27, 86, 1) 100%
  );
}

.bg-radial-gradient {
  background: radial-gradient(
    circle farthest-side,
    rgba(39, 58, 156, 1) 70%,
    rgba(15, 27, 86, 1) 100%
  );
}
</style>
