<script setup lang="ts">
const props = defineProps<{
  label: string;
  subLabel?: string;
  modelValue: string;
  small?: boolean;
  stat?: boolean;
  large?: boolean;
  spaceBetween?: boolean;
  clickableLabel?: boolean;
  mobileView?: boolean;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "label-click"): void;
}>();

function onChange(payload: Event) {
  const target = payload.target as HTMLInputElement | HTMLTextAreaElement;
  if (!target) return;
  emits("update:modelValue", target.value);
}
</script>

<template>
  <div
    class="text-field justify-start text-primary"
    :class="{
      small: props.small,
      stat: props.stat,
      'justify-space-between': props.spaceBetween,
    }"
  >
    <div
      class="justify-start align-start flex-shrink flex-basis-0"
      :class="{
        clickable: props.clickableLabel,
      }"
      @click="() => emits('label-click')"
    >
      <span class="label">{{ props.label }}</span>
      <span v-if="props.subLabel" class="sub-label primary-main">
        {{ subLabel }}
      </span>
    </div>
    <input
      v-if="!props.large"
      type="text"
      class="bg-paper shadow text-primary"
      :value="modelValue"
      @change="onChange"
      :maxlength="props.stat ? 2 : undefined"
    />
    <textarea
      v-if="props.large"
      class="bg-paper shadow text-primary"
      :class="{ 'mobile-view': mobileView }"
      :value="modelValue"
      @change="onChange"
    ></textarea>
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

  input[type="text"],
  textarea {
    font-size: 20px;
    padding: 5px 10px;
    border-radius: 7px;
    outline: 0;
    border: 0;
  }
  textarea {
    height: 100%;
    height: 100%;
    resize: none;
  }
  .mobile-view {
    min-height: 500px;
  }

  &.small {
    flex-basis: 100px;
  }

  &.stat {
    justify-content: center;
    align-items: center;
    flex-shrink: 1;
    flex-grow: 0;
    flex-basis: 0;
    min-width: auto;

    input[type="text"] {
      font-size: 34px;
      width: 45px;
      padding: 20px;
      text-align: center;
    }

    &.small {
      input[type="text"] {
        padding: 10px;
        font-size: 24px;
      }
    }
  }
}

.clickable {
  cursor: pointer;
}
</style>
