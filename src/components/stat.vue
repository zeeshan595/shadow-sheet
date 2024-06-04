<script setup lang="ts">
import { computed } from "vue";
import TextField from "./text-field.vue";
import { statToModifier, stringToNum } from "@/service/helpers";

const props = defineProps<{
  label: string;
  modelValue: string;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const modifier = computed(() => statToModifier(props.modelValue));

function click() {
  emits("update:modelValue", `${stringToNum(props.modelValue) + 1}`);
}
function rightClick() {
  emits("update:modelValue", `${stringToNum(props.modelValue) - 1}`);
}
</script>

<template>
  <div class="align-center flex-shrink flex-basis-0 gap10">
    <TextField
      stat
      small
      readonly
      clickable
      spaceBetween
      :label="props.label"
      :modelValue="props.modelValue"
      @update:modelValue="(v) => emits('update:modelValue', v)"
      @click="click"
      @right-click="rightClick"
    />
    <span class="stat-modifier">{{ modifier }}</span>
  </div>
</template>

<style scoped>
.stat-modifier {
  font-size: 34px;
}
</style>
