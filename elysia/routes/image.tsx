import { Elysia } from "elysia";
import coms from "../communities.json";

const communities = coms as Community[];

export default new Elysia().get("/image", ({ query }) => {
  if (!query.id) {
    return;
  }

  const id = query.id;
  return `data:image/jpeg;base64,${communities.find((c) => c.id === id)?.image}`;
});
