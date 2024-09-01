export function usePwaInstaller(
  deferredPromptCallback: (deferredPrompt: BeforeInstallPromptEvent) => void
) {
  window.addEventListener("beforeinstallprompt", (e) => {
    const promptEvent = e as BeforeInstallPromptEvent;

    // Prevent the mini-infobar from appearing on mobile
    promptEvent.preventDefault();
    deferredPromptCallback(promptEvent);
  });

  // @ts-ignore
  // if (navigator.getInstalledRelatedApps) {
  //   navigator.getInstalledRelatedApps().then((relatedApps: InstalledApp[]) => {
  //     console.log({ relatedApps });
  //   });
  // }
}

let registration: () => void;

export function usePwaUpdater(appUpdated: () => void) {
  if (!navigator.serviceWorker) {
    console.info("no service worker!");
    return;
  }

  function onSwUpdated(event: Event) {
    registration = (event as CustomEvent<() => void>).detail;
    if (appUpdated) {
      appUpdated();
    }
  }

  document.addEventListener("swUpdated", onSwUpdated, { once: true });

  // let refreshing = false;
  // navigator.serviceWorker.addEventListener("controllerchange", () => {
  //   // We'll also need to add 'refreshing' to our data originally set to false.
  //   if (refreshing) return;
  //   refreshing = true;
  //   // Here the actual reload of the page occurs
  //   window.location.reload();
  // });
}

export function refreshApp() {
  // Make sure we only send a 'skip waiting' message if the SW is waiting
  //if (!registration || !registration.waiting) return;
  // send message to SW to skip the waiting and activate the new SW
  //registration.waiting.postMessage({ type: "SKIP_WAITING" });
  if (registration) {
    registration();
  }
}
