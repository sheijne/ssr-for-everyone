import { ref, watch } from "vue";
function createCounterShared() {
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
    }
  };
}
const counter = createCounterShared();
export {
  counter as c
};
