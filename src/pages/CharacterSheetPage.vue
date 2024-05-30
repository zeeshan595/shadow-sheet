<script setup lang="ts">
import { watch, computed, ref, onMounted } from "vue";
import { owlbearRole } from "@/service/owlbear";
import { router } from "@/router";
import { characters } from "@/service/character";
import Button from "@/components/button.vue";
import TextField from "@/components/text-field.vue";
import Gear from "@/components/gear.vue";
import Toggle from "@/components/toggle.vue";
import Dice from "@/components/dice.vue";
import { useRoute } from "vue-router";
import { stringToNum } from "@/service/helpers";
import type { Character } from "@/types/character";
import { rollDice } from "@/service/diceBox";
import { modal } from "@/hooks/modal";

const BASE_HEALTH = 5;
const BASE_EVASION = 10;
const BASE_GEAR = 10;
const MOBILE_VIEW_MAX_WIDTH = 600;

const windowSize = ref<number>(800);
const diceToRoll = ref<string[]>([]);
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
const strengthNum = computed(() => stringToNum(character.value.strength));
watch(strengthNum, (newVal) => {
  if (newVal > 0) {
    const newGearVal = BASE_GEAR + newVal * 2;
    if (character.value.gear.length !== newGearVal) {
      if (character.value.gear.length > newGearVal) {
        character.value.gear = character.value.gear.slice(0, newGearVal);
      } else {
        character.value.gear.push(
          ...new Array(newGearVal - character.value.gear.length).fill("")
        );
      }
    }
  }
});

function addDiceRoll(dice: string) {
  diceToRoll.value.push(dice);
  const dices: Record<string, number> = {};
  for (const dice of diceToRoll.value) {
    if (dices[dice]) {
      dices[dice] = dices[dice] + 1;
    } else {
      dices[dice] = 1;
    }
  }
  const finalDice: string[] = [];
  for (const dice of Object.keys(dices)) {
    finalDice.push(`${dices[dice]}${dice}`);
  }
  modal.value = {
    message: finalDice.join(" + "),
    actions: ["Cancel", "Roll"],
    onActionClick(index) {
      modal.value = null;
      diceToRoll.value = [];
      switch (index) {
        case 1:
          rollDice({ dice: finalDice }, character.value.playerName);
          break;
      }
    },
  };
}
function onBackClick() {
  modal.value = null;
  router.push("/");
}
const isMobileView = computed(() => windowSize.value < MOBILE_VIEW_MAX_WIDTH);
onMounted(() => {
  windowSize.value = window.innerWidth;
  window.addEventListener("resize", () => {
    windowSize.value = window.innerWidth;
  });
});
</script>

<template>
  <div class="gap10">
    <div
      class="flex-row gap10 justify-start"
      :class="{ 'flex-col': isMobileView }"
      style="padding-bottom: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.3)"
    >
      <Button label="Back" @click="onBackClick" />
      <div
        v-if="owlbearRole === 'PLAYER'"
        class="flex-shrink flex-basis-0"
        style="min-width: 170px"
        :class="{
          'justify-center': isMobileView,
          'align-center': isMobileView,
        }"
      >
        <Toggle v-model="character.sync" />
      </div>
      <div
        class="flex-row gap20"
        :class="{
          'flex-wrap': isMobileView,
          'justify-end': !isMobileView,
          'justify-center': isMobileView,
          'align-center': isMobileView,
        }"
      >
        <Dice type="d4" @click="() => addDiceRoll('d4')" />
        <Dice type="d6" @click="() => addDiceRoll('d6')" />
        <Dice type="d8" @click="() => addDiceRoll('d8')" />
        <Dice type="d10" @click="() => addDiceRoll('d10')" />
        <Dice type="d12" @click="() => addDiceRoll('d12')" />
        <Dice type="d20" @click="() => addDiceRoll('d20')" />
        <Dice type="d100" @click="() => addDiceRoll('d100')" />
      </div>
    </div>
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
    <div class="flex-row gap10 flex-shrink flex-basis-0">
      <TextField
        stat
        spaceBetween
        label="strength"
        v-model="character.strength"
      />
      <TextField
        stat
        spaceBetween
        label="dexterity"
        v-model="character.dexterity"
      />
      <TextField
        stat
        spaceBetween
        label="constitution"
        v-model="character.constitution"
      />
      <TextField
        stat
        spaceBetween
        label="intelligence"
        v-model="character.intelligence"
      />
      <TextField stat spaceBetween label="wisdom" v-model="character.wisdom" />
      <TextField
        stat
        spaceBetween
        label="charisma"
        v-model="character.charisma"
      />
    </div>
    <div class="flex-row gap10" :class="{ 'flex-col': isMobileView }">
      <div class="flex-shrink flex-basis-0 gap10">
        <TextField stat label="health" v-model="character.currentHealth" />
        <TextField stat label="max health" v-model="character.health" />
        <TextField stat label="armor" v-model="character.armor" />
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

<style scoped></style>
