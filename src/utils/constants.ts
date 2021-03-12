import { User, MessageEmbed, GuildMember } from "discord.js";
import { config } from "dotenv";
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
};

/**
 * Constant variables
 */
export const CONSTANTS = {
  thumbsUpEmoji: "👍",
  pollReactions: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"],
  checkinReactions: {
    accept: "✅",
    reject: "❌",
    error: "❗",
  },
  jackLogo: "https://jack.srmkzilla.net/assets/jack_logo.png",
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
  MEMES_URL_ENDPOINT: "https://meme-api.herokuapp.com/gimme/programmingmemes/",
};

export const COLORS = {
  SUCCESS: "#15AE37",
  INFO: "#DAF7A6",
  ERROR: "#F42929",
  ANNOUNCEMENT: "#26BAFF",
};
