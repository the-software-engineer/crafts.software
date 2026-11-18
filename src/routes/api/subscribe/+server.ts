import { json } from '@sveltejs/kit';
import { site } from '$lib/newsroom/config';
import {
	listsClientFor,
	listsErrorResponse,
	UNAVAILABLE
} from '$lib/newsroom/lists.server';
import { verifyTurnstile } from '$lib/server/turnstile';
import { TURNSTILE_ACTION } from '$lib/turnstile-config';
import { isValidEmail } from '$lib/validation';
import type { RequestHandler } from './$types';

let warnedAboutSecret = false;

export const POST: RequestHandler = async ({
	request,
	platform,
	fetch,
	url
}) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid request' }, { status: 400 });
	}
	const { email, turnstileToken } = (
		body && typeof body === 'object' ? body : {}
	) as { email?: unknown; turnstileToken?: unknown };

	const address = typeof email === 'string' ? email.trim().toLowerCase() : '';
	if (!isValidEmail(address)) {
		return json({ error: 'Invalid email address' }, { status: 400 });
	}

	const secret = platform?.env?.TURNSTILE_SECRET_KEY;
	if (!secret) {
		if (!warnedAboutSecret) {
			warnedAboutSecret = true;
			console.error('TURNSTILE_SECRET_KEY is not set. Signups are refused.');
		}
		return json(UNAVAILABLE, { status: 503 });
	}

	const verified = await verifyTurnstile({
		token: turnstileToken,
		secret,
		action: TURNSTILE_ACTION,
		hostname: url.hostname,
		remoteIp: request.headers.get('CF-Connecting-IP')
	});
	if (!verified) {
		return json({ error: 'Verification failed' }, { status: 403 });
	}

	const lists = listsClientFor(platform?.env, fetch);
	if (!lists) {
		return json(UNAVAILABLE, { status: 503 });
	}

	try {
		await lists.subscribe(site.newsroomList, address, { source: site.source });
	} catch (error) {
		return listsErrorResponse(error);
	}

	// The same answer for a new address and one already on the list, so the
	// form cannot tell anyone who is subscribed.
	return json({ ok: true });
};
