import OBR from "@owlbear-rodeo/sdk";
import { ref } from "vue";
import { characters, saveCharacter } from "./character";
import { history } from "./diceBox";
import type { Character } from "../types/character";

export const owlbearPlayerName = ref<string>("You");
export const owlbearRole = ref<"GM" | "PLAYER">("PLAYER");

const OWLBEAR_SYNC_CHANNEL_ID = "owlbear.character-sheet.sync";
const OWLBEAR_NOTIFY_CHANNEL_ID = "owlbear.character-sheet.notify";

function pushMessageToHistory(message: string) {
  history.value = [message, ...history.value];
  if (history.value.length > 20) {
    history.value = history.value.slice(0, 20);
  }
}
export function sendNotification(message: string) {
  if (!OBR || !OBR.isAvailable) {
    pushMessageToHistory(message);
    return alert(message);
  }
  OBR.broadcast.sendMessage(OWLBEAR_NOTIFY_CHANNEL_ID, message, {
    destination: "ALL",
  });
}
export function sendCharacterToGM(character: Character) {
  if (isReady) {
    OBR.broadcast.sendMessage(
      OWLBEAR_SYNC_CHANNEL_ID,
      JSON.stringify(character)
    );
  }
}

let isReady = false;
if (OBR && OBR.isAvailable) {
  OBR.onReady(async () => {
    if (isReady) return;

    // handle player data
    OBR.player.getName().then((name) => (owlbearPlayerName.value = name));
    OBR.player.getRole().then((role) => (owlbearRole.value = role));
    OBR.player.onChange((player) => {
      owlbearPlayerName.value = player.name;
      owlbearRole.value = player.role;
    });

    // handle notifications
    OBR.broadcast.onMessage(OWLBEAR_NOTIFY_CHANNEL_ID, async (event) => {
      pushMessageToHistory(event.data as string);
      OBR.notification.show(event.data as string);
    });

    // handle syncing characters with GM
    OBR.broadcast.onMessage(OWLBEAR_SYNC_CHANNEL_ID, (event) => {
      // only run for GM
      if (owlbearRole.value !== "GM") return;
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
      saveCharacter(character);
    });

    // send existing characters to GM
    for (const character of characters.value) {
      sendCharacterToGM(character);
    }
    isReady = true;
  });
}
