import { checkInDBSchema } from "../../models/event";
import { getDbClient } from "../../utils/database";
import { getDiscordBot } from "../../utils/discord";
import { notificationsRequest } from "./notifications.schema";
import { createBasicEmbed } from "../../utils/messages";
import { Response } from "express";
import { Client } from "discord.js";

export interface getDiscordIDSchema {
  userIDArray: Array<string>;
  noIDUsers: Array<string>;
}

export const getDiscordID = async (emailArray: Array<string>) => {
  const db = (await getDbClient()).db().collection(`notification-mozohack22`);
  let noIDUsers: string[] = [];
  let userIDArray: string[] = [];
  try {
    for (let index = 0; index < emailArray.length; index++) {
      const user = await db.findOne<checkInDBSchema>({
        email: emailArray[index],
      });
      if (!user) {
        noIDUsers.push(emailArray[index]);
      } else {
        const userId = user.discordID;
        userIDArray.push(userId);
      }
    }
    return { userIDArray, noIDUsers };
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
    const msg = { title: data.subject, message: data.body };
    if (ids && client) {
      ids.userIDArray.map(async (id: string) => {
        const embed = createBasicEmbed(msg, "ANNOUNCEMENT");
        const user = await client.users.fetch(id, false);
        user.send(embed);
      });
      res.status(200).json({
        status:true,
        success: ids.userIDArray,
        failed: ids.noIDUsers,
      });
    }
  } catch (error: any) {
    res.status(error.code || 500).json({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};
