import { certificateEmoji } from "./constants";

export const certificateEmojifilter = (reaction: any) => {
  return certificateEmoji.includes(reaction.emoji.name);
};
