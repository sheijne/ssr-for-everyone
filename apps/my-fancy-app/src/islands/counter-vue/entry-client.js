import { createSSRApp } from "vue";
import Counter from "./Counter.vue";

const app = createSSRApp(Counter);

app.mount("#island-counter-vue");
