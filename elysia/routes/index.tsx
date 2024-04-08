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
        <script src="/public/script.js"></script>
      </head>
      <body>
        <header>
          <h1>Discuit Search</h1>
        </header>
        <main>
          <input
            hx-get="/search?"
            hx-target="#results"
            hx-include="this"
            hx-trigger="keyup changed"
            name="q"
            type="text"
            placeholder="Search..."
          />
          <ul id="results"></ul>
        </main>
      </body>
    </html>
  );
}
