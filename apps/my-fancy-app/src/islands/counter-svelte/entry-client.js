import { hydrate } from "svelte";
import Counter from "./Counter.svelte";

hydrate(Counter, { target: document.getElementById("island-counter-svelte") });
