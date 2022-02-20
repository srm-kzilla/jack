import { checkInDBSchema } from "../../models/event";
import { getDbClient } from "../../utils/database";
import { getDiscordBot } from "../../utils/discord";
import { notificationsRequest } from "./notifications.schema";
import { createBasicEmbed } from "../../utils/messages";

export const getDiscordID = async (emailArray: Array<string>) => {
  const db = (await getDbClient()).db().collection("notification-mozohack22");
  let noIDUsers: string[] = [];
  let userIDArray: string[] = [];
  try {
    emailArray.map(async (email) => {
      const user = await db.findOne<checkInDBSchema>({ email: email });
      if (!user) return noIDUsers.push(email);
      const userId = user.discordID;
      return userIDArray.push(userId);
    });
    return { userIDArray, noIDUsers };
  } catch (err) {
    console.log(err);
  }
};

export const notificationsService = async (data: notificationsRequest) => {
  try {
    const client = await getDiscordBot();
    const ids = await getDiscordID(data.emails);
    const msg = { title: data.subject, message: data.body };
    if (ids && client) {
      ids.userIDArray.map((id) => {
        const embed = createBasicEmbed(msg, "ANNOUNCEMENT");
        client.users
          .fetch(id.toString(), false)
          .then((user) => {
            user.send(embed);
          })
          .catch((err) => {
            console.log("Error Occured");
          });
      });
    }
    throw { code: 500, error: "Internal Server Error" };
  } catch (error) {}
};
