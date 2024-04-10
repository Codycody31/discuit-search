import { Elysia } from "elysia";
import { cron } from "@elysiajs/cron";
import { $ } from "bun";
import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import index from "./routes/index";
import searchRoute from "./routes/search";

const app = new Elysia()
  .use(
    cron({
      name: "build-index",
      pattern: "0 * * * *",
      run() {
        console.log("Building index...");
        $`bun run build-index`;
      },
    })
  )
  .use(html())
  .use(staticPlugin())
  .use(index)
  .use(searchRoute)
  .listen(8080);

console.log(`Listening on ${app.server!.url}`);
