<script>
	import { counter as sharedCounter } from '../../counter-shared/counter.js';

	let count = $state(0);
	let sharedCount = $state(0);

	function increment() {
		count += 1;
		sharedCounter.increment();
	}

	function decrement() {
		count -= 1;
		sharedCounter.decrement();
	}

	sharedCounter.subscribe((value) => {
		sharedCount = value;
	});
</script>

<h2>Svelte count: {count}</h2>
<h3>Shared count: {sharedCount}</h3>
<button onclick={increment}>+</button>
<button onclick={decrement}>-</button>
