import { Message } from "discord.js";
import * as Jimp from "jimp";
import { join } from "path";
import { emailSchema } from "../models/email";
import {
  getYourCertificateChannelMessage,
  internalError,
  unauthorizedUser,
  certParamsGenerator,
} from "../utils/messages";
import { CONSTANTS, ERRORS } from "../utils/constants";
import { getUserCertificate } from "../service/certificate-service";
import { sendReactableMessage } from "../controllers/sendMessageHandler";
import { checkForAccessByRoles } from "./roleAuth";
import { serverLogger } from "../utils/logger";

export async function certificateDMHandler(incomingMessage: Message) {
  const email = incomingMessage.content.split(" ")[2];
  try {
    if (!email) {
      serverLogger("user-error", incomingMessage.content, "No Email Found");
      incomingMessage.channel.send(ERRORS.EMAIL_MISSING);
    }
    await emailSchema.validate(email);
    getUserCertificate(incomingMessage, email);
  } catch (err) {
    if (err.name == "ValidationError") {
      serverLogger("user-error", incomingMessage.content, "Malformed Email");
      incomingMessage.channel.send(ERRORS.INVALID_EMAIL);
    } else {
      serverLogger("error", incomingMessage.content, err);
      incomingMessage.channel.send(internalError());
    }
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
      CONSTANTS.thumbsUpEmoji
    );
  } else {
    serverLogger("user-error", incomingMessage.content, "Unauthorized User");
    incomingMessage.channel.send(unauthorizedUser());
  }
}

export async function generateCertificate(name: string): Promise<Buffer> {
  let imgObject = await Jimp.read(process.env.CERTIFICATE_URL!);
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
