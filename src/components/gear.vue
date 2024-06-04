<script setup lang="ts">
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
  <div class="text-field justify-start text-primary">
    <div class="justify-start align-start flex-shrink flex-basis-0">
      <span class="label">gear</span>
      <span class="sub-label primary-main">10 or STR</span>
    </div>
    <div class="gap10 justify-start">
      <div
        class="flex-row align-center gap5"
        v-for="(item, index) in props.modelValue"
      >
        <span class="sub-label primary-main">{{ index + 1 }}</span>
        <input
          type="text"
          class="bg-paper shadow text-primary min-width-0"
          :value="item"
          @change="(ev: Event) => onChange(ev, index)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.text-field {
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
  }

  input[type="text"] {
    font-size: 20px;
    padding: 5px 10px;
    border-radius: 7px;
    outline: 0;
    border: 0;
  }
}
</style>
