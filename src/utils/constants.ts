import { User, MessageEmbed } from "discord.js";
import { config } from "dotenv";
import { incomingMessageSchema } from "../models/incomingMessage";

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
          : `<@${process.env.OPERATOR_ROLE_ID}`) +
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
};

export const INFO = {
  WAIT: {
    title: "Things worth having are worth waiting for! 😉",
    message: "Please wait while we fetch a certificate for you! ⏲️",
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
};

/**
 * Constant variables
 */
export const CONSTANTS = {
  thumbsUpEmoji: "👍",
  pollReactions: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"],
  jackLogo: "https://srmkzilla.net/static/jack_logo.png",
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
        "https://srmkzilla.net/assets/img/kzilla.png"
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
