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
    <a
      class={"community-link"}
      href={`https://discuit.net/${name}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <li class={"community"}>
        <h3>{name}</h3>
        {about && marked.parse(about)}
        <p>{noMembers} members</p>
      </li>
    </a>
  );
}

export default Community;
