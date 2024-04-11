import { PropsWithChildren } from "@kitajs/html";
import { marked } from "marked";

function Community({
  id,
  name,
  about,
  noMembers,
}: PropsWithChildren<{
  id: string;
  name: string;
  about: string | null;
  noMembers: number;
}>) {
  return (
    <button
      class={"community-link"}
      onclick={`open("https://discuit.net/${name}", "_blank", "noopener,noreferrer")`}
      target="_blank"
      title={`Open https://discuit.net/${name}`}
    >
      <h3>
        <img
          _={`
          on intersection(intersecting)
            if intersecting
              fetch /image?id=${id}
              put the result into my [@src]
            end
          `}
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
