import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import Counter from './Counter.vue';

export function render() {
	const app = createSSRApp(Counter);
	return renderToString(app);
}
