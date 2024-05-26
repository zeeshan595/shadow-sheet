<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { backgroundPaper, textSecondary, boxShadow } from "@/theme";

const props = defineProps<{
  name: string;
}>();
const emits = defineEmits<{
  (e: "click"): void;
  (e: "options"): void;
}>();

function onOptionsClick(payload: MouseEvent) {
  payload.preventDefault();
  emits("options");
}
</script>

<template>
  <div class="character">
    <span class="options material-symbols-outlined" @click="onOptionsClick">
      more_horiz
    </span>
    <span class="character-name" @click="() => emits('click')">
      {{ props.name }}
    </span>
  </div>
</template>

<style scoped>
.character {
  justify-content: start;
  flex-shrink: 1;
  flex-grow: 0;
  flex-basis: 200px;
  gap: 5px;
  border-radius: 7px;
  background-color: v-bind(backgroundPaper);
  box-shadow: v-bind(boxShadow);

  .options {
    cursor: pointer;
    padding: 10px 15px 10px 15px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  }

  .character-name {
    cursor: pointer;
    padding: 10px 15px 20px 15px;
    color: v-bind(textSecondary);
  }
}
</style>
