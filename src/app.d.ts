/// <reference types="@cloudflare/workers-types" />

// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	const __BUILD_VERSION__: string;

	namespace App {
		interface Platform {
			env: {
				/** Pages secret for production, set by deploy.yml from 1Password. */
				TURNSTILE_SECRET_KEY?: string;
				/** Pages secret, set by deploy.yml from 1Password. */
				NEWSROOM_LISTS_TOKEN?: string;
				/** Optional [vars] override for the newsroom lists host. */
				NEWSROOM_LISTS_URL?: string;
			};
		}
	}

	interface Window {
		turnstile?: {
			render: (container: HTMLElement, options: TurnstileOptions) => string;
			reset: (widgetId: string) => void;
			remove: (widgetId: string) => void;
		};
	}

	interface TurnstileOptions {
		sitekey: string;
		action: string;
		theme: 'light' | 'dark' | 'auto';
		size: 'normal' | 'compact' | 'flexible';
		appearance: 'always' | 'execute' | 'interaction-only';
		callback: (token: string) => void;
		'expired-callback': () => void;
		'error-callback': () => void;
	}
}

export {};
