<script setup lang="ts">
import { theme } from "@/theme";
import { computed, ref } from "vue";
const props = defineProps<{
  label: string;
  modelValue: boolean;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const primary = computed(() => theme.value.primary.main);
const text = computed(() => theme.value.text.primary);
</script>

<template>
  <div
    class="container flex-shrink flex-basis-0"
    @click="() => emits('update:modelValue', !props.modelValue)"
  >
    <span class="label">{{ props.label }}</span>
    <input type="checkbox" :checked="props.modelValue" />
    <span class="checkmark"></span>
  </div>
</template>

<style scoped lang="scss">
/* The container */
.container {
  position: relative;
  padding-left: 35px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.container .label {
  position: relative;
  top: -5px;
}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: v-bind(text);
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: v-bind(text);
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: v-bind(primary);
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid v-bind(text);
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
