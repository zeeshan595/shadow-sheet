import OBR from "@owlbear-rodeo/sdk";
import { ref } from "vue";
import { characters } from "./service/character";
import type { Character } from "./types/character";

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
  setInterval(() => {
    for (const character of characters.value.filter(
      (character) => character.sync
    )) {
      OBR.broadcast.sendMessage(
        OWLBEAR_SYNC_CHANNEL_ID,
        JSON.stringify(character)
      );
    }
  }, 5000);
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
let isReady = false;
if (OBR && OBR.isAvailable) {
  OBR.onReady(async () => {
    if (isReady) return;
    const role = await OBR.player.getRole();
    owlbearRole.value = role;
    fetchNotification();

    if (role === "GM") fetchCharactersFromPlayers();
    else sendCharacterToGM();
    isReady = true;
  });
}
