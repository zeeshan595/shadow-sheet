<script setup lang="ts">
import ContextMenuComponent from "@/components/context-menu.vue";
import { ContextMenu } from "./hooks/context-menu";
import { RouterView } from "vue-router";
import { computed, onMounted } from "vue";
import { windowWidth } from "./consts";
import { theme } from "@/theme";
import "./service/owlbear";
import "./service/diceBox";

onMounted(() => {
  // set window width size to current window width
  windowWidth.value = window.innerWidth;
  // if window size changes then update window width size
  window.addEventListener("resize", () => {
    windowWidth.value = window.innerWidth;
  });
});
const styleVariables = computed(() => ({
  "--bg-default": theme.value.background.default,
  "--bg-paper": theme.value.background.paper,
  "--text-primary": theme.value.text.secondary,
  "--shadow": theme.value.shadow,
  "--primary-main": theme.value.primary.main,
  "--primary-dark": theme.value.primary.dark
}));
</script>

<template>
  <div :style="styleVariables">
    <ContextMenuComponent
      :show="ContextMenu != null"
      :items="ContextMenu?.items ?? []"
      @click="ContextMenu?.click"
    />
    <RouterView />
  </div>
</template>

<style lang="scss">
.bg-default {
  background-color: var(--bg-default);
}
.bg-paper {
  background-color: var(--bg-paper);
}
.text-primary {
  color: var(--text-primary);
}
.shadow {
  box-shadow: var(--shadow);
}
.primary-main {
  color: var(--primary-main);
}
a:hover {
  background-color: var(--primary-dark);
}
</style>
