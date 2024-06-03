<script setup lang="ts">
import { backgroundPaper, boxShadow, textSecondary } from "@/theme";

const emits = defineEmits<{
  (e: "click"): void;
}>();
</script>

<template>
  <button @click="() => emits('click')">
    <slot></slot>
  </button>
</template>

<style scoped>
button {
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 7px;
  outline: 0;
  border: 0;
  background: v-bind(backgroundPaper);
  box-shadow: v-bind(boxShadow);
  color: v-bind(textSecondary);
  text-transform: uppercase;
  font-weight: bold;
  font-size: 14px;
  transition: 0.3s;
}
</style>
