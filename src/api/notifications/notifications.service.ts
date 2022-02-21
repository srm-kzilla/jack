import { checkInDBSchema } from "../../models/event";
import { getDbClient } from "../../utils/database";
import { getDiscordBot } from "../../utils/discord";
import { notificationsRequest } from "./notifications.schema";
import { Response } from "express";
import { Client, MessageEmbed } from "discord.js";
import { CONSTANTS } from '../../utils/constants';

export interface getDiscordIDSchema {
  userIDArray: Array<string>;
  failedEmails: Array<string>;
  successEmails: Array<string>;
}

export const getDiscordID = async (emailArray: Array<string>) => {
  const db = (await getDbClient()).db().collection(`jack-notifications`);
  const userIDArray: string[] = [];
  const failedEmails: string[] = [];
  const successEmails: string[] = [];
  try {
    for (let index = 0; index < emailArray.length; index++) {
      const user = await db.findOne<checkInDBSchema>({
        email: emailArray[index],
      });
      if (!user) {
        failedEmails.push(emailArray[index]);
      } else {
        const userId = user.discordID;
        userIDArray.push(userId);
        successEmails.push(emailArray[index]);
      }
    }
    return { userIDArray, failedEmails, successEmails };
  } catch (err) {
    console.log(err);
  }
};

export const notificationsService = async (
  data: notificationsRequest,
  res: Response
) => {
  try {
    const client: Client | undefined = await getDiscordBot();
    const ids: getDiscordIDSchema | undefined = await getDiscordID(data.emails);
    if (ids && client) {
      ids.userIDArray.map(async (id: string) => {
        const embed = new MessageEmbed()
          .setColor(CONSTANTS.PURPLE_COLOR_HEX)
          .setTitle(data.title)
          .setDescription(data.body)
          .setThumbnail(
            CONSTANTS.SRMKZILLA_GRADIENT_LOGO
          )
          .setTimestamp()
          .setFooter(CONSTANTS.FOOTER, CONSTANTS.FOOTER_LOGO_URL);
        const user = await client.users.fetch(id, false);
        user.send(embed);
      });
      return {
        status: true,
        success: ids.successEmails,
        failed: ids.failedEmails,
      }
      
    }
  } catch (error: any) {
    res.status(error.code || 500).json({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};
