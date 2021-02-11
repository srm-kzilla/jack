import { Client, GuildMember, PartialGuildMember } from "discord.js";
import { serverLogger } from "../utils/logger";

export function handleMemberJoin(
  member: GuildMember,
  client: Client | undefined
) {
  try {
    const channel = member.guild.channels.cache.find(
      (ch: any) => ch.id === process.env.LOGGER_CHANNEL_ID
    );
    if (!channel) return;
    //@ts-ignore
    channel.send(`Welcome to the server, ${member.toString()}`);
    member.send(
      `Hello ${member.toString()} ,\nI am Jack, SRMKZILLA's discord assistant.\nWe at SRMKZILLA welcome you to SRMKZILLA - Official Mozilla Campus Club, a lovely community of developers.\nEveryone here has one goal - to learn new and exciting things. \nTo that effect, please do not hesitate to ask any doubts or share an interesting piece of information. If you have any issues with, how things are running, do ping up any <@&761134182701072405> or <@&807504996496441346>. We are always here to help you and everyone have a magical experience.\n\nCheckout out ${client?.channels.cache
        .get("793838431277023252")
        ?.toString()} to get started!\n- Sent from SRMKZILLA - Official Mozilla Campus Club`
    );
  } catch (err) {
    serverLogger("error", "InternalError", err);
  }
}

export function handleMemberLeave(
  member: GuildMember | PartialGuildMember,
  client: Client | undefined
) {
  try {
    const channel = client?.channels.cache.find(
      (ch: any) => ch.id === process.env.LOGGER_CHANNEL_ID
    );
    if (!channel) return;
    // @ts-ignore
    channel.send(`${member.toString()} left the server :(`);
  } catch (err) {
    serverLogger("error", "InternalError", err);
  }
}
