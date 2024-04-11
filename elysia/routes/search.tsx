import { Elysia } from "elysia";
import { search } from "../controllers/search";
import coms from "../communities.json";
import Community from "../components/Community";

const communities = coms as Community[];

function sort(communities: Community[], sort: string) {
  const nameSorted = communities.toSorted();
  const activitySorted = communities.toSorted((a, b) => {
    if (new Date(a.lastActivityAt) > new Date(b.lastActivityAt)) return 1;
    if (new Date(a.lastActivityAt) < new Date(b.lastActivityAt)) return -1;
    return 0;
  });
  if (sort === "name-ascending") return nameSorted;
  if (sort === "name-descending") return nameSorted.toReversed();
  if (sort === "activity-ascending") return activitySorted;
  if (sort === "activity-descending") return activitySorted.toReversed();

  return communities;
}

export default new Elysia().get("/search", async ({ query }) => {
  if (!query["q"]) {
    return (
      <>
        {sort(communities, query["sort"] || "relevance").map((c) => (
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

  const searchResults = await search(query["q"]);
  if (!searchResults) {
    return (
      <>
        {sort(communities, query["q"] || "relevance").map((c) => (
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
      {sort(searchResults, query["sort"] || "relevance").map((c) => (
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
