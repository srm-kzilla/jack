import {
  Channel,
  Client,
  Emoji,
  Guild,
  GuildMember,
  PartialGuildMember,
  Role,
  TextChannel,
  User,
  VoiceState,
} from "discord.js";
import { serverLogger } from "../utils/logger";
import { updateUserJoinOrLeave } from "../service/user-service";
import { createBasicEmbed } from "../utils/messages";
import { Delete } from "../models/customTypes";
import { COLORS, CONSTANTS, ERRORS, INFO } from "../utils/constants";

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
      createBasicEmbed(ERRORS.MEMBER_LEAVE(member as GuildMember), "LOG_1")
    );
    updateUserJoinOrLeave(member as GuildMember, "leave");
  } catch (err) {
    serverLogger("error", "InternalError", err);
  }
}

export function handleChannelCreate(
  newChannel: Channel,
  client: Client | undefined
) {
  if (newChannel.type === "text" || newChannel.type === "voice") {
    try {
      const channel = client?.channels.cache.find(
        (ch: any) => ch.id === process.env.LOGGER_CHANNEL_ID
      ) as TextChannel;
      if (!channel) return;
      channel.send(
        createBasicEmbed(INFO.CHANNEL_CREATED(newChannel), "SUCCESS")
      );
    } catch (err) {
      serverLogger("error", "InternalError", err);
    }
  }
}

export function handleMemberBan(guild: Guild, user: User) {
  try {
    const channel = guild.channels.cache.find(
      (ch: any) => ch.id === process.env.LOGGER_CHANNEL_ID
    ) as TextChannel;
    if (!channel) return;
    channel.send(createBasicEmbed(INFO.MEMBER_BAN(user as User), "LOG_1"));
  } catch (err) {
    serverLogger("error", "InternalError", err);
  }
}

export function handleChannelDelete(
  deleteChannel: Delete,
  client: Client | undefined
) {
  if (deleteChannel.type === "text" || deleteChannel.type === "voice") {
    try {
      const channel = client?.channels.cache.find(
        (ch: any) => ch.id === process.env.LOGGER_CHANNEL_ID
      ) as TextChannel;
      if (!channel) return;
      channel.send(
        createBasicEmbed(INFO.CHANNEL_DELETE(deleteChannel), "INFO")
      );
    } catch (err) {
      serverLogger("error", "InternalError", err);
    }
  }
}
export function handleMemberUnban(guild: Guild, user: User) {
  try {
    const channel = guild.channels.cache.find(
      (ch: any) => ch.id === process.env.LOGGER_CHANNEL_ID
    ) as TextChannel;
    if (!channel) return;
    channel.send(createBasicEmbed(INFO.MEMBER_UNBAN(user as User), "LOG_2"));
  } catch (err) {
    serverLogger("error", "InternalError", err);
  }
}

export function handleChannelUpdate(
  updateChannel: Channel,
  client: Client | undefined
) {
  if (updateChannel.type === "text" || updateChannel.type === "voice") {
    try {
      const channel = client?.channels.cache.find(
        (ch: any) => ch.id === process.env.LOGGER_CHANNEL_ID
      ) as TextChannel;
      if (!channel) return;
      channel.send(
        createBasicEmbed(INFO.CHANNEL_UPDATE(updateChannel), "SUCCESS")
      );
    } catch (err) {
      serverLogger("error", "InternalError", err);
    }
  }
}
export function handleMemberUpdate(
  oldUser: GuildMember | PartialGuildMember,
  newUser: GuildMember
) {
  try {
    const channel = newUser.guild.channels.cache.find(
      (ch: any) => ch.id === process.env.LOGGER_CHANNEL_ID
    ) as TextChannel;
    if (!channel) return;
    if (oldUser.displayName !== newUser.displayName)
      channel.send(
        createBasicEmbed(
          INFO.MEMBER_UPDATE(oldUser, newUser),
          "LOG_2"
        ).setThumbnail(CONSTANTS.AVATAR_URL(newUser.voice))
      );
  } catch (err) {
    serverLogger("error", "InternalError", err);
  }
}

export function handleRoleCreate(role: Role) {
  try {
    const channel = role.guild.channels.cache.find(
      (ch: any) => ch.id === process.env.LOGGER_CHANNEL_ID
    ) as TextChannel;
    if (!channel) return;
    channel.send(createBasicEmbed(INFO.ROLE_CREATE(role), "LOG_2"));
  } catch (err) {
    serverLogger("error", "InternalError", err);
  }
}

export function handleEmojiCreate(emoji: Emoji, client: Client | undefined) {
  try {
    const channel = client?.channels.cache.find(
      (ch: any) => ch.id === process.env.LOGGER_CHANNEL_ID
    ) as TextChannel;
    if (!channel) return;
    channel.send(createBasicEmbed(INFO.EMOJI_CREATE(emoji), "SUCCESS"));
  } catch (err) {
    serverLogger("error", "InternalError", err);
  }
}
export function handleRoleUpdate(oldRole: Role, newRole: Role) {
  try {
    if (oldRole.name === newRole.name && oldRole.color === newRole.color)
      return;
    console.log(newRole.members.array);
    const channel = oldRole.guild.channels.cache.find(
      (ch: any) => ch.id === process.env.LOGGER_CHANNEL_ID
    ) as TextChannel;
    if (!channel) return;
    channel.send(createBasicEmbed(INFO.ROLE_UPDATE(oldRole, newRole), "LOG_2"));
  } catch (err) {
    serverLogger("error", "InternalError", err);
  }
}

export function handleEmojiDelete(emoji: Delete, client: Client | undefined) {
  try {
    const channel = client?.channels.cache.find(
      (ch: any) => ch.id === process.env.LOGGER_CHANNEL_ID
    ) as TextChannel;
    if (!channel) return;
    channel.send(createBasicEmbed(INFO.EMOJI_DELETE(emoji), "ERROR"));
  } catch (err) {
    serverLogger("error", "InternalError", err);
  }
}
export function handleRoleDelete(role: Role) {
  try {
    const channel = role.guild.channels.cache.find(
      (ch: any) => ch.id === process.env.LOGGER_CHANNEL_ID
    ) as TextChannel;
    if (!channel) return;
    channel.send(createBasicEmbed(INFO.ROLE_DELETE(role), "LOG_1"));
  } catch (err) {
    serverLogger("error", "InternalError", err);
  }
}

export function handleVoiceStatus(
  oldStatus: VoiceState,
  newStatus: VoiceState
) {
  try {
    const channel = oldStatus.guild.channels.cache.find(
      (ch: any) => ch.id === process.env.LOGGER_CHANNEL_ID
    ) as TextChannel;
    if (!channel) return;
    let embed = createBasicEmbed(
      INFO.VOICE_STATUS(oldStatus, newStatus),
      "MOVE_VOICE"
    ).setThumbnail(CONSTANTS.AVATAR_URL(newStatus));
    if (oldStatus.channel?.id === newStatus.channel?.id) return;
    if (oldStatus.channel?.id && newStatus.channel?.id)
      embed.setColor(COLORS.MOVE_VOICE);
    else if (oldStatus.channel?.id) embed.setColor(COLORS.LEAVE_VOICE);
    else if (newStatus.channel?.id) embed.setColor(COLORS.JOIN_VOICE);
    channel.send(embed);
  } catch (err) {
    serverLogger("error", "InternalError", err);
  }
}
