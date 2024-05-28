<script setup lang="ts">
import { router } from "@/router";
import { ContextMenu } from "@/hooks/context-menu";
import Button from "@/components/button.vue";
import CharacterItem from "../components/character-item.vue";
import {
  characters,
  downloadCharacter,
  uploadCharacter,
  createNewCharacter,
  saveCharacters,
} from "@/service/character";
import type { Character } from "@/types/character";
import { DiceBoxThemes, rollDice, setDiceBoxTheme } from "@/service/diceBox";

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
          {
            const temp = createNewCharacter();
            characters.value = [...characters.value, temp];
            router.push(`/character/${temp.uuid}`);
          }
          break;
        case 1:
          {
            const newCharacter = await uploadCharacter();
            if (newCharacter) {
              const existingCharIndex = characters.value.findIndex(
                (c) => c.uuid === newCharacter.uuid
              );
              if (existingCharIndex > -1) {
                const temp = [...characters.value];
                temp[existingCharIndex] = characters.value[existingCharIndex];
                characters.value = temp;
              } else {
                characters.value = [...characters.value, newCharacter];
              }
            }
          }
          break;
      }
    },
  };
}
function onDiceThemeClick() {
  ContextMenu.value = {
    items: Object.keys(DiceBoxThemes),
    click: (index: number) => {
      setDiceBoxTheme(Object.values(DiceBoxThemes)[index]).then(() => {
        rollDice({
          dice: ["1d4", "1d6", "1d8", "1d10", "1d12", "1d20"],
          hidden: true,
        });
      });
    },
  };
}
function onDeleteAllCharacters() {
  if (confirm("Are you sure you want to delete all characters?")) {
    characters.value = [];
    saveCharacters(characters.value);
  }
}
</script>

<template>
  <div class="gap20">
    <div class="flex-row justify-start gap10 align-center">
      <h2>Characters</h2>
      <Button label="Dice Theme" @click="onDiceThemeClick" />
      <Button label="Delete All Characters" @click="onDeleteAllCharacters" />
    </div>
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
