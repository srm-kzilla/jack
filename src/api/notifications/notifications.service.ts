import { checkInDBSchema } from "../../models/event";
import { getDbClient } from "../../utils/database";
import { getDiscordBot } from "../../utils/discord";

export const getDiscordID = async (emailArray: Array<string>) => {
  const client = await getDiscordBot();
  const db = (await getDbClient()).db().collection("notification-mozohack22");
  let noIDUsers = [];
  let userIDArray = [];
  try {
    emailArray.map(async (email) => {
      const user = await db.findOne<checkInDBSchema>({ email: email });
      if (!user) return noIDUsers.push(email);
      const userId = user.discordID;
      return userIDArray.push(userId);
    });
  } catch (err) {
    console.log(err);
  }
};
