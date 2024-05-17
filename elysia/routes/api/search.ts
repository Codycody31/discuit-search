import Elysia from "elysia";
import communities from "../../communities.json";
import { search } from "../../controllers/search";

const coms = communities as Community[];

function sort(communities: Community[], sort: string) {
  const nameSorted = communities.toSorted((a, b) => {
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    return 0;
  });
  const activitySorted = communities.toSorted((a, b) => {
    if (new Date(a.lastActivityAt) > new Date(b.lastActivityAt)) return 1;
    if (new Date(a.lastActivityAt) < new Date(b.lastActivityAt)) return -1;
    return 0;
  });
  const createdSorted = communities.toSorted((a, b) => {
    if (new Date(a.createdAt) > new Date(b.createdAt)) return 1;
    if (new Date(a.createdAt) < new Date(b.createdAt)) return -1;
    return 0;
  });
  if (sort === "name-ascending") return nameSorted;
  if (sort === "name-descending") return nameSorted.toReversed();
  if (sort === "activity-ascending") return activitySorted;
  if (sort === "activity-descending") return activitySorted.toReversed();
  if (sort === "created-ascending") return createdSorted;
  if (sort === "created-descending") return createdSorted.toReversed();

  return communities;
}

export default new Elysia().get("/api/search", async ({ query, error }) => {
  if (!query.q) return error("Bad Request");

  const searchResults = await search(query.q);
  if (!searchResults) return error("Not Found");

  return {
    results: sort(searchResults, query.sort || "relevance").map((c) => ({
      id: c.id,
      name: c.name,
      about: c.about,
      noMembers: c.noMembers,
      lastActivityAt: c.lastActivityAt,
      createdAt: c.createdAt,
      proPic: c.proPic,
    })),
  };
});
