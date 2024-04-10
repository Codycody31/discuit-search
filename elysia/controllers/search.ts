import { MeiliSearch } from "meilisearch";
import { communities } from "./communities";

const meilisearch = new MeiliSearch({
  host: Bun.env.MEILI_SEARCH_HOST || "http://localhost:3000",
  apiKey: Bun.env.MEILI_SEARCH_API_KEY || "",
});

meilisearch.index<Community>("communities").addDocuments(communities);

async function search(query: string) {
  return meilisearch
    .index<Community>("communities")
    .search(query)
    .then((r) => r.hits);
}

export { search };
