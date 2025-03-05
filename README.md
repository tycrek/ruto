<div align="center">

# ruto

*a link redirector*

</div>

## What is it?

A link redirector I wrote to replace my previous Cloudflare Pages setup that was a little too over-engineered.

## How do I use it?

ruto is simple: Install either [Deno](https://deno.com/) or [Docker Compose](https://docs.docker.com/compose/).

```bash
# Download this project
git clone https://github.com/tycrek/ruto.git
cd ruto/

# Create a redirects.json file
touch redirects.json

# If you chose Deno:
deno task run

# Or you chose Docker:
docker compose up
```

### `redirects.json`

This file configures where ruto will redirect requests. It uses a top-level array containing "routes". Each route can have multiple sources for a single destination. You may also set an optional response code to send, defaulting to `302`.

Example:

```json
[
	{
		"sources": [ "lh:29035/example", "0.0.0.0:29035/example" ],
		"destination": "https://example.com"
	},
	{
		"sources": [ "lh:29035" ],
		"destination": "https://example.org"
	},
	{
		"sources": [ "lh:29035/a" ],
		"destination": "https://example.org/?foo=hi"
	},
	{
		"sources": [ "mywebsite.com" ],
		"destination": "https://google.com",
		"code": 301
	}
]
```

It is suggested to **not** include `http(s)` in the sources. However, you **must** specify `http(s)` for destinations to ensure proper redirection.
