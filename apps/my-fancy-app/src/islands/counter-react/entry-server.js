import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { Counter } from "./Counter.jsx";

export function render() {
  return renderToString(createElement(Counter));
}
