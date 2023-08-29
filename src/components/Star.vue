<script setup lang="ts">

const props = defineProps(["full", "size"]);

</script>

<template>
  <img src="../assets/star-full.svg"
       v-bind:width="parseInt(props.size)"
       v-bind:height="parseInt(props.size)"
       v-if="props.full" alt=""/>
  <img src="../assets/star-empty.svg"
       v-bind:width="parseInt(props.size)"
       v-bind:height="parseInt(props.size)"
       v-else alt=""/>
</template>

<style scoped>

</style>
