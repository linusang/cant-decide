<template>
  <swiper-component
    :slides-per-view="1"
    :space-between="0"
    @swiper="onSwiperLoaded"
    @touchStart="onTouchStart"
    @transitionEnd="onTransitionEnd"
    :virtual="true"
    no-swiping-class="no-swiping"
    :passive-listeners="false"
  >
    <swiper-slide
      v-for="(slide, index) in wheelSlides"
      :key="index"
      :virtualIndex="index"
    >
      <component :is="slide.component" v-bind="slide.propsData"></component>
    </swiper-slide>
  </swiper-component>
</template>
<script lang="ts">
import { defineComponent, inject, computed, Component, watch } from "vue";
import SwiperCore, { Swiper, Virtual } from "swiper";
// @ts-ignore
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/vue";
import "swiper/swiper.scss";
import AppStore, { APP_STORE } from "@/share/AppStore";
import UserWheelsStore, { USER_WHEELS_STORE } from "@/share/UserWheelsStore";
import Wheel from "@/models/Wheel";
import WheelController from "./WheelController.vue";
import WheelAdder from "./WheelAdder.vue";
import PatternBackground from "@/components/PatternBackground.vue";
import { WheelSwiperApi } from "./WheelSwiperApi";

SwiperCore.use([Virtual]);

export default defineComponent({
  components: {
    SwiperComponent,
    SwiperSlide,
    WheelController,
    WheelAdder,
    PatternBackground,
  },
  emits: ["touch-start", "transition-end", "swiper-initialized"],
  setup(props, { emit }) {
    let swiperInstance: Swiper | undefined = undefined;
    const userWheelsStore = inject(USER_WHEELS_STORE) as UserWheelsStore;
    const appStore = inject(APP_STORE) as AppStore;

    function mapToWheelSlides(wheels: Wheel[]) {
      return wheels
        .map((w) => {
          const isActiveWheel = appStore.currentWheel.value?.id === w.id;
          return {
            component: WheelController,
            propsData: { wheel: w, isActiveWheel },
          } as WheelSlide;
        })
        .concat({
          component: WheelAdder,
          propsData: { wheel: null, isActiveWheel: false },
        });
    }

    function createEventArgs(swiper: Swiper) {
      const isBeginning = swiper.isBeginning;
      const isEnd = swiper.isEnd;
      return { isBeginning, isEnd };
    }

    function onSwiperLoaded(swiper: Swiper) {
      swiperInstance = swiper;
      emit("swiper-initialized", createEventArgs(swiper));
    }

    function slideNext() {
      if (swiperInstance) {
        swiperInstance.slideNext();
      }
    }

    function slidePrev() {
      if (swiperInstance) {
        swiperInstance.slidePrev();
      }
    }

    const wheelSlides = computed(() =>
      mapToWheelSlides(userWheelsStore.getState().wheels)
    );

    function onTouchStart() {
      emit("touch-start");
    }

    function onTransitionEnd(swiper: Swiper) {
      if (swiper.activeIndex !== wheelSlides.value.length - 1) {
        appStore.setCurrentWheelIndex(swiper.activeIndex);
      } else {
        appStore.setCurrentWheelIndex(null);
      }
      emit("transition-end", createEventArgs(swiper));
    }

    watch(
      () => appStore.getState().currentWheelIndex,
      (newIndex: number | null) => {
        if (
          swiperInstance &&
          newIndex !== swiperInstance.activeIndex &&
          newIndex !== null
        ) {
          swiperInstance.slideTo(newIndex);
        }
      }
    );

    const exposedApi: WheelSwiperApi = {
      slideNext,
      slidePrev,
    };

    return {
      onSwiperLoaded,
      wheelSlides,
      ...exposedApi,
      onTouchStart,
      onTransitionEnd,
    };
  },
});

interface WheelSlide {
  component: Component;
  propsData: { wheel: Wheel | null; isActiveWheel: boolean };
}
</script>
<style lang="scss">
.swiper-container {
  width: 100%;
  height: 100%;
}
</style>
