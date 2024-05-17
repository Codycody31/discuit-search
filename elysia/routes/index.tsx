import { Elysia } from "elysia";
import { Sun, Moon, Github, ChevronDown } from "lucide-static";

export default new Elysia().get("/", () => {
  return (
    <html lang="en" class={"hidden"} _="on load remove .hidden from me">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="A search engine for Discuit's community list"
        />
        <title>Discuit Search</title>
        <link rel="stylesheet" href="/public/style.css" />
        <script src="https://unpkg.com/htmx.org@1.9.11" />
        <script src="https://unpkg.com/hyperscript.org@0.9.12" />
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
          <form
            hx-get="/search"
            hx-target="#results"
            hx-trigger="keyup changes from:find input, change from:find select"
            hx-include="this"
          >
            <input
              name="q"
              type="text"
              placeholder="Search..."
              _="on keyup set #results.scrollTop to 0"
              title="Search for a community"
            />
            <label>
              Sort by:
              <select name="sort">
                <option value="relevance" selected>
                  Relevance
                </option>
                <option value="name-ascending">Name (A-Z)</option>
                <option value="name-descending">Name (Z-A)</option>
                <option value="activity-descending">
                  Last activity (newest-oldest)
                </option>
                <option value="activity-ascending">
                  Last activity (oldest-newest)
                </option>
                <option value="created-descending">
                  Created (newest-oldest)
                </option>
                <option value="created-ascending">
                  Created (oldest-newest)
                </option>
              </select>
              {ChevronDown}
            </label>
          </form>
          <div id="results" hx-get="/search" hx-trigger="load" />
        </main>
      </body>
    </html>
  );
});
