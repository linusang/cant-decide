import { ContainerTransformParams } from "@/plugins/containerTransform";

export interface ModalTransformerApi {
  open: (params: ContainerTransformParams) => Promise<void>;
  close: (params: ContainerTransformParams) => Promise<void>;
}
