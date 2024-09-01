import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

import Toto from "../views/Toto.vue";
import WheelMain from "../views/WheelMain.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "WheelMain",
    component: WheelMain,
  },
  {
    path: "/toto",
    name: "Toto",
    component: Toto,
  },
];

// if (!import.meta.env.PROD) {
//   routes.push({
//     path: "/explore",
//     name: "Explore",
//     // route level code-splitting
//     component: () => import("../views/Explore.vue"),
//   });
// }

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
