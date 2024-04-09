import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import Index from "./routes/index";
import { communities, search } from "./controllers/search";
import Community from "./components/Community";

const app = new Elysia()
  .use(html())
  .use(staticPlugin())
  .get("/", () => <Index />)
  .get("/search", async ({ query }) => {
    if (query["q"] === "" || !query["q"]) {
      return (
        <>
          {communities.map(({ name, about, noMembers, proPic }) => (
            <Community
              name={name}
              about={about}
              noMembers={noMembers}
              proPic={proPic}
            />
          ))}
        </>
      );
    }

    const searchResults = await search(query["q"]);
    if (!searchResults) {
      return (
        <>
          {communities.map(({ name, about, noMembers, proPic }) => (
            <Community
              name={name}
              about={about}
              noMembers={noMembers}
              proPic={proPic}
            />
          ))}
        </>
      );
    }

    return (
      <>
        {searchResults.map(({ name, about, noMembers, proPic }) => (
          <Community
            name={name}
            about={about}
            noMembers={noMembers}
            proPic={proPic}
          />
        ))}
      </>
    );
  })
  .listen(8080);

console.log(`Listening on ${app.server!.url}`);
