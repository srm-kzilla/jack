import { checkInDBSchema } from "../../models/event";
import { getDbClient } from "../../utils/database";
import { getDiscordBot } from "../../utils/discord";
import { notificationsRequest } from "./notifications.schema";
import { createBasicEmbed } from "../../utils/messages";
import { Response } from "express";
import { Client } from "discord.js";

export interface getDiscordIDSchema {
  userIDArray: Array<string>;
  failedEmails: Array<string>;
  successEmails: Array<string>;
}

export const getDiscordID = async (emailArray: Array<string>) => {
  const db = (await getDbClient()).db().collection(`jack-notifications`);
  let userIDArray: string[] = [];
  let failedEmails: string[] = [];
  let successEmails: string[] = [];
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
    return { userIDArray, failedEmails , successEmails};
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
    const msg = { title: data.title, message: data.body };
    if (ids && client) {
      ids.userIDArray.map(async (id: string) => {
        const embed = createBasicEmbed(msg, "ANNOUNCEMENT");
        const user = await client.users.fetch(id, false);
        user.send(embed);
      });
      res.status(200).json({
        status: true,
        success: ids.successEmails,
        failed: ids.failedEmails,
      });
    }
  } catch (error: any) {
    res.status(error.code || 500).json({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};
