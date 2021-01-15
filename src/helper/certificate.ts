import { Message } from "discord.js";
import { emailSchema } from "../models/email";
import {
  thumbsUpEmoji,
  getYourCertificateChannelMessage,
  internalError,
  unauthorizedUser,
} from "../utils/constants";
import { ERRORS } from "../utils/errors";
import { getUserCertificate } from "../service/certificate-service";
import { sendReactableMessage } from "../controllers/sendMessageHandler";
import { checkForAccessByRoles } from "./roleAuth";

export async function certificateDMHandler(incomingMessage: Message) {
  const email = incomingMessage.content.split(" ")[2];
  try {
    if (!email) {
      incomingMessage.channel.send(ERRORS.EMAIL_MISSING);
    }
    await emailSchema.validate(email);
    // Send Certificate Here
    getUserCertificate(incomingMessage, email);
  } catch (err) {
    console.log(err);
    if (err.name == "ValidationError")
      incomingMessage.channel.send(ERRORS.INVALID_EMAIL);
    else incomingMessage.channel.send(internalError());
  }
}

export async function getCertificateChannelMessage(incomingMessage: Message) {
  const isAllowed = await checkForAccessByRoles(incomingMessage.member, [
    "Moderator",
  ]);
  if (isAllowed) {
    sendReactableMessage(
      incomingMessage,
      getYourCertificateChannelMessage("Tech-Troduction"),
      thumbsUpEmoji
    );
  } else {
    incomingMessage.channel.send(unauthorizedUser());
  }
}

export async function generateCertificate(name: string) {
  //TODO add certificateGenerate here
}
