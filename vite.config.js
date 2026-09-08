import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		__BUILD_VERSION__: JSON.stringify(
			process.env.BUILD_VERSION ?? 'development'
		)
	}
});
