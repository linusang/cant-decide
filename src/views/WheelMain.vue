<template>
  <div class="viewport-height">
    <div class="relative" :style="{ height: `${windowInnerHeight}px` }">
      <pattern-background
        class="absolute w-full h-full"
        :xProgress="swipeProgress"
        :transitionDuration="swipeTransitionDuration"
      ></pattern-background>
      <div class="w-full h-full">
        <wheel-swiper
          ref="wheelSwiper"
          @touch-start="onTouchStart"
          @transition-end="onTransitionEnd"
          @set-transition="updateTransitionDuration"
        ></wheel-swiper>
      </div>

      <div class="absolute bottom-0 left-0 right-0">
        <div class="flex justify-center p-2">
          <div class="pb-3 opacity-60 text-catalina-blue-400">
            Handcrafted with
            <span><Icon icon="Heart" class="inline-block w-4 h-4"></Icon></span>
            by Linus
          </div>
        </div>
      </div>
      <transition name="fade">
        <div class="absolute wheel-editor" v-show="!isCurrentWheelNull">
          <wheel-editor :wheel="localWheel"></wheel-editor>
        </div>
      </transition>
      <div
        class="absolute flex items-center justify-center h-16 lg:items-end paginator"
      >
        <paginator></paginator>
      </div>
      <div class="absolute menu-opener">
        <menu-opener></menu-opener>
      </div>
    </div>
    <app-refresher></app-refresher>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  inject,
  watch,
  onUnmounted,
  computed,
} from "vue";
import AppStore, { APP_STORE } from "@/share/AppStore";
import UserWheelsStore, { USER_WHEELS_STORE } from "@/share/UserWheelsStore";
import WheelSwiper from "@/components/WheelSwiper.vue";
import Wheel from "@/models/Wheel";
import { IconButton } from "@/components/buttons";
import Icon from "@/components/icons/Icon.vue";
import Paginator from "@/components/Paginator.vue";
import AppRefresher from "@/components/AppRefresher.vue";
import MenuOpener from "@/components/MenuOpener.vue";
import WheelEditor from "@/components/WheelEditor.vue";
import PatternBackground from "@/components/PatternBackground.vue";
// @ts-ignore
import { Swiper } from "swiper/vue";

export default defineComponent({
  components: {
    WheelSwiper,
    IconButton,
    Icon,
    Paginator,
    AppRefresher,
    MenuOpener,
    WheelEditor,
    PatternBackground,
  },
  setup() {
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

    function updateTransitionDuration(swiper: Swiper, duration: number) {
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

    return {
      windowInnerHeight,
      wheelSwiper,
      localWheel,
      isCurrentWheelNull,
      swipeProgress,
      swipeTransitionDuration,
      onTouchStart,
      onTransitionEnd,
      updateTransitionDuration,
    };
  },
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
