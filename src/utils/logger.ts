import { getDiscordBot } from "./discord";

export async function logger(message: any) {
  const client = await getDiscordBot();
  client.channels.cache.get(process.env.LOGGER_CHANNEL_ID).send(message);
}
