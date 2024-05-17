import { Elysia } from "elysia";
import coms from "../communities.json";
import Community from "../components/Community";
import { search } from "../controllers/search";

const communities = coms as Community[];

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

export default new Elysia().get("/search", async ({ query }) => {
  if (!query.q) {
    return (
      <>
        {sort(communities, query.sort || "relevance").map((c) => (
          <Community
            id={c.id}
            name={c.name}
            about={c.about}
            noMembers={c.noMembers}
          />
        ))}
      </>
    );
  }

  const searchResults = await search(query.q);
  if (!searchResults) {
    return (
      <>
        {sort(communities, query.sort || "relevance").map((c) => (
          <Community
            id={c.id}
            name={c.name}
            about={c.about}
            noMembers={c.noMembers}
          />
        ))}
      </>
    );
  }

  return (
    <>
      {sort(searchResults, query.sort || "relevance").map((c) => (
        <Community
          id={c.id}
          name={c.name}
          about={c.about}
          noMembers={c.noMembers}
        />
      ))}
    </>
  );
});
