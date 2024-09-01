<template>
  <IconButton
    class="w-16 h-16 bg-violet-red-500 hover:bg-violet-red-400 no-swiping"
    @click="open()"
    ref="editButton"
  >
    <Icon icon="Pencil" class="w-8 h-8 text-white"></Icon>
  </IconButton>
  <teleport to="body">
    <ModalTransformer
      ref="modalTransformer"
      class="flex flex-col w-full h-full sm:w-120"
      :options="{ bodyFlexGrow: true, bodyOverflowAuto: true }"
      @is-opened="onIsOpenedChanged($event)"
      @before-open="onModalBeforeOpen"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <div class="text-xl uppercase text-catalina-blue-200">
            Edit Wheel
          </div>
          <icon-button
            class="bg-violet-red-500 hover:bg-violet-red-400"
            @click="onCloseClicked()"
          >
            <Icon icon="cross" class="text-white"></Icon>
          </icon-button>
        </div>
      </template>
      <template #default>
        <div class="p-3 space-y-5" ref="modalBody" v-if="wheelLocal">
          <div class="space-y-1">
            <div class="stagger">
              <label
                class="text-sm font-semibold tracking-wider uppercase text-chetwode-blue-500"
                >Title</label
              >
            </div>
            <div class="stagger">
              <text-input
                v-model="wheelLocal.title"
                maxlength="35"
                :selectWhenFocus="true"
              >
                <template #trailing="{ hasValue, clearValue, isFocused }">
                  <button
                    class="focus:outline-none text-chetwode-blue-500 hover:text-chetwode-blue-300"
                    @click.prevent="clearValue()"
                    @mousedown.prevent
                    v-show="hasValue && isFocused"
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
                class="text-sm font-semibold tracking-wider uppercase text-chetwode-blue-500"
                >Choices</label
              >
            </div>
            <transition-group name="flip-list" tag="ul" class="space-y-1">
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
            </transition-group>
            <div class="stagger">
              <button
                class="flex items-center px-3 py-3 mx-auto text-chetwode-blue-400 hover:text-chetwode-blue-300 focus:outline-none"
                @click="addNewChoice()"
                v-show="canAddChoice"
              >
                <Icon icon="Plus" class="w-6 h-6"></Icon>
                <span class="ml-1 uppercase">Add New Choice</span>
              </button>
              <div
                v-show="!canAddChoice"
                class="p-3 text-sm italic text-center text-chetwode-blue-700"
              >
                Maximum {{ maxChoices }} choices!
              </div>
            </div>
          </div>
          <div class="space-y-1">
            <div class="stagger">
              <label
                class="text-sm font-semibold tracking-wider uppercase text-chetwode-blue-500"
                >More Options</label
              >
            </div>
            <div class="p-3 space-y-3 rounded bg-catalina-blue-600 stagger">
              <div class="flex items-center justify-between">
                <label
                  class="inline-block text-sm font-semibold tracking-wider uppercase text-chetwode-blue-500"
                >
                  Hide Labels on Wheel
                </label>
                <ToggleIconButton
                  class="border rounded-full focus:outline-none border-chetwode-blue-600 hover:bg-chetwode-blue-700"
                  v-model="wheelLocal.hideLabelsOnWheel"
                >
                  <template #default="{isChecked}">
                    <Icon
                      icon="Check"
                      v-show="isChecked"
                      class="w-6 h-6 text-chetwode-blue-500"
                    ></Icon>
                    <div v-show="!isChecked" class="w-6 h-6"></div>
                  </template>
                </ToggleIconButton>
              </div>
              <div class="flex items-center justify-between">
                <label
                  class="inline-block text-sm font-semibold tracking-wider uppercase text-chetwode-blue-500"
                >
                  Split slice
                </label>
                <div class="flex items-center space-x-2">
                  <button
                    class="p-2 border rounded-full border-chetwode-blue-600 focus:outline-none hover:bg-chetwode-blue-700"
                    @click="onMinusOne()"
                  >
                    <Icon
                      icon="ChevronLeft"
                      class="w-6 h-6 text-chetwode-blue-600"
                    ></Icon>
                  </button>
                  <input
                    type="text"
                    class="w-16 px-1 py-2 text-center text-white bg-transparent border rounded border-chetwode-blue-600 focus:outline-none"
                    readonly
                    v-model="wheelLocal.repeat"
                  />
                  <button
                    class="p-2 border rounded-full border-chetwode-blue-600 focus:outline-none hover:bg-chetwode-blue-700"
                    @click="onPlusOne()"
                  >
                    <Icon
                      icon="ChevronRight"
                      class="w-6 h-6 text-chetwode-blue-600"
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
              :wheelTitle="wheelLocal.title"
              @confirm-remove-wheel="confirmRemoveWheel()"
              ref="wheelRemover"
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
          class="absolute inset-x-2 top-2 drop-shadow-lg"
          v-click-outside="{
            isActive: isCloseWarningOpened,
            onClickedOutside: onClickOutsideOfCloseWarning,
          }"
        >
          <CloseWarning
            :is-opened="isCloseWarningOpened"
            @close="close()"
            @apply-changes="onUpdateClicked()"
          ></CloseWarning>
        </div>
      </template>
    </ModalTransformer>
  </teleport>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  ref,
  nextTick,
  onUnmounted,
  PropType,
  watch,
} from "vue";
import Choice from "@/models/Choice";
import Wheel from "@/models/Wheel";
import AppStore, { APP_STORE } from "@/share/AppStore";
import EventStore, { EVENT_STORE } from "@/share/EventStore";
import UserWheelsStore, { USER_WHEELS_STORE } from "@/share/UserWheelsStore";
import {
  IconButton,
  RoundedButton,
  ToggleIconButton,
  RoundedButtonSmall,
} from "./buttons";
import ChoiceEditor from "./ChoiceEditor.vue";
import ModalTransformer from "./ModalTransformer.vue";
import TextInput from "./TextInput.vue";
import { shuffle } from "@/share/utils/wheelUtils";
import { createEmptyNewChoice } from "@/share/factory";
import WheelRemover from "./WheelRemover.vue";
import anime from "animejs";
import { ContainerTransformParams } from "@/plugins/containerTransform";
import { EventName } from "./WheelController.vue";
import Icon from "./icons/Icon.vue";
import { WheelEditorApi } from "./WheelEditorApi";
import { OnMountedContext } from "./ChoiceEditorApi";
import { debounce } from "@/share/utils/domUtils";
import CloseWarning from "./CloseWarning.vue";

export default defineComponent({
  components: {
    WheelRemover,
    IconButton,
    ModalTransformer,
    RoundedButton,
    TextInput,
    ChoiceEditor,
    ToggleIconButton,
    RoundedButtonSmall,
    Icon,
    CloseWarning,
  },
  props: {
    wheel: {
      type: Object as PropType<Wheel | null>,
      default: null,
    },
  },
  setup(props) {
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

    const exposedApi: WheelEditorApi = {
      open,
    };

    return {
      wheelLocal,
      modalTransformer,
      wheelRemover,
      canAddChoice,
      maxChoices,
      isAnyChoiceExcluded,
      modalBody,
      editButton,
      wheelHasChanges,
      isCloseWarningOpened,
      ...exposedApi,
      shuffleChoices,
      addNewChoice,
      removeChoice,
      close,
      onUpdateClicked,
      onIsOpenedChanged,
      confirmRemoveWheel,
      includeAll,
      onModalBeforeOpen,
      onMinusOne,
      onPlusOne,
      onChoiceEditorMounted,
      onCloseClicked,
      onClickOutsideOfCloseWarning,
    };
  },
});
</script>

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
