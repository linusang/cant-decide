<template>
  <transition
    name="fade"
    @before-enter="onBeforeEnter"
    @after-enter="onAfterEnter"
    @after-leave="onAfterLeave"
  >
    <!-- set z index to 2 because swiper-wrapper has z-index set to 1 -->
    <div
      v-if="isOpened"
      class="fixed inset-0 h-full backdrop"
      style="z-index: 2"
    >
      <div class="flex items-center justify-center w-full h-full p-3">
        <div
          v-bind="$attrs"
          class="rounded-lg shadow-xl border-chetwode-blue-800"
        >
          <div
            v-if="!hideHeader"
            class="px-8 py-4 rounded-t-lg bg-catalina-blue-600"
          >
            <slot name="header" :open="open" :close="close"></slot>
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
              <slot :open="open" :close="close"></slot>
            </MaskedOverflow>
          </div>
          <div
            v-if="!hideFooter"
            class="px-8 py-4 rounded-b-lg bg-catalina-blue-600"
          >
            <slot name="footer" :open="open" :close="close"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, Ref, watchEffect } from "vue";
import MaskedOverflow from "./MaskedOverflow.vue";
import { ModalOptions } from "./ModalApi";

export default defineComponent({
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
  components: {
    MaskedOverflow,
  },
  emits: ["is-opened", "before-open", "after-opened", "after-closed"],
  setup(props, { emit }) {
    const isOpened = ref<boolean>(false);
    const bodyFlexGrow = ref<boolean>(props.options?.bodyFlexGrow || false);
    const bodyOverflowAuto = ref<boolean>(
      props.options?.bodyOverflowAuto || false
    );
    function open() {
      isOpened.value = true;
    }

    function close() {
      isOpened.value = false;
    }

    function onBeforeEnter() {
      emit("before-open");
    }

    function onAfterEnter() {
      emit("after-opened");
    }

    function onAfterLeave() {
      emit("after-closed");
    }

    watchEffect(() => emit("is-opened", isOpened.value));

    return {
      isOpened,
      open,
      close,
      bodyFlexGrow,
      bodyOverflowAuto,
      onBeforeEnter,
      onAfterEnter,
      onAfterLeave,
    };
  },
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  pointer-events: none;
}
</style>
