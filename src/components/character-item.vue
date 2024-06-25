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
const stats = computed(() => [
  { name: "STR", value: props.character.strength },
  { name: "DEX", value: props.character.dexterity },
  { name: "CON", value: props.character.constitution },
  { name: "INT", value: props.character.intelligence },
  { name: "WIS", value: props.character.wisdom },
  { name: "CHA", value: props.character.charisma },
]);
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
      <div v-if="!isMobileView" class="flex-row justify-end gap20 font-small">
        <div
          v-for="stat in stats"
          class="flex-row gap10 align-center justify-start flex-shrink flex-basis-0"
        >
          <span class="bold">{{ stat.name }}</span>
          <span>{{ statToModifier(stat.value) }}</span>
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
          class="flex-row gap10 align-center justify-start flex-shrink flex-basis-0"
        >
          <span class="bold uppercase">{{ tracker.name }}</span>
          <span>{{ tracker.value }}</span>
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
