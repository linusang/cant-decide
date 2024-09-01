<template>
  <div
    class="flex px-3 py-2 space-x-2 rounded-full bg-opacity-80 bg-chetwode-blue-700"
  >
    <div
      v-for="(s, index) in totalWheels"
      :key="index"
      class="w-3 h-3 transition duration-200 ease-linear rounded-full"
      :class="{
        'bg-catalina-blue-500': currentWheelIndex !== index,
        'bg-catalina-blue-100': currentWheelIndex === index
      }"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, computed } from "vue";
import AppStore, { APP_STORE } from "@/share/AppStore";
import UserWheelsStore, { USER_WHEELS_STORE } from "@/share/UserWheelsStore";

export default defineComponent({
  setup() {
    const appStore = inject(APP_STORE) as AppStore;
    const userWheelsStore = inject(USER_WHEELS_STORE) as UserWheelsStore;

    const totalWheels = computed(() => {
      return userWheelsStore.getState().wheels.length + 1;
    });
    const currentWheelIndex = computed<number>(() => {
      return appStore.getState().currentWheelIndex !== null
        ? (appStore.getState().currentWheelIndex as number)
        : userWheelsStore.getState().wheels.length;
    });

    return {
      currentWheelIndex,
      totalWheels
    };
  }
});

</script>
