export interface pollSchema {
  title: string; // title of the poll
  pollID: string; // unique id of poll
  channelID: string; // channel on which the poll is going
  options: Array<{
    // options array of the poll
    value: string;
    emoji: string;
    reactions: Array<string>;
  }>;
  timestamp: Date | string; // poll creation timestamp
}
