import type Choice from "@/models/Choice";

export interface OnMountedContext {
  choice: Choice;
  focusTextInput(): void;
}
