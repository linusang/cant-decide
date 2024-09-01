<template>
  <div class="flex items-center justify-center w-full h-full">
    <container-transformer
      class="h-104 w-104"
      borderRadius="0.5rem"
      backgroundColor="#ffff00"
    >
      <div class="flex items-start justify-end w-full h-full">
        <icon-button class="bg-violet-red-500 hover:bg-violet-red-400">
          <cross class="text-white"></cross>
        </icon-button>
      </div>
    </container-transformer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ContainerTransformer from "@/components/ContainerTransformer.vue";
import { IconButton } from "@/components/buttons";
import { Cross } from "@/components/icons";
export default defineComponent({
  components: {
    ContainerTransformer,
    IconButton,
    Cross
  }
});
</script>
