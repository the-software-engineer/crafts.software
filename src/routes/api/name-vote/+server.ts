import { json } from '@sveltejs/kit';
import {
	MAX_NAME_VOTE_SELECTIONS,
	NAME_VOTE_OPTIONS
} from '$lib/name-vote-options';
import type { RequestHandler } from './$types';

export const prerender = false;

type Ballot = {
	names: string[];
	votedAt: string;
};

type Tally = {
	name: string;
	count: number;
};

// This is a small, short-lived poll for friends (expected tens of ballots),
// not a system meant to scale. This cap is just a safety valve so a stray
// flood of ballots can't make a request scan forever.
const MAX_BALLOTS_SCANNED = 2000;

// Reads every ballot key from KV and counts votes per name.
// Volume is expected to stay tiny (a poll page), but the cursor loop
// handles pagination correctly even if that assumption is wrong.
async function computeTallies(
	kv: KVNamespace
): Promise<{ tallies: Tally[]; ballots: number }> {
	const counts = new Map<string, number>();
	let ballots = 0;
	let cursor: string | undefined;

	outer: for (;;) {
		const list = await kv.list({ prefix: 'ballot:', cursor });

		for (const key of list.keys) {
			if (ballots >= MAX_BALLOTS_SCANNED) break outer;

			const value = await kv.get(key.name);
			if (!value) continue;

			try {
				const ballot = JSON.parse(value) as Ballot;
				if (!Array.isArray(ballot.names)) continue;

				ballots += 1;
				for (const name of ballot.names) {
					counts.set(name, (counts.get(name) ?? 0) + 1);
				}
			} catch {
				// Skip a ballot that fails to parse rather than failing the whole request.
			}
		}

		if (list.list_complete || !list.cursor) break;
		cursor = list.cursor;
	}

	const tallies: Tally[] = NAME_VOTE_OPTIONS.map((name) => ({
		name,
		count: counts.get(name) ?? 0
	})).sort((a, b) => b.count - a.count);

	return { tallies, ballots };
}

export const GET: RequestHandler = async ({ platform }) => {
	if (!platform?.env?.NAME_VOTES) {
		console.error('KV namespace NAME_VOTES not available');
		return json({ error: 'Service unavailable' }, { status: 503 });
	}

	const { tallies, ballots } = await computeTallies(platform.env.NAME_VOTES);
	return json({ tallies, ballots });
};

export const POST: RequestHandler = async ({ request, platform }) => {
	const body = (await request.json().catch(() => null)) as {
		names?: unknown;
	} | null;
	const names = body?.names;

	const isValid =
		Array.isArray(names) &&
		names.length >= 1 &&
		names.length <= MAX_NAME_VOTE_SELECTIONS &&
		new Set(names).size === names.length &&
		names.every(
			(name): name is string =>
				typeof name === 'string' &&
				(NAME_VOTE_OPTIONS as readonly string[]).includes(name)
		);

	if (!isValid) {
		return json({ error: 'Invalid selection' }, { status: 400 });
	}

	if (!platform?.env?.NAME_VOTES) {
		console.error('KV namespace NAME_VOTES not available');
		return json({ error: 'Service unavailable' }, { status: 503 });
	}

	const ballot: Ballot = {
		names,
		votedAt: new Date().toISOString()
	};

	await platform.env.NAME_VOTES.put(
		`ballot:${crypto.randomUUID()}`,
		JSON.stringify(ballot)
	);

	// The ballot is already saved at this point, so a failure below must not
	// turn a successful vote into an error response.
	let tallies: Tally[] = [];
	let ballots = 0;
	try {
		({ tallies, ballots } = await computeTallies(platform.env.NAME_VOTES));
	} catch (err) {
		console.error('computeTallies failed after vote was recorded', err);
	}

	return json({ ok: true, tallies, ballots });
};
