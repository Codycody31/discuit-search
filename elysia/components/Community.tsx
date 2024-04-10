import { PropsWithChildren } from "@kitajs/html";
import { marked } from "marked";

function Community({
  name,
  about,
  noMembers,
  proPic,
}: PropsWithChildren<Community>) {
  return (
    <button
      class={"community-link"}
      onclick={`open("https://discuit.net/${name}", "_blank", "noopener,noreferrer")`}
      target="_blank"
      title={`Open https://discuit.net/${name}`}
    >
      <h3>
        <img
          src={
            proPic
              ? `https://discuit.net${proPic.copies[0].url}`
              : `https://discuit.net/favicon.png`
          }
          decoding="async"
          loading="lazy"
          width={48}
          height={48}
        />
        {name}
      </h3>
      {about && marked.parse(about)}
      <p>{noMembers} members</p>
    </button>
  );
}

export default Community;
