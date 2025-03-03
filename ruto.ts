import pkg from './deno.json' with { type: 'json' };
import Log from '@tycrek/log';
import { Hono } from '@hono/hono';

const log = new Log({ prefix: `ruto v${pkg.version} |` });
const app = new Hono<{ Variables: { 'domain': string } }>();

app.use(async (ctx, next) => {
	ctx.set('domain', new URL(ctx.req.url).origin);
	await next();
	log.info(`[${ctx.res.status}] ${ctx.req.url}`);
});
app.get('*', async (ctx) => {
	const redirects = <{[key:string]: string}> JSON.parse(await Deno.readTextFile('./redirects.json'));
	return !redirects[ctx.req.url]
		? ctx.notFound()
		: ctx.redirect(redirects[ctx.req.url]);
});

log.info(`deno ${Deno.version.deno} typescript ${Deno.version.typescript}`);

// Host Deno server
Deno.serve({
	port: 29035,
	handler: app.fetch,
	onListen: ({ port, hostname }) => log.info(`server started: http://${hostname}:${port}`),
});
