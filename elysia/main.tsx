import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import index from "./routes/index";
import searchRoute from "./routes/search";

const app = new Elysia()
  .use(html())
  .use(staticPlugin())
  .use(index)
  .use(searchRoute)
  .listen(8080);

console.log(`Listening on ${app.server!.url}`);
