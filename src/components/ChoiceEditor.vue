<script setup lang="ts">
  import { onMounted, reactive, ref, toRaw } from "vue";

  import type Choice from "@/models/Choice";
  import { accurateCalc } from "@/share/utils/wheelUtils";

  import { ToggleIconButton } from "./buttons";
  import type { OnMountedContext } from "./ChoiceEditorApi";
  import Icon from "./icons/Icon.vue";
  import TextInput from "./TextInput.vue";
  import TransitionExpand from "./TransitionExpand.vue";

  const props = defineProps<{
    choice: Choice;
  }>();

  const emit = defineEmits<{
    "remove-choice": [Choice];
    mounted: [OnMountedContext];
  }>();

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
</script>

<template>
  <div class="rounded bg-catalina-blue-600 shadow-lg">
    <TextInput
      ref="textInputComponent"
      v-model="choiceLocal.name"
      :text-input-class="{
        'line-through': !choiceLocal.isIncluded,
        'choice-name-text-input': true,
      }"
      maxlength="30"
      :select-when-focus="true"
    >
      <template #trailing="{ hasValue, clearValue, isFocused }">
        <div class="flex space-x-2">
          <button
            v-show="hasValue && isFocused"
            class="text-chetwode-blue-500 hover:text-chetwode-blue-300 focus:outline-none"
            @click.prevent="clearValue()"
            @mousedown.prevent
          >
            <Icon icon="Cross"></Icon>
          </button>
          <ToggleIconButton
            ref="contextButtonElement"
            v-model="isContextMenuOpened"
            class="text-chetwode-blue-500 hover:text-chetwode-blue-300"
            @mousedown.prevent
          >
            <template #default="{ isChecked }">
              <Icon
                v-show="!isChecked"
                icon="ChevronDown"
                class="h-6 w-6"
              ></Icon>
              <Icon v-show="isChecked" icon="ChevronUp" class="h-6 w-6"></Icon>
            </template>
          </ToggleIconButton>
        </div>
      </template>
    </TextInput>

    <transition-expand>
      <div v-show="isContextMenuOpened">
        <div class="space-y-2 p-3">
          <div class="flex items-center justify-between">
            <label
              class="inline-block text-sm font-semibold uppercase tracking-wider text-chetwode-blue-500"
              >Weightage</label
            >
            <div class="flex items-center space-x-2">
              <button
                class="hidden rounded-full border border-chetwode-blue-600 p-2 hover:bg-chetwode-blue-700 focus:outline-none md:inline-block"
                @click="onMinusOne()"
              >
                <Icon
                  icon="ChevronDoubleLeft"
                  class="h-6 w-6 text-chetwode-blue-600"
                ></Icon>
              </button>
              <button
                class="rounded-full border border-chetwode-blue-600 p-2 hover:bg-chetwode-blue-700 focus:outline-none"
                @click="onMinusPointOne()"
              >
                <Icon
                  icon="ChevronLeft"
                  class="h-6 w-6 text-chetwode-blue-600"
                ></Icon>
              </button>
              <input
                v-model="choiceLocal.weightage"
                type="text"
                class="w-16 rounded border border-chetwode-blue-600 bg-transparent px-1 py-2 text-center text-white focus:outline-none"
                readonly
              />
              <button
                class="rounded-full border border-chetwode-blue-600 p-2 hover:bg-chetwode-blue-700 focus:outline-none"
                @click="onAddPointOne()"
              >
                <Icon
                  icon="ChevronRight"
                  class="h-6 w-6 text-chetwode-blue-600"
                ></Icon>
              </button>
              <button
                class="hidden rounded-full border border-chetwode-blue-600 p-2 hover:bg-chetwode-blue-700 focus:outline-none md:inline-block"
                @click="onAddOne()"
              >
                <Icon
                  icon="ChevronDoubleRight"
                  class="h-6 w-6 text-chetwode-blue-600"
                ></Icon>
              </button>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <label
              class="inline-block text-sm font-semibold uppercase tracking-wider text-chetwode-blue-500"
              >Include</label
            >
            <ToggleIconButton
              ref="contextButtonElement"
              v-model="choiceLocal.isIncluded"
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
          <button
            class="flex w-full items-center justify-center py-3 uppercase text-chetwode-blue-400 hover:text-chetwode-blue-300 focus:outline-none"
            @click="removeChoice()"
          >
            <div class="flex items-center">
              <Icon icon="trash" class="inline-block h-5 w-5"></Icon>
              <span class="ml-1">Remove Choice</span>
            </div>
          </button>
        </div>
      </div>
    </transition-expand>
  </div>
</template>
