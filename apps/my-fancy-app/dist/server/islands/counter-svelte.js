import { DEV } from "esm-env";
import { c as counter } from "../assets/counter-BwDwepJE.js";
import "vue";
const HYDRATION_START = "[";
const HYDRATION_END = "]";
const CONTENT_REGEX = /[&<]/g;
function escape_html(value, is_attr) {
  const str = String(value ?? "");
  const pattern = CONTENT_REGEX;
  pattern.lastIndex = 0;
  let escaped = "";
  let last = 0;
  while (pattern.test(str)) {
    const i = pattern.lastIndex - 1;
    const ch = str[i];
    escaped += str.substring(last, i) + (ch === "&" ? "&amp;" : ch === '"' ? "&quot;" : "&lt;");
    last = i + 1;
  }
  return escaped + str.substring(last);
}
var current_component = null;
function push(fn) {
  current_component = { p: current_component, c: null, d: null };
  if (DEV) {
    current_component.function = fn;
  }
}
function pop() {
  var component = (
    /** @type {Component} */
    current_component
  );
  var ondestroy = component.d;
  if (ondestroy) {
    on_destroy.push(...ondestroy);
  }
  current_component = component.p;
}
const BLOCK_OPEN = `<!--${HYDRATION_START}-->`;
const BLOCK_CLOSE = `<!--${HYDRATION_END}-->`;
let on_destroy = [];
function render$1(component, options = {}) {
  const payload = { out: "", css: /* @__PURE__ */ new Set(), head: { title: "", out: "" } };
  const prev_on_destroy = on_destroy;
  on_destroy = [];
  payload.out += BLOCK_OPEN;
  if (options.context) {
    push();
    current_component.c = options.context;
  }
  component(payload, options.props ?? {}, {}, {});
  if (options.context) {
    pop();
  }
  payload.out += BLOCK_CLOSE;
  for (const cleanup of on_destroy) cleanup();
  on_destroy = prev_on_destroy;
  let head = payload.head.out + payload.head.title;
  for (const { hash, code } of payload.css) {
    head += `<style id="${hash}">${code}</style>`;
  }
  return {
    head,
    html: payload.out,
    body: payload.out
  };
}
function Counter($$payload, $$props) {
  push();
  let count = 0;
  let sharedCount = 0;
  counter.subscribe((value) => {
    sharedCount = value;
  });
  $$payload.out += `<h2>Svelte count: ${escape_html(count)}</h2> <h3>Shared count: ${escape_html(sharedCount)}</h3> <button>+</button> <button>-</button>`;
  pop();
}
function render() {
  const { body } = render$1(Counter, {});
  return body;
}
export {
  render
};
