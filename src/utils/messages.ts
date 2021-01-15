import { MessageEmbed } from "discord.js";
import { CONSTANTS } from "./constants";

export const getYourCertificateChannelMessage = (eventName: string) => {
  return new MessageEmbed()
    .setTitle("Get Your Certificates")
    .setColor("#DAF7A6")
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
      "With ❤️ , your friends at SRMKZILLA",
      "https://srmkzilla.net/assets/img/kzilla.png"
    );
};

export const certificateMessage = async (cert: Buffer) => {
  return new MessageEmbed()
    .setTitle("Certificate")
    .setColor("#DAF7A6")
    .setDescription(
      `Thank you for attending the workshop! We hope you learnt a lot!`
    )
    .setTimestamp()
    .setFooter(
      "With ❤️ , your friends at SRMKZILLA",
      "https://srmkzilla.net/assets/img/kzilla.png"
    )
    .attachFiles([{ attachment: cert, name: "certificate.jpeg" }]);
};

export const getHelpMessage = () => {
  return new MessageEmbed()
    .setTitle("SRMKZILLA Discord Bot")
    .setColor("#DAF7A6")
    .setDescription(`Ask me about your certificates`)
    .addFields(
      {
        name: "Help",
        value: "Type `-srmkzilla help` for a list of commands",
      },
      {
        name: "Certificates",
        value:
          "Type `-srmkzilla get-certificate <your-email>` for certificates",
      },
      {
        name: "Start Certificates Thread [Only Mods]",
        value: "Type `-srmkzilla certificate` for certificate",
      }
    )
    .setTimestamp()
    .setFooter(
      "Made with ❤️ by your friends at SRMKZILLA",
      "https://srmkzilla.net/assets/img/kzilla.png"
    );
};
export const invalidCommand = () => {
  return new MessageEmbed()
    .setTitle("SRMKZILLA Discord Bot")
    .setColor("#DAF7A6")
    .setDescription(`Oops! It seems you have entered an invalid command.`)
    .addFields({
      name: "Help",
      value: "Type `-srmkzilla help` for a list of commands",
    })
    .setTimestamp()
    .setFooter(
      "Made with ❤️ by your friends at SRMKZILLA",
      "https://srmkzilla.net/assets/img/kzilla.png"
    );
};

export const unauthorizedUser = () => {
  return new MessageEmbed()
    .setTitle("SRMKZILLA Discord Bot")
    .setColor("#DAF7A6")
    .setDescription(`Oops! You are not authorized to use this command`)
    .addFields({
      name: "Help",
      value: "Type `-srmkzilla help` for a list of commands",
    })
    .setTimestamp()
    .setFooter(
      "Made with ❤️ by your friends at SRMKZILLA",
      "https://srmkzilla.net/assets/img/kzilla.png"
    );
};
export const internalError = () => {
  return new MessageEmbed()
    .setTitle("SRMKZILLA Discord Bot")
    .setColor("#DAF7A6")
    .setDescription(
      `Error 500. It's not you! It's us and we are on it! Meanwhile, try Help`
    )
    .addFields({
      name: "Help",
      value: "Type `-srmkzilla help` for a list of commands",
    })
    .setTimestamp()
    .setFooter(
      "Made with ❤️ by your friends at SRMKZILLA",
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
    .setTitle("Here's your short URL")
    .setColor("#DAF7A6")
    .setDescription(
      `I shovelled coal into the server and shrunk that like for you! 🚂`
    )
    .addFields(
      {
        name: "Shrunk URL",
        value: `kzilla.xyz/${data.shortCode}`,
      },
      {
        name: "Analytics URL",
        value: `kzilla.xyz/analytics/${data.analyticsCode}`,
      }
    )
    .setTimestamp()
    .setFooter(
      "With ❤️ , your friends at SRMKZILLA",
      "https://srmkzilla.net/assets/img/kzilla.png"
    );
};
