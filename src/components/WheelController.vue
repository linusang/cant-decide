<script setup lang="ts">
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  import chroma from "chroma-js";
  import { inject, onUnmounted, ref, watch } from "vue";

  import type Choice from "@/models/Choice";
  import type SvgSlice from "@/models/SvgSlice";
  import type Wheel from "@/models/Wheel";
  import type AppStore from "@/share/AppStore";
  import { APP_STORE } from "@/share/AppStore";
  import { chromaColors } from "@/share/colors";
  import type EventStore from "@/share/EventStore";
  import { EVENT_STORE } from "@/share/EventStore";
  import type UserWheelsStore from "@/share/UserWheelsStore";
  import { USER_WHEELS_STORE } from "@/share/UserWheelsStore";
  import { deepCopy } from "@/share/utils/jsUtils";
  import { computePos } from "@/share/utils/wheelUtils";

  import { IconButton, RoundedButton } from "./buttons";
  import Icon from "./icons/Icon.vue";
  import Modal from "./Modal.vue";
  import PatternBackground from "./PatternBackground.vue";
  import SvgWheel from "./SvgWheel.vue";

  export type EventName = "text-bubble-clicked";

  const props = withDefaults(
    defineProps<{
      wheel: Wheel;
      isActiveWheel?: boolean;
    }>(),
    {
      isActiveWheel: false,
    }
  );

  const slices = ref<SvgSlice<Choice>[]>([]);
  const afterSpinningSelectedChoice = ref<Choice | undefined>();
  const appStore = inject(APP_STORE) as AppStore;
  const eventStore = inject(EVENT_STORE) as EventStore<EventName>;
  const userWheelsStore = inject(USER_WHEELS_STORE) as UserWheelsStore;
  const modal = ref<InstanceType<typeof Modal>>();
  const localWheel = ref(props.wheel);
  const svgWheel = ref<InstanceType<typeof SvgWheel>>();
  const maxSpeed = 30;
  const minSpeedTrigger = 10;
  const speedometerWidth = ref<string>("0");
  const isMinSpeedAchieved = ref<boolean>(false);
  let isDragging = false;

  if (!localWheel.value) {
    throw "wheel prop must be specified";
  }

  function calcTotalWeights(choices: Choice[]): number {
    const totalPortion = choices
      .map((c) => c.weightage)
      .reduce((p, c) => p + c, 0);
    return totalPortion;
  }

  function calcDegrees(weightage: number, totalPortion: number) {
    return (360 / totalPortion) * weightage;
  }

  function generateColors(count: number): string[] {
    return chroma.scale(chromaColors).colors(count);
  }

  function mapToSlices(choices: Choice[], multiple = 1): SvgSlice<Choice>[] {
    const filtered = choices.filter((c) => c.isIncluded);
    const originalLength = filtered.length;
    const colors = generateColors(originalLength);

    let multipliedChoices: Choice[] = [];
    for (let i = 0; i < multiple; i++) {
      multipliedChoices = multipliedChoices.concat(filtered);
    }
    const totalWeights = calcTotalWeights(multipliedChoices);

    let currentStartAngle = 0;
    return multipliedChoices.map((choice, index) => {
      const sliceDegrees = calcDegrees(choice.weightage, totalWeights);
      const endAngle = currentStartAngle + sliceDegrees;
      const startPos = computePos(currentStartAngle, 50);
      const endPos = computePos(endAngle, 50);

      const textAngle = currentStartAngle + sliceDegrees / 2;
      const textCoord = computePos(textAngle, 45);
      const textRotateAngle = -90 + textAngle;

      const largeArcFlag = sliceDegrees > 180 ? "1" : "0";

      const d = `M ${startPos.x} ${startPos.y} A 50 50, 0, ${largeArcFlag}, 1, ${endPos.x} ${endPos.y} L 50 50 z`;
      const fill = colors[index % originalLength];

      const textTransform = `rotate(${textRotateAngle}, ${textCoord.x}, ${textCoord.y}) translate(0 1)`;

      currentStartAngle = endAngle;
      return {
        data: choice,
        d,
        fill,
        textCoord,
        textTransform,
        degrees: sliceDegrees,
      };
    });
  }

  function determineSelectedChoice2(angle: number): Choice | undefined {
    const normalized = 360 - angle;
    let minAngle = 0;
    const found = slices.value.find((s) => {
      const deg = s.degrees;
      const maxAngle = minAngle + deg;
      const isBetweenMinMaxAngle =
        minAngle < normalized && normalized <= maxAngle;
      if (!isBetweenMinMaxAngle) {
        minAngle = maxAngle;
      }
      return isBetweenMinMaxAngle;
    });
    return found?.data;
  }

  function onWheelStopped(angle: number) {
    const dontShowResultStates = [
      appStore.getState().isWheelEditorOpened,
      appStore.currentWheel.value?.id !== props.wheel.id,
    ];

    if (dontShowResultStates.some((x) => x)) {
      return;
    }

    if (!isMinSpeedAchieved.value) {
      return;
    }

    isMinSpeedAchieved.value = false;
    const choice = determineSelectedChoice2(angle);
    afterSpinningSelectedChoice.value = choice;
    if (modal.value) {
      modal.value?.open();

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.7 },
      });
    }
  }

  function excludeChoice(choice: Choice | undefined) {
    if (!choice) {
      return;
    }
    const copy = deepCopy<Wheel>(localWheel.value);
    const found = copy.choices.find((c) => c.id === choice.id);
    if (found) {
      found.isIncluded = false;
    }
    userWheelsStore.updateWheel(copy.id, copy);

    if (modal.value) {
      modal.value?.close();
    }
  }

  function onWheelSpeed(speed: number) {
    const speedPercentage = (speed / maxSpeed) * 100;
    speedometerWidth.value = `${speedPercentage}%`;

    if (speed >= minSpeedTrigger && !isDragging) {
      isMinSpeedAchieved.value = true;
    }
  }

  function onDragStart() {
    isDragging = true;
  }

  function onDragStop() {
    isDragging = false;
  }

  const stopWheelsPropWatcher = watch(
    () => props.wheel,
    (newValue) => {
      slices.value = mapToSlices(newValue.choices, newValue.repeat ?? 1);
      localWheel.value = newValue;
    },
    { deep: true }
  );

  function onTextBubbleClicked(wheelId: string) {
    eventStore.publish("text-bubble-clicked", wheelId);
  }

  onUnmounted(() => stopWheelsPropWatcher());

  slices.value = mapToSlices(
    localWheel.value.choices,
    localWheel.value.repeat ?? 1
  );
</script>

<template>
  <div
    class="h-1"
    :style="{ width: speedometerWidth }"
    :class="{
      'bg-chetwode-blue-500': !isMinSpeedAchieved,
      'bg-green-500': isMinSpeedAchieved,
    }"
  ></div>
  <div class="relative h-full w-full">
    <SvgWheel
      ref="svgWheel"
      :slices="slices"
      :hide-labels="localWheel.hideLabelsOnWheel"
      :wheel-id="localWheel.id"
      :title="localWheel.title"
      @stopped="onWheelStopped"
      @speed="onWheelSpeed"
      @drag-start="onDragStart"
      @drag-stop="onDragStop"
      @text-bubble-clicked="onTextBubbleClicked"
    ></SvgWheel>
  </div>
  <Teleport to="body">
    <Modal ref="modal" class="w-full sm:w-112">
      <template #header="{ close }">
        <div class="flex items-center justify-between">
          <div class="text-xl uppercase text-catalina-blue-200">
            You rolled...
          </div>
          <IconButton
            class="bg-violet-red-500 hover:bg-violet-red-400"
            @click="close()"
            ><Icon icon="Cross" class="text-white"></Icon
          ></IconButton>
        </div>
      </template>
      <template #default>
        <div class="relative">
          <PatternBackground
            class="absolute h-full w-full"
            gradient-type="radial"
          ></PatternBackground>

          <div class="relative flex h-48 items-center justify-center px-8 py-4">
            <div class="text-center text-4xl font-bold text-white">
              {{ afterSpinningSelectedChoice?.name }} !!
            </div>
          </div>
        </div>
      </template>
      <template #footer="{ close }">
        <div class="space-x-2 text-center">
          <RoundedButton
            class="border border-chetwode-blue-600 bg-transparent text-white hover:bg-chetwode-blue-600"
            @click="excludeChoice(afterSpinningSelectedChoice)"
          >
            Exclude this
          </RoundedButton>
          <RoundedButton
            class="border border-chetwode-blue-700 bg-chetwode-blue-700 hover:border-chetwode-blue-600 hover:bg-chetwode-blue-600"
            @click="close()"
          >
            OK
          </RoundedButton>
        </div>
      </template>
    </Modal>
  </Teleport>
</template>
