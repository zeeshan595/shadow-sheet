import {
  createMemoryHistory,
  createRouter,
  type RouteRecordRaw,
} from "vue-router";
import HomePage from "./pages/HomePage.vue";
import CharacterSheetPage from "./pages/CharacterSheetPage.vue";

export const routes: RouteRecordRaw[] = [
  { path: "/", component: HomePage },
  { path: "/character/:uuid", component: CharacterSheetPage },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
