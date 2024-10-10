import { useState, useSyncExternalStore, createElement } from "react";
import { renderToString } from "react-dom/server";
import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { c as counter } from "../assets/counter-BwDwepJE.js";
import "vue";
function Counter({ initialCount = 0 }) {
  const [count, setCount] = useState(initialCount);
  function increment() {
    setCount(count + 1);
    counter.increment();
  }
  function decrement() {
    setCount(count - 1);
    counter.decrement();
  }
  useSyncExternalStore(
    (trigger) => counter.subscribe(trigger),
    () => counter.count.value,
    () => counter.count.value
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("h2", { children: [
      "React count: ",
      count
    ] }),
    /* @__PURE__ */ jsxs("h3", { children: [
      "Shared count: ",
      counter.count.value
    ] }),
    /* @__PURE__ */ jsx("button", { onClick: increment, children: "+" }),
    /* @__PURE__ */ jsx("button", { onClick: decrement, children: "-" })
  ] });
}
function render() {
  return renderToString(createElement(Counter));
}
export {
  render
};
