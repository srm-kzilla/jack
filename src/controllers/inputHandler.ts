import { Message, User } from "discord.js";
import {
  certificateDMHandler,
  certificateHandler,
} from "../helper/certificate";
import {
  getHelpMessage,
  invalidCommand,
  internalError,
} from "../utils/constants";

import { ERRORS } from "../utils/errors";

export async function handleIncomingChannelCommand(incomingMessage: Message) {
  try {
    const messageCommand = incomingMessage.content.split(" ")[1];

    switch (messageCommand) {
      case "certificate": {
        certificateHandler(incomingMessage);
        break;
      }
      case "help": {
        incomingMessage.channel.send(getHelpMessage);
      }
      default:
        console.log("I'm here 1");
        // Need to add helper message
        incomingMessage.channel.send(invalidCommand);
    }
  } catch (err) {
    incomingMessage.channel.send(invalidCommand);
  }
}

export async function sendDirectMessageToUser(
  user: User,
  message: Message,
  userMessage: any
) {
  try {
    await user.send(userMessage);
  } catch (err) {
    console.log(err);
    message.channel.send(ERRORS.DM_BLOCKED);
  }
}

export function handleIncomingDMCommand(incomingMessage: Message) {
  try {
    const messageCommand = incomingMessage.content.split(" ")[1];

    switch (messageCommand) {
      case "certificate": {
        certificateDMHandler(incomingMessage);
        break;
      }
      default:
        incomingMessage.channel.send(invalidCommand);
    }
  } catch (err) {
    console.log(err);
    incomingMessage.channel.send(internalError);
  }
}
