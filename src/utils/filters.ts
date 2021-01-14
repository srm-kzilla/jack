import { thumbsUpEmoji } from "./constants";

export const certificateEmojifilter = (reaction: any) => {
  return thumbsUpEmoji.includes(reaction.emoji.name);
};
