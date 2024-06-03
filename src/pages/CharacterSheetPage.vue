<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { router } from "@/router";
import { characters } from "@/service/character";
import TextField from "@/components/text-field.vue";
import Gear from "@/components/gear.vue";
import Stat from "@/components/stat.vue";
import TopBar from "@/components/top-bar.vue";
import { useRoute } from "vue-router";
import type { Character } from "@/types/character";
import Seperator from "@/components/seperator.vue";

const MOBILE_VIEW_MAX_WIDTH = 620;

const windowSize = ref<number>(800);
const route = useRoute();
const character = computed<Character>({
  get() {
    let index = characters.value.findIndex(
      (character) => character.uuid === route.params.uuid
    );
    if (index < 0) {
      alert("character not found");
      router.push("/");
    }
    return characters.value[index];
  },
  set(newValue) {
    const index = characters.value.findIndex(
      (character) => character.uuid === route.params.uuid
    );
    const temp = [...characters.value];
    temp[index] = newValue;
    characters.value = temp;
  },
});

const isMobileView = computed(() => windowSize.value < MOBILE_VIEW_MAX_WIDTH);
onMounted(() => {
  windowSize.value = window.innerWidth;
  window.addEventListener("resize", () => {
    windowSize.value = window.innerWidth;
  });
});
</script>

<template>
  <div class="gap10" :class="{ 'character-sheet': !isMobileView }">
    <TopBar
      :player-name="character.playerName"
      :is-mobile-view="isMobileView"
      v-model="character.sync"
    />
    <div class="flex-row gap10" :class="{ 'flex-col': isMobileView }">
      <TextField label="player name" v-model="character.playerName" />
      <TextField label="character name" v-model="character.characterName" />
      <TextField
        :small="!isMobileView"
        label="level"
        v-model="character.level"
      />
    </div>
    <div class="flex-row gap10" :class="{ 'flex-col': isMobileView }">
      <TextField label="ancestry" v-model="character.ancestry" />
      <TextField label="background" v-model="character.background" />
      <TextField label="class" v-model="character.characterClass" />
    </div>
    <div
      class="flex-row gap10 flex-shrink flex-basis-0"
      :class="{
        'flex-wrap': isMobileView,
        'justify-space-between': !isMobileView,
      }"
    >
      <Stat label="strength" v-model="character.strength" />
      <Stat label="dexterity" v-model="character.dexterity" />
      <Stat label="constitution" v-model="character.constitution" />
      <Stat label="intelligence" v-model="character.intelligence" />
      <Stat label="wisdom" v-model="character.wisdom" />
      <Stat label="charisma" v-model="character.charisma" />
    </div>
    <Seperator />
    <div class="flex-row gap10" :class="{ 'flex-col': isMobileView }">
      <div
        class="flex-shrink flex-basis-0 gap10"
        :class="{
          'flex-row': isMobileView,
          'flex-wrap': isMobileView,
        }"
      >
        <TextField stat label="health" v-model="character.currentHealth" />
        <TextField stat label="max health" v-model="character.health" />
        <TextField
          stat
          label="armor"
          sub-label="10 + DEX"
          v-model="character.armor"
        />
        <TextField stat label="luck" v-model="character.luck" />
      </div>
      <div class="gap10">
        <TextField
          large
          :mobile-view="isMobileView"
          label="skills & talents"
          v-model="character.skills"
        />
        <TextField
          large
          :mobile-view="isMobileView"
          label="attacks & spells"
          v-model="character.attacks"
        />
      </div>
    </div>
    <div
      class="flex-row gap10 justify-start"
      :class="{ 'flex-col': isMobileView }"
    >
      <TextField
        large
        :mobile-view="isMobileView"
        label="notes"
        v-model="character.notes"
      />
      <div
        class="gap10 justify-start"
        :style="!isMobileView ? 'min-height: 400px; max-width: 250px' : ''"
      >
        <div class="flex-shrink flex-basis-0">
          <TextField
            label="gold"
            sub-label="100 = 1 gear"
            v-model="character.gold"
          />
        </div>
        <div class="flex-shrink flex-basis-0">
          <Gear v-model="character.gear" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.character-sheet {
  margin-top: 90px;
}
</style>
