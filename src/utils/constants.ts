import { MessageEmbed } from "discord.js";
import { generateCertificate } from "../helper/certificate";

export const thumbsUpEmoji = "👍";

export const startCommand = "-srmkzilla";

export const certificateUserDirectMessage =
  "Hello,Please drop your email here in the format `-srmkzilla certificate <your_email>`";

export const getYourCertificateChannelMessage = (eventName: string) => {
  return new MessageEmbed()
    .setTitle("Get Your Certificates")
    .setColor("#DAF7A6")
    .setDescription(
      `Looks like it’s Christmas again! It’s raining certificates. Grab yours for ${eventName} by reacting to this message with a ${thumbsUpEmoji}`
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

export const certificateMessage = async () => {
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
    );
  // .attachFiles([img]); // Need to make dynamic to attach certificate
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
