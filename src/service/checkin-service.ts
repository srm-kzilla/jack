import { Message, MessageCollector, TextChannel } from "discord.js";
import { emailSchema } from "../models/email";
import { registrantSchema } from "../models/event";
import { CONSTANTS, ERRORS, INFO } from "../utils/constants";
import { getDbClient } from "../utils/database";
import { serverLogger } from "../utils/logger";
import {
  checkInChannelAnnouncement,
  createBasicEmbed,
} from "../utils/messages";
import { getEvent } from "../utils/nodecache";

export const startCheckInCollector = async (
  incomingMessage: Message,
  eventSlug: string
): Promise<boolean> => {
  try {
    const event = await getEvent(eventSlug, "checkin");
    if (!event) throw "eventKey Not Found in NodeCache!";
    if (event.enabled) {
      const checkInChannel = incomingMessage.client.channels.cache.get(
        event.checkin!.channelId
      ) as TextChannel;
      const collector = checkInChannel.createMessageCollector(
        async (text: Message) => {
          if (text.author.bot) return false;
          try {
            await emailSchema.validate(text.content);
            return true;
          } catch (err) {
            serverLogger("user-error", text.content, "Malformed Email");
            text.channel.send(
              `<@${text.author.id}>`,
              createBasicEmbed(ERRORS.INVALID_EMAIL, "ERROR")
            );
            return false;
          }
        }
      );
      collector.on("collect", async (message: Message) => {
        try {
          await checkInEmails(message, collector, eventSlug);
        } catch (err) {
          serverLogger("error", message.content, err);
          message.channel.send(
            createBasicEmbed(ERRORS.INTERNAL_ERROR("text"), "ERROR")
          );
          collector.stop("Internal Server Error");
        }
      });
      collector.on("end", async () => {
        checkInChannel.send(createBasicEmbed(INFO.CHECKIN_END(event), "INFO"));
      });
      await checkInChannel.send(checkInChannelAnnouncement(event));
      await checkInChannel.send("**For Example:**");
      (await checkInChannel.send("jack@srmkzilla.net")).react(
        CONSTANTS.checkinReactions.accept
      );
      return true;
    } else {
      incomingMessage.channel.send(
        createBasicEmbed(ERRORS.EVENT_DISABLED, "ERROR")
      );
      return false;
    }
  } catch (err) {
    serverLogger("error", incomingMessage.content, err);
    incomingMessage.channel.send(
      createBasicEmbed(ERRORS.INTERNAL_ERROR("text"), "ERROR")
    );
    return false;
  }
};

const checkInEmails = async (
  incomingMessage: Message,
  collector: MessageCollector,
  eventSlug: string
) => {
  try {
    const event = await getEvent(eventSlug, "checkin");
    if (!event) throw "eventKey Not Found in NodeCache!";
    if (event.enabled) {
      const db = await (await getDbClient()).db().collection(event.slug);
      const registrant = await db.findOne<registrantSchema>({
        email: incomingMessage.content,
      });
      if (!registrant) {
        return incomingMessage.react(CONSTANTS.checkinReactions.reject);
      } else if (registrant.checkedIn) {
        return incomingMessage.react(CONSTANTS.checkinReactions.accept);
      } else {
        await db.updateOne(
          { email: incomingMessage.content },
          {
            $set: {
              checkedIn: true,
            },
          }
        );
        incomingMessage.react(CONSTANTS.checkinReactions.accept);
      }
    } else {
      collector.stop("Event Ended");
    }
  } catch (err) {
    await incomingMessage.react(CONSTANTS.checkinReactions.error);
    serverLogger("error", incomingMessage.content, err);
  }
};
