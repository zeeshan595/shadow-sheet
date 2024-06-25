<script setup lang="ts">
import { computed, ref } from "vue";
import { isMobileView } from "@/consts";
import {
  diceToRoll,
  rollAdvantage,
  rollDice,
  rollModifiers,
  showDiceRoller,
} from "@/service/diceBox";
import { stringToNum } from "@/service/helpers";
import Dice from "./dice.vue";
import History from "./history.vue";
import Button from "./button.vue";
import Stat from "./stat.vue";

const diceNotation = computed(() => {
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
  return finalDice;
});
const showHistory = ref(false);

const advantage = computed({
  get() {
    return rollAdvantage.value.toString();
  },
  set(value) {
    rollAdvantage.value = stringToNum(value);
  },
});

function addDiceRoll(dice: string) {
  diceToRoll.value.push(dice);
  showDiceRoller.value = true;
}

function removeDiceRoll(dice: string) {
  const diceIndex = diceToRoll.value.findIndex((d) => d === dice);
  if (diceIndex === -1) return;
  diceToRoll.value = [
    ...diceToRoll.value.slice(0, diceIndex),
    ...diceToRoll.value.slice(diceIndex + 1),
  ];
  showDiceRoller.value = diceToRoll.value.length > 0;
}

function cancelRoll() {
  diceToRoll.value = [];
  showDiceRoller.value = false;
}

function triggerRoll() {
  const modifier = stringToNum(rollModifiers.value);
  const advantage = rollAdvantage.value;
  rollDice({
    dice: diceNotation.value,
    modifier,
    advantage,
  });
  cancelRoll();
}

function onHistoryClick() {
  showHistory.value = true;
}
</script>

<template>
  <History :visible="showHistory" @update:visible="(v) => (showHistory = v)" />
  <div
    class="gap20"
    :class="{
      'top-bar': !isMobileView,
      'bg-paper': !isMobileView,
      shadow: !isMobileView,
    }"
  >
    <div
      :id="isMobileView ? 'dice-roll' : ''"
      class="flex-row gap10 justify-start"
      :class="{ 'flex-col': isMobileView }"
    >
      <slot></slot>
      <div
        class="flex-row gap20 align-center"
        :class="{
          'flex-wrap': isMobileView,
          'justify-end': !isMobileView,
          'justify-center': isMobileView,
        }"
      >
        <div class="tooltip flex-shrink flex-basis-0">
          <span
            class="material-symbols-outlined pointer"
            @click="onHistoryClick"
          >
            history
          </span>
          <span class="tooltiptext">History</span>
        </div>
        <Dice
          type="d4"
          @click="() => addDiceRoll('d4')"
          @right-click="() => removeDiceRoll('d4')"
        />
        <Dice
          type="d6"
          @click="() => addDiceRoll('d6')"
          @right-click="() => removeDiceRoll('d6')"
        />
        <Dice
          type="d8"
          @click="() => addDiceRoll('d8')"
          @right-click="() => removeDiceRoll('d8')"
        />
        <Dice
          type="d10"
          @click="() => addDiceRoll('d10')"
          @right-click="() => removeDiceRoll('d10')"
        />
        <Dice
          type="d12"
          @click="() => addDiceRoll('d12')"
          @right-click="() => removeDiceRoll('d12')"
        />
        <Dice
          type="d20"
          @click="() => addDiceRoll('d20')"
          @right-click="() => removeDiceRoll('d20')"
        />
        <Dice
          type="d100"
          @click="() => addDiceRoll('d100')"
          @right-click="() => removeDiceRoll('d100')"
        />
      </div>
    </div>
    <div
      v-if="!isMobileView || showDiceRoller"
      :class="{
        'dice-modal-container': !isMobileView,
        'hidden-modal': !showDiceRoller && !isMobileView,
        'shown-modal': showDiceRoller && !isMobileView,
      }"
    >
      <div
        class="modal justify-end gap10 shadow p20 bg-paper align-center gap10"
        style="padding-right: 20px"
      >
        <span class="gap10">
          <span class="bold uppercase">rolling</span>
          {{ diceNotation.join(" + ") }}
        </span>
        <Stat small label="modifiers" v-model="rollModifiers" />
        <Stat small label="advantage" v-model="advantage" />
        <div class="flex-row gap10">
          <Button @click="cancelRoll" class="shadow">Cancel</Button>
          <Button @click="triggerRoll" class="shadow">Roll</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.top-bar {
  position: sticky;
  top: 0;
  padding: 20px;
  z-index: 100;
}
.dice-modal-container {
  display: block;
  position: fixed;
  top: 100px;
  right: 360px;
  z-index: 200;
  transition: 0.5s;
  opacity: 0;

  .modal {
    display: flex;
    position: absolute;
    padding: 20px;
    border-radius: 7px;
    min-width: 300px;
    margin-left: auto;
    margin-right: auto;
    z-index: 50;
  }
}
.hidden-modal {
  opacity: 0;
  pointer-events: none;
}
.shown-modal {
  opacity: 1;
}
</style>
