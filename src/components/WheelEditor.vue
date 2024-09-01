<script setup lang="ts">
  import anime from "animejs";
  import { computed, inject, nextTick, onUnmounted, ref, watch } from "vue";

  import type Choice from "@/models/Choice";
  import type Wheel from "@/models/Wheel";
  import type { ContainerTransformParams } from "@/plugins/containerTransform";
  import type AppStore from "@/share/AppStore";
  import { APP_STORE } from "@/share/AppStore";
  import type EventStore from "@/share/EventStore";
  import { EVENT_STORE } from "@/share/EventStore";
  import { createEmptyNewChoice } from "@/share/factory";
  import type UserWheelsStore from "@/share/UserWheelsStore";
  import { USER_WHEELS_STORE } from "@/share/UserWheelsStore";
  import { debounce } from "@/share/utils/domUtils";
  import { shuffle } from "@/share/utils/wheelUtils";

  import {
    IconButton,
    RoundedButton,
    RoundedButtonSmall,
    ToggleIconButton,
  } from "./buttons";
  import ChoiceEditor from "./ChoiceEditor.vue";
  import type { OnMountedContext } from "./ChoiceEditorApi";
  import CloseWarning from "./CloseWarning.vue";
  import Icon from "./icons/Icon.vue";
  import ModalTransformer from "./ModalTransformer.vue";
  import TextInput from "./TextInput.vue";
  import type { EventName } from "./WheelController.vue";
  import WheelRemover from "./WheelRemover.vue";

  const props = withDefaults(
    defineProps<{
      wheel: Wheel | null;
    }>(),
    {
      wheel: null,
    }
  );
  const modalTransformer = ref<
    InstanceType<typeof ModalTransformer> | undefined
  >();
  const wheelRemover = ref<InstanceType<typeof WheelRemover> | undefined>();
  const userWheelsStore = inject(USER_WHEELS_STORE) as UserWheelsStore;
  const appStore = inject(APP_STORE) as AppStore;
  const eventStore = inject(EVENT_STORE) as EventStore<EventName>;
  const wheelLocal = ref<Wheel | null>(null);
  const maxChoices = 20;
  const modalBody = ref<HTMLElement>();
  const editButton = ref<InstanceType<typeof IconButton> | undefined>();
  const MAX_SPLIT_AMT = 5;
  const wheelHasChanges = ref<boolean>(false);
  const isCloseWarningOpened = ref<boolean>(false);
  let newlyAddedChoice: Choice | null;
  let wheelJson: string;

  function shuffleChoices() {
    if (wheelLocal.value) {
      const shuffled = shuffle(wheelLocal.value.choices).slice();
      wheelLocal.value.choices = shuffled;
    }
  }

  async function addNewChoice() {
    if (wheelLocal.value) {
      if (wheelLocal.value.choices.length < maxChoices) {
        const newChoice = createEmptyNewChoice();
        wheelLocal.value.choices.push(newChoice);
        newlyAddedChoice = newChoice;
      }
    }
  }

  function removeChoice(choice: Choice) {
    if (wheelLocal.value) {
      const index = wheelLocal.value.choices.indexOf(choice);
      wheelLocal.value.choices.splice(index, 1);
    }
  }

  function performStaggerAnimation() {
    if (modalBody.value) {
      const list = modalBody.value.querySelectorAll(".stagger");
      anime({
        targets: list,
        opacity: {
          value: [0, 1],
          easing: "linear",
        },
        translateY: {
          value: [50, 0],
        },
        delay: anime.stagger(30, { start: 100 }),
      });
    }
  }

  function createContainerTransformParams(
    srcElement: HTMLElement
  ): ContainerTransformParams {
    const afterClone = (src: HTMLElement, cloned: HTMLElement) => {
      src.style.opacity = "0";
      cloned.style.backgroundColor = "transparent";
      cloned.style.boxShadow = "none";
    };

    const srcBackgroundColor = getComputedStyle(
      srcElement,
      null
    ).getPropertyValue("background-color");

    const params: ContainerTransformParams = {
      srcElement,
      afterClone,
      srcElementBorderRadius: "2rem", // determine from css class
      srcElementBackgroundColor: srcBackgroundColor,
      duration: 280,
    };

    return params;
  }

  async function openModal() {
    if (editButton.value && modalTransformer.value) {
      const srcElement = editButton.value.getRootElement();
      if (srcElement) {
        const params = createContainerTransformParams(srcElement);
        await modalTransformer.value.open(params);
      }
    }
  }

  async function closeModal() {
    if (editButton.value && modalTransformer.value) {
      const srcElement = editButton.value.getRootElement();
      if (srcElement) {
        const params = createContainerTransformParams(srcElement);
        await modalTransformer.value.close(params);
        srcElement.style.opacity = "1";
      }
    }
  }

  async function open() {
    if (modalTransformer.value && props.wheel) {
      wheelJson = JSON.stringify(props.wheel);
      const copy = JSON.parse(wheelJson) as Wheel;
      wheelLocal.value = copy;
      wheelHasChanges.value = false;
      isCloseWarningOpened.value = false;
      await openModal();
    }
  }

  async function close() {
    await closeModal();
  }

  async function onUpdateClicked() {
    if (wheelLocal.value) {
      wheelLocal.value.choices = wheelLocal.value.choices.filter(
        (x) => x.name && x.name.trim() !== ""
      );
      userWheelsStore.updateWheel(wheelLocal.value.id, wheelLocal.value);
      await closeModal();
    }
  }

  function onIsOpenedChanged(value: boolean) {
    appStore.setIsWheelEditorOpened(value);
  }

  async function onWheelRemoved(_: Wheel, removedIndex: number) {
    if (userWheelsStore.getState().wheels[removedIndex]) {
      appStore.setCurrentWheelIndex(removedIndex);
    } else {
      appStore.setCurrentWheelIndex(removedIndex - 1);
    }

    if (wheelRemover.value) {
      wheelRemover.value.closeModal();
    }

    await closeModal();
  }

  function confirmRemoveWheel() {
    const wheelId = wheelLocal.value?.id;
    if (wheelId) {
      userWheelsStore.removeWheel(wheelId);
    }
  }

  function includeAll() {
    if (wheelLocal.value) {
      wheelLocal.value.choices.forEach((c) => (c.isIncluded = true));
    }
  }

  function onMinusOne() {
    if (wheelLocal.value) {
      if (typeof wheelLocal.value.repeat === "number") {
        if (wheelLocal.value.repeat <= 1) {
          return;
        }
        wheelLocal.value.repeat -= 1;
      }
    }
  }

  function onPlusOne() {
    if (wheelLocal.value) {
      if (typeof wheelLocal.value.repeat === "number") {
        if (wheelLocal.value.repeat >= MAX_SPLIT_AMT) {
          return;
        }
        wheelLocal.value.repeat += 1;
      }
    }
  }

  async function onModalBeforeOpen() {
    await nextTick();
    performStaggerAnimation();
  }

  const canAddChoice = computed(() => {
    if (wheelLocal.value) {
      return wheelLocal.value.choices.length < maxChoices;
    } else {
      return false;
    }
  });

  userWheelsStore.addRemoveCallback(onWheelRemoved);

  const isAnyChoiceExcluded = computed(() => {
    if (!wheelLocal.value) {
      return false;
    }
    return wheelLocal.value.choices.some((c) => !c.isIncluded);
  });

  async function onTextBubbleClicked(data: unknown) {
    if (typeof data === "string") {
      if (props.wheel?.id === data) {
        await open();
      }
    }
  }

  eventStore.subscribe("text-bubble-clicked", onTextBubbleClicked);

  function onWheelDataChange() {
    const copy = JSON.parse(JSON.stringify(wheelLocal.value)) as Wheel;
    copy.choices = copy.choices.filter((x) => x.name && x.name.trim() !== "");
    const wheelLocalJson = JSON.stringify(copy);
    wheelHasChanges.value = wheelLocalJson !== wheelJson;
  }

  const unwatchWheelLocal = watch(
    wheelLocal,
    debounce(onWheelDataChange, 300),
    { deep: true }
  );

  onUnmounted(() => {
    userWheelsStore.removeRemoveCallback(onWheelRemoved);
    eventStore.unsubscribe("text-bubble-clicked", onTextBubbleClicked);
    unwatchWheelLocal();
  });

  function onChoiceEditorMounted(context: OnMountedContext) {
    if (context.choice === newlyAddedChoice) {
      context.focusTextInput();
      newlyAddedChoice = null;
    }
  }

  async function onCloseClicked() {
    if (!wheelHasChanges.value) {
      await close();
    }

    isCloseWarningOpened.value = true;
  }

  function onClickOutsideOfCloseWarning() {
    isCloseWarningOpened.value = false;
  }

  defineExpose({
    open,
  });
</script>

<template>
  <IconButton
    ref="editButton"
    class="no-swiping h-16 w-16 bg-violet-red-500 hover:bg-violet-red-400"
    @click="open()"
  >
    <Icon icon="Pencil" class="h-8 w-8 text-white"></Icon>
  </IconButton>
  <Teleport to="body">
    <ModalTransformer
      ref="modalTransformer"
      class="flex h-full w-full flex-col"
      :options="{ bodyFlexGrow: true, bodyOverflowAuto: true }"
      @is-opened="onIsOpenedChanged($event)"
      @before-open="onModalBeforeOpen"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <div class="text-xl uppercase text-catalina-blue-200">Edit Wheel</div>
          <IconButton
            class="bg-violet-red-500 hover:bg-violet-red-400"
            @click="onCloseClicked()"
          >
            <Icon icon="cross" class="text-white"></Icon>
          </IconButton>
        </div>
      </template>
      <template #default>
        <div v-if="wheelLocal" ref="modalBody" class="space-y-5 p-3">
          <div class="space-y-1">
            <div class="stagger">
              <label
                class="text-sm font-semibold uppercase tracking-wider text-chetwode-blue-500"
                >Title</label
              >
            </div>
            <div class="stagger">
              <text-input
                v-model="wheelLocal.title"
                maxlength="35"
                :select-when-focus="true"
              >
                <template #trailing="{ hasValue, clearValue, isFocused }">
                  <button
                    v-show="hasValue && isFocused"
                    class="text-chetwode-blue-500 hover:text-chetwode-blue-300 focus:outline-none"
                    @click.prevent="clearValue()"
                    @mousedown.prevent
                  >
                    <Icon icon="Cross"></Icon>
                  </button>
                </template>
              </text-input>
            </div>
          </div>
          <div class="space-y-1">
            <div class="stagger">
              <label
                class="text-sm font-semibold uppercase tracking-wider text-chetwode-blue-500"
                >Choices</label
              >
            </div>
            <TransitionGroup name="flip-list" tag="ul" class="space-y-1">
              <li
                v-for="choice in wheelLocal.choices"
                :key="`${choice.id}`"
                class="stagger"
              >
                <ChoiceEditor
                  :choice="choice"
                  @remove-choice="removeChoice($event)"
                  @mounted="onChoiceEditorMounted"
                ></ChoiceEditor>
              </li>
            </TransitionGroup>
            <div class="stagger">
              <button
                v-show="canAddChoice"
                class="mx-auto flex items-center px-3 py-3 text-chetwode-blue-400 hover:text-chetwode-blue-300 focus:outline-none"
                @click="addNewChoice()"
              >
                <Icon icon="Plus" class="h-6 w-6"></Icon>
                <span class="ml-1 uppercase">Add New Choice</span>
              </button>
              <div
                v-show="!canAddChoice"
                class="p-3 text-center text-sm italic text-chetwode-blue-700"
              >
                Maximum {{ maxChoices }} choices!
              </div>
            </div>
          </div>
          <div class="space-y-1">
            <div class="stagger">
              <label
                class="text-sm font-semibold uppercase tracking-wider text-chetwode-blue-500"
                >More Options</label
              >
            </div>
            <div class="stagger space-y-3 rounded bg-catalina-blue-600 p-3">
              <div class="flex items-center justify-between">
                <label
                  class="inline-block text-sm font-semibold uppercase tracking-wider text-chetwode-blue-500"
                >
                  Hide Labels on Wheel
                </label>
                <ToggleIconButton
                  v-model="wheelLocal.hideLabelsOnWheel"
                  class="rounded-full border border-chetwode-blue-600 hover:bg-chetwode-blue-700 focus:outline-none"
                >
                  <template #default="{ isChecked }">
                    <Icon
                      v-show="isChecked"
                      icon="Check"
                      class="h-6 w-6 text-chetwode-blue-500"
                    ></Icon>
                    <div v-show="!isChecked" class="h-6 w-6"></div>
                  </template>
                </ToggleIconButton>
              </div>
              <div class="flex items-center justify-between">
                <label
                  class="inline-block text-sm font-semibold uppercase tracking-wider text-chetwode-blue-500"
                >
                  Split slice
                </label>
                <div class="flex items-center space-x-2">
                  <button
                    class="rounded-full border border-chetwode-blue-600 p-2 hover:bg-chetwode-blue-700 focus:outline-none"
                    @click="onMinusOne()"
                  >
                    <Icon
                      icon="ChevronLeft"
                      class="h-6 w-6 text-chetwode-blue-600"
                    ></Icon>
                  </button>
                  <input
                    v-model="wheelLocal.repeat"
                    type="text"
                    class="w-16 rounded border border-chetwode-blue-600 bg-transparent px-1 py-2 text-center text-white focus:outline-none"
                    readonly
                  />
                  <button
                    class="rounded-full border border-chetwode-blue-600 p-2 hover:bg-chetwode-blue-700 focus:outline-none"
                    @click="onPlusOne()"
                  >
                    <Icon
                      icon="ChevronRight"
                      class="h-6 w-6 text-chetwode-blue-600"
                    ></Icon>
                  </button>
                </div>
              </div>
              <div class="flex flex-wrap items-center justify-center gap-2">
                <RoundedButtonSmall
                  class="bg-chetwode-blue-700 hover:bg-chetwode-blue-600"
                  @click="shuffleChoices()"
                  >Shuffle Choices!</RoundedButtonSmall
                >
                <RoundedButtonSmall
                  v-if="isAnyChoiceExcluded"
                  class="bg-chetwode-blue-700 hover:bg-chetwode-blue-600"
                  @click="includeAll()"
                  >Include All</RoundedButtonSmall
                >
              </div>
            </div>
          </div>
          <div class="stagger">
            <WheelRemover
              ref="wheelRemover"
              :wheel-title="wheelLocal.title"
              @confirm-remove-wheel="confirmRemoveWheel()"
            ></WheelRemover>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="text-center">
          <rounded-button
            class="bg-violet-red-500 hover:bg-violet-red-400"
            @click="onUpdateClicked()"
          >
            {{ wheelHasChanges ? "Apply Changes" : "Close" }}
          </rounded-button>
        </div>
      </template>
      <template #overlay>
        <div
          v-click-outside="{
            isActive: isCloseWarningOpened,
            onClickedOutside: onClickOutsideOfCloseWarning,
          }"
          class="absolute inset-x-2 top-2 drop-shadow-lg"
        >
          <CloseWarning
            :is-opened="isCloseWarningOpened"
            @close="close()"
            @apply-changes="onUpdateClicked()"
          ></CloseWarning>
        </div>
      </template>
    </ModalTransformer>
  </Teleport>
</template>

<style>
  /* width */
  ::-webkit-scrollbar {
    width: 6px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #141d4d;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #7384d9;
    border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .flip-list-move {
    transition: transform 0.5s;
  }
</style>
