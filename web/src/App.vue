<template>
  <header>
    <h1>Discuit Search</h1>
  </header>
  <main>
    <input
      hx-get="/search"
      hx-target="#results"
      hx-include="this"
      hx-trigger="keyup changed"
      name="q"
      type="text"
      placeholder="Search..."
    />
    <ul id="results"></ul>
  </main>
</template>
