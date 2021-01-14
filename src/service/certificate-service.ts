import { Message } from "discord.js";
import { certificateMessage, internalError } from "../utils/constants";
import { getDbClient } from "../utils/database";
import { ERRORS } from "../utils/errors";

export async function getUserCertificate(incomingMessage: Message, email: any) {
  try {
    const dbClient = await getDbClient();
    const found = await dbClient
      .db()
      .collection("tech-troduction")
      .countDocuments({ email: email });
    if (found) incomingMessage.channel.send(certificateMessage());
    else incomingMessage.channel.send(ERRORS.CERTIFICATE_NOT_FOUND);
  } catch (err) {
    incomingMessage.channel.send(internalError());
  }
}
