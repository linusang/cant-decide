<template>
    <component :is="icon"></component>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as allIcons from "./index";
export default defineComponent({
    components: {
        ...allIcons
    },
    props: {
        icon: {
            type: String,
            required: true
        }
    }
});
</script>