<script setup lang="ts">
  import { computed, inject, onUnmounted } from "vue";

  import type Wheel from "@/models/Wheel";
  import type AppStore from "@/share/AppStore";
  import { APP_STORE } from "@/share/AppStore";
  import type UserWheelsStore from "@/share/UserWheelsStore";
  import { USER_WHEELS_STORE } from "@/share/UserWheelsStore";

  import Icon from "./icons/Icon.vue";
  import { useWheelSizer } from "./WheelSizer";

  const userWheelsStore = inject(USER_WHEELS_STORE) as UserWheelsStore;
  const appStore = inject(APP_STORE) as AppStore;
  const { container, size } = useWheelSizer();
  const maxWheels = 5;

  const hasReachMaxWheels = computed(
    () => userWheelsStore.getState().wheels.length >= 5
  );

  function addWheel() {
    if (userWheelsStore.getState().wheels.length < maxWheels) {
      userWheelsStore.addWheel();
    }
  }

  function onAddedCallback(wheel: Wheel, index: number) {
    appStore.setCurrentWheelIndex(index);
  }

  userWheelsStore.addAddedCallback(onAddedCallback, -1);

  onUnmounted(() => {
    userWheelsStore.removeAddedCallback(onAddedCallback);
  });
</script>

<template>
  <div class="h-full w-full py-10">
    <div
      ref="container"
      class="flex h-full w-full items-center justify-center p-10 md:p-28 lg:p-32"
    >
      <div :style="{ width: size, height: size }">
        <button
          v-show="!hasReachMaxWheels"
          id="add-wheel-btn"
          type="button"
          class="no-swiping flex h-full w-full select-none items-center justify-center rounded-full border-4 border-dashed border-catalina-blue-400 bg-catalina-blue-600 bg-opacity-40 text-xl text-catalina-blue-400 hover:bg-catalina-blue-600 hover:bg-opacity-60 hover:text-catalina-blue-200 focus:outline-none md:text-3xl lg:text-5xl"
          @click="addWheel"
        >
          <div class="flex items-center space-x-2">
            <Icon icon="Plus" class="h-8 w-8 lg:h-16 lg:w-16"></Icon>
            <span class="uppercase">Add New Wheel</span>
          </div>
        </button>

        <div
          v-show="hasReachMaxWheels"
          class="flex h-full w-full items-center justify-center"
        >
          <div
            class="text-xl uppercase text-catalina-blue-400 md:text-3xl lg:text-5xl"
          >
            Maximum of {{ maxWheels }} wheels can be created.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
