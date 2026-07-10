<script lang="ts">
import { onMount } from 'svelte';
import {
	MAX_NAME_VOTE_SELECTIONS,
	NAME_VOTE_OPTIONS
} from '$lib/name-vote-options';

const STORAGE_KEY = 'palseer-name-vote';

type Tally = { name: string; count: number };
type Phase = 'vote' | 'submitting' | 'results';

let selected = $state<string[]>([]);
let phase = $state<Phase>('vote');
let tallies = $state<Tally[]>([]);
let ballots = $state(0);
let errorMessage = $state('');

const maxCount = $derived(
	tallies.reduce((max, t) => Math.max(max, t.count), 0)
);

function toggleName(name: string) {
	if (phase !== 'vote') return;

	if (selected.includes(name)) {
		selected = selected.filter((n) => n !== name);
		return;
	}

	if (selected.length >= MAX_NAME_VOTE_SELECTIONS) return;
	selected = [...selected, name];
}

async function loadTallies() {
	try {
		const res = await fetch('/api/name-vote');
		if (!res.ok) return;
		const data = (await res.json()) as { tallies?: Tally[]; ballots?: number };
		tallies = data.tallies ?? [];
		ballots = data.ballots ?? 0;
	} catch {
		// Ignore. The results view still renders, just without fresh tallies.
	}
}

async function castVote() {
	if (selected.length === 0) return;

	phase = 'submitting';
	errorMessage = '';

	try {
		const res = await fetch('/api/name-vote', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ names: selected })
		});

		const data = (await res.json().catch(() => ({}))) as {
			error?: string;
			tallies?: Tally[];
			ballots?: number;
		};

		if (!res.ok) {
			errorMessage = data.error ?? 'Something went wrong. Try again.';
			phase = 'vote';
			return;
		}

		tallies = data.tallies ?? [];
		ballots = data.ballots ?? 0;
		localStorage.setItem(STORAGE_KEY, '1');
		phase = 'results';
	} catch {
		errorMessage = 'Could not reach the server. Try again.';
		phase = 'vote';
	}
}

onMount(() => {
	if (localStorage.getItem(STORAGE_KEY)) {
		phase = 'results';
		loadTallies();
	}
});
</script>

<svelte:head>
	<title>Name this app</title>
	<meta
		name="description"
		content="Help pick a new name for Palseer, a small screen-time app for friends. Vote for up to three names you like."
	/>
	<meta name="robots" content="noindex" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Hanken+Grotesk:wght@400;500;600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main class="page">
	<div class="wrap">
		<header class="intro">
			<h1>Help name this app</h1>
			<p>
				Palseer is a small app for cutting screen time together. You pick the apps you want to use less, and your
				daily time on them is visible to a small circle of friends. Lowest time tops the leaderboard. Gentle
				nudges, no shame. It needs a better name. Pick up to 3 you like.
			</p>
		</header>

		<div class="screens">
			<img
				src="/vote/circle.webp"
				alt="The circle leaderboard screen in Palseer"
				width="780"
				height="2562"
				loading="lazy"
				class="screen"
			/>
			<img
				src="/vote/you.webp"
				alt="Your own screen-time screen in Palseer"
				width="780"
				height="2892"
				loading="lazy"
				class="screen"
			/>
		</div>

		{#if phase === 'results'}
			<section class="results">
				<h2>Thanks for voting</h2>
				<p class="muted">{ballots} {ballots === 1 ? 'ballot' : 'ballots'} cast so far.</p>
				<ul class="tally-list">
					{#each tallies as t (t.name)}
						<li class="tally-row">
							<span class="tally-name">{t.name}</span>
							<div class="tally-bar-track">
								<div class="tally-bar" style="width: {maxCount === 0 ? 0 : (t.count / maxCount) * 100}%"></div>
							</div>
							<span class="tally-count">{t.count}</span>
						</li>
					{/each}
				</ul>
			</section>
		{:else}
			<section class="picker">
				<p class="hint">
					Pick up to {MAX_NAME_VOTE_SELECTIONS}. Selected: {selected.length}/{MAX_NAME_VOTE_SELECTIONS}
				</p>
				<div class="pills">
					{#each NAME_VOTE_OPTIONS as name (name)}
						<button
							type="button"
							class="pill"
							class:selected={selected.includes(name)}
							aria-pressed={selected.includes(name)}
							disabled={phase === 'submitting' ||
								(!selected.includes(name) && selected.length >= MAX_NAME_VOTE_SELECTIONS)}
							onclick={() => toggleName(name)}
						>
							{name}
						</button>
					{/each}
				</div>

				{#if errorMessage}
					<p class="error">{errorMessage}</p>
				{/if}

				<button
					type="button"
					class="cast-button"
					disabled={selected.length === 0 || phase === 'submitting'}
					onclick={castVote}
				>
					{phase === 'submitting' ? 'Casting vote…' : 'Cast vote'}
				</button>
			</section>
		{/if}
	</div>
</main>

<style>
	.page {
		min-height: 100vh;
		background: #14181f;
		color: #f3e8d4;
		font-family: 'Hanken Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif;
		padding: 2.5rem 1.25rem 4rem;
	}

	.wrap {
		max-width: 720px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	.intro h1 {
		font-family: 'Fraunces', Georgia, serif;
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		font-weight: 600;
		margin: 0 0 0.75rem;
		letter-spacing: -0.01em;
	}

	.intro p {
		margin: 0;
		color: #b7a98f;
		font-size: 1.05rem;
		line-height: 1.6;
		max-width: 56ch;
	}

	.screens {
		display: flex;
		flex-wrap: wrap;
		gap: 1.25rem;
		justify-content: center;
	}

	.screen {
		width: 100%;
		max-width: 300px;
		height: auto;
		border-radius: 16px;
		border: 1px solid #333947;
		background: #1e222c;
	}

	.hint {
		margin: 0 0 1rem;
		color: #b7a98f;
		font-size: 0.95rem;
	}

	.pills {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
		gap: 0.75rem;
	}

	.pill {
		font-family: inherit;
		font-size: 1rem;
		font-weight: 500;
		color: #f3e8d4;
		background: #1e222c;
		border: 1px solid #333947;
		border-radius: 999px;
		padding: 0.75rem 1.25rem;
		cursor: pointer;
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease,
			transform 0.1s ease;
	}

	.pill:hover:not(:disabled) {
		border-color: #f2a93e;
	}

	.pill:active:not(:disabled) {
		transform: scale(0.98);
	}

	.pill:focus-visible,
	.cast-button:focus-visible {
		outline: 2px solid #f2a93e;
		outline-offset: 2px;
	}

	.pill:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.pill.selected {
		border-color: #f2a93e;
		box-shadow: 0 0 0 3px #f2a93e73;
		background: #262b37;
	}

	.error {
		color: #f2a93e;
		font-size: 0.95rem;
		margin: 1rem 0 0;
	}

	.cast-button {
		margin-top: 1.5rem;
		font-family: inherit;
		font-size: 1.05rem;
		font-weight: 600;
		color: #14181f;
		background: #f2a93e;
		border: none;
		border-radius: 999px;
		padding: 0.85rem 2rem;
		cursor: pointer;
		transition:
			transform 0.1s ease,
			opacity 0.15s ease;
	}

	.cast-button:hover:not(:disabled) {
		transform: translateY(-1px);
	}

	.cast-button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.results h2 {
		font-family: 'Fraunces', Georgia, serif;
		font-size: 1.6rem;
		font-weight: 600;
		margin: 0 0 0.25rem;
	}

	.muted {
		color: #b7a98f;
		margin: 0 0 1.5rem;
	}

	.tally-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.tally-row {
		display: grid;
		grid-template-columns: 7rem 1fr 2.5rem;
		align-items: center;
		gap: 0.75rem;
		background: #1e222c;
		border: 1px solid #333947;
		border-radius: 16px;
		padding: 0.65rem 1rem;
	}

	.tally-name {
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.tally-bar-track {
		height: 8px;
		border-radius: 999px;
		background: #333947;
		overflow: hidden;
	}

	.tally-bar {
		height: 100%;
		border-radius: 999px;
		background: #f2a93e;
	}

	.tally-count {
		text-align: right;
		color: #b7a98f;
		font-variant-numeric: tabular-nums;
	}
</style>
