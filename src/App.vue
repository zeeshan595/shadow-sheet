<script setup lang="ts">
import { RouterView } from "vue-router";
import ContextMenuComponent from "@/components/context-menu.vue";
import { ContextMenu } from "./context-menu";
import { characters, saveCharacter } from "./service/character";
import OBR from "@owlbear-rodeo/sdk";
import { owlbearRole } from '@/owlbear';
import type { Character } from "./types/character";
const OWLBEAR_CHANNEL_ID = "rodeo.owlbear.character-sheet";

function sendCharacterToGM() {
  setInterval(() => {
    for (const character of characters.value.filter(
      (character) => character.sync
    )) {
      OBR.broadcast.sendMessage(OWLBEAR_CHANNEL_ID, JSON.stringify(character));
    }
  }, 5000);
}
function fetchCharactersFromPlayers() {
  OBR.broadcast.onMessage(OWLBEAR_CHANNEL_ID, (event) => {
    const character = JSON.parse(event.data as string) as Character;
    const existingCharacterIndex = characters.value.findIndex(
      (c) => c.uuid === character.uuid
    );
    if (existingCharacterIndex < 0) {
      characters.value = [character, ...characters.value];
    } else {
      const temp = [...characters.value];
      temp[existingCharacterIndex] = character;
      characters.value = temp;
    }
  });
}
if (OBR && OBR.isAvailable) {
  OBR.onReady(async () => {
    const role = await OBR.player.getRole();
    owlbearRole.value = role;
    if (role === "GM") fetchCharactersFromPlayers();
    else sendCharacterToGM();
  });
}

setInterval(() => saveCharacter(characters.value), 1000);
</script>

<template>
  <ContextMenuComponent
    :show="ContextMenu != null"
    :items="ContextMenu?.items ?? []"
    @click="ContextMenu?.click"
  />
  <RouterView />
</template>
