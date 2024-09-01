<template>
  <div>
    <button
      class="flex items-center px-3 py-3 mx-auto text-red-600 hover:text-red-500 focus:outline-none"
      @click="removeWheel()"
    >
      <Icon icon="Trash" class="w-6 h-6"></Icon>
      <span class="ml-1 uppercase">Remove Wheel</span>
    </button>
    <teleport to="body">
      <modal ref="removeWheelModal" class="sm:w-112">
        <template #default>
          <div class="p-8 text-3xl text-center text-white">
            Are you sure you want to remove "{{ wheelTitle }}"?
          </div>
        </template>
        <template #footer="{ close }">
          <div class="flex justify-center">
            <div class="space-x-4">
              <rounded-button
                class="border border-catalina-blue-400 hover:bg-catalina-blue-400"
                @click="close()"
                >Nah</rounded-button
              >
              <rounded-button
                id="remove-wheel-btn"
                type="button"
                class="bg-red-700 hover:bg-red-500"
                @click="confirmRemoveWheel()"
                >Yes, Remove</rounded-button
              >
            </div>
          </div>
        </template>
      </modal>
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Modal from "./Modal.vue";
import Icon from "./icons/Icon.vue";
import { RoundedButton } from "./buttons";
import { WheelRemoverApi } from "./WheelRemoverApi";

export default defineComponent({
  components: {
    Modal,
    Icon,
    RoundedButton,
  },
  props: {
    wheelTitle: {
      type: String,
      default: "",
    },
  },
  emits: ["confirm-remove-wheel"],
  setup(props, { emit }) {
    const removeWheelModal = ref<InstanceType<typeof Modal> | undefined>();
    function removeWheel() {
      if (removeWheelModal.value) {
        removeWheelModal.value.open();
      }
    }

    function confirmRemoveWheel() {
      emit("confirm-remove-wheel");
    }

    function closeModal() {
      if (removeWheelModal.value) {
        removeWheelModal.value.close();
      }
    }

    const exposedApi: WheelRemoverApi = {
      closeModal,
    };

    return {
      removeWheelModal,
      removeWheel,
      confirmRemoveWheel,
      ...exposedApi,
    };
  },
});
</script>
