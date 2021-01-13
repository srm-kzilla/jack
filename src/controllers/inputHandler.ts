import { Message, User } from "discord.js";
import { certificateHandler } from "../helper/certificate";

import { ERRORS } from "../utils/errors";

export function handleIncomingCommand(incomingMessage: Message) {
  const messageCommand = incomingMessage.content.split(" ")[1];

  switch (messageCommand) {
    case "certificate": {
      certificateHandler(incomingMessage);
      break;
    }
    default:
      incomingMessage.channel.send(
        `The command wasn't recognized by me please try again ${incomingMessage.content}`
      );
  }
}

export async function sendDirectMessageToUser(
  user: User,
  message: Message,
  userMessage: any
) {
  user
    .send(userMessage.text)
    .catch(() => message.channel.send(ERRORS.DM_BLOCKED));
}
