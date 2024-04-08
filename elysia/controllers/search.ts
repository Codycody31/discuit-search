import { MeiliSearch } from "meilisearch";

type Community = {
  id: string;
  name: string;
  about: string | null;
  noMembers: number;
};

const communities = (await fetch("https://discuit.net/api/communities").then(
  (r) => r.json(),
)) as Community[];

const meilisearch = new MeiliSearch({
  host: Bun.env.MEILI_SEARCH_HOST || "http://localhost:3000",
  apiKey: Bun.env.MEILI_SEARCH_API_KEY || "",
});

meilisearch.index("communities").addDocuments(communities);

function search(query: string) {
  return meilisearch
    .index("communities")
    .search(query)
    .then((r) => r.hits);
}

export { communities, search };
