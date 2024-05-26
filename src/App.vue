<script setup lang="ts">
import { RouterView } from "vue-router";
import ContextMenuComponent from "@/components/context-menu.vue";
import { ContextMenu } from "./context-menu";
import { characters, saveCharacter } from "./service/character";
import "./service/owlbear";
import "./service/diceBox";

setInterval(() => saveCharacter(characters.value), 1000);
</script>

<template>
  <div>
    <ContextMenuComponent
      :show="ContextMenu != null"
      :items="ContextMenu?.items ?? []"
      @click="ContextMenu?.click"
    />
    <RouterView />
  </div>
</template>
