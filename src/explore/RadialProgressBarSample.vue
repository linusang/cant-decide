<template>
  <div class="flex h-full w-full items-center justify-center bg-white">
    <RadialProgressBar
      color="red"
      :duration="3500"
      :stroke-width="5"
      @animation-end="onProgressEnded"
    >
      <template #default="{ animate }">
        <div
          class="flex h-full w-full items-center justify-center"
          @click="animate()"
        >
          click me!
        </div>
      </template>
    </RadialProgressBar>
  </div>
</template>

<script setup lang="ts">
  import RadialProgressBar from "@/components/RadialProgressBar.vue";

  function onProgressEnded() {
    console.log("progress done");
  }
</script>

<style>
  #app {
    @apply w-full;
    @apply h-full;
  }
</style>
