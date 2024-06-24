<script setup lang="ts">
import TextField from "./text-field.vue";
import { computed, ref, watch } from "vue";
import Button from "./button.vue";

const props = defineProps<{
  visible: boolean;
  name: string;
}>();
const emits = defineEmits<{
  (e: "save", name: string): void;
  (e: "delete"): void;
}>();
const name = ref<string>("");
const propName = computed(() => props.name);
watch(propName, (value) => {
  name.value = value;
});
</script>
<template>
  <div v-if="props.visible" class="tracker-edit-container">
    <div class="tracker-edit bg-paper rounded justify-start align-center gap20">
      <TextField label="name" v-model="name" />
      <div class="flex-row gap10">
        <Button class="shadow" @click="() => emits('delete')">Delete</Button>
        <Button class="shadow" @click="() => emits('save', name)">Save</Button>
      </div>
    </div>
  </div>
</template>

<style scoped scss>
.tracker-edit-container {
  display: block;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.3);
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 900;

  .tracker-edit {
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 10px;
    max-width: 260px;
  }
}
</style>
