import { TextChannel } from "discord.js";
import { getDiscordBot } from "./discord";

export async function channelLogger(channelID: any, message: any) {
  try {
    const client = await getDiscordBot();
    //@ts-ignore
    client.channels.cache.get(`${channelID}`).send(message);
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
