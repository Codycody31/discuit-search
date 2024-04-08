FROM oven/bun:1

WORKDIR /app

COPY elysia/package.json elysia/bun.lockb ./

RUN bun install --production

COPY elysia .

ENV NODE_ENV production
CMD [ "bun", "main.tsx" ]

EXPOSE 3000
