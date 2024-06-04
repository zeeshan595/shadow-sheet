import { computed, ref } from "vue";
import { migrateFromLocalStorage } from "./legacyCharacters";

export const CHARACTERS_STORE = "characters";

export const isReady = ref<boolean>(false);
export const db = ref<IDBDatabase | null>(null);
const request = indexedDB.open("character-sheet.online", 1);
request.onerror = console.error;
request.onupgradeneeded = function (event) {
  const db = request.result;
  switch (event.oldVersion) {
    case 0:
      migrateFromLocalStorage(db);
      break;
  }
};
request.onsuccess = function () {
  db.value = request.result;
  isReady.value = true;
};

export function getDb(): Promise<IDBDatabase> {
  let timeout = 5000;
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (isReady.value) {
        resolve(request.result);
        clearInterval(interval);
      }
      if (timeout <= 0) {
        throw new Error("timed out when getting database");
      } else {
        timeout -= 100;
      }
    }, 100);
  });
}
