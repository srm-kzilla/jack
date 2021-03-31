import { Message, TextChannel } from "discord.js";
import { generateCertificate } from "../helper/certificate";
import { Email } from "../models/email";
import { certificateMessage, createBasicEmbed } from "../utils/messages";
import { getDbClient } from "../utils/database";
import { ERRORS, INFO } from "../utils/constants";
import { channelLogger, serverLogger } from "../utils/logger";
import { getEvent } from "../utils/nodecache";

export async function getUserCertificate(
  incomingMessage: Message,
  eventSlug: string,
  email: Email
): Promise<boolean> {
  try {
    const event = await getEvent(eventSlug, "certificate");
    if (!event) throw "eventKey Not Found in NodeCache!";
    if (event.enabled) {
      incomingMessage.channel.send(createBasicEmbed(INFO.WAIT, "INFO"));
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
          await generateCertificate(registrant!.name, event)
        );
        incomingMessage.channel.send(message);
        const ledgerChannel = incomingMessage.client.channels.cache.find(
          (c) => c.id === event.ledgerChannel
        ) as TextChannel;
        ledgerChannel.send(
          createBasicEmbed(
            INFO.CERTIFICATE_COLLECTED(
              event,
              registrant!,
              incomingMessage.author
            ),
            "SUCCESS"
          )
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
          createBasicEmbed(ERRORS.CERTIFICATE_NOT_FOUND, "ERROR")
        );
        return false;
      }
    } else {
      incomingMessage.channel.send(
        createBasicEmbed(ERRORS.CERT_NOT_ACCESS, "ERROR")
      );
      serverLogger("user-error", incomingMessage.content, `Certificate N/A`);
      return true;
    }
  } catch (err) {
    serverLogger("error", incomingMessage.content, err);
    incomingMessage.channel.send(
      createBasicEmbed(ERRORS.INTERNAL_ERROR("dm"), "ERROR")
    );
    return true;
  }
}
