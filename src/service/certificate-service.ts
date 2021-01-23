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

export async function getUserCertificate(
  incomingMessage: Message,
  email: Email
) {
  try {
    if (process.env.CERTIFICATE_ACCESS_ENABLED) {
      incomingMessage.channel.send(waitCertificateMessage());
      const dbClient = await getDbClient();
      const found = await dbClient
        .db()
        .collection("tech-troduction")
        .countDocuments({ email: email });
      if (found) {
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
          "`" +
            registrant!.name +
            "`::`" +
            registrant!.email +
            "`" +
            " **just collected their certificate!**"
        );
        serverLogger(
          "success",
          incomingMessage.content,
          `Certificate Collected by ${registrant!.name}`
        );
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
      }
    } else {
      incomingMessage.channel.send(certificateNotAccessible());
      serverLogger("user-error", incomingMessage.content, `Certificate N/A`);
    }
  } catch (err) {
    serverLogger("error", incomingMessage.content, err);
    incomingMessage.channel.send(internalError());
  }
}
