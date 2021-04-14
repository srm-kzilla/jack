import {
  User,
  MessageEmbed,
  GuildMember,
  Channel,
  Emoji,
  PartialGuildMember,
  Role,
  VoiceState,
  Guild,
} from "discord.js";
import { config } from "dotenv";
import { Delete } from "../models/customTypes";
import { eventSchema } from "../models/event";

config();

/**
 * Error Messages
 */
export const ERRORS = {
  DM_BLOCKED: {
    title: "DM Blocked!",
    message: (user: User) => {
      return `**Oopsie!** <@${user.id}>, it seems your **DM is blocked**. Please **change the settings** and request again!`;
    },
  },
  CERTIFICATE_NOT_FOUND: {
    title: "Certificate Not Found!",
    message:
      "**Oops!** A wide search across our records, but we couldn't trace your data. Our insights say you weren't able to register for the event. Hope to see you soon next time!",
  },
  URL_MISSING: {
    title: "URL Missing!",
    message: "Invalid Command! Type `#kzjack help` for a list of commands",
  },
  INVALID_EMAIL: {
    title: "Invalid Email!",
    message:
      "Oops! The e-mail seems to be invalid or malformed! Please try again!",
  },
  INVALID_COMMAND: {
    title: "Oopsie! I didn't get that",
    message:
      "Oops! It seems you have entered an invalid command.\n\n**Help**\nType `#kzjack help` for a list of commands",
  },
  EVENT_DNE: {
    title: "Event Does Not Exist!",
    message:
      "Oops! It seems you have entered an invalid slug for an event! Double check your inputs!\n\n**Help**\nType `#kzjack help` for a list of commands",
  },
  INTERNAL_ERROR: (messageType: "dm" | "text" | "news") => {
    return {
      title: "Uhu! I encountered an error",
      message:
        "Error 500! Our hamsters encountered a bug. Seek out to any" +
        (messageType == "dm"
          ? "** @Moderator **"
          : ` <@&${process.env.OPERATOR_ROLE_ID}> `) +
        "for support, if you need one.\n\n**Help**\nType `#kzjack help` for a list of commands",
    };
  },
  UNAUTHORIZED_USER: {
    title: "Wait! This area is not accessible.",
    message:
      "Oops! You are not authorized to use this command. Please contact any moderator for the same.\n\n**Help**\nType `#kzjack help` for a list of commands",
  },
  INVALID_URL: {
    title: "Malformed URL",
    message:
      "Whoooop! It seems you entered an invalid or malformed URL\n\n**Help**\nType `#kzjack help` for a list of commands",
  },
  INVALID_CHANNEL: {
    title: "Invalid Channel Name",
    message:
      "Oops! It seems you have entered an invalid channel name. Please enter a valid one and try again!\n\n**Help**\nType `#kzjack help` for a list of commands",
  },
  CERT_NOT_ACCESS: {
    title: "Ooops! Service Unavailable as the event hasn't ended yet!",
    message:
      "Please do join us at the event to explore awesomeness!\n\n**Help**\nType `#kzjack help` for a list of commands",
  },
  INVALID_POLL: {
    title: "Poll ID invalid!",
    message:
      "Please check your Poll ID, or maybe even your command syntax!\n\n**Help**\nType `#kzjack help` for a list of commands",
  },
  MEMBER_LEAVE: (member: GuildMember) => {
    return {
      title: `A member left the server 🥺!`,
      message: `<@${member.id}> left the server. Sorry to see you go!`,
    };
  },
  EVENT_DISABLED: {
    title: "Event has not been enabled yet! ⏲️",
    message:
      "The event requested hasn't been enabled by the admin yet! Please contact admins!",
  },
  CHECKIN_CREATE_FAIL: {
    title: "Checkin Collector Creation Failed!",
    message: "There has been some error while creating the check-in collector!",
  },
  ROLE_MISSING: {
    title: "Error!😭",
    message:
      "Please recheck and make sure you have entered atleast one role(@role) and a corresponding emoji. Also make sure roles and emojis are in pair.",
  },
  INVALID_ROLE: {
    title: "Error!😭",
    message:
      "Invalid Role! please check and enter a valid role. Please tag the role(@role).",
  },
  ROLE_SYNTAX_ERROR: {
    title: "Error!😭",
    message: `Please follow the proper syntax. Use my help command to access see the proper syntax.`,
  },
  ROLE_ERROR: {
    title: "Error!😭",
    message:
      "Ooooops! something went wrong and I am not quite sure what. Please check the syntax and try again. Also, make sure the mentioned roles exist in the guild.",
  },
  ROLE_EMOJI_PAIR: {
    title: "Error! 😭",
    message:
      "Roles and emojis must exist in pair. Please check the syntax and try and again.",
  },
};

export const INFO = {
  WAIT: {
    title: "Things worth having are worth waiting for! 😉",
    message: "Please wait while we fetch a certificate for you! ⏲️",
  },
  MEMBER_JOIN: (member: GuildMember) => {
    return {
      title: `A new member joined the server 🥳!`,
      message: `<@${member.id}> joined the server! Welcome home!`,
    };
  },
  CHECKIN_END: (event: eventSchema) => {
    return {
      title: `And....it's a wrap up for ${event.name} check-ins 🎊!`,
      message:
        "Thank you for co-operating with us! We really appreciate it 🥰!\n**P.S: If you're still not checked-in, contact admins ASAP!**",
    };
  },
  CHECKIN_CREATED: (event: eventSchema) => {
    return {
      title: "Check-in Collector Started! 🥳",
      message: `**Event Slug:** ${event.slug}\n**Event Name:** ${event.name}\n**Channel Started:** <#${event.checkin?.channelId}>`,
    };
  },
  TEAM_CHANNEL_INTRO: (
    channelType: string,
    eventName: string,
    teamName?: string | null
  ) => {
    return {
      title: "Welcome to the channel! You're the first one here!",
      message:
        `Channel Type: **${channelType}**\nEvent Name: **${eventName}**\n` +
        (teamName
          ? `Team Name: **${teamName}**`
          : "**Support will join soon!**"),
    };
  },
  TEAM_CHANNEL_NEW_MEMBER: (
    user: User,
    event: eventSchema,
    channelType: "team" | "support"
  ) => {
    return {
      title: `Hola ${user.username}#${user.discriminator} 👋 ! Welcome to your ${channelType} channel!`,
      message:
        `Event Name: **${event.name}**\nNew Member: **<@${user.id}>**\n` +
        (channelType === "support"
          ? "**We are here to help you! 😇**"
          : "**This is your private team channel 💪!\nDiscuss, chat or even chill-out with your team!**"),
    };
  },
  CHANNEL_CREATION: (
    channels: { text: string; voice: string },
    channelType: string,
    teamName?: string
  ) => {
    return {
      title: `New ${channelType} Channels Created!`,
      message:
        `Text Channel: **<#${channels.text}>**\nVoice Channel: **<#${channels.voice}>**\n` +
        (teamName ? `Team Name: **${teamName}**` : ""),
    };
  },
  CHANNEL_CREATED: (channel: Channel) => {
    return {
      title: `A new Channel is created 🥳!`,
      message: `<#${channel.id}> is created on our Server!\n created at: ${channel.createdTimestamp}\n channel type: ${channel.type}`,
    };
  },
  CHANNEL_DELETE: (channel: Delete) => {
    return {
      title: `A Channel is Deleted!`,
      message: `${channel.name} is deleted on our Server!`,
    };
  },
  CHANNEL_UPDATE: (channel: Channel) => {
    return {
      title: `A Channel is Updated!`,
      message: `<#${channel.id}> is updated on our Server\n channel type:  ${channel.type} !`,
    };
  },
  EMOJI_CREATE: (emoji: Emoji) => {
    return {
      title: `A Emoji is created 🌽❗`,
      message: `<:${emoji.name}:${emoji.id}> is created on our Server\n created At:  ${emoji.createdAt} !`,
    };
  },
  EMOJI_DELETE: (emoji: Delete) => {
    return {
      title: `A Emoji is Deleted 🙊`,
      message: `Name of the Emoji :${emoji.name}:${emoji.id} is deleted on our Server`,
    };
  },
  CERTIFICATE_COLLECTED: (
    event: eventSchema,
    registrant: { email: string; name: string },
    user: User
  ) => {
    return {
      title: `**Somebody just collected their ${event.name} certificate! 🔴✨**`,
      message: `**Event name:** ${event.name}\n\n**Name:** ${registrant.name}\n**E-mail:** ${registrant.email}\n**Discord Tag:** ${user.username}#${user.discriminator}`,
    };
  },
  MEMBER_BAN: (user: User) => {
    return {
      title: `A member was banned 👮‍♀️!`,
      message: `\n\n<@${user.id}> was banned from the server!😢\n**Username:** ${user.username}#${user.discriminator}`,
    };
  },
  MEMBER_UNBAN: (user: User) => {
    return {
      title: `A member was un-banned ‍🥳!`,
      message: `\n\n<@${user.id}> was un-banned from the Server.😄\n**Username:** ${user.username}#${user.discriminator}`,
    };
  },
  MEMBER_UPDATE: (
    oldInfo: GuildMember | PartialGuildMember,
    newInfo: GuildMember
  ) => {
    if (!(oldInfo.displayName === newInfo.displayName))
      return {
        title: `${oldInfo.displayName} 's details were updated!👀`,
        message: `\n\n**Old name:** ${oldInfo.displayName}\n**new name:** ${newInfo.displayName}\n**user:** <@${oldInfo.user?.id}>\n**Tag:** ${oldInfo.user?.tag}`,
      };
    return {
      title: `${oldInfo.displayName} 's details were updated!👀`,
      message: `\n\n**user:** <@${oldInfo.user?.id}>\n**Tag:** ${
        oldInfo.user?.tag
      }\n**Old avatar:** [**Old avatar**](${CONSTANTS.AVATAR_URL(
        oldInfo.voice
      )})\n**New avatar:** [**New avatar**](${CONSTANTS.AVATAR_URL(
        newInfo.voice
      )})`,
    };
  },
  ROLE_CREATE: (role: Role) => {
    return {
      title: `A new **role** was created!🎉`,
      message: ``,
    };
  },
  ROLE_DELETE: (role: Role) => {
    return {
      title: `A **role** was deleted!😭`,
      message: `\n**Role Name:** ${role.name}`,
    };
  },
  VOICE_STATUS: (oldStatus: VoiceState, newStatus: VoiceState) => {
    let voiceMessage = ` `;
    let titleMessage = ` `;
    if (!(oldStatus.channel?.id === newStatus.channel?.id)) {
      if (oldStatus.channel?.id && newStatus.channel?.id) {
        titleMessage = `${newStatus.member?.user.username}#${newStatus.member?.user.discriminator}`;
        voiceMessage = `\n**${oldStatus.member?.displayName}** moved from the **<#${oldStatus.channel?.id}>** voice channel to the **<#${newStatus.channel?.id}>** voice channel! 🏃‍♂️`;
      } else if (oldStatus.channel?.id) {
        titleMessage = `${oldStatus.member?.user.username}#${oldStatus.member?.user.discriminator}`;
        voiceMessage = `\n**${oldStatus.member?.displayName}** left the **<#${oldStatus.channel?.id}>** voice channel! 🥺`;
      } else if (newStatus.channel?.id) {
        titleMessage = `${newStatus.member?.user.username}#${newStatus.member?.user.discriminator}`;
        voiceMessage = `\n**${newStatus.member?.displayName}** joined the **<#${newStatus.channel?.id}>** voice channel! ✨`;
      }
    }
    return {
      title: titleMessage,
      message: voiceMessage,
    };
  },
  ROLE_UPDATE: (oldRole: Role, newRole: Role) => {
    if (!(oldRole.name === newRole.name))
      return {
        title: `A **role name** was updated!`,
        message: `**Old role Name**: ${oldRole.name}\n**New role name:** ${newRole.name}`,
      };
    return {
      title: `A **role color** was updated!`,
      message: ``,
    };
  },
  REACTION_ROLE_REMOVE: (
    role: Role | undefined,
    userAdd: GuildMember | undefined
  ) => {
    return {
      title: "Role removed ❌",
      message: `**${role?.name}** was removed from ${userAdd?.displayName}. \n**Tag:** ${userAdd?.user.tag}.`,
    };
  },
  REACTION_ROLE_ADD: (
    role: Role | undefined,
    userAdd: GuildMember | undefined
  ) => {
    return {
      title: "Role Alloted ✅",
      message: `**${role?.name}** was alloted to ${userAdd?.displayName}. \n**Tag:** ${userAdd?.user.tag}`,
    };
  },
};

/**
 * Commands
 */
export const COMMANDS = {
  prefix: "#kzjack",
  shrinkURL: "shrink",
  help: "help",
  certificate: "certificate",
  membercount: "membercount",
  announce: "announce",
  joke: "joke",
  memes: "meme",
  cacheflush: "flush",
  createPoll: "poll",
  checkIn: "checkin",
  reactionRole: "role",
};

/**
 * Constant variables
 */
export const CONSTANTS = {
  thumbsUpEmoji: "👍",
  pollReactions: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"],
  roleReactions: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"],
  checkinReactions: {
    accept: "✅",
    reject: "❌",
    error: "❗",
  },
  jackLogo: "https://jack.srmkzilla.net/assets/jack_logo.png",
  FOOTER_LOGO_URL:
    "https://jack.srmkzilla.net/assets/srmkzilla_logo_white_mono.png",
  FOOTER: "Powered by SRMKZILLA and hamster-charged batteries",
  SRMKZILLA_WHITE_LOGO:
    "https://jack.srmkzilla.net/assets/srmkzilla_logo_white_mono.png",
  certificateUserDirectMessage: (eventName: string, username: string) =>
    new MessageEmbed()
      .setTitle(`${eventName} Certificates`)
      .setColor(COLORS.INFO)
      .setDescription(
        `
  **Yayy @${username}!** You've made it to the end of ${eventName}! 🥳
  **Thank you for attending!**
  For your hard work, we would like to provide **certificates!** 🏆\n\n
  `
      )
      .addFields([
        {
          name: "Email",
          value:
            "Drop your registered email 📨 **below** to **claim** your certificates!",
        },
        {
          name: "Expiry",
          value:
            "This message is only **valid for 5 minutes!** Drop in your email ASAP! ⏱️",
        },
      ])
      .setTimestamp()
      .setFooter(
        "Powered by SRMKZILLA and hamster-charged batteries",
        "https://jack.srmkzilla.net/assets/srmkzilla_logo_white_mono.png"
      ),

  KZILLA_XYZ_SHRINK_URL_ENDPOINT: "https://kzilla.xyz/api/v1/webhook/link",
  JOKES_URL_ENDPOINT:
    "https://official-joke-api.appspot.com/jokes/programming/random",
  MEMES_API: "https://meme-api.herokuapp.com/gimme/",
  SUB_REDDITS: [
    "ProgrammerHumor/",
    "codinghumor/",
    "pcmemes/",
    "programmingmemes/",
  ],
  AVATAR_URL: (newStatus: VoiceState) => {
    if (newStatus.member?.user.avatar)
      return `https://cdn.discordapp.com/avatars/${newStatus.member?.user.id}/${newStatus.member?.user.avatar}.jpeg`;
    return `https://cdn.discordapp.com/embed/avatars/0.png`;
  },
};

export const COLORS = {
  SUCCESS: "#15AE37",
  INFO: "#DAF7A6",
  ERROR: "#F42929",
  ANNOUNCEMENT: "#26BAFF",
  LOG_1: "#800000",
  LOG_2: "#008080",
  JOIN_VOICE: "#00ff00",
  LEAVE_VOICE: "#ff0066",
  MOVE_VOICE: "#00ccff",
  REACTION_ROLE: "#bf00ff",
};

export const randomMemesEndpoint = () => {
  return CONSTANTS.MEMES_API.concat(
    CONSTANTS.SUB_REDDITS[
      Math.floor(Math.random() * Math.floor(CONSTANTS.SUB_REDDITS.length))
    ]
  );
};
