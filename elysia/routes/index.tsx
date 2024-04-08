import Community from "../components/Community";
import { communities } from "../controllers/search";

export default function () {
  return (
    <html lang="en">
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
      </head>
      <body>
        <header>
          <h1>Discuit Search</h1>
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
            {communities.map(({ name, about, noMembers }) => (
              <Community name={name} about={about} noMembers={noMembers} />
            ))}
          </ul>
        </main>
      </body>
    </html>
  );
}
