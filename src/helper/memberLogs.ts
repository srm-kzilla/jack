import {
  Client,
  GuildMember,
  PartialGuildMember,
  TextChannel,
} from "discord.js";
import { serverLogger } from "../utils/logger";
import { updateUserJoinOrLeave } from "../service/user-service";
import { createBasicEmbed } from "../utils/messages";
import { ERRORS, INFO } from "../utils/constants";

export function handleMemberJoin(
  member: GuildMember,
  client: Client | undefined
) {
  try {
    const channel = member.guild.channels.cache.find(
      (ch: any) => ch.id === process.env.LOGGER_CHANNEL_ID
    ) as TextChannel;
    if (!channel) return;
    channel.send(
      createBasicEmbed(INFO.MEMBER_JOIN(member as GuildMember), "SUCCESS")
    );
    member.send(
      `Hello ${member.toString()} ,\nI am **Jack**, **SRMKZILLA's discord assistant.**\nWe at SRMKZILLA welcome you to **SRMKZILLA - Official Mozilla Campus Club**, a lovely community of developers.\nEveryone here has one goal - to learn new and exciting things. \nTo that effect, please do not hesitate to ask any doubts or share an interesting piece of information. If you have any issues with, how things are running, do ping up any **@Admin** or **@Jack Developer**. We are always here to help you and everyone have a magical experience.\n\nCheckout out ${client?.channels.cache
        .get("793838431277023252")
        ?.toString()} to get started!\n- Sent from **SRMKZILLA - Official Mozilla Campus Club**`
    );
    updateUserJoinOrLeave(member, "join");
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
    ) as TextChannel;
    if (!channel) return;
    channel.send(
      createBasicEmbed(ERRORS.MEMBER_LEAVE(member as GuildMember), "ERROR")
    );
    updateUserJoinOrLeave(member as GuildMember, "leave");
  } catch (err) {
    serverLogger("error", "InternalError", err);
  }
}
