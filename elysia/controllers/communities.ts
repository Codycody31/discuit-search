export const communities = (await fetch(
  "https://discuit.net/api/communities",
).then((r) => r.json())) as Community[];
