type Community = {
  id: string;
  name: string;
  about: string | null;
  noMembers: number;
  proPic: {
    copies: [{ name: "medium"; url: string }];
  } | null;
};
