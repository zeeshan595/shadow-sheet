<script setup lang="ts">
import ContextMenuComponent from "@/components/context-menu.vue";
import ModalComponent from "@/components/modal.vue";
import { ContextMenu } from "./hooks/context-menu";
import { modal } from "./hooks/modal";
import { RouterView } from "vue-router";
import { characters, saveCharacters } from "./service/character";
import { computed, onMounted } from "vue";
import { windowWidth } from "./consts";
import { setDiceBoxTheme, getDiceBoxTheme } from "./service/diceBox";
import { theme } from "@/theme";
import "./service/owlbear";
import "./service/diceBox";

onMounted(() => {
  // save characters every second
  setInterval(() => saveCharacters(characters.value), 1000);
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
  "--text-parimart": theme.value.text.primary,
  "--shadow": theme.value.shadow,
  "--primary-main": theme.value.primary.main,
}));
</script>

<template>
  <div :style="styleVariables">
    <ContextMenuComponent
      :show="ContextMenu != null"
      :items="ContextMenu?.items ?? []"
      @click="ContextMenu?.click"
    />
    <ModalComponent
      v-if="modal != null"
      :message="modal.message"
      :actions="modal.actions"
      @click:action="modal.onActionClick"
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
</style>
