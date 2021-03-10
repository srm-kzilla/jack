import { getDiscordBot } from "../../utils/discord";
import { GuildChannel, OverwriteResolvable } from "discord.js";
import { ERRORS } from "../error/error.constant";
import { getDbClient } from "../../utils/database";
import { serverLogger, channelLogger } from "../../utils/logger";

export const addChannel = async (
  channelName: string,
  categoryId: string,
  userIds: Array<string>
) => {
  const client = await getDiscordBot();
  const guild = client?.guilds.cache.get(process.env.GUILD_ID!);
  try {
    const textPermissions: OverwriteResolvable[] = [
      {
        id: guild!.roles.cache.find((role) => role.name === "@everyone")!.id,
        deny: ["VIEW_CHANNEL"],
      },
    ];
    const voicePermissions: OverwriteResolvable[] = [
      {
        id: guild!.roles.cache.find((role) => role.name === "@everyone")!.id,
        deny: ["VIEW_CHANNEL"],
      },
    ];
    const textPromises = userIds.map(async (userId) => {
      const myId = (await guild?.members.fetch(userId))!.id;
      textPermissions.push({
        id: myId,
        allow: [
          "VIEW_CHANNEL",
          "READ_MESSAGE_HISTORY",
          "SEND_MESSAGES",
          "EMBED_LINKS",
          "ATTACH_FILES",
          "ADD_REACTIONS",
          "USE_EXTERNAL_EMOJIS",
        ],
      });
    });
    const voicePromises = userIds.map(async (userId) => {
      const myId = (await guild?.members.fetch(userId))!.id;
      voicePermissions.push({
        id: myId,
        allow: ["CONNECT", "STREAM", "SPEAK", "USE_VAD"],
      });
    });
    await Promise.all(textPromises);
    await Promise.all(voicePromises);
    const createdTextChannel = await guild?.channels.create(
      `${channelName}-text`,
      {
        type: "text",
        parent: categoryId,
        permissionOverwrites: textPermissions,
      }
    );
    const createdVoiceChannel = await guild?.channels.create(
      `${channelName}-voice`,
      {
        type: "voice",
        parent: categoryId,
        permissionOverwrites: voicePermissions,
      }
    );
    const db = await (await getDbClient()).db().collection("private-channels");
    await db.insertOne({
      channelName,
      categoryId,
      userIds,
    });
    return {
      text: createdTextChannel?.id,
      voice: createdVoiceChannel?.id,
    };
  } catch (err) {
    serverLogger("webhook-error", "Webhook Channel Add", err);
    throw ERRORS.INTERNAL_SERVER_ERROR;
  }
};

export const deleteChannel = async (channelName: string) => {
  const client = await getDiscordBot();
  const guild = client?.guilds.cache.get(process.env.GUILD_ID!);
  let guildTextChannel: GuildChannel | undefined;
  let guildVoiceChannel: GuildChannel | undefined;
  try {
    guildTextChannel = await guild?.channels.cache.find(
      (channel) => channel.name === `${channelName}-text`
    );
    await guildTextChannel?.delete("Channel Expired!");
    guildVoiceChannel = await guild?.channels.cache.find(
      (channel) => channel.name === `${channelName}-voice`
    );
    await guildVoiceChannel?.delete("Channel Expired!");
    const db = await (await getDbClient()).db().collection("private-channels");
    await db.deleteOne({
      channelName,
    });
    return {
      text: guildTextChannel?.id,
      voice: guildVoiceChannel?.id,
    };
  } catch (err) {
    serverLogger("webhook-error", "Webhook Channel Delete", err);
    throw ERRORS.DISCORD_CHANNEL_404;
  }
};
