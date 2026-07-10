/// <reference types="@cloudflare/workers-types" />

// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {
		interface Platform {
			env: {
				NAME_VOTES: KVNamespace;
			};
		}
	}
}

export {};
