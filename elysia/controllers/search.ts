import { MeiliSearch } from "meilisearch";
import coms from "../communities.json";

const communities = coms as Community[];

const meilisearch = new MeiliSearch({
  host: Bun.env.MEILI_SEARCH_HOST || "http://localhost:7700",
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
