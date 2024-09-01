<template>
  <div class="relative" ref="tgtElement">
    <div class="absolute inset-0" ref="bgElement"></div>
    <div
      class="absolute inset-0 w-full h-full"
      ref="contentElement"
      v-bind="$attrs"
    >
      <slot></slot>
    </div>
    <div
      class="absolute inset-0 w-full h-full"
      ref="srcPlaceholderElement"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import {
  ContainerTransformParams,
  useContainerTransform,
} from "@/plugins/containerTransform";
import { ContainerTransformerApi } from "./ContainerTransformerApi";

export default defineComponent({
  props: {
    borderRadius: {
      type: String,
      default: "0",
    },
    backgroundColor: {
      type: String,
      default: "#FFF",
    },
  },
  setup(props) {
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

    const exposedApi: ContainerTransformerApi = {
      performEntranceTransition,
      performExitTransition,
    };

    return {
      tgtElement,
      bgElement,
      contentElement,
      srcPlaceholderElement,
      ...exposedApi,
    };
  },
});
</script>
