import { PropsWithChildren } from "@kitajs/html";
import { marked } from "marked";

function Community({
  name,
  about,
  noMembers,
  proPic,
}: PropsWithChildren<{
  name: string;
  about: string | null;
  noMembers: number;
  proPic: {
    url: string;
  } | null;
}>) {
  return (
    <li class={"community"}>
      <button
        class={"community-link"}
        onclick={`open("https://discuit.net/${name}", "_blank", "noopener,noreferrer")`}
        target="_blank"
      >
        <img
          src={
            proPic
              ? `https://discuit.net${proPic.url}`
              : `https://discuit.net/favicon.png`
          }
          decoding="async"
          loading="lazy"
          width={120}
          height={120}
        />
        <div>
          <h3>{name}</h3>
          {about && marked.parse(about)}
          <p>{noMembers} members</p>
        </div>
      </button>
    </li>
  );
}

export default Community;
