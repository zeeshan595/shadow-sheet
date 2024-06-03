<script setup lang="ts">
import { ref } from "vue";
import { rollDice } from "@/service/diceBox";
import { modal } from "@/hooks/modal";
import { isMobileView } from "@/consts";
import { owlbearPlayerName } from "@/service/owlbear";
import Dice from "./dice.vue";

const diceToRoll = ref<string[]>([]);

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
          rollDice({ dice: finalDice }, owlbearPlayerName.value);
          break;
      }
    },
  };
}
</script>

<template>
  <div
    :class="{
      'top-bar': !isMobileView,
      'bg-paper': !isMobileView,
      shadow: !isMobileView,
    }"
  >
    <div
      class="flex-row gap10 justify-start"
      :class="{ 'flex-col': isMobileView }"
    >
      <slot></slot>
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
  </div>
</template>

<style scoped>
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 20px;
}
</style>
