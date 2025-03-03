import pkg from './deno.json' with { type: 'json' };
import Log from '@tycrek/log';
import { Hono } from '@hono/hono';

const log = new Log({ prefix: `ruto v${pkg.version} |` });
const app = new Hono<{ Variables: { 'domain': string } }>();

app.use((ctx, next) => (ctx.set('domain', new URL(ctx.req.url).origin), next()));
app.get('*', async (ctx) => {
	const url = ctx.req.url;
	const redirects = <{[key:string]: string}> JSON.parse(await Deno.readTextFile('./redirects.json'));

	log.debug(url);

	return !redirects[url]
		? ctx.notFound()
		: ctx.redirect(redirects[url]);
});

log.info(`deno ${Deno.version.deno} typescript ${Deno.version.typescript}`);

// Host Deno server
Deno.serve({
	port: 29035,
	handler: app.fetch,
	onListen: ({ port, hostname }) => log.info(`server started: http://${hostname}:${port}`),
});
