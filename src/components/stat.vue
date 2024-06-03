<script setup lang="ts">
import { computed } from "vue";
import TextField from "./text-field.vue";
import { statToModifier } from "@/service/helpers";

const props = defineProps<{
  label: string;
  modelValue: string;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const modifier = computed(() => statToModifier(props.modelValue));
</script>

<template>
  <div class="align-center flex-shrink flex-basis-0 gap10">
    <TextField
      stat
      small
      spaceBetween
      :label="props.label"
      :modelValue="props.modelValue"
      @update:modelValue="(v) => emits('update:modelValue', v)"
    />
    <span class="stat-modifier">{{ modifier }}</span>
  </div>
</template>

<style scoped>
.stat-modifier {
  font-size: 34px;
}
</style>
