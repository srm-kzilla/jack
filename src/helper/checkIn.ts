import { Message } from "discord.js";
import { eventSchema } from "../models/event";
import { incomingMessageSchema } from "../models/incomingMessage";
import { startCheckInCollector } from "../service/checkin-service";
import { ERRORS, INFO } from "../utils/constants";
import { getDbClient } from "../utils/database";
import { serverLogger } from "../utils/logger";
import { createBasicEmbed } from "../utils/messages";
import { setEvent } from "../utils/nodecache";

/**
 * Handles checkin thread start
 *
 * @param {Message} incomingMessage
 * @param {incomingMessageSchema} messageType
 */
export const startCheckIn = async (
  incomingMessage: Message,
  messageType: incomingMessageSchema
) => {
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
        type: "checkin",
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
      const exitCode = await startCheckInCollector(incomingMessage, event.slug);
      if (exitCode) {
        incomingMessage.channel.send(
          createBasicEmbed(INFO.CHECKIN_CREATED(event), "SUCCESS")
        );
      } else {
        incomingMessage.channel.send(
          createBasicEmbed(ERRORS.CHECKIN_CREATE_FAIL, "ERROR")
        );
      }
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
};
