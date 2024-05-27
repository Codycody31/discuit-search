const t0 = Bun.nanoseconds();

async function fetchBase64(url = "") {
  return await fetch(url)
    .then((res) => res.arrayBuffer())
    .then((buf) => Buffer.from(buf).toString("base64"));
}

async function getImage(c: Community) {
  const url = c.proPic?.copies[c.proPic.copies.length - 1]?.url;
  c.image = url ? await fetchBase64(`https://discuit.net${url}`) : favicon;
  return c;
}

async function getLastActivity(c: Community) {
  type Response = {
    posts: Post[];
  };
  const posts = (await fetch(
    `https://discuit.net/api/posts?communityId=${c.id}&sort=activity&limit=1`,
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
      return {
        id: community.id,
        name: community.name,
        about: community.about,
        noMembers: community.noMembers,
        image: community.image,
        createdAt: community.createdAt,
        lastActivityAt: community.lastActivityAt,
      };
    }),
  )
  .then((p) => Promise.all(p));

Bun.write("communities.json", JSON.stringify(communities));

const t1 = Bun.nanoseconds();

console.log(`Built index in ${(t1 - t0) / 1e9}s`);
