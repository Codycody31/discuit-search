import { Elysia } from "elysia";
import { search } from "../controllers/search";
import coms from "../communities.json";
import Community from "../components/Community";

const communities = coms as Community[];

export default new Elysia().get("/search", async ({ query }) => {
  if (query["q"] === "" || !query["q"]) {
    return (
      <>
        {communities.map((c) => (
          <Community
            name={c.name}
            about={c.about}
            noMembers={c.noMembers}
            image={c.image}
          />
        ))}
      </>
    );
  }

  const searchResults = await search(query["q"]);
  if (!searchResults) {
    return (
      <>
        {communities.map((c) => (
          <Community
            name={c.name}
            about={c.about}
            noMembers={c.noMembers}
            image={c.image}
          />
        ))}
      </>
    );
  }

  return (
    <>
      {searchResults.map((c) => (
        <Community
          name={c.name}
          about={c.about}
          noMembers={c.noMembers}
          image={c.image}
        />
      ))}
    </>
  );
});
