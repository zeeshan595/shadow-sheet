<script setup lang="ts">
import { ref } from "vue";
import Button from "./button.vue";
import Toggle from "./toggle.vue";
import { ContextMenu } from "@/hooks/context-menu";
import {
  DiceBoxThemes,
  rollDicePreview,
  setDiceBoxTheme,
} from "@/service/diceBox";
import {
  characters,
  deleteAllCharacters,
  saveCharacter,
  uploadCharacter,
} from "@/service/character";

const use2d10 = ref(localStorage.getItem("use2D10") == "1");

function setUse2d10(value: boolean) {
  localStorage.setItem("use2D10", value ? "1" : "0");
  use2d10.value = value;
}

function onDiceThemeClick() {
  ContextMenu.value = {
    items: Object.keys(DiceBoxThemes),
    click: (index: number) => {
      setDiceBoxTheme(Object.values(DiceBoxThemes)[index]).then(() => {
        rollDicePreview(["1d4", "1d6", "1d8", "1d10", "1d12", "1d20"]);
      });
    },
  };
}
async function loadCharacter() {
  const newCharacter = await uploadCharacter();
  if (newCharacter) {
    const existingCharIndex = characters.value.findIndex(
      (c) => c.uuid === newCharacter.uuid
    );
    if (existingCharIndex > -1) {
      const temp = [...characters.value];
      temp[existingCharIndex] = characters.value[existingCharIndex];
      characters.value = temp;
    } else {
      characters.value = [...characters.value, newCharacter];
    }
    saveCharacter(newCharacter);
  }
}
async function onDeleteAllCharacters() {
  if (confirm("Are you sure you want to delete all characters?")) {
    await deleteAllCharacters();
    characters.value = [];
  }
}

const props = defineProps<{
  visible: boolean;
}>();
const emits = defineEmits<{
  (e: "update:visible", visible: boolean): void;
}>();
</script>
<template>
  <div v-if="props.visible" class="container">
    <div class="window bg-paper rounded justify-start align-center gap20">
      <div class="flex-row">
        <h2>Options</h2>
        <div
          class="close-button pointer"
          @click="() => emits('update:visible', false)"
        >
          <span class="material-symbols-outlined"> close </span>
        </div>
      </div>
      <Button class="items-container" @click="onDiceThemeClick">
        Dice Theme
      </Button>
      <Toggle :model-value="use2d10" @update:model-value="setUse2d10"
        >Use 2D10 instead of D20</Toggle
      >
      <Button class="items-container" @click="loadCharacter">
        Load Character
      </Button>
      <Button class="items-container" @click="onDeleteAllCharacters">
        Delete All Characters
      </Button>
    </div>
  </div>
</template>

<style scoped scss>
.container {
  display: block;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.3);
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 900;

  .window {
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 10px;
    height: calc(100% - 60px);

    div {
      flex-shrink: 1;
      flex-grow: 0;
      flex-basis: auto;
    }
    .close-button {
      display: block;
      position: absolute;
      right: 40px;
      top: 40px;
    }
  }
}
.items-container {
  display: block;
  overflow-y: auto;
  width: 100%;

  .items {
    width: 100%;
  }
}
</style>
