<script setup lang="ts">
import { computed, ref, watch } from "vue";
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
import Checkbox from "./checkbox.vue";

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

const rollWithAdvantage = computed({
  get() {
    return rollAdvantage.value > 0;
  },
  set(value) {
    rollAdvantage.value = value ? 1 : 0;
  },
});
const rollWithDisadvantage = computed({
  get() {
    return rollAdvantage.value < 0;
  },
  set(value) {
    rollAdvantage.value = value ? -1 : 0;
  },
});

function addDiceRoll(dice: string) {
  diceToRoll.value.push(dice);
  showDiceRoller.value = true;
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
        <Dice type="d4" @click="() => addDiceRoll('d4')" />
        <Dice type="d6" @click="() => addDiceRoll('d6')" />
        <Dice type="d8" @click="() => addDiceRoll('d8')" />
        <Dice type="d10" @click="() => addDiceRoll('d10')" />
        <Dice type="d12" @click="() => addDiceRoll('d12')" />
        <Dice type="d20" @click="() => addDiceRoll('d20')" />
        <Dice type="d100" @click="() => addDiceRoll('d100')" />
      </div>
    </div>
    <div v-if="showDiceRoller">
      <div
        class="modal justify-end gap10"
        :class="{
          'align-center': isMobileView,
          'align-end': !isMobileView,
        }"
        style="padding-right: 20px"
      >
        <span class="gap10">
          <span class="bold uppercase">rolling</span>
          {{ diceNotation.join(" + ") }}
        </span>
        <Stat small label="modifiers" v-model="rollModifiers" />
        <Checkbox label="Advantage" v-model="rollWithAdvantage" />
        <Checkbox label="Disadvantage" v-model="rollWithDisadvantage" />
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
  right: 260px;
  z-index: 200;

  .modal {
    display: flex;
    position: absolute;
    padding: 20px;
    border-radius: 7px;
    min-width: 200px;
    margin-left: auto;
    margin-right: auto;
    z-index: 50;
  }
}
</style>
