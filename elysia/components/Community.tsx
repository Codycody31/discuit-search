import { PropsWithChildren } from "@kitajs/html";
import { marked } from "marked";

function Community({
  name,
  about,
  noMembers,
}: PropsWithChildren<{
  name: string;
  about: string | null;
  noMembers: number;
}>) {
  return (
    <li class={"community"}>
      <button
        class={"community-link"}
        onclick={`open("https://discuit.net/${name}", "_blank", "noopener,noreferrer")`}
        target="_blank"
      >
        <h3>{name}</h3>
        {about && marked.parse(about)}
        <p>{noMembers} members</p>
      </button>
    </li>
  );
}

export default Community;
