import { GuildMember } from "discord.js";
import { getEventDbClient } from "../utils/database";
import { serverLogger } from "../utils/logger";
import { eventUserSchema } from "../models/event";

export const updateUserJoinOrLeave = async (
  member: GuildMember,
  joinOrLeave: "join" | "leave"
) => {
  try {
    const db = (await getEventDbClient())
      .db()
      .collection<eventUserSchema>("users");
    await db.updateOne(
      { userId: member.id },
      {
        $set: {
          joinedDiscord: joinOrLeave === "join" ? true : false,
        },
      }
    );
  } catch (err) {
    serverLogger("internal-error", "Event MongoDB Connection Error", err);
  }
};
