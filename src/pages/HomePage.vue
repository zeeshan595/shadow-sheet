<script setup lang="ts">
import { router } from "@/router";
import { ContextMenu } from "@/hooks/context-menu";
import {
  characters,
  downloadCharacter,
  uploadCharacter,
  createNewCharacter,
  deleteAllCharacters,
  deleteCharacter,
  saveCharacter,
} from "@/service/character";
import type { Character } from "@/types/character";
import {
  DiceBoxThemes,
  rollDicePreview,
  setDiceBoxTheme,
} from "@/service/diceBox";
import Button from "@/components/button.vue";
import CharacterItem from "@/components/character-item.vue";
import TopBar from "@/components/top-bar.vue";
import { isMobileView } from "@/consts";

function onDeleteCharacter(character: Character) {
  const CONFIRM_TEXT = `Are you sure you want to delete this character?\n${character.characterName} (${character.playerName})`;
  if (confirm(CONFIRM_TEXT)) {
    characters.value = characters.value.filter(
      (c) => c.uuid !== character.uuid
    );
    deleteCharacter(character);
  }
}
function onNewCharacterClick() {
  const temp = createNewCharacter();
  characters.value = [...characters.value, temp];
  router.push(`/character/${temp.uuid}`);
  saveCharacter(temp);
}
function onDiceThemeClick() {
  ContextMenu.value = {
    items: Object.keys(DiceBoxThemes),
    click: (index: number) => {
      setDiceBoxTheme(Object.values(DiceBoxThemes)[index]).then(() => {
        rollDicePreview(["1d4", "1d6", "1d8", "1d10", "1d12", "1d20"]);
      });
    },
  };
}
async function onDeleteAllCharacters() {
  if (confirm("Are you sure you want to delete all characters?")) {
    await deleteAllCharacters();
    characters.value = [];
  }
}
function onMenuOptionsClick() {
  ContextMenu.value = {
    items: ["Dice Theme", "Load Chracter", "Delete All Characters"],
    async click(index: number) {
      switch (index) {
        case 0:
          setTimeout(onDiceThemeClick, 100);
          break;
        case 1:
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
            saveCharacter(newCharacter);
          }
          break;
        case 2:
          onDeleteAllCharacters();
          break;
      }
    },
  };
}
</script>

<template>
  <TopBar>
    <div
      class="flex-row gap10 justify-start align-center"
      :class="{ 'flex-col': isMobileView }"
    >
      <span
        class="options material-symbols-outlined pointer"
        @click="onMenuOptionsClick"
      >
        more_horiz
      </span>
      <h2>Characters</h2>
    </div>
  </TopBar>
  <div class="gap20 page-padding">
    <div class="gap20" :class="{ mt100: !isMobileView }">
      <template v-for="character in characters">
        <CharacterItem
          :character="character"
          @click="() => router.push(`/character/${character.uuid}`)"
          @save="() => downloadCharacter(character)"
          @delete="() => onDeleteCharacter(character)"
        />
      </template>
      <Button @click="onNewCharacterClick">+</Button>
    </div>
  </div>
</template>

<style scoped></style>
