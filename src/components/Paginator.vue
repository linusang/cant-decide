<script setup lang="ts">
  import { computed, inject } from "vue";

  import type AppStore from "@/share/AppStore";
  import { APP_STORE } from "@/share/AppStore";
  import type UserWheelsStore from "@/share/UserWheelsStore";
  import { USER_WHEELS_STORE } from "@/share/UserWheelsStore";

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
</script>
<template>
  <div
    class="flex space-x-2 rounded-full bg-chetwode-blue-700 bg-opacity-80 px-3 py-2"
  >
    <div
      v-for="(s, index) in totalWheels"
      :key="index"
      class="h-3 w-3 rounded-full transition duration-200 ease-linear"
      :class="{
        'bg-catalina-blue-500': currentWheelIndex !== index,
        'bg-catalina-blue-100': currentWheelIndex === index,
      }"
    ></div>
  </div>
</template>
