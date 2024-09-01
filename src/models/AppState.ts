export default interface AppState {
    isWheelEditorOpened: boolean;
    currentWheelIndex: number | null;
    installPromptEvent: BeforeInstallPromptEvent | null;
  }
  