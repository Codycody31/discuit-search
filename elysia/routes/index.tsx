import { Elysia } from "elysia";
import Community from "../components/Community";
import coms from "../communities.json";
import { Sun, Moon, Github } from "lucide-static";

const communities = coms as Community[];

export default new Elysia().get("/", () => {
  return (
    <html lang="en" class={"hidden"} _={`on load remove .hidden from me`}>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="A search engine for Discuit's community list"
        />
        <title>Discuit Search</title>
        <link rel="stylesheet" href="/public/style.css" />
        <script src="https://unpkg.com/htmx.org@1.9.11"></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.12"></script>
      </head>
      <body>
        <header>
          <h1>Discuit Search</h1>
          <div>
            <button
              type="button"
              class={"theme-toggle"}
              title="Theme toggle"
              _={`
              on load
                if matchMedia("(prefers-color-scheme: dark)").matches
                then add .dark to <html />
                else add .light to <html />
                end
              on click toggle between .dark and .light on <html />
              `}
            >
              {Sun}
              {Moon}
            </button>
            <a
              href="https://github.com/Codycody31/discuit-search"
              title="GitHub link"
            >
              {Github}
            </a>
          </div>
        </header>
        <main>
          <input
            name="q"
            type="text"
            hx-get="/search"
            hx-target="#results"
            hx-trigger="keyup changed"
            hx-include="this"
            placeholder="Search..."
            title="Search for a community"
          />
          <div id="results">
            {communities.map((c) => (
              <Community
                name={c.name}
                about={c.about}
                noMembers={c.noMembers}
                image={c.image}
              />
            ))}
          </div>
        </main>
      </body>
    </html>
  );
});
