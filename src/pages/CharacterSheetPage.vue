<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { router } from "@/router";
import { characters, saveCharacter } from "@/service/character";
import { useRoute } from "vue-router";
import { isMobileView } from "@/consts";
import { owlbearRole, sendCharacterToGM } from "@/service/owlbear";
import type { Character } from "@/types/character";
import { stringToNum } from "@/service/helpers";
import Gear from "@/components/gear.vue";
import Stat from "@/components/stat.vue";
import TopBar from "@/components/top-bar.vue";
import TextField from "@/components/text-field.vue";
import Button from "@/components/button.vue";
import Toggle from "@/components/toggle.vue";
import TrackerEdit from "@/components/tracker-edit.vue";

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
function updateTracker(index: number, value: string) {
  const trackers = [...character.value.trackers];
  trackers[index].value = stringToNum(value);
  character.value = {
    ...character.value,
    trackers,
  };
}
const editingTrackerIndex = ref<number | null>(null);
const editingTrackerName = computed(() => {
  if (!editingTrackerIndex.value) return "";
  if (editingTrackerIndex.value < 0) return "";
  if (editingTrackerIndex.value >= character.value.trackers.length) return "";
  return character.value.trackers[editingTrackerIndex.value].name;
});
function createNewTracker() {
  character.value.trackers.push({
    name: "New Tracker",
    value: 0,
  });
  editingTrackerIndex.value = character.value.trackers.length - 1;
}
function saveTracker(name: string) {
  if (!editingTrackerIndex.value) return;
  const trackers = [...character.value.trackers];
  trackers[editingTrackerIndex.value].name = name;
  character.value = {
    ...character.value,
    trackers,
  };
  editingTrackerIndex.value = null;
}
function deleteTracker() {
  if (!editingTrackerIndex.value) return;
  const trackers = [
    ...character.value.trackers.slice(0, editingTrackerIndex.value),
    ...character.value.trackers.slice(editingTrackerIndex.value + 1),
  ];
  character.value = {
    ...character.value,
    trackers,
  };
  editingTrackerIndex.value = null;
}
</script>

<template>
  <TrackerEdit
    :visible="editingTrackerIndex !== null"
    :name="editingTrackerName"
    @save="saveTracker"
    @delete="deleteTracker"
  />
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
  <div class="gap10 page-padding gap10">
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
    <div class="flex-row gap10 flex-basis-0 flex-wrap">
      <Stat
        v-for="(tracker, index) in character.trackers"
        small
        is-label-clickable
        :label="tracker.name"
        :model-value="`${tracker.value}`"
        @update:model-value="(value) => updateTracker(index, value)"
        @label:click="() => (editingTrackerIndex = index)"
      />
    </div>
    <div class="shadow" style="margin-top: 10px; margin-bottom: 10px">
      <Button @click="createNewTracker">+ Add another tracker</Button>
    </div>
    <div
      class="flex-row gap10"
      :class="{ 'flex-col': isMobileView }"
      style="margin-bottom: 10px"
    >
      <div class="gap10" style="min-height: 400px">
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
      class="flex-row gap10 justify-start gap20"
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
