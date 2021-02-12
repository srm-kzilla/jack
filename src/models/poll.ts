export interface pollSchema {
  title: string;
  pollID: string;
  channelID: string;
  options: Array<{
    value: string;
    emoji: string;
    reactions: Array<string>;
  }>;
  timestamp: Date | string;
}
