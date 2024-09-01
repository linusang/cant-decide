<template>
  <div class="w-full h-full py-10">
    <div
      class="flex items-center justify-center w-full h-full p-10 md:p-28 lg:p-32"
      ref="container"
    >
      <div :style="{ width: size, height: size }">
        <button
          id="add-wheel-btn"
          type="button"
          class="flex items-center justify-center w-full h-full text-xl border-4 border-dashed rounded-full select-none bg-opacity-40 md:text-3xl border-catalina-blue-400 text-catalina-blue-400 focus:outline-none hover:bg-catalina-blue-600 hover:bg-opacity-60 lg:text-5xl bg-catalina-blue-600 no-swiping hover:text-catalina-blue-200"
          @click="addWheel"
          v-show="!hasReachMaxWheels"
        >
          <div class="flex items-center space-x-2">
            <Icon icon="Plus" class="w-8 h-8 lg:w-16 lg:h-16"></Icon>
            <span class="uppercase">Add New Wheel</span>
          </div>
        </button>

        <div
          class="flex items-center justify-center w-full h-full"
          v-show="hasReachMaxWheels"
        >
          <div
            class="text-xl uppercase md:text-3xl text-catalina-blue-400 lg:text-5xl"
          >
            Maximum of {{ maxWheels }} wheels can be created.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" >
import { computed, defineComponent, inject, onUnmounted } from "vue";
import UserWheelsStore, { USER_WHEELS_STORE } from "@/share/UserWheelsStore";
import AppStore, { APP_STORE } from "@/share/AppStore";
import { useWheelSizer } from "./WheelSizer";
import Icon from "./icons/Icon.vue";
import Wheel from "@/models/Wheel";
export default defineComponent({
  components: {
    Icon,
  },
  setup() {
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

    return {
      addWheel,
      container,
      size,
      maxWheels,
      hasReachMaxWheels,
    };
  },
});

</script>
