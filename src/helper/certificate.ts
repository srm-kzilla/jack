import { Message } from "discord.js";
import * as Jimp from "jimp";
import { join } from "path";
import { emailSchema } from "../models/email";
import {
  thumbsUpEmoji,
  getYourCertificateChannelMessage,
  internalError,
  unauthorizedUser,
  certParamsGenerator,
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

export async function generateCertificate(name: string): Promise<Buffer> {
  let imgObject = await Jimp.read(
    join(__dirname, "..", "..", "..", "assets", "certificate.png")
  );
  const certParams = certParamsGenerator();
  imgObject = await imgObject.print(
    await Jimp.loadFont(
      join(__dirname, "..", "..", "..", "assets", "font.fnt")
    ),
    certParams.x,
    certParams.y,
    {
      text: name,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    },
    certParams.maxWidth,
    certParams.maxHeight
  );
  return imgObject.quality(100).getBufferAsync(Jimp.MIME_JPEG);
}
