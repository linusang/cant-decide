<template>
  <div
    class="flex items-center w-full px-3 py-2 text-xl border rounded"
    :class="{
      'border-chetwode-blue-500 bg-chetwode-blue-700': isFocused,
      'border-chetwode-blue-700 bg-chetwode-blue-800': !isFocused
    }"
  >
    <slot name="leading"></slot>
    <div class="flex-grow">
      <input
        type="text"
        class="w-full text-white bg-transparent focus:outline-none"
        :class="textInputClass"
        @focus="focusInput"
        @blur="unfocusInput"
        @mousedown="onMouseDown"
        @mouseup="onMouseUp"
        v-model="localValue"
        ref="inputElement"
        v-bind:maxlength="maxlength"
      />
    </div>
    <slot
      name="trailing"
      :isFocused="isFocused"
      :clearValue="clearValue"
      :hasValue="hasValue"
    ></slot>
  </div>
</template>

<script lang="ts">
import { useModelWrapper } from "../composables/useModelWrapper";
import { defineComponent, ref,  computed } from "vue";

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      default: ""
    },
    textInputClass: {
      type: Object,
      default: null
    },
    maxlength: {
      type: String,
      default: null
    },
    selectWhenFocus: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const isFocused = ref<boolean>(false);    
    const localValue = useModelWrapper<string>(props, emit);
    const inputElement = ref<HTMLInputElement | undefined>(undefined);
    const hasValue = computed(() => !!localValue.value);
    let preventMouseUpDefault = false;

    function focusInput() {
      if (inputElement.value && !isFocused.value) {
        inputElement.value.focus();
        isFocused.value = true;

        if (props.selectWhenFocus) {
          inputElement.value.select();
        }
      }
    }

    function unfocusInput() {
      isFocused.value = false;
    }

    function clearValue() {
      localValue.value = "";
      focusInput();
    }

    function onMouseDown() {
      if (props.selectWhenFocus) {
        preventMouseUpDefault = isFocused.value ? false : true;
      }
    }

    function onMouseUp(event: MouseEvent) {
      if (props.selectWhenFocus && preventMouseUpDefault) {
        event.preventDefault();
      }
    }

    return {
      isFocused,
      localValue,
      focusInput,
      unfocusInput,
      inputElement,
      clearValue,
      hasValue,
      onMouseUp,
      onMouseDown
    };
  }
});
</script>

<style lang="scss" scoped>
::selection {
  @apply bg-violet-red-400;
}
::-moz-selection {
  @apply bg-violet-red-500;
}
</style>
