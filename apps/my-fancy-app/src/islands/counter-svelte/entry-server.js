import { render as renderSvelteComponent } from "svelte/server";
import Counter from "./Counter.svelte";

export function render() {
  const { body } = renderSvelteComponent(Counter, {});
  return body;
}
