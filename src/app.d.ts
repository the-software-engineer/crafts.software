/// <reference types="@cloudflare/workers-types" />

// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	const __BUILD_VERSION__: string;

	namespace App {
		interface Platform {
			env: Record<string, never>;
		}
	}
}

export {};
