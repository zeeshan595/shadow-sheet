<script setup lang="ts">
import { router } from "@/router";
import {
  characters,
  downloadCharacter,
  createNewCharacter,
  deleteCharacter,
  saveCharacter,
} from "@/service/character";
import type { Character } from "@/types/character";
import Button from "@/components/button.vue";
import CharacterItem from "@/components/character-item.vue";
import TopBar from "@/components/top-bar.vue";
import Options from "@/components/options.vue";
import { isMobileView } from "@/consts";
import { ref } from "vue";

const showOptions = ref(false);

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
</script>

<template>
  <Options :visible="showOptions" @update:visible="(v) => (showOptions = v)" />
  <TopBar>
    <div
      class="flex-row gap10 justify-start align-center"
      :class="{ 'flex-col': isMobileView }"
    >
      <span
        class="options material-symbols-outlined pointer"
        @click="showOptions = true"
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
