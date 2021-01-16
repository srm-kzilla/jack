import { Message } from "discord.js";
import { serverLogger } from "../utils/logger";
import { internalError } from "../utils/messages";
import { membersCountMessage } from "../utils/messages";
export async function handleGetMemberCount(incomingMessage: Message) {
  try {
    const memberCount = incomingMessage.guild?.memberCount;
    const bots = incomingMessage.guild?.members.cache.filter(
      (member) => !member.user.bot
    ).size;
    incomingMessage.channel.send(
      await membersCountMessage(memberCount || 0, bots || 0)
    );
    serverLogger(
      "success",
      incomingMessage.content,
      `Members count ${memberCount}`
    );
  } catch (err) {
    serverLogger("error", incomingMessage.content, err);
    incomingMessage.channel.send(internalError());
  }
}
// var memberCount = guild.members.filter(member => !member.user.bot).size;
