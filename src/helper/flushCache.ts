import { Message } from "discord.js";
import { refreshKeys } from "../utils/nodecache";
import { createBasicEmbed, flushSuccessMessage } from "../utils/messages";
import { serverLogger } from "../utils/logger";
import { checkForAccessByRoles } from "./roleAuth";
import { incomingMessageSchema } from "../models/incomingMessage";
import { ERRORS } from "../utils/constants";

/**
 * Handles flushing the cache
 *
 * @param {Message} incomingMessage
 * @param {incomingMessageSchema} messageType
 */
export const flushCache = async (
  incomingMessage: Message,
  messageType: incomingMessageSchema
) => {
  const isAllowed = await checkForAccessByRoles(incomingMessage.member, [
    `${process.env.OPERATOR_ROLE_ID}`,
  ]);
  if (isAllowed) {
    await refreshKeys();
    incomingMessage.channel.send(flushSuccessMessage());
    serverLogger("success", incomingMessage.content, "Cache Flush Keys");
  } else {
    serverLogger("user-error", incomingMessage.content, "Unauthorized User");
    incomingMessage.channel.send(
      `<@${messageType.incomingUser.id}>`,
      createBasicEmbed(ERRORS.UNAUTHORIZED_USER, "ERROR")
    );
  }
};
