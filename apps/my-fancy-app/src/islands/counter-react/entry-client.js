import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Counter } from "./Counter.jsx";

const root = createRoot(document.querySelector("#island-counter-react"));
root.render(createElement(Counter));
