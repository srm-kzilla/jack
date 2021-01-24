import { Message, MessageReaction, User } from "discord.js";
import { internalError } from "../utils/messages";
import { ERRORS } from "../utils/constants";
import { certificateEmojifilter } from "../utils/filters";
import { handleIncomingReaction } from "./incomingMessageHandler";
import { serverLogger } from "../utils/logger";
/**
 * Sends message to user in his DMs
 *
 * @param {User} user
 * @param {MessageReaction} reaction
 * @param {any} userMessage message that has to be sent
 */

export async function sendDirectMessageToUser(
  user: User,
  message: Message,
  userMessage: any
) {
  try {
    await user.send(userMessage);
  } catch (err) {
    serverLogger("error", message, "DM Blocked");
    message.channel.send(ERRORS.DM_BLOCKED(user));
  }
}

/**
 * Sends out a message to a channel which is reactable
 *
 * @param {Message} incomingMessage
 */
export function sendReactableMessage(
  incomingMessage: Message,
  message: any,
  emoji: any
) {
  try {
    incomingMessage.channel.send(message).then(async function (message: any) {
      await message.react(emoji);
      // create a reaction collector on the specific message
      const collector = message.createReactionCollector(certificateEmojifilter);

      collector.on("collect", (reaction: MessageReaction, user: User) => {
        handleIncomingReaction(user, reaction, message);
      });
    });
  } catch (err) {
    serverLogger("error", incomingMessage.content, err);
    incomingMessage.channel.send(internalError());
  }
}
