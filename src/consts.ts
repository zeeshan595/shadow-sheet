import { computed, ref } from "vue";

export const MOBILE_VIEW_MAX_WIDTH = 620;
export const windowWidth = ref<number>(0);
export const isMobileView = computed(() => windowWidth.value < MOBILE_VIEW_MAX_WIDTH);
