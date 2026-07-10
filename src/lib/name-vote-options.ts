// Candidate names for the Palseer rename vote.
// Order matters here: it is the display order on the /vote page.
// This is the single source of truth, used by both the page and the API route.
export const NAME_VOTE_OPTIONS = [
	'brethro',
	'brethus',
	'commuus',
	'kindrer',
	'kindrers',
	'kinfia',
	'kinfio',
	'kinfus',
	'kinsmia',
	'lampeus',
	'luceix',
	'palkeep',
	'folkseer',
	'kincoa',
	'chumers',
	'chummers',
	'kinpha',
	'luceers',
	'peepia',
	'seerfolk'
] as const;

export type NameVoteOption = (typeof NAME_VOTE_OPTIONS)[number];

export const MAX_NAME_VOTE_SELECTIONS = 3;
