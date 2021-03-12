import { Message, MessageCollector, TextChannel } from "discord.js";
import { emailSchema } from "../models/email";
import { eventSchema, registrantSchema } from "../models/event";
import { CONSTANTS, ERRORS, INFO } from "../utils/constants";
import { getDbClient } from "../utils/database";
import { serverLogger } from "../utils/logger";
import { addChannel, joinChannel } from "../api/channels/channels.service";
import slugify from "slugify";
import {
  checkInChannelAnnouncement,
  createBasicEmbed,
} from "../utils/messages";
import { getEvent } from "../utils/nodecache";
import { channelDBSchema } from "../api/channels/channels.schema";

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
      await checkInChannel.send("@everyone", checkInChannelAnnouncement(event));
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
        if (event.checkin?.roleId) {
          await giveCheckinRole(incomingMessage, event.checkin!.roleId);
        }
        if (event.checkin?.teamEvent) {
          await findAndJoinTeams(incomingMessage, registrant, event);
        }
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

const findAndJoinTeams = async (
  incomingMessage: Message,
  registrant: registrantSchema,
  event: eventSchema
) => {
  try {
    const db = await (await getDbClient()).db().collection("private-channels");
    const teamName = slugify(registrant.teamName!, {
      strict: true,
      lower: true,
      replacement: "-",
    });
    const channelExists = await db.findOne({ channelName: teamName });
    if (!channelExists) {
      const createdChannels = await createTeamChannel(
        incomingMessage,
        event,
        teamName,
        "team",
        registrant.teamName
      );
      const ledgerChannel = (await incomingMessage.client.channels.fetch(
        event.ledgerChannel
      )) as TextChannel;
      ledgerChannel.send(
        createBasicEmbed(
          INFO.CHANNEL_CREATION(
            createdChannels,
            "Team Channels 💪",
            registrant.teamName!
          ),
          "SUCCESS"
        )
      );
    } else {
      await joinTeamChannel(incomingMessage, event, teamName, "team");
    }
  } catch (err) {
    serverLogger("error", incomingMessage.content, err);
    throw "Team Channel Creation Failed!";
  }
};

const giveCheckinRole = async (incomingMessage: Message, roleId: string) => {
  await incomingMessage.member?.roles.add(roleId);
};

const createTeamChannel = async (
  incomingMessage: Message,
  event: eventSchema,
  channelName: string,
  channelType: "team" | "support",
  teamName?: string
): Promise<{ text: string; voice: string }> => {
  enum cTypes {
    team = "Team Channels 💪",
    support = "Support Channels 🔧",
  }
  const channelsCreated = await addChannel({
    channelName,
    userIds: [incomingMessage.author.id],
    categoryId: process.env.TEAM_CHANNEL_CATEGORY_ID!,
  });
  if (!channelsCreated.text || !channelsCreated.voice)
    throw "Channel Creation Failed!";
  const channel = (await incomingMessage.client.channels.fetch(
    channelsCreated.text!
  )) as TextChannel;
  await channel.send(
    "@here",
    createBasicEmbed(
      INFO.TEAM_CHANNEL_INTRO(
        cTypes[channelType],
        event.name,
        channelType === "team" ? teamName : null
      ),
      "SUCCESS"
    )
  );
  return { text: channelsCreated.text!, voice: channelsCreated.voice! };
};

const joinTeamChannel = async (
  incomingMessage: Message,
  event: eventSchema,
  channelName: string,
  channelType: "team" | "support"
) => {
  const db = await (await getDbClient()).db().collection("private-channels");
  const channelExists = await db.findOne<channelDBSchema>({ channelName });
  if (!channelExists) throw "Expected channel to exist, but no channel found!";
  await joinChannel({
    channelId: channelExists.channelId.text,
    userIds: [incomingMessage.author.id],
  });
  await joinChannel({
    channelId: channelExists.channelId.voice,
    userIds: [incomingMessage.author.id],
  });
  const channel = (await incomingMessage.client.channels.fetch(
    channelExists.channelId.text
  )) as TextChannel;
  channel.send(
    "@here",
    createBasicEmbed(
      INFO.TEAM_CHANNEL_NEW_MEMBER(incomingMessage.author, event, channelType),
      "SUCCESS"
    )
  );
};
