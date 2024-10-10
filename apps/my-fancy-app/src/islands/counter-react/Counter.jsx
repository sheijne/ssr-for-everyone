import { useState, useSyncExternalStore } from 'react';
import { counter as sharedCounter } from '../../counter-shared/counter.js';

export function Counter({ initialCount = 0 }) {
	const [count, setCount] = useState(initialCount);

	function increment() {
		setCount(count + 1);
		sharedCounter.increment();
	}

	function decrement() {
		setCount(count - 1);
		sharedCounter.decrement();
	}

	useSyncExternalStore(
		(trigger) => sharedCounter.subscribe(trigger),
		() => sharedCounter.count.value,
		() => sharedCounter.count.value
	);

	return (
		<>
			<h2>React count: {count}</h2>
			<h3>Shared count: {sharedCounter.count.value}</h3>
			<button onClick={increment}>+</button>
			<button onClick={decrement}>-</button>
		</>
	);
}
