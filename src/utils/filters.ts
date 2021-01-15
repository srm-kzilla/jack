import { CONSTANTS } from "./constants";

export const certificateEmojifilter = (reaction: any) => {
  return CONSTANTS.thumbsUpEmoji.includes(reaction.emoji.name);
};
