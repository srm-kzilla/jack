import { getDiscordBot } from "../../utils/discord";
import { GuildMember, MessageEmbed } from "discord.js";
import { ERRORS } from "../error/error.constant";
import { COLORS, CONSTANTS } from "../../utils/constants";
import { getDbClient } from "../../utils/database";
import { welcomeMessageDBSchema } from "./roles.schema";
import { serverLogger } from "../../utils/logger";

export const addRole = async (
  userId: string,
  roles: Array<{ roleId: string; eventSlug: string }>
) => {
  const client = await getDiscordBot();
  const db = await (await getDbClient()).db().collection("welcome-messages");
  const guild = client?.guilds.cache.get(process.env.GUILD_ID!);
  let guildMember: GuildMember | undefined;
  try {
    guildMember = await guild?.members.fetch(userId);
  } catch (err) {
    throw ERRORS.DISCORD_404;
  }
  await Promise.all([
    roles.map(async (role) => {
      try {
        const roleAssigned = guildMember!.roles.cache.has(role.roleId);
        if (!roleAssigned) {
          await guildMember?.roles.add(role.roleId);
          const welcomeMessage = await db.findOne<welcomeMessageDBSchema>({
            eventSlug: role.eventSlug,
          });
          if (!welcomeMessage) return;
          let message = new MessageEmbed()
            .setTitle(welcomeMessage.message.title)
            .setColor(
              welcomeMessage.message.color
                ? welcomeMessage.message.color
                : COLORS["ANNOUNCEMENT"]
            );
          if (welcomeMessage.message.logoUrl)
            message.setThumbnail(welcomeMessage.message.logoUrl);
          message
            .setAuthor("Jack Notifications", CONSTANTS.jackLogo)
            .setDescription(welcomeMessage.message.description);
          if (
            welcomeMessage.message.embeds &&
            welcomeMessage.message.embeds.length > 0
          ) {
            message.addFields(welcomeMessage.message.embeds);
          }
          message
            .setTimestamp()
            .setFooter(
              "Powered by SRMKZILLA and hamster-charged batteries",
              "https://jack.srmkzilla.net/assets/srmkzilla_logo_white_mono.png"
            );
          try {
            await (await guildMember?.createDM(true))?.send(message);
          } catch (err) {
            throw ERRORS.USER_DM_BLOCKED;
          }
        }
      } catch (err) {
        serverLogger("non-fatal-error", "Webhook Role Add", err);
      }
    }),
  ]);
};

export const deleteRole = async (
  userId: string,
  roles: Array<{ roleId: string; eventSlug: string }>
) => {
  const client = await getDiscordBot();
  const guild = client?.guilds.cache.get(process.env.GUILD_ID!);
  let guildMember: GuildMember | undefined;
  try {
    guildMember = await guild?.members.fetch(userId);
  } catch (err) {
    throw ERRORS.DISCORD_404;
  }
  await Promise.all([
    roles.map(async (role) => {
      try {
        const roleAssigned = guildMember!.roles.cache.has(role.roleId);
        if (roleAssigned) {
          guildMember?.roles.remove(role.roleId);
        }
      } catch (err) {
        serverLogger("non-fatal-error", "Webhook Role Delete", err);
      }
    }),
  ]);
};
