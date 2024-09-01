<template>
  <div class="viewport-height">
    <div class="relative" :style="{ height: `${windowInnerHeight}px` }">
      <PatternBackground
        class="absolute h-full w-full"
        :x-progress="swipeProgress"
        :transition-duration="swipeTransitionDuration"
      ></PatternBackground>
      <div class="h-full w-full">
        <WheelSwiper
          ref="wheelSwiper"
          @touch-start="onTouchStart"
          @transition-end="onTransitionEnd"
          @set-transition="updateTransitionDuration"
        ></WheelSwiper>
      </div>

      <div class="absolute bottom-0 left-0 right-0">
        <div class="flex justify-center p-2">
          <div class="pb-3 text-catalina-blue-400 opacity-60">
            Handcrafted with
            <span><Icon icon="Heart" class="inline-block h-4 w-4"></Icon></span>
            by Linus
          </div>
        </div>
      </div>
      <transition name="fade">
        <div v-show="!isCurrentWheelNull" class="wheel-editor absolute">
          <WheelEditor :wheel="localWheel"></WheelEditor>
        </div>
      </transition>
      <div
        class="paginator absolute flex h-16 items-center justify-center lg:items-end"
      >
        <Paginator></Paginator>
      </div>
      <div class="menu-opener absolute">
        <MenuOpener></MenuOpener>
      </div>
    </div>
    <AppRefresher></AppRefresher>
  </div>
</template>

<script setup lang="ts">
  // eslint-disable-next-line
  import { Swiper } from "swiper/vue";
  import { computed, inject, onMounted, onUnmounted, ref, watch } from "vue";

  import AppRefresher from "@/components/AppRefresher.vue";
  import Icon from "@/components/icons/Icon.vue";
  import MenuOpener from "@/components/MenuOpener.vue";
  import Paginator from "@/components/Paginator.vue";
  import PatternBackground from "@/components/PatternBackground.vue";
  import WheelEditor from "@/components/WheelEditor.vue";
  import WheelSwiper from "@/components/WheelSwiper.vue";
  import type Wheel from "@/models/Wheel";
  import type AppStore from "@/share/AppStore";
  import { APP_STORE } from "@/share/AppStore";
  import type UserWheelsStore from "@/share/UserWheelsStore";
  import { USER_WHEELS_STORE } from "@/share/UserWheelsStore";

  const appStore = inject(APP_STORE) as AppStore;
  const userWheelsStore = inject(USER_WHEELS_STORE) as UserWheelsStore;
  const wheel = appStore.currentWheel.value;
  const windowInnerHeight = ref<number>(0);
  const wheelSwiper = ref<InstanceType<typeof WheelSwiper> | undefined>(
    undefined
  );
  const canPrev = ref<boolean>(false);
  const canNext = ref<boolean>(true);
  const localWheel = ref<Wheel | null>(wheel);
  const isSwiping = ref<boolean>(false);
  const swipeProgress = ref<number>(0);
  const swipeTransitionDuration = ref<number>(0);

  function onResize() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    windowInnerHeight.value = window.innerHeight;
  }

  function onTouchStart() {
    isSwiping.value = true;
  }

  function onTransitionEnd(eventArgs: {
    isBeginning: boolean;
    isEnd: boolean;
  }) {
    canPrev.value = !eventArgs.isBeginning;
    canNext.value = !eventArgs.isEnd;
    isSwiping.value = false;
  }

  function onCurrentWheelChanged(wheel: Wheel | null) {
    localWheel.value = wheel;
  }

  function onWheelAdded() {
    canNext.value = true;
  }

  function updateTransitionDuration(swiper: typeof Swiper, duration: number) {
    swipeTransitionDuration.value = duration;
  }

  userWheelsStore.addAddedCallback(onWheelAdded);

  const stopCurrentWheelWatcher = watch(
    appStore.currentWheel,
    onCurrentWheelChanged
  );

  const isCurrentWheelNull = computed(
    () => appStore.currentWheel.value === null
  );

  onMounted(() => {
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    onResize();
  });

  onUnmounted(() => {
    stopCurrentWheelWatcher();
    userWheelsStore.removeRemoveCallback(onWheelAdded);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("orientationchange", onResize);
  });
</script>

<style lang="scss">
  .viewport-height {
    height: 100vh; /* Fallback for browsers that do not support Custom Properties */
    height: calc(var(--vh, 1vh) * 100);
  }
  .wheel-editor {
    right: 10%;
    bottom: 10%;
    z-index: 2;
  }
  .menu-opener {
    left: 10%;
    bottom: 10%;
    z-index: 2;
  }
  .paginator {
    left: 50%;
    bottom: 10%;
    z-index: 2;
    transform: translateX(-50%);
  }
</style>
