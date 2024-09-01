import { ContainerTransformParams } from "@/plugins/containerTransform";

export interface ContainerTransformerApi {
  performEntranceTransition: (
    params: ContainerTransformParams
  ) => Promise<void>;
  performExitTransition: (params: ContainerTransformParams) => Promise<void>;
}
