import "./App.css";
import "./handleServiceWorker";

import { createApp } from "vue";

import App from "./App.vue";
import router from "./router/router";
import { registerDirectives } from "./share/directives/registerDirectives";

const app = createApp(App);
registerDirectives(app);
app.use(router).mount("#app");
