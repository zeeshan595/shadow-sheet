import { ref } from "vue";

export type ContextMenuProps = {
  items: string[];
  click: (itemIndex: number) => void;
};

export const ContextMenu = ref<ContextMenuProps | null>();
