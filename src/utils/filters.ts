import { MessageReaction } from "discord.js";
import { CONSTANTS } from "./constants";

export const certificateEmojifilter = (reaction: MessageReaction) => {
  return CONSTANTS.thumbsUpEmoji.includes(reaction.emoji.name);
};

export const pollEmojiFilter = (reaction: MessageReaction) =>
  CONSTANTS.pollReactions.includes(reaction.emoji.name);
