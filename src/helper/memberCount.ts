import { Message } from "discord.js";
import { incomingMessageSchema } from "../models/incomingMessage";
import { serverLogger } from "../utils/logger";
import { createBasicEmbed, membersCountMessage } from "../utils/messages";
import { ERRORS } from "../utils/constants";
/**
 * Handles all incoming members count command in channel
 * Get members count in channel
 * @param {Message} incomingMessage
 * @param {incomingMessageSchema} messageType
 */
export async function handleGetMemberCount(
  incomingMessage: Message,
  messageType: incomingMessageSchema
) {
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
    incomingMessage.channel.send(
      `<@${messageType.incomingUser.id}>`,
      createBasicEmbed(ERRORS.INTERNAL_ERROR, "ERROR")
    );
  }
}
