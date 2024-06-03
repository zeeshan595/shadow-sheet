import { ref, computed } from "vue";
import OBR, { type Theme } from "@owlbear-rodeo/sdk";

export const boxShadow =
  "rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px";
export const theme = ref<Theme>({
  mode: "DARK",
  background: {
    default: "#1E2231",
    paper: "rgba(41, 44, 60, 0.9)",
  },
  primary: {
    contrastText: "",
    dark: "",
    light: "",
    main: "",
  },
  secondary: {
    contrastText: "",
    dark: "",
    light: "",
    main: "",
  },
  text: {
    disabled: "rgba(255, 255, 255, 0.3)",
    primary: "rgb(187, 153, 255)",
    secondary: "#ffffff",
  },
});
if (OBR && OBR.isReady) {
  OBR.theme.getTheme().then((t) => (theme.value = t));
  OBR.theme.onChange((t) => (theme.value = t));
}
document.body.style.background = theme.value.background.default;
document.body.style.color = theme.value.text.secondary;

// computed values
export const background = computed(() => theme.value.background.default);
export const backgroundPaper = computed(() => theme.value.background.paper);
export const textSecondary = computed(() => theme.value.text.secondary);
export const textPrimary = computed(() => theme.value.text.primary);
