<script setup lang="ts">
  import "swiper/swiper.scss";

  import type { Swiper } from "swiper";
  import SwiperCore, { Virtual } from "swiper";
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  import { Swiper as SwiperComponent, SwiperSlide } from "swiper/vue";
  import type { Component } from "vue";
  import { computed, inject, watch } from "vue";

  import type Wheel from "@/models/Wheel";
  import type AppStore from "@/share/AppStore";
  import { APP_STORE } from "@/share/AppStore";
  import type UserWheelsStore from "@/share/UserWheelsStore";
  import { USER_WHEELS_STORE } from "@/share/UserWheelsStore";

  import WheelAdder from "./WheelAdder.vue";
  import WheelController from "./WheelController.vue";

  SwiperCore.use([Virtual]);

  const emit = defineEmits<{
    "touch-start": [];
    "transition-end": [{ isBeginning: boolean; isEnd: boolean }];
    "swiper-initialized": [{ isBeginning: boolean; isEnd: boolean }];
  }>();

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

  defineExpose({
    slideNext,
    slidePrev,
  });

  interface WheelSlide {
    component: Component;
    propsData: { wheel: Wheel | null; isActiveWheel: boolean };
  }
</script>

<template>
  <SwiperComponent
    :slides-per-view="1"
    :space-between="0"
    :virtual="true"
    no-swiping-class="no-swiping"
    :passive-listeners="false"
    @swiper="onSwiperLoaded"
    @touch-start="onTouchStart"
    @transition-end="onTransitionEnd"
  >
    <!-- @vue-ignore -->
    <SwiperSlide
      v-for="(slide, index) in wheelSlides"
      :key="index"
      :virtual-index="index"
    >
      <component :is="slide.component" v-bind="slide.propsData"></component>
    </SwiperSlide>
  </SwiperComponent>
</template>
<style lang="scss">
  .swiper-container {
    width: 100%;
    height: 100%;
  }
</style>
