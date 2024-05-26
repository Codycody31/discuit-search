type Community = {
  id: string;
  name: string;
  about: string | null;
  noMembers: number;
  image: string;
  lastActivityAt: string; // time
  createdAt: string; // time
  proPic: {
    copies: {
      url: string;
    }[];
  } | null;
};

type Post = {
  lastActivityAt: string;
};
