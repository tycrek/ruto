import pkg from './deno.json' with { type: 'json' };
import Log from '@tycrek/log';
import { Hono } from '@hono/hono';
import type { RedirectStatusCode } from '@hono/hono/utils/http-status';

interface Route {
	sources: string[];
	destination: string;
	code?: number;
}

const log = new Log({ prefix: `ruto v${pkg.version} |` });
const app = new Hono<{ Variables: { 'where': string } }>();

app.use(async (ctx, next) => {
	const start = Date.now();
	await next();
	const time = Date.now() - start;
	
	if (ctx.res.status == 404) log.warn(`[404] [${time}ms] ${ctx.req.url}`);
	else log.success(`[${ctx.res.status}] [${Date.now() - start}ms] ${ctx.req.url} -> ${ctx.get('where')}`);
});

app.get('*', async (ctx) => {
	const routes = <Route[]> JSON.parse(await Deno.readTextFile('./redirects.json'));

	for (const route of routes) {
		for (const source of route.sources) {
			if (ctx.req.url.match(source)) {
				ctx.set('where', route.destination);
				return ctx.redirect(route.destination, <RedirectStatusCode> route.code ?? 302);
			}
		}
	}

	return ctx.notFound();
});

log.info(`deno ${Deno.version.deno} typescript ${Deno.version.typescript}`);

// Host Deno server
Deno.serve({
	port: 29035,
	handler: app.fetch,
	onListen: ({ port, hostname }) => log.info(`server started: http://${hostname}:${port}`),
});
