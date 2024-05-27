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
  for (const result of results) {
    total += result.value;
  }
  if (options.modifier) {
    total += options.modifier;
  }
  diceClearTimeout = setTimeout(() => diceBox.clear(), 1000);
  if (!options.hidden) {
    // player text
    let playerText = "Rolled ";
    if (player) {
      playerText = `${player} rolled `;
    }

    // details text
    const diceDetails = results
      .map((r) => `${r.value}(d${r.sides})`)
      .join(" + ");

    // modifier text
    let modifierText = "";
    if (options.modifier) {
      modifierText = `+ ${options.modifier}`;
    }
    let criticalText = "";
    if (results.filter((d) => d.sides === 20).length === results.length) {
      const success = Math.max(...results.map((r) => r.value));
      const fail = Math.min(...results.map((r) => r.value));
      criticalText = `, ADV. ${success}, DIS. ${fail}`;
    }
    // send notifications
    sendNotification(
      `${playerText}${diceDetails} ${modifierText} = Total ${total}${criticalText}`
    );
  }
}
