<script setup lang="ts">
import ContextMenuComponent from "@/components/context-menu.vue";
import ModalComponent from "@/components/modal.vue";
import { ContextMenu } from "./hooks/context-menu";
import { modal } from "./hooks/modal";
import { RouterView } from "vue-router";
import { characters, saveCharacters } from "./service/character";
import { onMounted } from "vue";
import { windowWidth } from "./consts";
import { setDiceBoxTheme, getDiceBoxTheme } from "./service/diceBox";
import "./service/owlbear";
import "./service/diceBox";

onMounted(() => {
  // save characters every second
  setInterval(() => saveCharacters(characters.value), 1000);
  // update dice theme with the one user selected last time
  setDiceBoxTheme(getDiceBoxTheme());
  // set window width size to current window width
  windowWidth.value = window.innerWidth;
  // if window size changes then update window width size
  window.addEventListener("resize", () => {
    windowWidth.value = window.innerWidth;
  });
});
</script>

<template>
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
</template>
