<script setup lang="ts">
  import { computed, ref } from "vue";

  import { useModelWrapper } from "../composables/useModelWrapper";

  const props = withDefaults(
    defineProps<{
      modelValue?: string;
      textInputClass?: Record<string, boolean> | null;
      maxlength?: string | number | undefined;
      selectWhenFocus?: boolean;
    }>(),
    {
      modelValue: "",
      textInputClass: null,
      maxlength: undefined,
      selectWhenFocus: false,
    }
  );

  const emit = defineEmits<{
    "update:modelValue": [string];
  }>();

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

  defineExpose({
    focusInput,
    unfocusInput,
    clearValue,
    onMouseDown,
    onMouseUp,
  });
</script>

<template>
  <div
    class="flex w-full items-center rounded border px-3 py-2 text-xl"
    :class="{
      'border-chetwode-blue-500 bg-chetwode-blue-700': isFocused,
      'border-chetwode-blue-700 bg-chetwode-blue-800': !isFocused,
    }"
  >
    <slot name="leading"></slot>
    <div class="flex-grow">
      <input
        ref="inputElement"
        v-model="localValue"
        type="text"
        class="w-full bg-transparent text-white focus:outline-none"
        :class="textInputClass"
        :maxlength="maxlength"
        @focus="focusInput"
        @blur="unfocusInput"
        @mousedown="onMouseDown"
        @mouseup="onMouseUp"
      />
    </div>
    <slot
      name="trailing"
      :is-focused="isFocused"
      :clear-value="clearValue"
      :has-value="hasValue"
    ></slot>
  </div>
</template>

<style lang="scss" scoped>
  ::selection {
    @apply bg-violet-red-400;
  }
  ::-moz-selection {
    @apply bg-violet-red-500;
  }
</style>
