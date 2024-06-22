import { ref } from "vue";
import OBR, { type Theme } from "@owlbear-rodeo/sdk";

export type ShadowType = { shadow: string };

export const defaultShadow = "0 1px 3px 1px rgba(0, 0, 0, 0.3)";
const DEFAULT_THEMES = {
  DARK: {
    mode: "DARK",
    primary: {
      main: "#bb99ff",
      light: "rgb(200, 173, 255)",
      dark: "rgb(130, 107, 178)",
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
    secondary: {
      main: "#ee99ff",
      light: "rgb(241, 173, 255)",
      dark: "rgb(166, 107, 178)",
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
    background: {
      paper: "#222639",
      default: "#1e2231",
    },
    text: {
      disabled: "rgba(255, 255, 255, 0.5)",
      primary: "#fff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
    shadow: defaultShadow,
  },
  LIGHT: {
    mode: "LIGHT",
    primary: {
      main: "#9966ff",
      light: "rgb(173, 132, 255)",
      dark: "rgb(107, 71, 178)",
      contrastText: "#fff",
    },
    secondary: {
      main: "#dd33ff",
      light: "rgb(227, 91, 255)",
      dark: "rgb(154, 35, 178)",
      contrastText: "#fff",
    },
    background: {
      paper: "#f1f3f9",
      default: "#dde1ee",
    },
    text: {
      disabled: "rgba(0, 0, 0, 0.38)",
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.6)",
    },
    shadow: defaultShadow,
  },
} as const;

export const theme = ref<Theme & ShadowType>(DEFAULT_THEMES.DARK);
document.body.style.background = theme.value.background.default;
document.body.style.color = theme.value.text.secondary;

function setTheme(t: Theme) {
  if (!t) return;
  theme.value = {
    ...t,
    shadow: defaultShadow,
  };
  document.body.style.background = t.background.default;
  document.body.style.color = t.text.secondary;
}
if (OBR) {
  OBR.onReady(() => {
    OBR.theme.getTheme().then((t) => setTheme(t));
    OBR.theme.onChange(setTheme);
  });
}
