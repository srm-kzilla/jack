import { MessageEmbed } from "discord.js";
import { COLORS, CONSTANTS } from "./constants";
import { pollSchema } from "../models/poll";
import { incomingMessageSchema } from "../models/incomingMessage";
import { join } from "path";
import { eventSchema } from "../models/event";

export const getYourCertificateChannelMessage = (eventName: string) => {
  return new MessageEmbed()
    .setTitle("Get Your Certificates")
    .setColor(COLORS.INFO)
    .setDescription(
      `Looks like it’s Christmas again! It’s raining certificates. Grab yours for ${eventName} by reacting to this message with a ${CONSTANTS.thumbsUpEmoji}`
    )
    .addFields({
      name: "Event Name",
      value: eventName,
    })
    .setImage("https://jack.srmkzilla.net/assets/srmkzilla_logo_white_mono.png")
    .setTimestamp()
    .setFooter(
      "Powered by SRMKZILLA and hamster-charged batteries",
      "https://jack.srmkzilla.net/assets/srmkzilla_logo_white_mono.png"
    );
};

export const certificateMessage = async (cert: Buffer) => {
  return new MessageEmbed()
    .setTitle("Here's your Certificate")
    .setColor(COLORS.SUCCESS)
    .setDescription(
      `Thank you for being the star of the webinar. Grab your participation certificate here. We hope you had a great time learning and discovering !`
    )
    .setTimestamp()
    .setFooter(
      "Powered by SRMKZILLA and hamster-charged batteries",
      "https://jack.srmkzilla.net/assets/srmkzilla_logo_white_mono.png"
    )
    .attachFiles([{ attachment: cert, name: "certificate.jpeg" }]);
};

export const getHelpMessage = (messageType: incomingMessageSchema) => {
  let message = new MessageEmbed()
    .setTitle("Hi, This is Jack")
    .setThumbnail(CONSTANTS.jackLogo)
    .setColor(COLORS.INFO)
    .setDescription(`A cool Beep Bot. Talk with me with the following commands`)
    .addFields(
      {
        name: "Get List of Commands",
        value: "`#kzjack help`",
      },
      {
        name: "Shrink URLs using KZILLA.XYZ",
        value: "`#kzjack shrink <URL>`",
      },
      {
        name: "Tell me a joke",
        value: "`#kzjack joke`",
      },
      {
        name: "Send Memes",
        value: "`#kzjack meme`",
      }
    );
  if (
    messageType.channelType === "text" ||
    messageType.channelType === "news"
  ) {
    message.addFields({
      name: "Members Count",
      value: "`#kzjack membercount`",
    });
  }
  if (messageType.incomingUser.isMod) {
    message.addFields(
      {
        name: "Announcements [Only Mods]",
        value:
          "`#kzjack announce <? here|everyone|@role > <#channel> {<?title>} <description>`",
      },
      {
        name: "Start Certificates Thread [Only Mods]",
        value: "`#kzjack certificate <event-slug>`",
      },
      {
        name: "Flush Cache [Only Mods]",
        value: "`#kzjack flush`",
      },
      {
        name: "Start a Poll (Upto 9 options) [Only Mods]",
        value:
          "`#kzjack poll create <#channel> {<Some Question>} [[<Option 1>],[<Option 2>],[<Option 3>],[<Option 4>]]`",
      },
      {
        name: "Get Poll Results [Only Mods]",
        value: "`#kzjack poll result <Poll ID>`",
      },
      {
        name: "Start a check-in Channel [Only Mods]",
        value: "`kzjack checkin <Event Slug>`",
      }
    );
  }
  message
    .setTimestamp()
    .setFooter(
      "Powered by SRMKZILLA and hamster-charged batteries",
      "https://jack.srmkzilla.net/assets/srmkzilla_logo_white_mono.png"
    );
  return message;
};

export const shrinkedURLMessage = (data: any) => {
  return new MessageEmbed()
    .setTitle("Here's your dwindled URL")
    .setColor(COLORS.SUCCESS)
    .setDescription(
      `I shovelled coal into the server and shrunk that like for you! 🚂`
    )
    .addFields(
      {
        name: "Shrunk URL",
        value: `[kzilla.xyz/${data.shortCode}](https://kzilla.xyz/${data.shortCode})`,
        inline: true,
      },
      {
        name: "Analytics URL",
        value: `[kzilla.xyz/analytics/${data.analyticsCode}](https://kzilla.xyz/analytics/${data.analyticsCode})`,
        inline: true,
      }
    )
    .setTimestamp()
    .setFooter(
      "Powered by SRMKZILLA and hamster-charged batteries",
      "https://jack.srmkzilla.net/assets/srmkzilla_logo_white_mono.png"
    );
};

export const membersCountMessage = (membersCount: number, botCount: number) => {
  return new MessageEmbed()
    .setTitle(`It's ${membersCount + botCount}`)
    .setColor(COLORS.SUCCESS)
    .setDescription(
      `I shovelled coal into the server and counted the members for you! 🚂`
    )
    .addFields(
      {
        name: "Current Members",
        value: membersCount,
        inline: true,
      },
      {
        name: "Bots",
        value: botCount,
        inline: true,
      },
      {
        name: "Next Milstone",
        value: `${
          (Math.ceil(membersCount / 100) * 100) % 10 == 0
            ? Math.ceil(membersCount / 100) * 100 + 100
            : Math.ceil(membersCount / 100) * 100
        }`,
      }
    )
    .setTimestamp()
    .setFooter(
      "Powered by SRMKZILLA and hamster-charged batteries",
      "https://jack.srmkzilla.net/assets/srmkzilla_logo_white_mono.png"
    );
};

export const announcementMessage = (title: string, message: string) => {
  if (title == "null") {
    return new MessageEmbed()
      .setColor(COLORS.ANNOUNCEMENT)
      .setDescription(message)
      .setTimestamp()
      .setFooter(
        "Powered by SRMKZILLA and hamster-charged batteries",
        "https://jack.srmkzilla.net/assets/srmkzilla_logo_white_mono.png"
      );
  } else {
    return new MessageEmbed()
      .setTitle(title)
      .setColor(COLORS.ANNOUNCEMENT)
      .setDescription(message)
      .setTimestamp()
      .setFooter(
        "Powered by SRMKZILLA and hamster-charged batteries",
        "https://jack.srmkzilla.net/assets/srmkzilla_logo_white_mono.png"
      );
  }
};

export const createBasicEmbed = (
  msg: { title: string; message: string },
  level: "SUCCESS" | "INFO" | "ERROR" | "ANNOUNCEMENT"
) => {
  return new MessageEmbed()
    .setColor(COLORS[level])
    .setTitle(msg.title)
    .setDescription(msg.message)
    .setTimestamp()
    .setFooter(
      "Powered by SRMKZILLA and hamster-charged batteries",
      "https://jack.srmkzilla.net/assets/srmkzilla_logo_white_mono.png"
    );
};

export const flushSuccessMessage = () => {
  return new MessageEmbed()
    .setColor(COLORS.INFO)
    .setTitle("**Cache Flushed! :toilet:**")
    .setDescription(
      "The cache has been updated with the latest data pulled from MongoDB!"
    )
    .setTimestamp()
    .setFooter(
      "Powered by SRMKZILLA and hamster-charged batteries",
      "https://jack.srmkzilla.net/assets/srmkzilla_logo_white_mono.png"
    );
};

export const createPollMessage = (poll: pollSchema) => {
  return new MessageEmbed()
    .setColor(COLORS.ANNOUNCEMENT)
    .setAuthor(`New Poll 💡!`, CONSTANTS.jackLogo)
    .setTitle(`**${poll.title}**`)
    .setDescription(
      (() => {
        let options = "";
        poll.options.map((o) => {
          options += `${o.emoji} **: ${o.value}**\n`;
        });
        return options;
      })()
    )
    .setTimestamp()
    .setFooter(
      `Poll ID: ${poll.pollID}\nPowered by SRMKZILLA and hamster-charged batteries`,
      "https://jack.srmkzilla.net/assets/srmkzilla_logo_white_mono.png"
    );
};

export const createPollResult = (poll: pollSchema) => {
  return new MessageEmbed()
    .setColor(COLORS.ANNOUNCEMENT)
    .setAuthor(`Poll Results 📊!`, CONSTANTS.jackLogo)
    .addField("Poll ID :", "`" + poll.pollID + "`", true)
    .addField("Channel Deployed:", "<#" + poll.channelID + ">", true)
    .addField("Title:", poll.title)
    .addField("Created Time:", new Date(poll.timestamp as string))
    .addField("\u200B", "\u200B")
    .addFields(
      (() => {
        const ops = poll.options.map((o) => {
          return {
            name: `${o.emoji} **: ${o.value}**`,
            value: `**${o.reactions.length}** votes`,
          };
        });
        return ops;
      })()
    )
    .setTimestamp()
    .setFooter(
      `Powered by SRMKZILLA and hamster-charged batteries`,
      "https://jack.srmkzilla.net/assets/srmkzilla_logo_white_mono.png"
    );
};

export const checkInChannelAnnouncement = (event: eventSchema) =>
  new MessageEmbed()
    .setColor(COLORS.INFO)
    .setAuthor("Check-in Begins! 🏁", CONSTANTS.jackLogo)
    .setTitle(`Check yourself in for ${event.name} 🏁🏁🏁`)
    .setDescription(
      `We are all geared ⚙️ up to host **${event.name}**!\n**But before we can begin, we need to get y'all checked in! 📝**\n\nKindly enter **your registered e-mail** 📩 below!\n\n\n**Upon check-in, you will receive reactions from Jack:**\n\n`
    )
    .addFields(
      {
        name: `${CONSTANTS.checkinReactions.accept} - **Successfully Checked-In!**`,
        value: `You are on your way to participate in **${event.name}**! 🥳\nYou will be auto-joined to a private channel with your team! 💪`,
      },
      {
        name: `${CONSTANTS.checkinReactions.reject} - **Cannot Check-In!**`,
        value:
          "You are not qualified, or your details are not with us.\n**If you think this is a mistake, contact the admins!**",
      },
      {
        name: `${CONSTANTS.checkinReactions.error} - **There is Some Error!**`,
        value: `There has been some error from our side! Contact **<@&${process.env.OPERATOR_ROLE_ID}>**, please!`,
      },
      {
        name: "\u200B",
        value: "\u200B",
      }
    )
    .setTimestamp()
    .setFooter(
      `Powered by SRMKZILLA and hamster-charged batteries`,
      "https://jack.srmkzilla.net/assets/srmkzilla_logo_white_mono.png"
    );
