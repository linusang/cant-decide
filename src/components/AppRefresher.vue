<script setup lang="ts">
  import { ref } from "vue";

  import { refreshApp, usePwaUpdater } from "@/share/pwa";

  import { RoundedButton } from "./buttons";
  import Icon from "./icons/Icon.vue";

  defineProps<{
    serviceWorkerRegistration?: ServiceWorkerRegistration;
  }>();

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
</script>

<template>
  <Teleport to="body">
    <div v-show="hasUpdates" class="fixed w-full" style="z-index: 3; top: 0">
      <div
        class="absolute flex w-full justify-center"
        style="top: 30px; left: 0; right: 0"
      >
        <Transition name="fade">
          <div v-if="isOpened" class="w-full sm:w-112">
            <div
              class="relative m-3 space-y-2 rounded border border-chetwode-blue-500 bg-chetwode-blue-700 p-3 shadow-lg"
            >
              <p
                class="text-center text-sm uppercase tracking-wider text-white"
              >
                we've updates!
              </p>
              <div class="text-center">
                <rounded-button
                  class="bg-violet-red-500 hover:bg-violet-red-400"
                  @click="refresh()"
                >
                  Relaunch App
                </rounded-button>
              </div>
              <div class="absolute" style="right: 10px; top: 0">
                <button class="block p-1" @click="close">
                  <Icon
                    icon="Cross"
                    class="h-3 w-3 text-chetwode-blue-600 hover:text-chetwode-blue-300 focus:outline-none"
                  ></Icon>
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Teleport>
</template>
