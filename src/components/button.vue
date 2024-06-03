<script setup lang="ts">
const emits = defineEmits<{
  (e: "click"): void;
}>();
</script>

<template>
  <button class="rounded text-primary bg-paper" @click="() => emits('click')">
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
button {
  cursor: pointer;
  padding: 10px 15px;
  outline: 0;
  border: 0;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 14px;
  transition: 0.3s;
}
</style>
