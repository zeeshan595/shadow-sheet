import { ref } from "vue";

export type ModalProps = {
  message: string;
  actions: string[];
  onActionClick: (index: number) => void;
};

export const modal = ref<ModalProps | null>();
