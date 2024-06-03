<script setup lang="ts">
import { backgroundPaper, textSecondary, boxShadow } from "@/theme";
import Seperator from "./seperator.vue";
import type { Character } from "@/types/character";
import { statToModifier } from "@/service/helpers";

const props = defineProps<{
  character: Character;
}>();
const emits = defineEmits<{
  (e: "click"): void;
  (e: "save"): void;
  (e: "delete"): void;
}>();
</script>

<template>
  <div class="character">
    <div class="flex-row gap10 justify-start flex-shrink flex-basis-0 p10">
      <span
        class="material-symbols-outlined pointer"
        @click="() => emits('save')"
      >
        download
      </span>
      <span
        class="material-symbols-outlined pointer"
        @click="() => emits('delete')"
      >
        delete
      </span>
    </div>
    <Seperator />
    <div class="character-name flex-row gap20" @click="() => emits('click')">
      <div class="flex-shrink flex-basis-0" style="min-width: 240px">
        {{ props.character.characterName }}
        <template v-if="props.character.playerName">
          ({{ props.character.playerName }})
        </template>
      </div>
      <div class="flex-row gap10">
        <div class="align-center">
          <span class="bold">STR</span> {{ statToModifier(character.strength) }}
        </div>
        <div class="align-center">
          <span class="bold">DEX</span>
          {{ statToModifier(character.dexterity) }}
        </div>
        <div class="align-center">
          <span class="bold">CON</span>
          {{ statToModifier(character.constitution) }}
        </div>
        <div class="align-center">
          <span class="bold">INT</span>
          {{ statToModifier(character.intelligence) }}
        </div>
        <div class="align-center">
          <span class="bold">WIS</span> {{ statToModifier(character.wisdom) }}
        </div>
        <div class="align-center">
          <span class="bold">CHA</span> {{ statToModifier(character.charisma) }}
        </div>
        <div class="align-center">
          <span class="bold">AC</span> {{ character.armor }}
        </div>
        <div class="align-center">
          <span class="bold">HP</span> {{ character.currentHealth }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.character {
  justify-content: start;
  border-radius: 7px;
  background-color: v-bind(backgroundPaper);
  box-shadow: v-bind(boxShadow);

  .character-name {
    cursor: pointer;
    padding: 10px 15px 20px 15px;
    color: v-bind(textSecondary);
  }
}
.bold {
  font-weight: bold;
}
</style>
