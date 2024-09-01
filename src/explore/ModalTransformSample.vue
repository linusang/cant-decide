<template>
  <div class="flex items-end justify-start w-full h-full item-start">
    <icon-button
      class="w-16 h-16 bg-violet-red-500 hover:bg-violet-red-400 no-swiping"
      @click="openModal($event)"
    >
      <Icon icon="Pencil" class="w-8 h-8 text-white"></Icon>
    </icon-button>
  </div>
  <teleport to="body">
    <div class="fixed inset-0" v-if="isOpened">
      <div class="flex items-center justify-center w-full h-full p-5">
        <div
          class="relative h-full w-104"
          ref="tgtElement"
          data-purpose="tgtElement"
        >
          <div
            class="absolute inset-0 shadow-lg"
            ref="bgElement"
            data-purpose="bgElement"
          ></div>
          <div
            class="absolute inset-0 w-full h-full"
            ref="contentElement"
            data-purpose="contentElement"
          >
            <div class="flex items-start justify-end w-full h-full">
              <icon-button
                class="bg-violet-red-500 hover:bg-violet-red-400"
                @click="closeModal()"
              >
                <Icon icon="Cross" class="text-white"></Icon>
              </icon-button>
            </div>
          </div>
          <div
            class="absolute inset-0 w-full h-full"
            data-purpose="srcPlaceholderElement"
            ref="srcPlaceholderElement"
          ></div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick } from "vue";
import {
  ContainerTransformParams,
  useContainerTransform,
} from "@/plugins/containerTransform";
import { IconButton } from "@/components/buttons";
import Icon from "@/components/icons/Icon.vue";

export default defineComponent({
  components: {
    IconButton,
    Icon,
  },
  setup() {
    // elements required for containerTransform
    const tgtElement = ref<HTMLElement>();
    const bgElement = ref<HTMLElement>();
    const contentElement = ref<HTMLElement>();
    const srcPlaceholderElement = ref<HTMLElement>();

    // modal props
    const isOpened = ref<boolean>(false);
    let srcElement: HTMLElement;

    async function openModal(event: UIEvent) {
      if (!event) throw "UIEvent required";

      isOpened.value = true;
      await nextTick();

      if (!tgtElement.value) throw "tgtElement required";
      if (!bgElement.value) throw "bgElement required";
      if (!contentElement.value) throw "contentElement required";
      if (!srcPlaceholderElement.value) throw "srcPlaceholderElement required";

      srcElement = event.currentTarget as HTMLElement;
      const afterClone = (src: HTMLElement, cloned: HTMLElement) => {
        src.style.opacity = "0";
        cloned.style.backgroundColor = "transparent";
        cloned.style.boxShadow = "none";
      };
      const srcBackgroundColor = getComputedStyle(
        srcElement,
        null
      ).getPropertyValue("background-color");

      const api = useContainerTransform(
        tgtElement.value,
        bgElement.value,
        contentElement.value,
        srcPlaceholderElement.value,
        "0.5rem",
        "rgba(219, 234, 254, 1)"
      );

      const params: ContainerTransformParams = {
        srcElement,
        afterClone,
        srcElementBorderRadius: "2rem",
        srcElementBackgroundColor: srcBackgroundColor,
        duration: 5000,
      };

      await api.performEntranceTransition(params);
    }

    async function closeModal() {
      if (!srcElement) throw "srcElement required";
      if (!tgtElement.value) throw "tgtElement required";
      if (!bgElement.value) throw "bgElement required";
      if (!contentElement.value) throw "contentElement required";
      if (!srcPlaceholderElement.value) throw "srcPlaceholderElement required";

      const afterClone = (src: HTMLElement, cloned: HTMLElement) => {
        src.style.opacity = "0";
        cloned.style.backgroundColor = "transparent";
        cloned.style.boxShadow = "none";
      };
      const srcBackgroundColor = getComputedStyle(
        srcElement,
        null
      ).getPropertyValue("background-color");

      const api = useContainerTransform(
        tgtElement.value,
        bgElement.value,
        contentElement.value,
        srcPlaceholderElement.value,
        "0.5rem",
        "#FFF"
      );

      const params: ContainerTransformParams = {
        srcElement,
        afterClone,
        srcElementBorderRadius: "2rem",
        srcElementBackgroundColor: srcBackgroundColor,
        duration: 5000,
      };

      await api.performExitTransition(params);
      srcElement.style.opacity = "1";
      isOpened.value = false;
    }

    return {
      // elements required for containerTransform
      tgtElement,
      bgElement,
      contentElement,
      srcPlaceholderElement,

      // modal functions
      openModal,
      closeModal,
      isOpened,
    };
  },
});
</script>
