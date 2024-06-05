<script setup lang="ts">
import { history } from "@/service/diceBox";

const props = defineProps<{
  visible: boolean;
}>();
const emits = defineEmits<{
  (e: "update:visible", visible: boolean): void;
}>();
</script>
<template>
  <div v-if="props.visible" class="history-container">
    <div
      class="history-window bg-paper rounded justify-start align-center gap20"
    >
      <div class="flex-row">
        <h2>Roll History</h2>
        <div
          class="close-button pointer"
          @click="() => emits('update:visible', false)"
        >
          <span class="material-symbols-outlined"> close </span>
        </div>
      </div>
      <div class="gap10">
        <div v-for="item in history" class="bg-default rounded p10">
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped scss>
.history-container {
  display: block;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.3);
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 20;

  .history-window {
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 10px;
    min-height: calc(100% - 60px);

    div {
      flex-shrink: 1;
      flex-grow: 0;
      flex-basis: auto;
    }
    .close-button {
      display: block;
      position: absolute;
      right: 40px;
      top: 40px;
    }
  }
}
</style>
