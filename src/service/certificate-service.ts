import { Message } from "discord.js";
import { Email } from "../models/email";
import { certificateMessage, internalError } from "../utils/constants";
import { getDbClient } from "../utils/database";
import { ERRORS } from "../utils/errors";

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
    const message = await certificateMessage();
    if (found) incomingMessage.channel.send(message);
    else incomingMessage.channel.send(ERRORS.CERTIFICATE_NOT_FOUND);
  } catch (err) {
    incomingMessage.channel.send(internalError());
  }
}
