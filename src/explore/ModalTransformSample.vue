<template>
  <div class="item-start flex h-full w-full items-end justify-start">
    <IconButton
      class="no-swiping h-16 w-16 bg-violet-red-500 hover:bg-violet-red-400"
      @click="openModal($event)"
    >
      <Icon icon="Pencil" class="h-8 w-8 text-white"></Icon>
    </IconButton>
  </div>
  <teleport to="body">
    <div v-if="isOpened" class="fixed inset-0">
      <div class="flex h-full w-full items-center justify-center p-5">
        <div
          ref="tgtElement"
          class="relative h-full w-104"
          data-purpose="tgtElement"
        >
          <div
            ref="bgElement"
            class="absolute inset-0 shadow-lg"
            data-purpose="bgElement"
          ></div>
          <div
            ref="contentElement"
            class="absolute inset-0 h-full w-full"
            data-purpose="contentElement"
          >
            <div class="flex h-full w-full items-start justify-end">
              <IconButton
                class="bg-violet-red-500 hover:bg-violet-red-400"
                @click="closeModal()"
              >
                <Icon icon="Cross" class="text-white"></Icon>
              </IconButton>
            </div>
          </div>
          <div
            ref="srcPlaceholderElement"
            class="absolute inset-0 h-full w-full"
            data-purpose="srcPlaceholderElement"
          ></div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
  import { defineComponent, nextTick, ref } from "vue";

  import { IconButton } from "@/components/buttons";
  import Icon from "@/components/icons/Icon.vue";
  import type { ContainerTransformParams } from "@/plugins/containerTransform";
  import { useContainerTransform } from "@/plugins/containerTransform";

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
        if (!srcPlaceholderElement.value)
          throw "srcPlaceholderElement required";

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
        if (!srcPlaceholderElement.value)
          throw "srcPlaceholderElement required";

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
