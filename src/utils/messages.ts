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

export const waitCertificateMessage = async () => {
  return new MessageEmbed()
    .setTitle("Things worth having are worth waiting for")
    .setColor("#DAF7A6")
    .setDescription(`Please wait while we fetch a certificate for you!`)
    .setTimestamp()
    .setFooter(
      "Powered by SRMKZILLA and hamster-charged batteries",
      "https://srmkzilla.net/assets/img/kzilla.png"
    );
};

export const getHelpMessage = () => {
  return new MessageEmbed()
    .setTitle("SRMKZILLA Discord Bot")
    .setColor(COLORS.INFO)
    .setDescription(`Ask me about your certificates`)
    .addFields(
      {
        name: "Help",
        value: "Type `#kzjack help` for a list of commands",
      },
      {
        name: "Certificates",
        value: "Type `#kzjack get-certificate <your-email>` for certificates",
      },
      {
        name: "Shrink URLs",
        value: "Type `#kzjack shrink <URL>` for shrinking the URL",
      },
      {
        name: "Members Count",
        value:
          "Type `#kzjack membercount` for getting count of the awesome people on this server",
      },
      {
        name: "Start Certificates Thread [Only Mods]",
        value: "Type `#kzjack certificate` for certificate",
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
    .setTitle("SRMKZILLA Discord Bot")
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

export const unauthorizedUser = () => {
  return new MessageEmbed()
    .setTitle("SRMKZILLA Discord Bot")
    .setColor(COLORS.ERROR)
    .setDescription(`Oops! You are not authorized to use this command`)
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
    .setTitle("SRMKZILLA Discord Bot")
    .setColor(COLORS.ERROR)
    .setDescription(
      `Error 500. It's not you! It's us and we are on it! Meanwhile, try Help`
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

export const membersCountMessage = (memberCount: number, botCount: number) => {
  return new MessageEmbed()
    .setTitle(memberCount)
    .setColor(COLORS.SUCCESS)
    .setDescription(
      `I shovelled coal into the server and counted the members for you! 🚂`
    )
    .addFields(
      {
        name: "Current Members",
        value: memberCount - botCount,
        inline: true,
      },
      {
        name: "Bots",
        value: botCount,
        inline: true,
      },
      {
        name: "Next Milstone",
        value: `${Math.ceil(memberCount / 100) * 100}`,
      }
    )
    .setTimestamp()
    .setFooter(
      "Powered by SRMKZILLA and hamster-charged batteries",
      "https://srmkzilla.net/assets/img/kzilla.png"
    );
};
