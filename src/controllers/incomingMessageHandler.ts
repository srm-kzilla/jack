import { Message, MessageReaction, User } from "discord.js";
import {
  certificateDMHandler,
  getCertificateChannelMessage,
} from "../helper/certificate";
import {
  getHelpMessage,
  invalidCommand,
  internalError,
  unauthorizedUser,
  thumbsUpEmoji,
  certificateUserDirectMessage,
} from "../utils/constants";
import {
  sendDirectMessageToUser,
  sendReactableMessage,
} from "./sendMessageHandler";
/**
 * Handles all incoming commands in channel
 *
 * @param {Message} incomingMessage
 */
export async function handleIncomingChannelCommand(incomingMessage: Message) {
  try {
    const messageCommand = incomingMessage.content.split(" ")[1];

    switch (messageCommand) {
      case "certificate": {
        // certificatehandler
        getCertificateChannelMessage(incomingMessage);
        break;
      }
      case "help": {
        incomingMessage.channel.send(getHelpMessage());
      }
      default:
        incomingMessage.channel.send(invalidCommand());
    }
  } catch (err) {
    incomingMessage.channel.send(invalidCommand());
  }
}

/**
 * Handles all incoming commands in Direct Message
 *
 * @param {Message} incomingMessage
 */
export function handleIncomingDMCommand(incomingMessage: Message) {
  try {
    const messageCommand = incomingMessage.content.split(" ")[1];

    switch (messageCommand) {
      case "get-certificate": {
        certificateDMHandler(incomingMessage);
        break;
      }
      default:
        incomingMessage.channel.send(invalidCommand());
    }
  } catch (err) {
    console.log(err);
    incomingMessage.channel.send(internalError());
  }
}

/**
 * Handles all incoming reaction commands
 *
 * @param {User} user
 * @param {MessageReaction} reaction
 * @param {Message} message
 */
export async function handleIncomingReaction(
  user: User,
  reaction: MessageReaction,
  message: Message
) {
  if (!user.bot) {
    if (reaction.emoji.name === thumbsUpEmoji) {
      //TODO transfer the log to another channel
      message.channel.send(
        `${
          message.guild?.member(user.id)?.displayName || user.username
        } just collected their certificate!`
      );
      sendDirectMessageToUser(user, message, certificateUserDirectMessage);
    }
  }
}
