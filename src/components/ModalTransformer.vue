<template>
  <!-- set z index to 2 because swiper-wrapper has z-index set to 1 -->
  <div class="fixed inset-0 w-full h-full" style="z-index: 2" v-if="isOpened">
    <div class="relative w-full h-full">
      <div class="absolute w-full h-full backdrop" ref="backdrop"></div>
      <div class="absolute flex items-center justify-center w-full h-full p-3">
        <ContainerTransformer
          v-bind="$attrs"
          ref="containerTransformer"
          border-radius="0.5rem"
          background-color="rgba(30, 43, 115, 1)"
        >
          <div
            v-if="!hideHeader"
            class="px-8 py-4 rounded-t-lg bg-catalina-blue-600"
          >
            <slot name="header"></slot>
          </div>
          <div
            class="border-l-2 border-r-2 border-catalina-blue-600 bg-catalina-blue-700"
            :class="{
              'rounded-t-lg': hideHeader,
              'rounded-b-lg': hideFooter,
              'flex-grow': bodyFlexGrow,
              'overflow-auto': bodyOverflowAuto,
            }"
          >
            <MaskedOverflow class="text-chetwode-blue-500 h-full">
              <slot></slot>
            </MaskedOverflow>
          </div>
          <div
            v-if="!hideFooter"
            class="px-8 py-4 rounded-b-lg bg-catalina-blue-600"
          >
            <slot name="footer"></slot>
          </div>

          <slot name="overlay"></slot>
        </ContainerTransformer>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ContainerTransformParams } from "@/plugins/containerTransform";
import { defineComponent, PropType, ref, watchEffect, nextTick } from "vue";
import ContainerTransformer from "./ContainerTransformer.vue";
import MaskedOverflow from "./MaskedOverflow.vue";
import { ModalOptions } from "./ModalApi";
import anime from "animejs";

export default defineComponent({
  components: {
    ContainerTransformer,
    MaskedOverflow,
  },
  inheritAttrs: false,
  props: {
    options: {
      type: Object as PropType<ModalOptions>,
    },
    hideHeader: {
      type: Boolean,
      default: false,
    },
    hideFooter: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    "is-opened",
    "before-open",
    "after-opened",
    "before-close",
    "after-closed",
  ],
  setup(props, { emit }) {
    const isOpened = ref<boolean>(false);
    const bodyFlexGrow = ref<boolean>(props.options?.bodyFlexGrow || false);
    const bodyOverflowAuto = ref<boolean>(
      props.options?.bodyOverflowAuto || false
    );
    const backdrop = ref<HTMLElement>();
    const containerTransformer = ref<
      InstanceType<typeof ContainerTransformer>
    >();

    function animateOpacityTo(element: HTMLElement, value: number) {
      const promise = new Promise<void>((resolve) => {
        anime({
          targets: element,
          opacity: value,
          duration: 300,
          easing: "linear",
          complete: () => resolve(),
        });
      });
      return promise;
    }

    function fadeInBackdrop() {
      if (!backdrop.value) return Promise.resolve();
      return animateOpacityTo(backdrop.value, 1);
    }

    function fadeOutBackdrop() {
      if (!backdrop.value) return Promise.resolve();
      return animateOpacityTo(backdrop.value, 0);
    }

    async function open(params: ContainerTransformParams) {
      isOpened.value = true;
      await nextTick();

      if (!containerTransformer.value) {
        throw "containerTransformer required";
      }

      const transformer = containerTransformer.value;

      emit("before-open");
      const p1 = fadeInBackdrop();
      const p2 = transformer.performEntranceTransition(params);
      await Promise.all([p1, p2]);
      emit("after-opened");
    }

    async function close(params: ContainerTransformParams) {
      if (!containerTransformer.value) {
        throw "containerTransformer required";
      }
      const transformer = containerTransformer.value;
      emit("before-close");
      const p1 = fadeOutBackdrop();
      const p2 = transformer.performExitTransition(params);
      await Promise.all([p1, p2]);
      isOpened.value = false;
      emit("after-closed");
    }

    watchEffect(() => emit("is-opened", isOpened.value));

    return {
      isOpened,
      open,
      close,
      bodyFlexGrow,
      bodyOverflowAuto,
      containerTransformer,
      backdrop,
    };
  },
});
</script>
