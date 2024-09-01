<template>
  <button
    @click="toggle()"
    class="flex items-center justify-center p-2 rounded-full focus:outline-none"
  >
    <slot :isChecked="isChecked"></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const isChecked = ref<boolean>(props.modelValue);
    function toggle() {
      isChecked.value = !isChecked.value;
    }

    watch(isChecked, (newValue: boolean, oldValue: boolean) => {
      emit("update:modelValue", newValue, oldValue);
    });

    watch(
      () => props.modelValue,
      (newValue: boolean) => {
        isChecked.value = newValue;
      }
    );

    return {
      isChecked,
      toggle
    };
  }
});
</script>
