<script setup lang="ts">
  import { onMounted, provide } from "vue";

  import type { EventName } from "./components/WheelController.vue";
  import AppStore, { APP_STORE } from "./share/AppStore";
  import EventStore, { EVENT_STORE } from "./share/EventStore";
  import { usePwaInstaller } from "./share/pwa";
  import UserWheelsDataStore, {
    USER_WHEELS_STORE,
  } from "./share/UserWheelsStore";

  const userWheelsStore = new UserWheelsDataStore();
  provide(USER_WHEELS_STORE, userWheelsStore);

  const appStore = new AppStore(userWheelsStore);
  provide(APP_STORE, appStore);

  const eventStore = new EventStore<EventName>();
  provide(EVENT_STORE, eventStore);

  function showBuildVersion() {
    if (import.meta.env.VITE_BUILD_VERSION) {
      console.info(`BUILD: ${import.meta.env.VITE_BUILD_VERSION}`);
    }
  }

  function savePromptEvent(promptEvent: BeforeInstallPromptEvent) {
    appStore.setPromptEvent(promptEvent);
  }

  function disableContextMenu() {
    window.addEventListener("contextmenu", (e) => e.preventDefault(), false);
  }

  usePwaInstaller(savePromptEvent);

  onMounted(() => {
    disableContextMenu();
    showBuildVersion();
  });
</script>

<template>
  <router-view />
</template>

<style>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  body {
    overscroll-behavior-y: none;
    touch-action: pan-x pan-y;
    -webkit-tap-highlight-color: transparent;
    @apply select-none;
    @apply bg-catalina-blue-600;
  }
</style>
