import { Message, User } from "discord.js";
import {
  certificateDMHandler,
  certificateHandler,
} from "../helper/certificate";

import { ERRORS } from "../utils/errors";

export async function handleIncomingChannelCommand(incomingMessage: Message) {
  const messageCommand = incomingMessage.content.split(" ")[1];

  switch (messageCommand) {
    case "certificate": {
      certificateHandler(incomingMessage);

      break;
    }
    default:
      // Need to add helper message
      await incomingMessage.channel.send(ERRORS.INVALID_COMMAND);
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
  const messageCommand = incomingMessage.content.split(" ")[1];

  switch (messageCommand) {
    case "certificate": {
      certificateDMHandler(incomingMessage);
      break;
    }
    default:
      incomingMessage.channel.send(ERRORS.INVALID_COMMAND);
  }
}
