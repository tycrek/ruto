FROM denoland/deno:alpine-2.2.2
WORKDIR /ruto

# cache dependencies
COPY deno.json .
RUN deno install

USER deno

COPY redirects.json .

# internally cache compiled source
COPY ruto.ts .
RUN deno cache ./ruto.ts

CMD deno task start