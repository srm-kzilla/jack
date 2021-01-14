import { MessageEmbed } from "discord.js";

export const certificateEmoji = ["👍"];

export const startCommand = "-srmkzilla";

export const certificateUserDirectMessage =
  "Hello, Please send your email here in the format";

export const getYourCertificateChannelMessage = (eventName: any) => {
  return new MessageEmbed()
    .setTitle("Get Your Certificates")
    .setColor("#DAF7A6")
    .setDescription(
      `Get your certificates for ${eventName} event by reacting with a ${certificateEmoji[0]} to this message`
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

export const certificateMessage = new MessageEmbed()
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
  .attachFiles(["https://ishanchhabra.com/resume.pdf"]);

export const getHelpMessage = new MessageEmbed()
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
      value: "Type `-srmkzilla certificate <your-email>` for certificates",
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

export const invalidCommand = new MessageEmbed()
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

export const internalError = new MessageEmbed()
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
