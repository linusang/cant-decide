<script setup lang="ts">
  import { ref } from "vue";

  import { RoundedButton } from "./buttons";
  import Icon from "./icons/Icon.vue";
  import Modal from "./Modal.vue";

  withDefaults(
    defineProps<{
      wheelTitle?: string;
    }>(),
    {
      wheelTitle: "",
    }
  );

  const emit = defineEmits<{
    "confirm-remove-wheel": [];
  }>();

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

  defineExpose({
    closeModal,
  });
</script>

<template>
  <div>
    <button
      class="mx-auto flex items-center px-3 py-3 text-red-600 hover:text-red-500 focus:outline-none"
      @click="removeWheel()"
    >
      <Icon icon="Trash" class="h-6 w-6"></Icon>
      <span class="ml-1 uppercase">Remove Wheel</span>
    </button>
    <teleport to="body">
      <Modal ref="removeWheelModal" class="sm:w-112">
        <template #default>
          <div class="p-8 text-center text-3xl text-white">
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
      </Modal>
    </teleport>
  </div>
</template>
