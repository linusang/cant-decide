<script setup lang="ts">
  import { ref, watchEffect } from "vue";

  import MaskedOverflow from "./MaskedOverflow.vue";
  import type { ModalOptions } from "./ModalApi";

  const props = withDefaults(
    defineProps<{
      options?: ModalOptions;
      hideHeader?: boolean;
      hideFooter?: boolean;
    }>(),
    {
      options: () => ({}),
      hideHeader: false,
      hideFooter: false,
    }
  );

  const emit = defineEmits<{
    "is-opened": [boolean];
    "before-open": [];
    "after-opened": [];
    "after-closed": [];
  }>();

  defineOptions({
    inheritAttrs: false,
  });

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

  defineExpose({
    open,
    close,
  });
</script>

<template>
  <Transition
    name="fade"
    @before-enter="onBeforeEnter"
    @after-enter="onAfterEnter"
    @after-leave="onAfterLeave"
  >
    <!-- set z index to 2 because swiper-wrapper has z-index set to 1 -->
    <div
      v-if="isOpened"
      class="backdrop fixed inset-0 h-full"
      style="z-index: 2"
    >
      <div class="flex h-full w-full items-center justify-center p-3">
        <div
          v-bind="$attrs"
          class="rounded-lg border-chetwode-blue-800 shadow-xl"
        >
          <div
            v-if="!hideHeader"
            class="rounded-t-lg bg-catalina-blue-600 px-8 py-4"
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
            <MaskedOverflow class="h-full text-chetwode-blue-500">
              <slot :open="open" :close="close"></slot>
            </MaskedOverflow>
          </div>
          <div
            v-if="!hideFooter"
            class="rounded-b-lg bg-catalina-blue-600 px-8 py-4"
          >
            <slot name="footer" :open="open" :close="close"></slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    pointer-events: none;
  }
</style>
