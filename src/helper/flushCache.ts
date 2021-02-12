import { Message } from "discord.js";
import { refreshKeys } from "../utils/nodecache";
import { flushSuccessMessage, unauthorizedUser } from "../utils/messages";
import { serverLogger } from "../utils/logger";
import { checkForAccessByRoles } from "./roleAuth";

/**
 * Handles flushing the cache
 *
 * @param {Message} incomingMessage
 */
export const flushCache = async (incomingMessage: Message) => {
  const isAllowed = await checkForAccessByRoles(incomingMessage.member, [
    `${process.env.OPERATOR_ROLE_ID}`,
  ]);
  if (isAllowed) {
    await refreshKeys();
    incomingMessage.channel.send(flushSuccessMessage());
    serverLogger("success", incomingMessage.content, "Cache Flush Keys");
  } else {
    serverLogger("user-error", incomingMessage.content, "Unauthorized User");
    incomingMessage.channel.send(unauthorizedUser());
  }
};
