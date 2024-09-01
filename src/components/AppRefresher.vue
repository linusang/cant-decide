<template>
  <teleport to="body">
    <div class="fixed w-full" v-show="hasUpdates" style="z-index: 3; top: 0">
      <div
        class="absolute flex justify-center w-full"
        style="top: 30px; left: 0; right: 0;"
      >
        <transition name="fade">
          <div v-if="isOpened" class="w-full sm:w-112">
            <div
              class="relative p-3 m-3 space-y-2 border rounded shadow-lg bg-chetwode-blue-700 border-chetwode-blue-500"
            >
              <p
                class="text-sm tracking-wider text-center text-white uppercase"
              >
                we've updates!
              </p>
              <div class="text-center">
                <rounded-button
                  @click="refresh()"
                  class="bg-violet-red-500 hover:bg-violet-red-400"
                >
                  Relaunch App
                </rounded-button>
              </div>
              <div class="absolute" style="right: 10px; top: 0">
                <button class="block p-1" @click="close">
                  <Icon icon="Cross"
                    class="w-3 h-3 text-chetwode-blue-600 hover:text-chetwode-blue-300 focus:outline-none"                    
                  ></Icon>
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, PropType, Ref, ref } from "vue";
import { RoundedButton, RoundedButtonSmall } from "./buttons";
import { usePwaUpdater, refreshApp } from "@/share/pwa";
import Icon from "./icons/Icon.vue";
export default defineComponent({
  props: {
    serviceWorkerRegistration: {
      type: Object as PropType<Ref<ServiceWorkerRegistration>>,
      default: undefined,
    },
  },
  components: {
    RoundedButton,
    RoundedButtonSmall,
    Icon,
  },
  setup() {
    const isOpened = ref<boolean>(false);
    const hasUpdates = ref<boolean>(false);

    function open() {
      isOpened.value = true;
    }

    function close() {
      isOpened.value = false;
    }

    function refresh() {
      refreshApp();
      isOpened.value = false;
    }

    usePwaUpdater(() => {
      hasUpdates.value = true;
      open();
    });

    return {
      isOpened,
      open,
      close,
      refresh,
      hasUpdates,
    };
  },
});

</script>
