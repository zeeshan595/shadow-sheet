<script setup lang="ts">
import { ref } from "vue";
import { rollDice } from "@/service/diceBox";
import { isMobileView } from "@/consts";
import { owlbearPlayerName } from "@/service/owlbear";
import Dice from "./dice.vue";
import Button from "./button.vue";
import History from "./history.vue";

type ModalProps = {
  message: string;
  actions: string[];
  onActionClick: (index: number) => void;
};
const modal = ref<ModalProps | null>();
const diceToRoll = ref<string[]>([]);
const showHistory = ref(false);

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

function onHistoryClick() {
  showHistory.value = true;
}
</script>

<template>
  <History :visible="showHistory" @update:visible="(v) => (showHistory = v)" />
  <div v-if="modal" class="dice-modal-container">
    <div class="modal flex-grow gap20 bg-paper shadow">
      <div
        class="flex-grow flex-basis-100 justify-start align-start"
        style="width: 100%"
      >
        {{ modal.message }}
      </div>
      <div class="flex-row justify-center flex-shrink flex-basis-0 gap20">
        <Button
          v-for="(action, index) in modal.actions"
          @click="() => modal!.onActionClick(index)"
        >
          {{ action }}
        </Button>
      </div>
    </div>
  </div>
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
        class="flex-row gap20 align-center"
        :class="{
          'flex-wrap': isMobileView,
          'justify-end': !isMobileView,
          'justify-center': isMobileView,
        }"
      >
        <span class="material-symbols-outlined pointer" @click="onHistoryClick">
          history
        </span>
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

<style scoped lang="scss">
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 20px;
}
.dice-modal-container {
  display: block;
  position: fixed;
  top: 100px;
  right: 260px;

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
