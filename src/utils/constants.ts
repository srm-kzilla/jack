import { User, MessageEmbed } from "discord.js";

export const ERRORS = {
  DM_BLOCKED: (user: User) =>
    `**Oopsie!** <@${user.id}>, it seems your **DM is blocked**. Please **change the settings** and request again!`,
  CERTIFICATE_NOT_FOUND:
    "**Oops!** A wide search across our records, but we couldn't trace your data. Our insights say you weren't able to register for the event. Hope to see you soon next time!",
  EMAIL_MISSING: "Invalid Command! Type `#kzjack help` for a list of commands",
  INVALID_EMAIL: "Oops! The email is malformed or invalid. Please try again!",
  URL_MISSING: "Invalid Command! Type `#kzjack help` for a list of commands",
};
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
};

export const CONSTANTS = {
  thumbsUpEmoji: "👍",
  jackLogo: "https://srmkzilla.net/static/jack_logo.png",
  certificateUserDirectMessage: (eventName: string) =>
    new MessageEmbed()
      .setTitle(`${eventName} Certificates`)
      .setColor(COLORS.INFO)
      .setDescription(
        `
  **Yayy!** You've made it to the end of ${eventName}! 🥳
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
