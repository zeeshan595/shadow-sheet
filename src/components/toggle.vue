<script setup lang="ts">
import { textPrimary } from "@/theme";

const props = defineProps<{
  modelValue: boolean;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

function onClick() {
  emits("update:modelValue", !props.modelValue);
}
</script>

<template>
  <div class="flex-row justify-start align-center gap10 flex-shrink flex-basis-0">
    <span class="label">Sync</span>
    <label class="switch">
      <input type="checkbox" :checked="props.modelValue" @click="onClick" />
      <span class="slider round"></span>
    </label>
  </div>
</template>

<style scoped>
.label {
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: v-bind(textPrimary);
}

input:focus + .slider {
  box-shadow: 0 0 1px v-bind(textPrimary);
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
