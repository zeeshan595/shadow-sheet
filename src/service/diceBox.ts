// @ts-ignore
import DiceBox from "@3d-dice/dice-box";
import { sendNotification, owlbearPlayerName } from "./owlbear";
import { randomRange } from "./helpers";
import { ref } from "vue";

const THEME_KEY = "dicebox-theme";
const audio = new Audio("/assets/dice-roll.mp3");
audio.loop = false;
export const history = ref<string[]>([]);
export enum DiceBoxThemes {
  BlueGreenMetal = "blueGreenMetal",
  DiceOfRolling = "diceOfRolling",
  Gemstone = "gemstone",
  GemstoneMarble = "gemstoneMarble",
  Rock = "rock",
  Rust = "rust",
  Smooth = "smooth",
  Wooden = "wooden",
}
export const diceBox = new DiceBox("#dice-box", {
  assetPath: "/assets/dice-box/",
  themes: Object.values(DiceBoxThemes),
  mass: 5,
  throwForce: randomRange(10, 30),
  spinForce: randomRange(5, 10),
  restitution: 0.6,
  offscreen: false,
});
diceBox.init().then(() => {
  setDiceBoxTheme(getDiceBoxTheme());
});

export async function setDiceBoxTheme(theme: DiceBoxThemes) {
  localStorage.setItem(THEME_KEY, theme);
  await diceBox.updateConfig({ theme });
}
export function getDiceBoxTheme(): DiceBoxThemes {
  const theme: unknown = localStorage.getItem(THEME_KEY);
  if (!theme) return DiceBoxThemes.Smooth;
  return theme as DiceBoxThemes;
}

let diceClearTimeout: number | null = null;
export type RollDiceOptions = {
  dice: string | string[];
  modifier?: number;
  hidden?: boolean;
};
export type DiceRollResult = {
  diceType: string;
  sides: number;
  value: number;
};
export async function rollDice(options: RollDiceOptions) {
  audio.play();
  if (diceClearTimeout) clearTimeout(diceClearTimeout);
  const results: DiceRollResult[] = await diceBox.roll(options.dice);
  let total = 0;
  for (const result of results) {
    total += result.value;
  }
  diceClearTimeout = setTimeout(() => diceBox.clear(), 5000);
  if (!options.hidden) {
    // player text
    let playerText = "Rolled ";
    if (owlbearPlayerName.value) {
      playerText = `${owlbearPlayerName.value} rolled `;
    }

    // details text
    let diceDetails = results.map((r) => `${r.value}(d${r.sides})`).join(" + ");

    if (options.modifier !== undefined) {
      total += options.modifier;
      if (options.modifier >= 0) {
        diceDetails += ` + ${options.modifier}`;
      } else {
        diceDetails += ` - ${options.modifier * -1}`;
      }
    }

    // advantage & dis-advantage
    let finalText = `Total ${total}`;
    if (
      results.length > 1 &&
      results.filter((d) => d.sides === 20).length === results.length
    ) {
      let success = Math.max(...results.map((r) => r.value));
      let fail = Math.min(...results.map((r) => r.value));
      if (options.modifier !== undefined) {
        success += options.modifier;
        fail += options.modifier;
      }
      finalText = `Total ${total}, ADV. ${success}, DIS. ${fail}`;
    }
    // send notifications
    sendNotification(`${playerText}${diceDetails} = ${finalText}`, true);
  }
}
