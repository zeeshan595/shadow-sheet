import "./assets/main.css";
import { createApp } from "vue";

// Components
import App from "./App.vue";
import { router } from "./router";
import VTooltip from "v-tooltip";

createApp(App).use(VTooltip).use(router).mount("#app");
