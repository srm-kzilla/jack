import { checkInDBSchema } from "../../models/event";
import { getDbClient } from "../../utils/database";
import { getDiscordBot } from "../../utils/discord";
import {
  notificationsRequest,
  notificationUserSchema,
} from "./notifications.schema";
import { MessageEmbed } from "discord.js";
import { CONSTANTS } from "../../utils/constants";

export const getDiscordID = async (emailArray: Array<string>) => {
  const db = (await getDbClient()).db().collection(`jack-notifications`);
  const userIDArray: notificationUserSchema[] = [];
  const failedEmails: string[] = [];
  for (let index = 0; index < emailArray.length; index++) {
    const userEmail = emailArray[index];
    const user = await db.findOne<checkInDBSchema>({
      email: userEmail,
    });
    if (!user) {
      failedEmails.push(userEmail);
    } else {
      const userID = user.discordID;
      userIDArray.push({ email: userEmail, discordID: userID });
    }
  }
  return { userIDArray, failedEmails };
};

export const notificationsService = async (data: notificationsRequest) => {
  try {
    const client = await getDiscordBot();
    const notificationArray = await getDiscordID(data.emails);
    const failedUsers = notificationArray.failedEmails;
    if (notificationArray?.userIDArray.length && client) {
      const notification = await (Promise as any).allSettled(
        notificationArray.userIDArray.map(async (userDetails) => {
          try {
            const embed = new MessageEmbed()
              .setColor(CONSTANTS.PURPLE_COLOR_HEX)
              .setTitle(data.title)
              .setDescription(data.body)
              .setThumbnail(CONSTANTS.SRMKZILLA_GRADIENT_LOGO)
              .setTimestamp()
              .setFooter(CONSTANTS.FOOTER, CONSTANTS.FOOTER_LOGO_URL);
            const user = await client.users.fetch(userDetails.discordID, false);
            await user.send(embed);
          } catch (err) {
            failedUsers.push(userDetails.email);
          }
        })
      );
    }
    return {
      status: true,
      failed: failedUsers,
    };
  } catch (error: any) {
    throw {
      code: error.code || 500,
      message: error.message || "Internal Server Error",
    };
  }
};
