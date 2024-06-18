<script setup lang="ts">
import { computed } from "vue";
import TextField from "./text-field.vue";
import { statToModifier, stringToNum } from "@/service/helpers";
import { rollDice } from "@/service/diceBox";

const props = defineProps<{
  small?: boolean;
  modifier?: boolean;
  label?: string;
  subLabel?: string;
  modelValue: string;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const modifier = computed(() => statToModifier(props.modelValue));

function increaseValue() {
  emits("update:modelValue", `${stringToNum(props.modelValue) + 1}`);
}
function decreaseValue() {
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
  <div class="align-center flex-basis-0 gap10">
    <span v-if="props.label" class="uppercase font-small bold">{{
      props.label
    }}</span>
    <span v-if="props.subLabel" class="uppercase font-small bold primary-main">
      {{ props.subLabel }}
    </span>
    <div class="flex-row flex-basis-0">
      <button
        @click="decreaseValue"
        class="left bg-paper shadow text-primary pointer"
      >
        <div class="absolute">
          <span class="icon relative material-symbols-outlined"> remove </span>
        </div>
      </button>
      <TextField
        stat
        :small="props.small"
        spaceBetween
        :modelValue="props.modelValue"
        @update:modelValue="(v) => emits('update:modelValue', v)"
      />
      <button
        @click="increaseValue"
        class="right bg-paper shadow text-primary pointer"
      >
        <div class="absolute">
          <span class="icon relative material-symbols-outlined"> add </span>
        </div>
      </button>
    </div>
    <div class="tooltip">
      <span
        v-if="props.modifier"
        class="stat-modifier pointer"
        @click="rollWithModifier"
        @contextmenu="rollTwiceWithModifier"
      >
        {{ modifier }}
      </span>
      <span class="tooltiptext">Roll for {{ props.label }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stat-modifier {
  font-size: 34px;
  padding-right: 20px;
  padding-left: 20px;
}
button {
  position: relative;
  z-index: 0;
  width: 10px;
  padding: 10px;
  outline: 0;
  border: 0;
  z-index: 10;

  .icon {
    left: -12px;
    top: -10px;
  }
  &.left {
    border-top-left-radius: 7px;
    border-bottom-left-radius: 7px;
    left: 7px;
  }
  &.right {
    border-top-right-radius: 7px;
    border-bottom-right-radius: 7px;
    right: 7px;
  }
}
</style>
