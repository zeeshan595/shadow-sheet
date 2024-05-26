<script setup lang="ts">
import { watch, computed, ref } from "vue";
import { owlbearRole, sendNotification } from "@/owlbear";
import { router } from "@/router";
import { characters } from "@/service/character";
import Button from "@/components/button.vue";
import TextField from "@/components/text-field.vue";
import Gear from "@/components/gear.vue";
import Toggle from "@/components/toggle.vue";
import { useRoute } from "vue-router";
import { stringToNum } from "@/service/helpers";
import type { Character } from "@/types/character";
import { DiceRoll } from "@dice-roller/rpg-dice-roller";

const BASE_HEALTH = 5;
const BASE_EVASION = 10;
const BASE_GEAR = 10;

const diceRoller = ref<string>("");
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
  character.value.currentHealth = `${BASE_HEALTH + newVal}`;
  character.value.health = `${BASE_HEALTH + newVal}`;
  const newGearVal = BASE_GEAR + newVal;
  if (character.value.gear.length !== newGearVal) {
    if (character.value.gear.length > newGearVal) {
      character.value.gear = character.value.gear.slice(0, newGearVal);
    } else {
      character.value.gear.push(
        ...new Array(newGearVal - character.value.gear.length).fill("")
      );
    }
  }
});
const dexterityNum = computed(() => stringToNum(character.value.dexterity));
watch(dexterityNum, (newVal) => {
  character.value.evasion = `${BASE_EVASION + newVal}`;
});
function rollDice(command: string) {
  const roll = new DiceRoll(command);
  const regex = /\= ([0-9]+)$/i;
  const matches = regex.exec(roll.output);
  if (!matches) return;
  sendNotification(
    `${character.value.playerName} rolled ${roll.notation} and got ${matches[1]}`
  );
}
</script>

<template>
  <div class="gap10">
    <div
      class="flex-row gap10 justify-start"
      style="padding-bottom: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.3)"
    >
      <Button label="Back" @click="() => router.push('/')" />
      <div
        v-if="owlbearRole === 'PLAYER'"
        class="flex-shrink flex-basis-0"
        style="min-width: 170px"
      >
        <Toggle v-model="character.sync" />
      </div>
      <TextField label="dice roller" v-model="diceRoller" />
      <Button label="Roll" @click="rollDice(diceRoller)" />
    </div>
    <div class="flex-row gap10">
      <TextField label="player name" v-model="character.playerName" />
      <TextField label="character name" v-model="character.characterName" />
      <TextField small label="level" v-model="character.level" />
    </div>
    <div class="flex-row gap10">
      <TextField label="ancestry" v-model="character.ancestry" />
      <TextField label="background" v-model="character.background" />
      <TextField label="class" v-model="character.characterClass" />
    </div>
    <div class="flex-row gap10">
      <div class="gap10 flex-shrink flex-basis-0">
        <TextField
          stat
          clickable-label
          spaceBetween
          label="strength"
          v-model="character.strength"
          @label-click="() => rollDice(`d20+${character.strength}`)"
        />
        <TextField
          stat
          clickable-label
          spaceBetween
          label="dexterity"
          v-model="character.dexterity"
          @label-click="() => rollDice(`d20+${character.dexterity}`)"
        />
        <TextField
          stat
          clickable-label
          spaceBetween
          label="intelligence"
          v-model="character.intelligence"
          @label-click="() => rollDice(`d20+${character.intelligence}`)"
        />
        <TextField
          stat
          clickable-label
          spaceBetween
          label="charisma"
          v-model="character.charisma"
          @label-click="() => rollDice(`d20+${character.charisma}`)"
        />
      </div>
      <div class="gap10 flex-shrink flex-basis-0">
        <TextField stat label="health" v-model="character.currentHealth" />
        <TextField
          stat
          label="max health"
          sub-label="5 + STR"
          v-model="character.health"
        />
        <TextField
          stat
          label="evasion"
          sub-label="10 + DEX"
          v-model="character.evasion"
        />
        <TextField
          stat
          label="armor"
          sub-label="GEAR"
          v-model="character.armor"
        />
      </div>
      <div class="gap10">
        <TextField
          large
          label="skills & talents"
          sub-label="skills = (INT x 2) + 1"
          v-model="character.skills"
        />
        <TextField large label="attacks & spells" v-model="character.attacks" />
      </div>
    </div>
    <div class="flex-row gap10 justify-start">
      <TextField large label="notes" v-model="character.notes" />
      <div
        class="gap10 justify-start"
        style="min-height: 400px; max-width: 250px"
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
