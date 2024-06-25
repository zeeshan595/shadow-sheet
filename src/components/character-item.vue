<script setup lang="ts">
import Seperator from "./seperator.vue";
import type { Character } from "@/types/character";
import { statToModifier } from "@/service/helpers";
import { isMobileView } from "@/consts";
import { computed } from "vue";

const props = defineProps<{
  character: Character;
}>();
const emits = defineEmits<{
  (e: "click"): void;
  (e: "save"): void;
  (e: "delete"): void;
}>();
const trackers = computed(() => {
  if (props.character.trackers.length <= 5) {
    return props.character.trackers;
  }
  return props.character.trackers.slice(0, 5);
});
</script>

<template>
  <div class="rounded bg-paper p10">
    <div
      class="flex-row gap10 justify-start align-center flex-shrink flex-basis-0 p10"
    >
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
      <div class="flex-row justify-end gap20 font-small">
        <div class="align-center justify-start flex-shrink flex-basis-0">
          <span class="bold">STR</span> {{ statToModifier(character.strength) }}
        </div>
        <div class="align-center justify-start flex-shrink flex-basis-0">
          <span class="bold">DEX</span>
          {{ statToModifier(character.dexterity) }}
        </div>
        <div class="align-center justify-start flex-shrink flex-basis-0">
          <span class="bold">CON</span>
          {{ statToModifier(character.constitution) }}
        </div>
        <div class="align-center justify-start flex-shrink flex-basis-0">
          <span class="bold">INT</span>
          {{ statToModifier(character.intelligence) }}
        </div>
        <div class="align-center justify-start flex-shrink flex-basis-0">
          <span class="bold">WIS</span> {{ statToModifier(character.wisdom) }}
        </div>
        <div class="align-center justify-start flex-shrink flex-basis-0">
          <span class="bold">CHA</span> {{ statToModifier(character.charisma) }}
        </div>
      </div>
    </div>
    <Seperator />
    <div
      class="character-name flex-row gap20 p10 pointer"
      @click="() => emits('click')"
    >
      <div>
        {{ props.character.characterName }}
        <template v-if="props.character.playerName">
          ({{ props.character.playerName }})
        </template>
      </div>
      <div
        v-if="!isMobileView"
        class="flex-row gap20 justify-end align-center font-small"
      >
        <div
          v-for="tracker in trackers"
          class="align-center justify-start flex-shrink flex-basis-0"
        >
          <span class="bold uppercase">{{ tracker.name }}</span>
          {{ tracker.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.character {
  .character-name {
    cursor: pointer;
    padding: 10px 15px 20px 15px;
  }
}
.bold {
  font-weight: bold;
}
.min-width-240 {
  min-width: 240px;
}
</style>
