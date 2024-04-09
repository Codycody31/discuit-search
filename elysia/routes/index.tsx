import Community from "../components/Community";
import { communities } from "../controllers/search";

export default function () {
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
          <div class={"buttons"}>
            <button
              type="button"
              class={"theme-toggle"}
              _={`
              on load
                if matchMedia("(prefers-color-scheme: dark)").matches
                then add .dark to <html />
                else add .light to <html />
                end
              on click toggle between .dark and .light on <html />
              `}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-sun"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-moon"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            </button>
            <a href="https://github.com/Codycody31/discuit-search">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-github"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
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
          />
          <ul id="results">
            {communities.map(({ name, about, noMembers, proPic }) => (
              <Community
                name={name}
                about={about}
                noMembers={noMembers}
                proPic={proPic}
              />
            ))}
          </ul>
        </main>
      </body>
    </html>
  );
}
