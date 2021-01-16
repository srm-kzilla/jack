import { getDiscordBot } from "./discord";

export async function channelLogger(channelID: any, message: any) {
  const client = await getDiscordBot();
  //@ts-ignore
  client.channels.cache.get(channelID).send(message);
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
