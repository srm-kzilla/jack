import { GuildMember } from "discord.js";
import { MongoClient } from "mongodb";
import { serverLogger } from "../utils/logger";
import { eventUserSchema } from "../models/event";

export const updateUserJoinOrLeave = async (
  member: GuildMember,
  joinOrLeave: "join" | "leave"
) => {
  try {
    const db = (
      await MongoClient.connect(process.env.EVENT_DATABASE_URI!, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ignoreUndefined: true,
      })
    )
      .db()
      .collection<eventUserSchema>("users");
    const { result } = await db.updateOne(
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
