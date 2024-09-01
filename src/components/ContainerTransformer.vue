<script setup lang="ts">
  import { onMounted, ref } from "vue";

  import type { ContainerTransformParams } from "@/plugins/containerTransform";
  import { useContainerTransform } from "@/plugins/containerTransform";

  const props = withDefaults(
    defineProps<{
      borderRadius: string;
      backgroundColor: string;
    }>(),
    {
      borderRadius: "0",
      backgroundColor: "#FFF",
    }
  );

  // elements required for containerTransform
  const tgtElement = ref<HTMLElement>();
  const bgElement = ref<HTMLElement>();
  const contentElement = ref<HTMLElement>();
  const srcPlaceholderElement = ref<HTMLElement>();

  onMounted(() => {
    if (bgElement.value) {
      bgElement.value.style.borderRadius = props.borderRadius;
      bgElement.value.style.backgroundColor = props.backgroundColor;
    }
    if (srcPlaceholderElement.value) {
      srcPlaceholderElement.value.style.display = "none";
    }
  });

  async function performEntranceTransition(params: ContainerTransformParams) {
    if (!tgtElement.value) throw "tgtElement required";
    if (!bgElement.value) throw "bgElement required";
    if (!contentElement.value) throw "contentElement required";
    if (!srcPlaceholderElement.value) throw "srcPlaceholderElement required";
    const api = useContainerTransform(
      tgtElement.value,
      bgElement.value,
      contentElement.value,
      srcPlaceholderElement.value,
      props.borderRadius,
      props.backgroundColor
    );
    await api.performEntranceTransition(params);
  }

  async function performExitTransition(params: ContainerTransformParams) {
    if (!tgtElement.value) throw "tgtElement required";
    if (!bgElement.value) throw "bgElement required";
    if (!contentElement.value) throw "contentElement required";
    if (!srcPlaceholderElement.value) throw "srcPlaceholderElement required";
    const api = useContainerTransform(
      tgtElement.value,
      bgElement.value,
      contentElement.value,
      srcPlaceholderElement.value,
      props.borderRadius,
      props.backgroundColor
    );
    await api.performExitTransition(params);
  }

  defineExpose({
    performEntranceTransition,
    performExitTransition,
  });
</script>

<template>
  <div ref="tgtElement" class="relative">
    <div ref="bgElement" class="absolute inset-0"></div>
    <div
      ref="contentElement"
      class="absolute inset-0 h-full w-full"
      v-bind="$attrs"
    >
      <slot></slot>
    </div>
    <div
      ref="srcPlaceholderElement"
      class="absolute inset-0 h-full w-full"
    ></div>
  </div>
</template>
