<template>
  <div class="w-full h-full py-10">
    <div
      class="flex items-center justify-center w-full h-full p-10 md:p-28 lg:p-32"
      ref="container"
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
            class="absolute inset-0 bg-transparent rounded-full no-swiping"
          ></div>
        </div>

        <div
          ref="shadowText"
          class="absolute sm:max-w-120 transform -translate-x-1/2 -translate-y-full shadow-lg -top-1.5 left-1/2 whitespace-nowrap invisible"
        >
          <div
            class="relative px-6 py-3 text-xl font-bold text-center bg-white rounded-lg md:text-2xl lg:text-3xl text-catalina-blue-500 wheel-text-bubble"
          >
            {{ title }}
          </div>
        </div>

        <div
          @click="textBubbleClicked"
          class="absolute sm:max-w-120 transform -translate-x-1/2 -translate-y-full shadow-lg -top-1.5 left-1/2 group cursor-pointer no-swiping"
          :class="{ 'w-full': wrapText }"
        >
          <div
            style="z-index: 2"
            class="relative px-6 py-3 text-xl font-bold text-center bg-white rounded-lg md:text-2xl lg:text-3xl text-catalina-blue-500 group-hover:bg-chetwode-blue-300"
            :class="{ 'whitespace-nowrap': !wrapText }"
          >
            {{ title }}
          </div>
          <div class="relative w-full h-full">
            <div
              class="absolute w-6 h-6 transform rotate-45 -translate-x-1/2 -translate-y-1/2 bg-white arrow left-1/2 group-hover:bg-chetwode-blue-300"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import "@/vendor/Propeller/propeller";
import { defineComponent, onMounted, onUnmounted, PropType, ref } from "vue";
import Choice from "@/models/Choice";
import SvgSlice from "@/models/SvgSlice";
import { useWheelSizer } from "./WheelSizer";
import { SvgWheelApi } from "./SvgWheelApi";

export default defineComponent({
  props: {
    slices: {
      type: Array as PropType<SvgSlice<Choice>[]>,
      default: [],
      required: false,
    },
    hideLabels: {
      type: Boolean,
      default: false,
    },
    wheelId: {
      type: String,
      default: null,
      required: true,
    },
    title: {
      type: String,
      default: null,
    },
  },
  emits: [
    "angle",
    "speed",
    "stopped",
    "drag-start",
    "drag-stop",
    "text-bubble-clicked",
  ],
  setup(props, { emit }) {
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
          onStop: function() {
            emit("angle", this.angle);
            emit("speed", this.speed);
            emit("stopped", this.angle);
          },
          onRotate: function() {
            const propeller = this as Propeller;
            //premature stop
            if (Math.abs(propeller.speed) < 0.02) {
              propeller.stop();
              emit("stopped", this.angle);
            }
            emit("angle", this.angle);
            emit("speed", Math.abs(propeller.speed));
          },
          onDragStart: function() {
            emit("drag-start");
          },
          onDragStop: function() {
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

    const exposedApi: SvgWheelApi = {
      stop,
      bind,
      unbind,
    };

    return {
      ...exposedApi,
      container,
      wheel,
      size,
      touchElement,
      shadowText,
      wrapText,
      textBubbleClicked,
    };
  },
});
</script>

<style lang="scss" scoped>
.slice-label {
  font-family: "Nunito Sans" sans-serif;
  font-size: 2.5px;
  font-weight: 600;
  fill: #1e2b73;
  user-select: none;
}
</style>
