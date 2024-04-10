import { Elysia } from "elysia";
import { search } from "../controllers/search";
import { communities } from "../controllers/communities";
import Community from "../components/Community";

export default new Elysia().get("/search", async ({ query }) => {
  if (query["q"] === "" || !query["q"]) {
    return (
      <>
        {communities.map(({ id, name, about, noMembers, proPic }) => (
          <Community
            id={id}
            name={name}
            about={about}
            noMembers={noMembers}
            proPic={proPic}
          />
        ))}
      </>
    );
  }

  const searchResults = await search(query["q"]);
  if (!searchResults) {
    return (
      <>
        {communities.map(({ id, name, about, noMembers, proPic }) => (
          <Community
            id={id}
            name={name}
            about={about}
            noMembers={noMembers}
            proPic={proPic}
          />
        ))}
      </>
    );
  }

  return (
    <>
      {searchResults.map(({ id, name, about, noMembers, proPic }) => (
        <Community
          id={id}
          name={name}
          about={about}
          noMembers={noMembers}
          proPic={proPic}
        />
      ))}
    </>
  );
});
