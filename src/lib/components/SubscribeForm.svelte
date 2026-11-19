<script module lang="ts">
const SCRIPT_URL =
	'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let scriptPromise: Promise<void> | undefined;

function loadTurnstile(): Promise<void> {
	if (window.turnstile) return Promise.resolve();
	scriptPromise ??= new Promise<void>((resolve, reject) => {
		const script = document.createElement('script');
		script.src = SCRIPT_URL;
		script.async = true;
		script.addEventListener('load', () => resolve(), { once: true });
		script.addEventListener(
			'error',
			() => {
				scriptPromise = undefined;
				script.remove();
				reject(new Error('Turnstile did not load'));
			},
			{ once: true }
		);
		document.head.appendChild(script);
	});
	return scriptPromise;
}
</script>

<script lang="ts">
import { onDestroy } from 'svelte';
import { TURNSTILE_ACTION, turnstileSiteKey } from '$lib/turnstile-config';

const TOKEN_WAIT_MS = 30_000;
const CHECK_EMAIL = 'Check the email address.';
const TRY_LATER = 'Couldn’t subscribe. Try again later.';

let email = $state('');
let status = $state<'idle' | 'sending' | 'done'>('idle');
let failure = $state('');
let container: HTMLDivElement;
let widgetHeight = $state(0);

let widgetId: string | undefined;
let widgetReady: Promise<boolean> | undefined;
let token: string | null = null;
let waiter: ((token: string | null) => void) | undefined;

function deliver(next: string | null) {
	token = next;
	const resolve = waiter;
	waiter = undefined;
	resolve?.(next);
}

// Turnstile loads on the first interaction with the form, not on page load,
// so visitors who never sign up never reach Cloudflare's challenge.
function startWidget(): Promise<boolean> {
	widgetReady ??= loadTurnstile().then(
		() => {
			if (!window.turnstile) return false;
			widgetId = window.turnstile.render(container, {
				sitekey: turnstileSiteKey(window.location.hostname),
				action: TURNSTILE_ACTION,
				theme: 'light',
				size: 'flexible',
				appearance: 'interaction-only',
				callback: (next) => deliver(next),
				'expired-callback': () => {
					token = null;
				},
				'error-callback': () => deliver(null)
			});
			return true;
		},
		() => {
			widgetReady = undefined;
			return false;
		}
	);
	return widgetReady;
}

function nextToken(): Promise<string | null> {
	if (token) return Promise.resolve(token);
	return new Promise((resolve) => {
		const timer = setTimeout(() => {
			waiter = undefined;
			resolve(null);
		}, TOKEN_WAIT_MS);
		waiter = (next) => {
			clearTimeout(timer);
			resolve(next);
		};
	});
}

function resetWidget() {
	token = null;
	if (widgetId && window.turnstile) window.turnstile.reset(widgetId);
}

function fail(message: string) {
	failure = message;
	status = 'idle';
}

async function submit(event: SubmitEvent) {
	event.preventDefault();
	if (status !== 'idle') return;
	status = 'sending';
	failure = '';

	const turnstileToken = (await startWidget()) ? await nextToken() : null;
	if (!turnstileToken) {
		resetWidget();
		fail(TRY_LATER);
		return;
	}
	token = null;

	try {
		const response = await fetch('/api/subscribe', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ email, turnstileToken })
		});
		if (response.ok) {
			status = 'done';
			if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
			widgetId = undefined;
			return;
		}
		resetWidget();
		fail(response.status === 400 ? CHECK_EMAIL : TRY_LATER);
	} catch {
		resetWidget();
		fail(TRY_LATER);
	}
}

onDestroy(() => {
	if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
});
</script>

<div class="relative">
  <form
    class="flex flex-col gap-u12 md:flex-row md:items-center"
    onsubmit={submit}
    onfocusin={() => void startWidget()}
  >
    <input
      type="email"
      name="email"
      bind:value={email}
      required
      autocomplete="email"
      placeholder="you@example.com"
      aria-label="Email address"
      aria-invalid={failure === CHECK_EMAIL ? 'true' : undefined}
      aria-describedby={failure ? 'subscribe-failure' : undefined}
      readonly={status === 'done'}
      class="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-base leading-6 text-gray-900 placeholder:text-gray-500 focus-visible:border-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 aria-[invalid=true]:border-red-700 md:h-u48 md:w-u360 md:rounded-u8 md:px-u16 md:text-u16 md:leading-u24"
    />
    <button
      type="submit"
      disabled={status !== 'idle'}
      aria-label={status === 'done' ? 'Subscribed' : undefined}
      class="relative inline-flex h-12 w-full items-center justify-center rounded-lg bg-gray-900 px-6 text-[15px] font-medium leading-5 text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 enabled:hover:bg-gray-800 disabled:cursor-default md:h-u48 md:w-auto md:rounded-u8 md:px-u24 md:text-u15 md:leading-u20"
      class:opacity-80={status === 'sending'}
    >
      <span class:invisible={status === 'done'}>Subscribe</span>
      {#if status === 'done'}
        <svg
          class="absolute h-5 w-5 md:h-u20 md:w-u20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg
        >
      {/if}
    </button>
  </form>
  <!-- Turnstile shows here only when it needs the visitor to act; otherwise it has no height. -->
  <div bind:this={container} bind:clientHeight={widgetHeight} class:mt-3={widgetHeight > 0}></div>
  <p class="sr-only" role="status">{status === 'done' ? 'Subscribed' : ''}</p>
  {#if failure}
    <!-- Sits in the space under the form, so the page stays on one screen. -->
    <p
      id="subscribe-failure"
      role="alert"
      class="absolute inset-x-0 top-full mt-3 text-sm leading-5 text-red-700"
    >
      {failure}
    </p>
  {/if}
</div>
