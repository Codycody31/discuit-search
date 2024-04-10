import { Elysia } from "elysia";
import { cron } from "@elysiajs/cron";
import { $ } from "bun";
import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import index from "./routes/index";
import searchRoute from "./routes/search";

if (!(await Bun.file(`${import.meta.dir}/communities.json`).exists())) {
  await $`bun build-index`;
}

const app = new Elysia()
  .use(
    cron({
      name: "build-index",
      pattern: "0 * * * *",
      async run() {
        console.log("Building index...");
        await $`bun build-index`;
      },
    }),
  )
  .use(html())
  .use(staticPlugin())
  .use(index)
  .use(searchRoute)
  .listen(8080);

console.log(`Listening on ${app.server!.url}`);
