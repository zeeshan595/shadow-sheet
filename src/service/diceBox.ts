// @ts-ignore
import DiceBox from "@3d-dice/dice-box";
import { sendNotification, owlbearPlayerName } from "./owlbear";
import { randomRange } from "./helpers";
import { ref } from "vue";

export const showDiceRoller = ref(false);
export const rollModifiers = ref<string>("0");
export const rollAdvantage = ref(0);
export const diceToRoll = ref<string[]>([]);

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

export type RollDiceOptions = {
  dice: string | string[];
  modifier?: number;
  advantage?: number;
};
export type DiceRollResult = {
  diceType: string;
  sides: number;
  value: number;
};
export async function rollDicePreview(dice: string[]) {
  // play audio
  audio.play();

  // roll dice
  await diceBox.roll(dice);
}
export async function rollDice(options: RollDiceOptions) {
  // play audio
  audio.play();
  const isUsingAdvantage = options.advantage !== undefined && options.advantage !== 0;

  // roll dice
  const results: DiceRollResult[][] = [await diceBox.roll(options.dice)];

  // roll extra dice for advantage
  if (isUsingAdvantage) {
    for (let i = 0; i < Math.abs(options.advantage!); i++) {
      audio.play();
      results.push(await diceBox.roll(options.dice));
    }
  }

  let total = 0;
  // get value with advantage or dis-advantage
  const diceResult = results.map(
    r => r.map(d => d.value).reduce((sum, a) => sum + a, 0)
  );
  if (options.advantage && options.advantage > 0) {
    total = Math.max(...diceResult);
  } else if (options.advantage && options.advantage < 0) {
    total = Math.min(...diceResult);
  } else {
    total = diceResult[0];
  }

  // player text
  let playerText = "Rolled ";
  if (owlbearPlayerName.value) {
    playerText = `${owlbearPlayerName.value} rolled `;
  }

  // details text
  let diceDetails = '';
  if (results.length === 1) {
    diceDetails = results[0].map((r) => `${r.value}(d${r.sides})`).join(" + ");
  } else {
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (i > 0) diceDetails += ' || ';
      diceDetails += '(';
      diceDetails += result.map((r) => `${r.value}(d${r.sides})`).join(" + ");
      diceDetails += ')';
    }
  }

  if (options.modifier !== undefined && options.modifier !== 0) {
    total += options.modifier;
    if (options.modifier >= 0) {
      diceDetails += ` + ${options.modifier}`;
    } else {
      diceDetails += ` - ${options.modifier * -1}`;
    }
  }

  // advantage & dis-advantage
  let finalText = `Total ${total}`;
  if (isUsingAdvantage) {
    if (options.advantage! > 0) {
      finalText += ' with +ADV';
    } else if (options.advantage! < 0) {
      finalText += ' with -DIS';
    }
  }
  // send notifications
  sendNotification(`${playerText}${diceDetails} = ${finalText}`, true);
  diceBox.clear();
}
