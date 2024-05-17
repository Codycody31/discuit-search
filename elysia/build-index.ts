const t0 = performance.now();

async function fetchBase64(url = "") {
  return await fetch(url)
    .then((res) => res.arrayBuffer())
    .then((buf) => Buffer.from(buf).toString("base64"));
}

async function getImage(c: Community) {
  const url = c.proPic?.url;

  c.image = await fetchBase64(`https://discuit.net${url}`).catch(() => {
    return favicon;
  });

  return c;
}

async function getLastActivity(c: Community) {
  type Response = {
    posts: Post[];
  };
  const posts = (await fetch(
    `https://discuit.net/api/posts?communityId=${c.id}&sort=activity`,
  ).then((r) => r.json())) as Response;

  if (posts.posts) {
    c.lastActivityAt = posts.posts[0]?.lastActivityAt || "";
  } else {
    c.lastActivityAt = c.createdAt;
  }
  return c;
}

const favicon = await fetchBase64("https://discuit.net/favicon.png");

const communities = await fetch("https://discuit.net/api/communities")
  .then(async (r) => {
    return (await r.json()) as Community[];
  })
  .then((cArr) =>
    cArr.map(async (c) => {
      let community = await getImage(c);
      community = await getLastActivity(community);
      return community;
    }),
  )
  .then((cArr) => Promise.all(cArr))
  .then((cArr) =>
    cArr.map((c) => ({
      id: c.id,
      name: c.name,
      about: c.about,
      noMembers: c.noMembers,
      image: c.image,
      createdAt: c.createdAt,
      lastActivityAt: c.lastActivityAt,
    })),
  );

Bun.write("communities.json", JSON.stringify(communities));

const t1 = performance.now();

console.log(`Built index in ${(t1 - t0) / 1000}s`);
