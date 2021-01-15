import { Message } from "discord.js";
import { generateCertificate } from "../helper/certificate";
import { Email } from "../models/email";
import { certificateMessage, internalError } from "../utils/messages";
import { getDbClient } from "../utils/database";
import { ERRORS } from "../utils/constants";
import { logger } from "../utils/logger";

export async function getUserCertificate(
  incomingMessage: Message,
  email: Email
) {
  try {
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
      logger(`${registrant!.name} just collected their certificate!`);
    } else incomingMessage.channel.send(ERRORS.CERTIFICATE_NOT_FOUND);
  } catch (err) {
    console.log(err);
    incomingMessage.channel.send(internalError());
  }
}
