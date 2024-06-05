import OBR from "@owlbear-rodeo/sdk";
import { ref, watch } from "vue";
import { characters } from "./character";
import type { Character } from "../types/character";

export const owlbearPlayerName = ref<string>("You");
export const owlbearRole = ref<"GM" | "PLAYER">("GM");

const OWLBEAR_SYNC_CHANNEL_ID = "owlbear.character-sheet.sync";
const OWLBEAR_NOTIFY_CHANNEL_ID = "owlbear.character-sheet.notify";

export function sendNotification(message: string) {
  if (!OBR || !OBR.isAvailable) {
    return alert(message);
  }
  OBR.broadcast.sendMessage(OWLBEAR_NOTIFY_CHANNEL_ID, message, {
    destination: "ALL",
  });
}
function sendCharacterToGM() {
  watch(
    characters,
    (characters) => {
      for (const character of characters.filter(
        (character) => character.sync
      )) {
        OBR.broadcast.sendMessage(
          OWLBEAR_SYNC_CHANNEL_ID,
          JSON.stringify(character)
        );
      }
    },
    { deep: true }
  );
}
function fetchCharactersFromPlayers() {
  OBR.broadcast.onMessage(OWLBEAR_SYNC_CHANNEL_ID, (event) => {
    const character = JSON.parse(event.data as string) as Character;
    const existingCharacterIndex = characters.value.findIndex(
      (c) => c.uuid === character.uuid
    );
    if (existingCharacterIndex < 0) {
      characters.value = [character, ...characters.value];
    } else {
      const temp = [...characters.value];
      temp[existingCharacterIndex] = character;
      characters.value = temp;
    }
  });
}
function fetchNotification() {
  OBR.broadcast.onMessage(OWLBEAR_NOTIFY_CHANNEL_ID, async (event) => {
    OBR.notification.show(event.data as string);
  });
}

function setOwlbearRole() {
  return OBR.player.getRole().then((role) => (owlbearRole.value = role));
}

function setOwlbearName() {
  setInterval(() => {
    OBR.player.getName().then((name) => (owlbearPlayerName.value = name));
  }, 1000);
}

let isReady = false;
if (OBR && OBR.isAvailable) {
  OBR.onReady(async () => {
    if (isReady) return;
    await setOwlbearRole();
    setOwlbearName();
    fetchNotification();

    if (owlbearRole.value === "GM") {
      fetchCharactersFromPlayers();
    } else {
      sendCharacterToGM();
    }
    isReady = true;
  });
}
