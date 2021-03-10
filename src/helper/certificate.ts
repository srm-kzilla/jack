import { Message } from "discord.js";
import * as Jimp from "jimp";
import { join } from "path";
import {
  getYourCertificateChannelMessage,
  createBasicEmbed,
} from "../utils/messages";
import { CONSTANTS, ERRORS } from "../utils/constants";
import { getUserCertificate } from "../service/certificate-service";
import { sendReactableMessage } from "../controllers/sendMessageHandler";
import { serverLogger } from "../utils/logger";
import { getDbClient } from "../utils/database";
import { eventSchema } from "../models/event";
import { setEvent } from "../utils/nodecache";
import { incomingMessageSchema } from "../models/incomingMessage";

/**
 * Handles all certificate message in DM (email)
 *
 * @param {Message} incomingMessage
 * @param {string} eventSlug
 */
export async function certificateDMHandler(
  incomingMessage: Message,
  eventSlug: string
): Promise<boolean> {
  const email = incomingMessage.content.trim();
  try {
    const serviceExecuted = await getUserCertificate(
      incomingMessage,
      eventSlug,
      email
    );
    return serviceExecuted;
  } catch (err) {
    serverLogger("error", incomingMessage.content, err);
    incomingMessage.channel.send(
      createBasicEmbed(ERRORS.INTERNAL_ERROR("dm"), "ERROR")
    );
    return true;
  }
}
/**
 * Handles certificate thread start message
 *
 * @param {Message} incomingMessage
 * @param {incomingMessageSchema} messageType
 */
export async function getCertificateChannelMessage(
  incomingMessage: Message,
  messageType: incomingMessageSchema
) {
  try {
    if (messageType.incomingUser.isMod) {
      const eventSlug = incomingMessage.content.split(/ +/)[2];
      if (!eventSlug) {
        serverLogger("user-error", incomingMessage.content, "Invalid Command");
        return incomingMessage.channel.send(
          `<@${messageType.incomingUser.id}>`,
          createBasicEmbed(ERRORS.INVALID_COMMAND, "ERROR")
        );
      }
      const db = await (await getDbClient()).db().collection("events");
      const event = await db.findOne<eventSchema>({
        slug: eventSlug,
        type: "certificate",
      });
      if (!event) {
        serverLogger(
          "user-error",
          incomingMessage.content,
          "Event Does Not Exist"
        );
        return incomingMessage.channel.send(
          `<@${messageType.incomingUser.id}>`,
          createBasicEmbed(ERRORS.EVENT_DNE, "ERROR")
        );
      }
      if (!(await setEvent(event))) throw "Cannot set nodeCache Key!";
      await sendReactableMessage(
        incomingMessage,
        event.slug,
        getYourCertificateChannelMessage(event.name),
        CONSTANTS.thumbsUpEmoji
      );
    } else {
      serverLogger("user-error", incomingMessage.content, "Unauthorized User");
      incomingMessage.channel.send(
        `<@${messageType.incomingUser.id}>`,
        createBasicEmbed(ERRORS.UNAUTHORIZED_USER, "ERROR")
      );
    }
  } catch (err) {
    serverLogger("internal-error", "Error", err);
    incomingMessage.channel.send(
      `<@${messageType.incomingUser.id}>`,
      createBasicEmbed(ERRORS.INTERNAL_ERROR(messageType.channelType), "ERROR")
    );
  }
}

/**
 * Generates certificate for user
 *
 * @param {string} name
 * @param {eventSchema} event
 */
export async function generateCertificate(
  name: string,
  event: eventSchema
): Promise<Buffer> {
  const certParams = event.certificate;
  let imgObject = await Jimp.read(certParams!.url);
  imgObject = await imgObject.print(
    await Jimp.loadFont(
      join(__dirname, "..", "..", "..", "assets", "font.fnt")
    ),
    certParams!.x,
    certParams!.y,
    {
      text: name,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    },
    certParams!.maxWidth,
    certParams!.maxHeight
  );
  return imgObject.quality(100).getBufferAsync(Jimp.MIME_JPEG);
}
