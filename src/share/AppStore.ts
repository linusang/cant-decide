import { computed } from "vue";

import type AppState from "@/models/AppState";
import type Wheel from "@/models/Wheel";

import Store from "./Store";
import type UserWheelsStore from "./UserWheelsStore";

export const APP_STORE = Symbol("AppStore");

export default class AppStore extends Store<AppState> {
  constructor(userWheelsStore: UserWheelsStore) {
    super();
    this.userWheelsStore = userWheelsStore;
  }

  private userWheelsStore: UserWheelsStore;

  protected initializeData(): AppState {
    return {
      isWheelEditorOpened: false,
      currentWheelIndex: 0,
      installPromptEvent: null,
    };
  }

  public setIsWheelEditorOpened(value: boolean) {
    this.state.isWheelEditorOpened = value;
  }

  public setCurrentWheelIndex(index: number | null): void {
    this.state.currentWheelIndex = index;
  }

  public setPromptEvent(promptEvent: BeforeInstallPromptEvent) {
    this.state.installPromptEvent = promptEvent;
  }

  public currentWheel = computed<Wheel | null>(() => {
    if (this.state.currentWheelIndex !== null) {
      return this.userWheelsStore.getState().wheels[
        this.state.currentWheelIndex
      ];
    } else {
      return null;
    }
  });
}
