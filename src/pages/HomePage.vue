<script setup lang="ts">
import { router } from "@/router";
import { ContextMenu } from "@/context-menu";
import Button from "@/components/button.vue";
import CharacterItem from "../components/character-item.vue";
import {
  characters,
  downloadCharacter,
  uploadCharacter,
  createNewCharacter,
} from "@/service/character";
import type { Character } from "@/types/character";

function showOptions(character: Character) {
  ContextMenu.value = {
    items: ["save", "delete"],
    click: (index: number) => {
      switch (index) {
        case 0:
          downloadCharacter(character);
          break;
        case 1:
          characters.value = characters.value.filter((c) => c !== character);
          break;
      }
    },
  };
}
function onNewCharacterClick() {
  ContextMenu.value = {
    items: ["new", "load"],
    click: async (index: number) => {
      switch (index) {
        case 0:
          const temp = createNewCharacter();
          characters.value = [...characters.value, temp];
          router.push(`/character/${temp.uuid}`);
          break;
        case 1:
          const newCharacter = await uploadCharacter();
          if (newCharacter) {
            characters.value = [...characters.value, newCharacter];
          }
          break;
      }
    },
  };
}
</script>

<template>
  <div class="gap20">
    <h2>Characters</h2>
    <div class="characters">
      <template v-for="character in characters">
        <CharacterItem
          :name="character.characterName"
          @click="() => router.push(`/character/${character.uuid}`)"
          @options="() => showOptions(character)"
        />
      </template>
      <Button label="+" @click="onNewCharacterClick" />
    </div>
  </div>
</template>

<style scoped>
.characters {
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: start;
  gap: 20px;
}
</style>
