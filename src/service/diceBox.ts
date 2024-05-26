// @ts-ignore
import DiceBox from "@3d-dice/dice-box";
import { sendNotification } from "./owlbear";

const THEME_KEY = "dicebox-theme";

export enum DiceBoxThemes {
  BlueGreenMetal = "blueGreenMetal",
  Default = "default",
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
});
diceBox.init();

export async function setDiceBoxTheme(theme: DiceBoxThemes) {
  localStorage.setItem(THEME_KEY, theme);
  await diceBox.updateConfig({ theme: theme });
}
export function getDiceBoxTheme(): DiceBoxThemes {
  const theme = localStorage.getItem(THEME_KEY);
  if (!theme) return DiceBoxThemes.Default;
  return (theme as DiceBoxThemes) ?? DiceBoxThemes.Default;
}

let diceClearTimeout: number | null = null;
export type RollDiceOptions = {
  dice: string | string[];
  modifier?: number;
  advantage?: "ADV" | "DIS";
  hidden?: boolean;
};
export type DiceRollResult = {
  diceType: string;
  sides: number;
  value: number;
};
export async function rollDice(options: RollDiceOptions, player?: string) {
  if (diceClearTimeout) clearTimeout(diceClearTimeout);
  const results: DiceRollResult[] = await diceBox.roll(options.dice);
  let total = 0;
  let criticalSuccess = false;
  let criticalFail = false;
  if (options.advantage === "ADV") {
    total = Math.max(...results.map((r) => r.value));

    if (results[0].sides === 20) {
      const nat20 = results.find((r) => r.value === 20);
      if (nat20) {
        criticalSuccess = true;
      } else if (total === 1) {
        criticalFail = true;
      }
    }
  } else if (options.advantage === "DIS") {
    total = Math.min(...results.map((r) => r.value));

    if (results[0].sides === 20) {
      const nat1 = results.find((r) => r.value === 1);
      if (nat1) {
        criticalFail = true;
      } else if (total === 20) {
        criticalSuccess = true;
      }
    }
  } else {
    for (const result of results) {
      total += result.value;

      if (result.sides === 20) {
        if (result.value === 20) {
          criticalSuccess = true;
        } else if (result.value === 1) {
          criticalFail = true;
        }
      }
    }
  }
  if (options.modifier) {
    total += options.modifier;
  }
  diceClearTimeout = setTimeout(() => diceBox.clear(), 1000);
  if (!options.hidden) {
    let criticalMessage = "";
    if (criticalSuccess) {
      criticalMessage = ` with CRITICAL SUCCESS`;
    } else if (criticalFail) {
      criticalMessage = ` with CRITICAL FAIL`;
    }
    sendNotification(`${player} rolled: ${total}${criticalMessage}`);
  }
}
