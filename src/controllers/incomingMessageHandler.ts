import { Message, MessageReaction, User } from "discord.js";
import { handleAnnouncements } from "../helper/announcement";
import { getCertificateChannelMessage } from "../helper/certificate";
import { handleJokes, handleMemes } from "../helper/jokes";
import { handleShrinkURLMessage } from "../helper/kzillaXYZ";
import { handleGetMemberCount } from "../helper/memberCount";
import { getEvent } from "../utils/nodecache";
import { COMMANDS, CONSTANTS, ERRORS } from "../utils/constants";
import { serverLogger } from "../utils/logger";
import { flushCache } from "../helper/flushCache";
import { createPoll, getResult } from "../helper/polls";
import { startCheckIn } from "../helper/checkIn";
import { createBasicEmbed, getHelpMessage } from "../utils/messages";
import { sendDirectMessageToUser } from "./sendMessageHandler";
import { incomingMessageSchema } from "../models/incomingMessage";
/**
 * Handles all incoming commands in a text channel
 *
 * @param {Message} incomingMessage The incoming message
 * @param {incomingMessageSchema} messageType The incoming message type
 */
export async function handleIncomingChannelCommand(
  incomingMessage: Message,
  messageType: incomingMessageSchema
) {
  try {
    const messageCommand = incomingMessage.content.split(" ")[1];

    switch (messageCommand) {
      case COMMANDS.certificate: {
        getCertificateChannelMessage(incomingMessage, messageType);
        break;
      }
      case COMMANDS.shrinkURL: {
        handleShrinkURLMessage(incomingMessage, messageType);
        break;
      }
      case COMMANDS.membercount: {
        handleGetMemberCount(incomingMessage, messageType);
        break;
      }
      case COMMANDS.announce: {
        handleAnnouncements(incomingMessage, messageType);
        serverLogger(
          "success",
          incomingMessage.content.split(" ").splice(0, 5),
          "Announcements"
        );
        break;
      }
      case COMMANDS.joke: {
        handleJokes(incomingMessage, messageType);
        break;
      }
      case COMMANDS.memes: {
        handleMemes(incomingMessage, messageType);
        break;
      }
      case COMMANDS.cacheflush: {
        flushCache(incomingMessage, messageType);
        break;
      }
      case COMMANDS.createPoll: {
        if (incomingMessage.content.split(" ")[2] == "create")
          createPoll(incomingMessage, messageType);
        else getResult(incomingMessage, messageType);
        break;
      }
      case COMMANDS.checkIn: {
        startCheckIn(incomingMessage, messageType);
        break;
      }
      case COMMANDS.help: {
        incomingMessage.channel.send(getHelpMessage(messageType));
        serverLogger("success", incomingMessage.content, "Help Message");
        break;
      }
      default:
        incomingMessage.channel.send(
          `<@${messageType.incomingUser.id}>`,
          createBasicEmbed(ERRORS.INVALID_COMMAND, "ERROR")
        );
        serverLogger("user-error", incomingMessage.content, "Invalid Command");
        break;
    }
  } catch (err) {
    serverLogger("error", incomingMessage.content, err);
    incomingMessage.channel.send(
      `<@${messageType.incomingUser.id}>`,
      createBasicEmbed(ERRORS.INTERNAL_ERROR(messageType.channelType), "ERROR")
    );
  }
}

/**
 * Handles all incoming commands in Direct Message
 *
 * @param {Message} incomingMessage The incoming message
 * @param {incomingMessageSchema} messageType The incoming message type
 */
export function handleIncomingDMCommand(
  incomingMessage: Message,
  messageType: incomingMessageSchema
) {
  try {
    const messageCommand = incomingMessage.content.split(" ")[1];
    switch (messageCommand) {
      case COMMANDS.shrinkURL: {
        handleShrinkURLMessage(incomingMessage, messageType);
        break;
      }
      case COMMANDS.help: {
        incomingMessage.channel.send(getHelpMessage(messageType));
        serverLogger("success", incomingMessage.content, "Help Message");
        break;
      }
      case COMMANDS.joke: {
        handleJokes(incomingMessage, messageType);
        break;
      }
      case COMMANDS.memes: {
        handleMemes(incomingMessage, messageType);
        break;
      }
      default:
        incomingMessage.channel.send(
          `<@${messageType.incomingUser.id}>`,
          createBasicEmbed(ERRORS.INVALID_COMMAND, "ERROR")
        );
        serverLogger("user-error", incomingMessage.content, "Invalid Command");
        break;
    }
  } catch (err) {
    serverLogger("error", incomingMessage.content, err);
    incomingMessage.channel.send(
      `<@${messageType.incomingUser.id}>`,
      createBasicEmbed(ERRORS.INTERNAL_ERROR(messageType.channelType), "ERROR")
    );
  }
}

/**
 * Handles all incoming reaction commands
 *
 * @param {User} user
 * @param {MessageReaction} reaction
 * @param {eventSchema} event
 * @param {Message} message
 */
export async function handleIncomingReaction(
  user: User,
  reaction: MessageReaction,
  eventSlug: string,
  message: Message
) {
  try {
    if (!user.bot) {
      const event = await getEvent(eventSlug, "certificate");
      if (!event) throw "eventKey Not Found in NodeCache!";
      if (reaction.emoji.name === CONSTANTS.thumbsUpEmoji) {
        sendDirectMessageToUser(
          user,
          message,
          event.slug,
          CONSTANTS.certificateUserDirectMessage(event.name, user.username)
        );
      }
    }
  } catch (err) {
    serverLogger("error", "InternalError", err);
  }
}
