<template>
  <div class="flex items-center justify-center w-full h-full bg-white">
    <radial-progress-bar
      color="red"
      :duration="3500"
      :stroke-width="5"
      @animation-end="onProgressEnded"
    >
      <template #default="{ animate }">
        <div
          class="flex items-center justify-center w-full h-full"
          @click="animate()"
        >
          click me!
        </div>
      </template>
    </radial-progress-bar>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import RadialProgressBar from "@/components/RadialProgressBar.vue";
export default defineComponent({
  components: {
    RadialProgressBar
  },
  setup() {
    function onProgressEnded() {
      console.log("progress done");
    }
    return {
      onProgressEnded
    };
  }
});
</script>

<style>
#app {
  @apply w-full;
  @apply h-full;
}
</style>
