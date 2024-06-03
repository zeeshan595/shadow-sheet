<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { ContextMenu } from "@/hooks/context-menu";

const mouse = ref<{ x: number; y: number }>({ x: 0, y: 0 });
const contextMenuPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 });
const props = defineProps<{
  items: string[];
  show?: boolean;
}>();
const emits = defineEmits<{
  (e: "click", itemIndex: number): void;
}>();
onMounted(() => {
  window.addEventListener("mousemove", (ev: MouseEvent) => {
    mouse.value = {
      x: ev.x,
      y: ev.y,
    };
  });
});

function onItemClicked(index: number) {
  ContextMenu.value = null;
  emits("click", index);
}
const isShowing = computed(() => props.show);

function autoHideEvent(ev: MouseEvent) {
  ContextMenu.value = null;
}
watch(isShowing, (newVal: boolean) => {
  if (!newVal) {
    return document.removeEventListener("click", autoHideEvent);
  }
  setTimeout(() => document.addEventListener("click", autoHideEvent), 100);
  contextMenuPosition.value = mouse.value;
});
</script>

<template>
  <div
    id="context-menu"
    class="context-menu shadow bg-paper text-primary"
    :style="`display: ${show ? 'block' : 'none'}; left: ${
      contextMenuPosition.x
    }px; top: ${contextMenuPosition.y}px;`"
  >
    <div v-for="(item, index) in props.items" :key="index">
      <div
        :class="{
          top: index == 0,
          bottom: index + 1 == props.items.length,
        }"
        @click="() => onItemClicked(index)"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.context-menu {
  display: block;
  position: fixed;
  border-radius: 7px;
  z-index: 100;

  div {
    padding: 10px 20px;
    cursor: pointer;
  }
  .top {
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
  }
  .bottom {
    border-bottom-left-radius: 7px;
    border-bottom-right-radius: 7px;
  }
}
</style>
