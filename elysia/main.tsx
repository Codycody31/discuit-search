import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import Index from "./routes/index";
import { communities } from "./controllers/search";

const app = new Elysia()
  .use(html())
  .use(staticPlugin())
  .get("/", () => <Index />)
  .get("/search", ({ query }) => {
    if (query["q"] === "") {
      return communities;
    }
  })
  .listen(8080);

console.log(`Listening on ${app.server!.url}`);
