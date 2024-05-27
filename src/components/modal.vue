<script setup lang="ts">
import { backgroundPaper, boxShadow } from "@/theme";
import Button from "./button.vue";

const props = defineProps<{
  message: string;
  actions: string[];
}>();
const emits = defineEmits<{
  (e: "click:action", index: number): void;
}>();
</script>

<template>
  <div class="container">
    <div class="modal flex-grow gap20">
      <div
        class="flex-grow flex-basis-100 justify-start align-start"
        style="width: 100%"
      >
        {{ props.message }}
      </div>
      <div class="flex-row justify-center flex-shrink flex-basis-0 gap20">
        <Button
          v-for="(action, index) in props.actions"
          :label="action"
          @click="() => emits('click:action', index)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: block;
  position: fixed;
  top: 100px;
  right: 260px;
}
.modal {
  display: flex;
  position: absolute;
  padding: 20px;
  border-radius: 7px;
  min-width: 200px;
  background-color: v-bind(backgroundPaper);
  box-shadow: v-bind(boxShadow);
  margin-left: auto;
  margin-right: auto;
  z-index: 50;
}
</style>
