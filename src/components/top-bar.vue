<script setup lang="ts">
import { ref } from "vue";
import { rollDice } from "@/service/diceBox";
import { modal } from "@/hooks/modal";
import { router } from "@/router";
import { owlbearRole } from "@/service/owlbear";
import { background, boxShadow } from "@/theme";
import Button from "./button.vue";
import Toggle from "./toggle.vue";
import Dice from "./dice.vue";

const diceToRoll = ref<string[]>([]);

const props = defineProps<{
  playerName: string;
  isMobileView: boolean;
  modelValue: boolean;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

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
          rollDice({ dice: finalDice }, props.playerName);
          break;
      }
    },
  };
}
function onBackClick() {
  modal.value = null;
  router.push("/");
}
</script>

<template>
  <div
    :class="{
      'top-bar': !props.isMobileView,
    }"
  >
    <div
      class="flex-row gap10 justify-start"
      :class="{ 'flex-col': isMobileView }"
    >
      <Button label="Back" @click="onBackClick" />
      <div
        v-if="owlbearRole === 'PLAYER'"
        class="flex-shrink flex-basis-0"
        :class="{
          'justify-center': isMobileView,
          'align-center': isMobileView,
        }"
      >
        <Toggle v-model="props.modelValue" />
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
  </div>
</template>

<style>
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background-color: v-bind(background);
  box-shadow: v-bind(boxShadow);
}
</style>
