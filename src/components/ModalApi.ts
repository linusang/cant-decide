import { Ref } from "vue";

export interface ModalOptions {
  hideHeader?: boolean;
  hideFooter?: boolean;
  bodyFlexGrow?: boolean;
  bodyOverflowAuto?: boolean;
}

export interface ModalApi {
  isOpened: Ref<boolean>;
  open: () => void;
  close: () => void;
}
