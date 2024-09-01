<template>
  <div class="rounded shadow-lg bg-catalina-blue-600">
    <text-input
      v-model="choiceLocal.name"
      :text-input-class="{
        'line-through': !choiceLocal.isIncluded,
        'choice-name-text-input': true,
      }"
      maxlength="30"
      :selectWhenFocus="true"
      ref="textInputComponent"
    >
      <template #trailing="{ hasValue, clearValue, isFocused }">
        <div class="flex space-x-2">
          <button
            class="focus:outline-none text-chetwode-blue-500 hover:text-chetwode-blue-300"
            @click.prevent="clearValue()"
            @mousedown.prevent
            v-show="hasValue && isFocused"
          >
            <Icon icon="Cross"></Icon>
          </button>
          <toggle-icon-button
            class="text-chetwode-blue-500 hover:text-chetwode-blue-300"
            ref="contextButtonElement"
            @mousedown.prevent
            v-model="isContextMenuOpened"
          >
            <template #default="{isChecked}">
              <Icon
                icon="ChevronDown"
                v-show="!isChecked"
                class="w-6 h-6 "
              ></Icon>
              <Icon icon="ChevronUp" v-show="isChecked" class="w-6 h-6"></Icon>
            </template>
          </toggle-icon-button>
        </div>
      </template>
    </text-input>

    <transition-expand>
      <div v-show="isContextMenuOpened">
        <div class="p-3 space-y-2">
          <div class="flex items-center justify-between">
            <label
              class="inline-block text-sm font-semibold tracking-wider uppercase text-chetwode-blue-500"
              >Weightage</label
            >
            <div class="flex items-center space-x-2">
              <button
                class="hidden p-2 border rounded-full border-chetwode-blue-600 focus:outline-none hover:bg-chetwode-blue-700 md:inline-block"
                @click="onMinusOne()"
              >
                <Icon
                  icon="ChevronDoubleLeft"
                  class="w-6 h-6 text-chetwode-blue-600"
                ></Icon>
              </button>
              <button
                class="p-2 border rounded-full border-chetwode-blue-600 focus:outline-none hover:bg-chetwode-blue-700"
                @click="onMinusPointOne()"
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
                v-model="choiceLocal.weightage"
              />
              <button
                class="p-2 border rounded-full border-chetwode-blue-600 focus:outline-none hover:bg-chetwode-blue-700"
                @click="onAddPointOne()"
              >
                <Icon
                  icon="ChevronRight"
                  class="w-6 h-6 text-chetwode-blue-600"
                ></Icon>
              </button>
              <button
                class="hidden p-2 border rounded-full border-chetwode-blue-600 focus:outline-none hover:bg-chetwode-blue-700 md:inline-block"
                @click="onAddOne()"
              >
                <Icon
                  icon="ChevronDoubleRight"
                  class="w-6 h-6 text-chetwode-blue-600"
                ></Icon>
              </button>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <label
              class="inline-block text-sm font-semibold tracking-wider uppercase text-chetwode-blue-500"
              >Include</label
            >
            <toggle-icon-button
              class="border rounded-full focus:outline-none border-chetwode-blue-600 hover:bg-chetwode-blue-700"
              ref="contextButtonElement"
              v-model="choiceLocal.isIncluded"
            >
              <template #default="{isChecked}">
                <Icon
                  icon="Check"
                  v-show="isChecked"
                  class="w-6 h-6 text-chetwode-blue-500"
                ></Icon>
                <div v-show="!isChecked" class="w-6 h-6"></div>
              </template>
            </toggle-icon-button>
          </div>
          <button
            class="flex items-center justify-center block w-full py-3 uppercase text-chetwode-blue-400 focus:outline-none hover:text-chetwode-blue-300"
            @click="removeChoice()"
          >
            <div class="flex items-center">
              <Icon icon="trash" class="inline-block w-5 h-5"></Icon>
              <span class="ml-1">Remove Choice</span>
            </div>
          </button>
        </div>
      </div>
    </transition-expand>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  reactive,
  ref,
  onMounted,
  toRaw,
} from "vue";
import Choice from "@/models/Choice";
import { accurateCalc } from "@/share/utils/wheelUtils";
import { ToggleIconButton, RoundedButton } from "./buttons";
import Icon from "./icons/Icon.vue";
import TextInput from "./TextInput.vue";
import Modal from "./Modal.vue";
import TransitionExpand from "./TransitionExpand.vue";
import { OnMountedContext } from "./ChoiceEditorApi";

export default defineComponent({
  components: {
    TextInput,
    ToggleIconButton,
    Modal,
    RoundedButton,
    TransitionExpand,
    Icon,
  },
  props: {
    choice: {
      type: Object as PropType<Choice>,
      required: true,
    },
  },
  emits: ["remove-choice", "mounted"],
  setup(props, { emit }) {
    const contextButtonElement = ref<HTMLElement>();
    const isContextMenuOpened = ref<boolean>(false);
    const choiceLocal = reactive(props.choice);
    const textInputComponent = ref<InstanceType<typeof TextInput>>();

    function removeChoice() {
      emit("remove-choice", props.choice);
    }

    function onAddOne() {
      choiceLocal.weightage = accurateCalc(choiceLocal.weightage, "+", 1);
    }
    function onMinusOne() {
      const result = accurateCalc(choiceLocal.weightage, "-", 1);
      if (result >= 0.1) {
        choiceLocal.weightage = result;
      }
    }
    function onAddPointOne() {
      choiceLocal.weightage = accurateCalc(choiceLocal.weightage, "+", 0.1);
    }
    function onMinusPointOne() {
      const result = accurateCalc(choiceLocal.weightage, "-", 0.1);
      if (result >= 0.1) {
        choiceLocal.weightage = result;
      }
    }

    function focusTextInput() {
      if (textInputComponent.value) {
        textInputComponent.value.focusInput();
      }
    }

    onMounted(() => {
      const context: OnMountedContext = {
        choice: toRaw(props.choice),
        focusTextInput,
      };
      emit("mounted", context);
    });

    return {
      choiceLocal,
      contextButtonElement,
      isContextMenuOpened,
      removeChoice,
      onAddOne,
      onMinusOne,
      onAddPointOne,
      onMinusPointOne,
      focusTextInput,
      textInputComponent,
    };
  },
});
</script>
