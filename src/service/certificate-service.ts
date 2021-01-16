import { Message } from "discord.js";
import { generateCertificate } from "../helper/certificate";
import { Email } from "../models/email";
import {
  certificateMessage,
  internalError,
  waitCertificateMessage,
  certificateNotAccessible,
} from "../utils/messages";
import { getDbClient } from "../utils/database";
import { ERRORS } from "../utils/constants";
import { channelLogger, serverLogger } from "../utils/logger";

export async function getUserCertificate(
  incomingMessage: Message,
  email: Email
) {
  try {
    incomingMessage.channel.send(waitCertificateMessage());
    const dbClient = await getDbClient();
    const found = await dbClient
      .db()
      .collection("tech-troduction")
      .countDocuments({ email: email });
    if (found) {
      if (process.env.CERTIFICATED_ACCESS_ENABLED) {
        const registrant = await dbClient
          .db()
          .collection("tech-troduction")
          .findOne<{ email: string; name: string }>({ email: email });
        const message = await certificateMessage(
          await generateCertificate(registrant!.name)
        );
        incomingMessage.channel.send(message);
        channelLogger(
          process.env.LOGGER_CHANNEL_ID,
          `${registrant!.name} just collected their certificate!`
        );
        serverLogger(
          "success",
          incomingMessage.content,
          `Certificate Collected by ${registrant!.name}`
        );
      } else {
        incomingMessage.channel.send(certificateNotAccessible());
        serverLogger(
          "user-error",
          incomingMessage.content,
          `Unauth access to certificate`
        );
      }
    } else {
      serverLogger(
        "user-error",
        incomingMessage.content,
        "Certificate Not Found"
      );
      incomingMessage.channel.send(ERRORS.CERTIFICATE_NOT_FOUND);
    }
  } catch (err) {
    serverLogger("error", incomingMessage.content, err);
    incomingMessage.channel.send(internalError());
  }
}
