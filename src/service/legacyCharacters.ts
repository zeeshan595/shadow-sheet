import type { Character } from "@/types/character";
import { stringToNum } from "./helpers";
import { CHARACTERS_STORE } from "./db";

function modifiersToStats(character: Character): Character {
  const str = stringToNum(character.strength);
  const dex = stringToNum(character.dexterity);
  const con = stringToNum(character.constitution);
  const int = stringToNum(character.intelligence);
  const wis = stringToNum(character.wisdom);
  const cha = stringToNum(character.charisma);

  if (str >= 5) return character;
  if (dex >= 5) return character;
  if (con >= 5) return character;
  if (int >= 5) return character;
  if (wis >= 5) return character;
  if (cha >= 5) return character;

  character.strength = `${str * 2 + 10}`;
  character.dexterity = `${dex * 2 + 10}`;
  character.constitution = `${con * 2 + 10}`;
  character.intelligence = `${int * 2 + 10}`;
  character.wisdom = `${wis * 2 + 10}`;
  character.charisma = `${cha * 2 + 10}`;
  return character;
}

function fixGearSlots(character: Character): Character {
  const itemsToAdd = 20 - character.gear.length;
  character.gear = [...character.gear, ...new Array(itemsToAdd).fill("")];
  return character;
}

export function migrateFromLocalStorage(db: IDBDatabase) {
  const raw = localStorage.getItem("characters");
  if (!raw) return;
  const characters = JSON.parse(raw) as Character[];

  const store = db.createObjectStore(CHARACTERS_STORE);

  for (const legacyCharacter of characters) {
    const character = modifiersToStats(fixGearSlots(legacyCharacter));
    store.add(character, character.uuid);
  }
}
