import { TextChannel } from "discord.js";
import { getDiscordBot } from "./discord";

export async function channelLogger(channelID: string, message: any) {
  try {
    const client = await getDiscordBot();
    (client!.channels.cache.get(channelID) as TextChannel).send(message);
  } catch (err) {
    serverLogger("error", "InternalError", err);
  }
}

export function serverLogger(type: string, message: any, error: any) {
  if (type == "success") {
    console.log(
      `✔️   ${new Date().toISOString()}        ${type}        ${message}`
    );
  } else {
    console.log(
      `❌  ${new Date().toISOString()}        ${type}        ${message}        `,
      error
    );
  }
}
