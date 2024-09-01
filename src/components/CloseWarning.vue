<script setup lang="ts">
  import { ref } from "vue";

  import RoundedButton from "./buttons/RoundedButton.vue";
  import type MenuPopper from "./MenuPopper.vue";

  interface Props {
    isOpened: boolean;
  }

  defineProps<Props>();
  const emit = defineEmits(["close", "apply-changes"]);

  const menuPopper = ref<InstanceType<typeof MenuPopper>>();

  function onCloseClicked() {
    if (menuPopper.value) {
      menuPopper.value.close();
    }
    emit("close");
  }

  function onApplyChanges() {
    emit("apply-changes");
  }
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isOpened"
      class="rounded border border-chetwode-blue-500 bg-chetwode-blue-700"
    >
      <div class="space-y-3 p-4">
        <div class="text-center text-xl text-white">
          We noticed you made some changes...
        </div>
        <div class="flex flex-wrap justify-center gap-2 text-center">
          <RoundedButton
            class="border border-chetwode-blue-600 bg-transparent text-white hover:bg-chetwode-blue-600"
            @click="onCloseClicked()"
          >
            Just Close
          </RoundedButton>
          <RoundedButton
            class="bg-violet-red-500 hover:bg-violet-red-400"
            @click="onApplyChanges()"
            >Apply Changes</RoundedButton
          >
        </div>
      </div>
    </div>
  </Transition>
</template>
