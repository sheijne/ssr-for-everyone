import { ref, watch } from "vue";

/**
 * @returns {{
 *  count: import('vue').Ref<number>,
 *  increment(): void,
 *  decrement(): void,
 *  subscribe(fn: import('vue').WatchCallback<number, number>)
 * }}
 */
export function createCounterShared() {
  const count = ref(0);

  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  return {
    count,
    increment,
    decrement,
    subscribe(fn) {
      return watch(count, fn);
    },
  };
}

export const counter = createCounterShared();
