<script setup>
import { ref } from 'vue';
import { counter as sharedCounter } from '../../counter-shared/counter.js';

const count = ref(0);

function increment() {
	count.value++;
	sharedCounter.count.value++;
}

function decrement() {
	count.value--;
	sharedCounter.count.value--;
}
</script>

<template>
	<h2>Vue count: {{ count }}</h2>
	<h3>Shared count: {{ sharedCounter.count }}</h3>
	<button @click="increment">+</button>
	<button @click="decrement">-</button>
</template>
