<script lang="ts">
import type { PageProps } from './$types';

let { data }: PageProps = $props();

const maxCount = $derived(
	data.tallies.reduce((max, t) => Math.max(max, t.count), 0)
);
</script>

<svelte:head>
	<title>Name vote results</title>
	<meta
		name="description"
		content="Live results for the Palseer name vote."
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
			<h1>Name vote results</h1>
			{#if data.unavailable}
				<p class="muted">Results are unavailable right now. Try again shortly.</p>
			{:else}
				<p class="muted">
					{data.ballots}
					{data.ballots === 1 ? 'ballot' : 'ballots'} cast so far. Refresh for the latest.
				</p>
			{/if}
		</header>

		{#if !data.unavailable}
			<ul class="tally-list">
				{#each data.tallies as t (t.name)}
					<li class="tally-row">
						<span class="tally-name">{t.name}</span>
						<div class="tally-bar-track">
							<div class="tally-bar" style="width: {maxCount === 0 ? 0 : (t.count / maxCount) * 100}%"></div>
						</div>
						<span class="tally-count">{t.count}</span>
					</li>
				{/each}
			</ul>
		{/if}

		<p class="muted"><a href="/vote">Not voted yet? Cast your ballot.</a></p>
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
		gap: 1.5rem;
	}

	.intro h1 {
		font-family: 'Fraunces', Georgia, serif;
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		font-weight: 600;
		margin: 0 0 0.75rem;
		letter-spacing: -0.01em;
	}

	.muted {
		color: #b7a98f;
		margin: 0;
	}

	.muted a {
		color: #f2a93e;
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
