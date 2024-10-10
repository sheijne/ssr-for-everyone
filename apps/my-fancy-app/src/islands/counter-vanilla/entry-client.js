import { counter as sharedCounter } from "../../counter-shared/counter.js";

/**
 * @param {HTMLElement} element
 */
function hydrateCounter(element) {
  const countText = /** @type {HTMLElement} */ (
    element.querySelector(".counter-count")
  );
  const sharedCountText = /** @type {HTMLElement} */ (
    element.querySelector(".counter-shared-count")
  );
  const incrementButton = element.querySelector(".counter-increment");
  const decrementButton = element.querySelector(".counter-decrement");

  function getCount() {
    return Number(countText.textContent);
  }

  /**
   * @param {number} count
   */
  function setCount(count) {
    countText.textContent = String(count);
  }

  /**
   * @param {number} count
   */
  function setSharedCount(count) {
    sharedCountText.textContent = String(count);
  }

  function increment() {
    setCount(getCount() + 1);
    sharedCounter.increment();
  }

  function decrement() {
    setCount(getCount() - 1);
    sharedCounter.decrement();
  }

  if (incrementButton) {
    incrementButton.addEventListener("click", increment);
  }

  if (decrementButton) {
    decrementButton.addEventListener("click", decrement);
  }

  sharedCounter.subscribe(setSharedCount);
}

const root = /** @type {HTMLElement} */ (
  document.getElementById("island-counter-vanilla")
);

hydrateCounter(root);
