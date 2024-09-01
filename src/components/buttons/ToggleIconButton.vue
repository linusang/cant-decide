<script setup lang="ts">
  import { ref, watch } from "vue";

  const props = withDefaults(
    defineProps<{
      modelValue?: boolean;
    }>(),
    {
      modelValue: false,
    }
  );

  const emit = defineEmits(["update:modelValue"]);

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
</script>

<template>
  <button
    class="flex items-center justify-center rounded-full p-2 focus:outline-none"
    @click="toggle()"
  >
    <slot :is-checked="isChecked"></slot>
  </button>
</template>
