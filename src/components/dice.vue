<script setup lang="ts">

const props = defineProps<{
  type: "d4" | "d6" | "d8" | "d10" | "d12" | "d20" | "d100";
}>();
const emits = defineEmits<{
  (e: "click"): void;
}>();
</script>

<template>
  <div class="flex-row flex-shrink flex-basis-0" @click="() => emits('click')">
    <img
      v-if="props.type === 'd4'"
      src="@/assets/dice/d4.png"
      alt="d4"
      class="dice-image"
    />
    <img
      v-if="props.type === 'd6'"
      src="@/assets/dice/d6.png"
      alt="d6"
      class="dice-image"
    />
    <img
      v-if="props.type === 'd8'"
      src="@/assets/dice/d8.png"
      alt="d8"
      class="dice-image"
    />
    <img
      v-if="props.type === 'd10'"
      src="@/assets/dice/d10.png"
      alt="d10"
      class="dice-image"
    />
    <img
      v-if="props.type === 'd12'"
      src="@/assets/dice/d12.png"
      alt="d12"
      class="dice-image"
    />
    <img
      v-if="props.type === 'd20'"
      src="@/assets/dice/d20.png"
      alt="d20"
      class="dice-image"
    />
    <img
      v-if="props.type === 'd100'"
      src="@/assets/dice/d100.png"
      alt="d100"
      class="dice-image"
    />
  </div>
</template>

<style scoped>
.dice-image {
  width: auto;
  height: 40px;
  cursor: pointer;
}
</style>
