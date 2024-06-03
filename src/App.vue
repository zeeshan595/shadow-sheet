<script setup lang="ts">
import ContextMenuComponent from "@/components/context-menu.vue";
import ModalComponent from "@/components/modal.vue";
import { ContextMenu } from "./hooks/context-menu";
import { modal } from "./hooks/modal";
import { RouterView } from "vue-router";
import { characters, saveCharacters } from "./service/character";
import { onMounted } from "vue";
import { windowSize } from "./consts";
import { setDiceBoxTheme, getDiceBoxTheme } from "./service/diceBox";
import "./service/owlbear";
import "./service/diceBox";

setInterval(() => saveCharacters(characters.value), 1000);
onMounted(() => {
  setDiceBoxTheme(getDiceBoxTheme());
  windowSize.value = window.innerWidth;
  window.addEventListener("resize", () => {
    windowSize.value = window.innerWidth;
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
