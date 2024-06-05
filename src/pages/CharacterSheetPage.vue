<script setup lang="ts">
import { computed } from "vue";
import { router } from "@/router";
import { characters } from "@/service/character";
import { useRoute } from "vue-router";
import { isMobileView } from "@/consts";
import { owlbearRole } from "@/service/owlbear";
import type { Character } from "@/types/character";
import Seperator from "@/components/seperator.vue";
import Gear from "@/components/gear.vue";
import Stat from "@/components/stat.vue";
import TopBar from "@/components/top-bar.vue";
import TextField from "@/components/text-field.vue";
import Button from "@/components/button.vue";
import Toggle from "@/components/toggle.vue";
import { stringToNum } from "@/service/helpers";

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
function onBackClick() {
  router.push("/");
}
function currentHealthClick() {
  character.value.currentHealth = `${
    stringToNum(character.value.currentHealth) + 1
  }`;
}
function currentHealthRightClick() {
  character.value.currentHealth = `${
    stringToNum(character.value.currentHealth) - 1
  }`;
}
function healthClick() {
  character.value.health = `${stringToNum(character.value.health) + 1}`;
}
function healthRightClick() {
  character.value.health = `${stringToNum(character.value.health) - 1}`;
}
function armorClick() {
  character.value.armor = `${stringToNum(character.value.armor) + 1}`;
}
function armorRightClick() {
  character.value.armor = `${stringToNum(character.value.armor) - 1}`;
}
function luckClick() {
  character.value.luck = `${stringToNum(character.value.luck) + 1}`;
}
function luckRightClick() {
  character.value.luck = `${stringToNum(character.value.luck) - 1}`;
}
</script>

<template>
  <div
    class="gap10"
    :class="{
      'character-sheet': !isMobileView,
      'character-sheet-player': !isMobileView && owlbearRole === 'PLAYER',
    }"
  >
    <TopBar>
      <Button @click="onBackClick">
        <span class="material-symbols-outlined"> arrow_back </span>
      </Button>
      <div
        v-if="owlbearRole === 'PLAYER'"
        class="flex-shrink flex-basis-0"
        :class="{
          'justify-center': isMobileView,
          'align-center': isMobileView,
        }"
      >
        <Toggle v-model="character.sync" />
      </div>
    </TopBar>
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
        <TextField
          stat
          readonly
          clickable
          label="health"
          v-model="character.currentHealth"
          @click="currentHealthClick"
          @right-click="currentHealthRightClick"
        />
        <TextField
          stat
          readonly
          clickable
          label="max health"
          v-model="character.health"
          @click="healthClick"
          @right-click="healthRightClick"
        />
        <TextField
          stat
          readonly
          clickable
          label="armor"
          sub-label="10 + DEX"
          v-model="character.armor"
          @click="armorClick"
          @right-click="armorRightClick"
        />
        <TextField
          stat
          readonly
          clickable
          label="luck"
          v-model="character.luck"
          @click="luckClick"
          @right-click="luckRightClick"
        />
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
  margin-top: 100px;
}
.character-sheet-player {
  margin-top: 120px;
}
</style>
