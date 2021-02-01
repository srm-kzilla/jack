import { MessageEmbed } from "discord.js";
import { COLORS, CONSTANTS } from "./constants";

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
    .setImage("https://srmkzilla.net/assets/img/kzilla.png")
    .setTimestamp()
    .setFooter(
      "Powered by SRMKZILLA and hamster-charged batteries",
      "https://srmkzilla.net/assets/img/kzilla.png"
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
      "https://srmkzilla.net/assets/img/kzilla.png"
    )
    .attachFiles([{ attachment: cert, name: "certificate.jpeg" }]);
};

export const waitCertificateMessage = () => {
  return new MessageEmbed()
    .setTitle("Things worth having are worth waiting for")
    .setColor(COLORS.INFO)
    .setDescription(`Please wait while we fetch a certificate for you!`)
    .setTimestamp()
    .setFooter(
      "Powered by SRMKZILLA and hamster-charged batteries",
      "https://srmkzilla.net/assets/img/kzilla.png"
    );
};
export const certificateNotAccessible = () => {
  return new MessageEmbed()
    .setTitle("Ooops! Service Unavailable as the event hasn't ended yet!")
    .setColor(COLORS.ERROR)
    .setDescription(`Please do join us at the event to explore awesomeness!`)
    .setTimestamp()
    .setFooter(
      "Powered by SRMKZILLA and hamster-charged batteries",
      "https://srmkzilla.net/assets/img/kzilla.png"
    );
};

export const getHelpMessage = () => {
  return new MessageEmbed()
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
        name: "Members Count",
        value: "`#kzjack membercount`",
      },
      {
        name: "Tell me a joke",
        value: "`#kzjack joke`",
      },
      {
        name: "Send Memes",
        value: "`#kzjack meme`",
      },
      {
        name: "Announcements [Only Mods]",
        value:
          "`#kzjack announce <? here|everyone > <channel> {<?title>} <description>`",
      },
      {
        name: "Start Certificates Thread [Only Mods]",
        value: "`#kzjack certificate <event-slug>`",
      }
    )
    .setTimestamp()
    .setFooter(
      "Powered by SRMKZILLA and hamster-charged batteries",
      "https://srmkzilla.net/assets/img/kzilla.png"
    );
};
export const invalidCommand = () => {
  return new MessageEmbed()
    .setTitle("Oopsie! I didn't get that")
    .setColor(COLORS.ERROR)
    .setDescription(`Oops! It seems you have entered an invalid command.`)
    .addFields({
      name: "Help",
      value: "Type `#kzjack help` for a list of commands",
    })
    .setTimestamp()
    .setFooter(
      "Powered by SRMKZILLA and hamster-charged batteries",
      "https://srmkzilla.net/assets/img/kzilla.png"
    );
};

export const eventDoesNotExist = () => {
  return new MessageEmbed()
    .setTitle("Event Does Not Exist!")
    .setColor(COLORS.ERROR)
    .setDescription(
      `Oops! It seems you have entered an invalid slug for an event! Double check your inputs!`
    )
    .addFields({
      name: "Help",
      value: "Type `#kzjack help` for a list of commands",
    })
    .setTimestamp()
    .setFooter(
      "Powered by SRMKZILLA and hamster-charged batteries",
      "https://srmkzilla.net/assets/img/kzilla.png"
    );
};

export const unauthorizedUser = () => {
  return new MessageEmbed()
    .setTitle("Wait! This area is not accessible.")
    .setColor(COLORS.ERROR)
    .setDescription(
      `Oops! You are not authorized to use this command. Please contact any moderator for the same.`
    )
    .addFields({
      name: "Help",
      value: "Type `#kzjack help` for a list of commands",
    })
    .setTimestamp()
    .setFooter(
      "Powered by SRMKZILLA and hamster-charged batteries",
      "https://srmkzilla.net/assets/img/kzilla.png"
    );
};

export const invalidURL = () => {
  return new MessageEmbed()
    .setTitle("Malformed URL")
    .setColor(COLORS.ERROR)
    .setDescription(`Whoooop! It seems you entered an invalid or malformed URL`)
    .setTimestamp()
    .setFooter(
      "Powered by SRMKZILLA and hamster-charged batteries",
      "https://srmkzilla.net/assets/img/kzilla.png"
    );
};

export const internalError = () => {
  return new MessageEmbed()
    .setTitle("Uhu! I encountered an error")
    .setColor(COLORS.ERROR)
    .setDescription(
      `Error 500! Our hamsters encountered a bug. Seek out to any <@&778861665826766868> or <@&761273035931516968> for support, if you need one. Type \`#kzjack\` for help`
    )
    .addFields({
      name: "Help",
      value: "Type `#kzjack help` for a list of commands",
    })
    .setTimestamp()
    .setFooter(
      "Powered by SRMKZILLA and hamster-charged batteries",
      "https://srmkzilla.net/assets/img/kzilla.png"
    );
};

export const certParamsGenerator = () => {
  return {
    x: +process.env.CERTIFICATE_X!,
    y: +process.env.CERTIFICATE_Y!,
    maxWidth: +process.env.CERTIFICATE_MAXWIDTH!,
    maxHeight: +process.env.CERTIFICATE_MAXHEIGHT!,
  };
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
      "https://srmkzilla.net/assets/img/kzilla.png"
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
      "https://srmkzilla.net/assets/img/kzilla.png"
    );
};

export const invalidChannel = () => {
  return new MessageEmbed()
    .setTitle("Invalid Channel Name")
    .setColor(COLORS.ERROR)
    .setDescription(
      `Oops! It seems you have entered an invalid channel name. Please enter a valid one and try again!`
    )
    .setTimestamp()
    .setFooter(
      "Powered by SRMKZILLA and hamster-charged batteries",
      "https://srmkzilla.net/assets/img/kzilla.png"
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
        "https://srmkzilla.net/assets/img/kzilla.png"
      );
  } else {
    return new MessageEmbed()
      .setTitle(title)
      .setColor(COLORS.ANNOUNCEMENT)
      .setDescription(message)
      .setTimestamp()
      .setFooter(
        "Powered by SRMKZILLA and hamster-charged batteries",
        "https://srmkzilla.net/assets/img/kzilla.png"
      );
  }
};

export const createErrorEmbed = (title: string, error: string) => {
  return new MessageEmbed()
    .setColor(COLORS.ERROR)
    .setTitle(title)
    .setDescription(error)
    .setTimestamp()
    .setFooter(
      "Powered by SRMKZILLA and hamster-charged batteries",
      "https://srmkzilla.net/assets/img/kzilla.png"
    );
};
