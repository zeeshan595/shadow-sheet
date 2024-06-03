<script setup lang="ts">
import { computed } from "vue";
import TextField from "./text-field.vue";
import { stringToNum } from "@/service/helpers";

const props = defineProps<{
  label: string;
  modelValue: string;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const valueNum = computed(() => stringToNum(props.modelValue));
</script>

<template>
  <div class="align-center flex-shrink flex-basis-0 gap10">
    <TextField
      stat
      spaceBetween
      :label="props.label"
      v-model="props.modelValue"
    />
    <span class="stat-modifier">{{ Math.floor(valueNum / 2) - 5 }}</span>
  </div>
</template>

<style>
.stat-modifier {
  font-size: 34px;
}
</style>
