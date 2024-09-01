// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { registerSW } from "virtual:pwa-register";

if (import.meta.env.PROD) {
  const updateSW = registerSW({
    onNeedRefresh() {
      // show a prompt to user
      console.log("New content is available; please refresh.");

      document.dispatchEvent(
        new CustomEvent<ServiceWorkerRegistration>("swUpdated", {
          detail: updateSW,
        })
      );

      // from https://stackoverflow.com/questions/54145735/vue-pwa-not-getting-new-content-after-refresh
      caches.keys().then(function (names) {
        for (const name of names) caches.delete(name);
      });
    },
    onOfflineReady() {
      // show a ready to work offline to user
    },
  });
}
