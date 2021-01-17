import { Message } from "discord.js";
import { serverLogger } from "../utils/logger";
import { internalError } from "../utils/messages";
import { membersCountMessage } from "../utils/messages";
/**
 * Handles all incoming members count command in channel
 *
 * @param {Message} incomingMessage
 */
export async function handleGetMemberCount(incomingMessage: Message) {
  getMemberCount(incomingMessage);
}

/**
 * Get members count in channel
 *
 * @param {Message} incomingMessage
 */
export async function getMemberCount(incomingMessage: Message) {
  try {
    const members = await incomingMessage.guild?.members.fetch({
      force: true,
    });
    const membersCount = members?.filter((m) => {
      return !m.user.bot;
    }).size;
    const botsCount = members?.filter((m) => {
      return m.user.bot;
    }).size;
    incomingMessage.channel.send(
      membersCountMessage(membersCount || 0, botsCount || 0)
    );
    serverLogger(
      "success",
      incomingMessage.content,
      `Members count ${botsCount}`
    );
  } catch (err) {
    serverLogger("error", incomingMessage.content, err);
    incomingMessage.channel.send(internalError());
  }
}
