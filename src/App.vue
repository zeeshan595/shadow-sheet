<script setup lang="ts">
import ContextMenuComponent from "@/components/context-menu.vue";
import ModalComponent from "@/components/modal.vue";
import { ContextMenu } from "./hooks/context-menu";
import { modal } from "./hooks/modal";
import { RouterView } from "vue-router";
import { characters, saveCharacters } from "./service/character";
import "./service/owlbear";
import "./service/diceBox";

setInterval(() => saveCharacters(characters.value), 1000);
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
