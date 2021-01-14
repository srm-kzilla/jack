import { MessageEmbed } from "discord.js";

export const certificateEmoji = ["👍"];

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
      "With ❤️ , your friends at  SRMKZILLA",
      "https://srmkzilla.net/assets/img/kzilla.png"
    );
};

export const startCommand = "-srmkzilla";

export const certificateUserDirectMessage =
  "Hello, Please send your email here in the format";

export const certificateMessage = "Here is your certificate!";
