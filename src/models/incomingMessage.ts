export interface incomingMessageSchema {
  //incoming user properties
  incomingUser: {
    isMod: boolean;
    username: string;
    discriminator: string;
    id: string;
  };
  //channel types
  channelType: "dm" | "text" | "news";
}
