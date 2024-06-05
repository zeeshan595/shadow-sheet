<script setup lang="ts">
import { computed } from "vue";
import TextField from "./text-field.vue";
import { statToModifier, stringToNum } from "@/service/helpers";
import { rollDice } from "@/service/diceBox";

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
function rollWithModifier() {
  rollDice({
    dice: "1d20",
    modifier: stringToNum(modifier.value),
  });
}
function rollTwiceWithModifier(e: MouseEvent) {
  e.preventDefault();
  rollDice({
    dice: "2d20",
    modifier: stringToNum(modifier.value),
  });
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
    <span
      class="stat-modifier pointer"
      @click="rollWithModifier"
      @contextmenu="rollTwiceWithModifier"
    >
      {{ modifier }}
    </span>
  </div>
</template>

<style scoped>
.stat-modifier {
  font-size: 34px;
}
</style>
