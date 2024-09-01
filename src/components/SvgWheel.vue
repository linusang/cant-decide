<script setup lang="ts">
  import "@/vendor/Propeller/propeller";

  import { onMounted, onUnmounted, ref } from "vue";

  import type Choice from "@/models/Choice";
  import type SvgSlice from "@/models/SvgSlice";

  import { useWheelSizer } from "./WheelSizer";

  const props = withDefaults(
    defineProps<{
      slices?: SvgSlice<Choice>[];
      hideLabels?: boolean;
      wheelId: string;
      title?: string | null;
    }>(),
    {
      slices: () => [],
      hideLabels: false,
      title: null,
    }
  );

  const emit = defineEmits<{
    angle: [number];
    speed: [number];
    stopped: [number];
    "drag-start": [];
    "drag-stop": [];
    "text-bubble-clicked": [wheelId: string];
  }>();

  const wheel = ref<HTMLElement>();
  const touchElement = ref<HTMLElement>();
  const { container, size } = useWheelSizer();
  const shadowText = ref<HTMLElement>();
  const wrapText = ref<boolean>(false);
  let propeller: Propeller;
  let resizeObserver: ResizeObserver;

  function setDragOnWheel() {
    if (wheel.value && touchElement.value) {
      const touchElementId = `wheel-${props.wheelId}`;
      touchElement.value.id = touchElementId;

      const options: PropellerOptions = {
        inertia: 0.993,
        speed: 0.3,
        onStop: function (this: Propeller) {
          emit("angle", this.angle);
          emit("speed", this.speed);
          emit("stopped", this.angle);
        },
        onRotate: function (this: Propeller) {
          const propeller = this as Propeller;
          //premature stop
          if (Math.abs(propeller.speed) < 0.02) {
            propeller.stop();
            emit("stopped", this.angle);
          }
          emit("angle", this.angle);
          emit("speed", Math.abs(propeller.speed));
        },
        onDragStart: function () {
          emit("drag-start");
        },
        onDragStop: function () {
          emit("drag-stop");
        },
        touchElement: `#${touchElementId}`,
      };
      propeller = new Propeller(wheel.value, options);
    }
  }

  function stop() {
    if (propeller) {
      propeller.stop();
    }
  }

  function bind() {
    if (propeller) {
      propeller.bind();
    }
  }

  function unbind() {
    if (propeller) {
      propeller.unbind();
    }
  }

  function onElementsResized() {
    if (shadowText.value && container.value) {
      const shadowTextWidth = shadowText.value.offsetWidth;
      const containerWidth = container.value.offsetWidth;
      wrapText.value = shadowTextWidth >= containerWidth;
    }
  }

  function subscribeToResizeObserver() {
    if (shadowText.value && container.value) {
      resizeObserver = new ResizeObserver(onElementsResized);
      resizeObserver.observe(shadowText.value);
      resizeObserver.observe(container.value);
    }
  }

  function unsubscribeResizeObserver() {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  }

  function textBubbleClicked() {
    emit("text-bubble-clicked", props.wheelId);
  }

  onMounted(() => {
    setDragOnWheel();
    subscribeToResizeObserver();
  });

  onUnmounted(() => {
    unsubscribeResizeObserver();
  });

  defineExpose({
    stop,
    bind,
    unbind,
  });
</script>

<template>
  <div class="h-full w-full py-10">
    <div
      ref="container"
      class="flex h-full w-full items-center justify-center p-10 md:p-28 lg:p-32"
    >
      <div class="relative">
        <div class="relative" :style="{ width: size, height: size }">
          <div ref="wheel">
            <svg viewBox="0 0 100 100" class="svg">
              <circle r="50" cx="50" cy="50" fill="#cccccc" />
              <path
                v-for="(slice, index) in slices"
                :key="index"
                :d="slice.d"
                :fill="slice.fill"
              ></path>
              <template v-if="!hideLabels">
                <text
                  v-for="(slice, index) in slices"
                  :key="index"
                  :x="slice.textCoord.x"
                  :y="slice.textCoord.y"
                  text-anchor="end"
                  class="slice-label"
                  :transform="slice.textTransform"
                >
                  {{ slice.data.name }}
                </text>
              </template>
            </svg>
          </div>
          <div
            ref="touchElement"
            class="no-swiping absolute inset-0 rounded-full bg-transparent"
          ></div>
        </div>

        <div
          ref="shadowText"
          class="invisible absolute -top-1.5 left-1/2 -translate-x-1/2 -translate-y-full transform whitespace-nowrap shadow-lg sm:max-w-120"
        >
          <div
            class="wheel-text-bubble relative rounded-lg bg-white px-6 py-3 text-center text-xl font-bold text-catalina-blue-500 md:text-2xl lg:text-3xl"
          >
            {{ title }}
          </div>
        </div>

        <div
          class="no-swiping group absolute -top-1.5 left-1/2 -translate-x-1/2 -translate-y-full transform cursor-pointer shadow-lg sm:max-w-120"
          :class="{ 'w-full': wrapText }"
          @click="textBubbleClicked"
        >
          <div
            style="z-index: 2"
            class="relative rounded-lg bg-white px-6 py-3 text-center text-xl font-bold text-catalina-blue-500 group-hover:bg-chetwode-blue-300 md:text-2xl lg:text-3xl"
            :class="{ 'whitespace-nowrap': !wrapText }"
          >
            {{ title }}
          </div>
          <div class="relative h-full w-full">
            <div
              class="arrow absolute left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 transform bg-white group-hover:bg-chetwode-blue-300"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .slice-label {
    font-family: "Nunito Sans" sans-serif;
    font-size: 2.5px;
    font-weight: 600;
    fill: #1e2b73;
    user-select: none;
  }
</style>
