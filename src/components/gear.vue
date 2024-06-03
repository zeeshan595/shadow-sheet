<script setup lang="ts">
import {
  backgroundPaper,
  boxShadow,
  textSecondary,
  textPrimary,
} from "@/theme";

const props = defineProps<{
  modelValue: string[];
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: string[]): void;
}>();

function onChange(payload: Event, index: number) {
  const target = payload.target as HTMLInputElement;
  if (!target) return;
  const temp = [...props.modelValue];
  temp[index] = target.value;
  emits("update:modelValue", temp);
}
</script>

<template>
  <div class="text-field justify-start">
    <div class="justify-start align-start flex-shrink flex-basis-0">
      <span class="label">gear</span>
        <span class="sub-label">10 or STR</span>
    </div>
    <div class="gap10 justify-start">
      <div
        class="flex-row align-center gap5"
        v-for="(item, index) in props.modelValue"
      >
        <span class="sub-label">{{ index + 1 }}</span>
        <input
          type="text"
          :value="item"
          @change="(ev: Event) => onChange(ev, index)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.text-field {
  color: v-bind(textSecondary);
  min-width: 100px;

  .label {
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
  }
  .sub-label {
    font-size: 10px;
    font-weight: bold;
    text-transform: uppercase;
    color: v-bind(textPrimary);
  }

  input[type="text"] {
    font-size: 20px;
    padding: 5px 10px;
    background-color: v-bind(backgroundPaper);
    box-shadow: v-bind(boxShadow);
    color: v-bind(textSecondary);
    border-radius: 7px;
    outline: 0;
    border: 0;
  }
}
</style>
