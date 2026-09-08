import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const version =
	typeof __BUILD_VERSION__ === 'undefined' ? 'development' : __BUILD_VERSION__;

export const GET: RequestHandler = () =>
	json({
		status: 'pass',
		version,
		serviceId: 'crafts-software-web',
		checks: {
			runtime: [
				{
					componentType: 'system',
					componentId: 'pages-runtime',
					status: 'pass'
				}
			]
		}
	});
