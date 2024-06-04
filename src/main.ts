import "./assets/main.css";
import { createApp } from "vue";
import "./service/db";

// Components
import App from "./App.vue";
import { router } from "./router";

createApp(App).use(router).mount("#app");
