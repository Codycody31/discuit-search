import Elysia from "elysia";
import communities from "../communities.json";

export default new Elysia().get("/api", () => {
  const coms = communities as Community[];
  return {
    communities: coms.map((c) => ({
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
