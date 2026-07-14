import type { PageServerLoad } from './$types';

export const prerender = false;

type Tally = { name: string; count: number };

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const res = await fetch('/api/name-vote');
		if (!res.ok) {
			return { tallies: [] as Tally[], ballots: 0, unavailable: true };
		}
		const data = (await res.json()) as { tallies?: Tally[]; ballots?: number };
		return {
			tallies: data.tallies ?? [],
			ballots: data.ballots ?? 0,
			unavailable: false
		};
	} catch {
		return { tallies: [] as Tally[], ballots: 0, unavailable: true };
	}
};
