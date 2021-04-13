export interface roleSchema {
  guildName: string;
  description: string;
  messageID: string;
  channelID: string;
  options: Array<{
    roleID: string;
    emoji: string;
  }>;
  reactions: Array<{ id: string; tag: string; roleID: string }>;
  guildID: string;
  timestamp: Date | string;
}
