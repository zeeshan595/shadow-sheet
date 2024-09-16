<script setup lang="ts">
import { computed } from "vue";
import { theme } from "@/theme";

const primaryMain = computed(() => theme.value.primary.main);

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
  <div
    class="justify-start align-center gap10 flex-shrink flex-basis-0"
    @click="onClick"
  >
    <span class="label"><slot></slot></span>
    <label class="switch">
      <input type="checkbox" :checked="props.modelValue" @click="onClick" />
      <span class="slider round"></span>
    </label>
  </div>
</template>

<style scoped lang="scss">
.label {
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 16px;
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
  height: 16px;
  width: 16px;
  left: 1px;
  bottom: 0px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

// todo: update this
input:checked + .slider {
  background-color: v-bind(primaryMain);
}

input:focus + .slider {
  box-shadow: 0 0 1px v-bind(primaryMain);
}

input:checked + .slider:before {
  -webkit-transform: translateX(14px);
  -ms-transform: translateX(14px);
  transform: translateX(14px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
