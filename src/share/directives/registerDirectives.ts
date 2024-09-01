import type { App } from "vue";

import clickOutsideFunc from "./click-outside";

export function registerDirectives(app: App) {
  app.directive("click-outside", clickOutsideFunc);
}
