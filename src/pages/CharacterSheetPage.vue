<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { router } from "@/router";
import { characters, saveCharacter } from "@/service/character";
import { useRoute } from "vue-router";
import { isMobileView } from "@/consts";
import { owlbearRole, sendCharacterToGM } from "@/service/owlbear";
import type { Character } from "@/types/character";
import Seperator from "@/components/seperator.vue";
import Gear from "@/components/gear.vue";
import Stat from "@/components/stat.vue";
import TopBar from "@/components/top-bar.vue";
import TextField from "@/components/text-field.vue";
import Button from "@/components/button.vue";
import Toggle from "@/components/toggle.vue";
import { stringToNum } from "@/service/helpers";
import { rollDice } from "@/service/diceBox";

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
const attackDice = ref<string>("1d20+1d4+3");
const damageDice = ref<string>("2d6+1");
watch(
  character,
  (character) => {
    sendCharacterToGM(character);
    saveCharacter(character);
  },
  { deep: true }
);
function onBackClick() {
  router.push("/");
}
function handleParsedDiceRoll(dice: string) {
  let diceTrimmed = dice.trim();
  const regex = /^([0-9]{1,2}d(4|6|8|10|12|20|100)\+?)+((\+|\-){1}[0-9]+)?$/;
  const matches = regex.exec(diceTrimmed);
  if (!matches) {
    return alert("Invalid dice type");
  }
  let modifier: number | undefined = undefined;
  if (matches[3]) {
    modifier = stringToNum(matches[3]);
    diceTrimmed = diceTrimmed.slice(0, diceTrimmed.length - matches[3].length);
  }
  console.log(diceTrimmed);
  let diceSplit = diceTrimmed.split("+").filter((d) => d.length > 0);
  rollDice({
    dice: diceSplit,
    modifier,
  });
}
function rollDamageDice() {
  handleParsedDiceRoll(damageDice.value);
}
function rollAttackDice() {
  handleParsedDiceRoll(attackDice.value);
}
</script>

<template>
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
  <div class="gap10 page-padding">
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
      class="flex-row gap10 flex-basis-0"
      :class="{
        'flex-wrap': isMobileView,
      }"
    >
      <Stat small modifier label="strength" v-model="character.strength" />
      <Stat small modifier label="dexterity" v-model="character.dexterity" />
      <Stat
        small
        modifier
        label="constitution"
        v-model="character.constitution"
      />
      <Stat
        small
        modifier
        label="intelligence"
        v-model="character.intelligence"
      />
      <Stat small modifier label="wisdom" v-model="character.wisdom" />
      <Stat small modifier label="charisma" v-model="character.charisma" />
    </div>
    <div
      class="flex-row flex-shrink flex-basis-0 gap10"
      :class="{ 'flex-wrap': isMobileView }"
    >
      <TextField
        :mobile-view="isMobileView"
        label="attack roll"
        v-model="attackDice"
      />
      <Button @click="rollAttackDice" class="shadow">
        <span class="material-symbols-outlined"> ifl </span>
      </Button>
      <TextField
        :mobile-view="isMobileView"
        label="damage roll"
        v-model="damageDice"
      />
      <Button @click="rollDamageDice" class="shadow">
        <span class="material-symbols-outlined"> ifl </span>
      </Button>
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
        <Stat clickable label="health" v-model="character.currentHealth" />
        <Seperator />
        <Stat clickable label="max health" v-model="character.health" />
        <Seperator />
        <Stat
          stat
          label="armor"
          sub-label="10 + DEX"
          v-model="character.armor"
        />
        <Seperator />
        <Stat clickable label="luck" v-model="character.luck" />
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
          <Gear
            v-model="character.gear"
            :strength="stringToNum(character.strength)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
