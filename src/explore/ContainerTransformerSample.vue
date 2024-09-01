<template>
  <div class="flex h-full w-full items-center justify-center">
    <container-transformer
      class="h-104 w-104"
      border-radius="0.5rem"
      background-color="#ffff00"
    >
      <div class="flex h-full w-full items-start justify-end">
        <IconButton class="bg-violet-red-500 hover:bg-violet-red-400">
          <cross class="text-white"></cross>
        </IconButton>
      </div>
    </container-transformer>
  </div>
</template>

<script setup lang="ts">
  import { IconButton } from "@/components/buttons";
  import ContainerTransformer from "@/components/ContainerTransformer.vue";
  import { Cross } from "@/components/icons";
</script>
