<template>
  <transition name="fade">
    <div
      class="border rounded border-chetwode-blue-500 bg-chetwode-blue-700"
      v-if="isOpened"
    >
      <div class="p-4 space-y-3">
        <div class="text-white text-xl text-center ">
          We noticed you made some changes...
        </div>
        <div class="text-center flex flex-wrap gap-2 justify-center">
          <RoundedButton
            class="text-white bg-transparent border hover:bg-chetwode-blue-600 border-chetwode-blue-600"
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
  </transition>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import RoundedButton from "./buttons/RoundedButton.vue";
import MenuPopper from "./MenuPopper.vue";

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
