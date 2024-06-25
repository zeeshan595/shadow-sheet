<script setup lang="ts">
import { computed } from "vue";
import TextField from "./text-field.vue";
import { statToModifier, stringToNum } from "@/service/helpers";
import {
  diceToRoll,
  rollAdvantage,
  rollModifiers,
  showDiceRoller,
} from "@/service/diceBox";

const props = defineProps<{
  small?: boolean;
  modifier?: boolean;
  label?: string;
  subLabel?: string;
  isLabelClickable?: boolean;
  modelValue: string;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "label:click"): void;
}>();

const modifier = computed(() => statToModifier(props.modelValue));

function increaseValue() {
  emits("update:modelValue", `${stringToNum(props.modelValue) + 1}`);
}
function decreaseValue() {
  emits("update:modelValue", `${stringToNum(props.modelValue) - 1}`);
}
function rollWithModifier() {
  diceToRoll.value = ["d20"];
  rollModifiers.value = stringToNum(modifier.value).toString();
  rollAdvantage.value = 0;
  showDiceRoller.value = true;
}
</script>

<template>
  <div class="align-center flex-basis-0">
    <span
      @click="() => emits('label:click')"
      v-if="props.label"
      class="uppercase font-small bold"
      :class="{ clickable: props.isLabelClickable }"
    >
      {{ props.label }}
    </span>
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
      <a href="#dice-roll">
        <span
          v-if="props.modifier"
          class="stat-modifier pointer text-primary"
          @click="rollWithModifier"
        >
          {{ modifier }}
        </span>
      </a>
      <span class="tooltiptext">Roll for {{ props.label }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stat-modifier {
  font-size: 34px;
  padding-right: 20px;
  padding-left: 20px;
  background-color: none;
}
a {
  background-color: none;
  &:hover {
    background: none;
  }
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
