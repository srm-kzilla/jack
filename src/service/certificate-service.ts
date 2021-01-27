import { Message } from "discord.js";
import { generateCertificate } from "../helper/certificate";
import { Email } from "../models/email";
import {
  certificateMessage,
  internalError,
  waitCertificateMessage,
  certificateNotAccessible,
  createErrorEmbed,
} from "../utils/messages";
import { getDbClient } from "../utils/database";
import { ERRORS } from "../utils/constants";
import { channelLogger, serverLogger } from "../utils/logger";
import { eventSchema } from "../models/event";

export async function getUserCertificate(
  incomingMessage: Message,
  event: eventSchema,
  email: Email
): Promise<boolean> {
  try {
    if (event.enabled) {
      incomingMessage.channel.send(waitCertificateMessage());
      const dbClient = await getDbClient();
      const found = await dbClient
        .db()
        .collection(event.slug)
        .countDocuments({ email: email });
      if (found) {
        const registrant = await dbClient
          .db()
          .collection(event.slug)
          .findOne<{ email: string; name: string }>({ email: email });
        const message = await certificateMessage(
          await generateCertificate(registrant!.name)
        );
        incomingMessage.channel.send(message);
        channelLogger(
          event.ledgerChannel,
          `**Somebody just collected their certificate! 🔴✨**\n**Name:** ${
            registrant!.name
          }\n**Email:** ${registrant!.email}\n**Discord Tag:** ${
            incomingMessage.author.username
          }#${incomingMessage.author.discriminator}`
        );
        serverLogger(
          "success",
          incomingMessage.content,
          `Certificate Collected by ${registrant!.name}`
        );
        return true;
      } else {
        serverLogger(
          "user-error",
          incomingMessage.content,
          "Certificate Not Found"
        );
        incomingMessage.channel.send(
          createErrorEmbed(
            "Certificate Not Found!",
            ERRORS.CERTIFICATE_NOT_FOUND
          )
        );
        return false;
      }
    } else {
      incomingMessage.channel.send(certificateNotAccessible());
      serverLogger("user-error", incomingMessage.content, `Certificate N/A`);
      return true;
    }
  } catch (err) {
    serverLogger("error", incomingMessage.content, err);
    incomingMessage.channel.send(internalError());
    return true;
  }
}
