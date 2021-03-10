import axios from "axios";
import { Message, MessageEmbed } from "discord.js";
import { incomingMessageSchema } from "../models/incomingMessage";
import { COLORS, CONSTANTS, ERRORS } from "../utils/constants";
import { serverLogger } from "../utils/logger";
import { createBasicEmbed } from "../utils/messages";

/**
 * Handle joke commands.
 * Send some jokes on the server.
 * @param {Message} incomingMessage
 * @param {incomingMessageSchema} messageType
 */
export async function handleJokes(
  incomingMessage: Message,
  messageType: incomingMessageSchema
) {
  try {
    const { data } = await axios.get(CONSTANTS.JOKES_URL_ENDPOINT);
    console.log(data);
    incomingMessage.channel.send(
      new MessageEmbed()
        .setTitle(data[0].setup)
        .setDescription(`*${data[0].punchline}*`)
        .setColor(COLORS.INFO)
        .setTimestamp()
        .setFooter(
          "Powered by SRMKZILLA and hamster-charged batteries",
          "https://jack.srmkzilla.net/assets/srmkzilla_logo_white_mono.png"
        )
    );
  } catch (err) {
    incomingMessage.channel.send(
      `<@${messageType.incomingUser.id}>`,
      createBasicEmbed(ERRORS.INTERNAL_ERROR(messageType.channelType), "ERROR")
    );
    serverLogger("error", incomingMessage.content, err);
  }
}

/**
 * Handle memes commands.
 * Send some memes on the server.
 * @param {Message} incomingMessage
 * @param {incomingMessageSchema} messageType
 */
export async function handleMemes(
  incomingMessage: Message,
  messageType: incomingMessageSchema
) {
  try {
    const { data } = await axios.get(CONSTANTS.MEMES_URL_ENDPOINT);
    console.log(data);
    incomingMessage.channel.send(
      new MessageEmbed()
        .setDescription(`**${data.title}**`)
        .setColor(COLORS.INFO)
        .setImage(data.url)
        .setTimestamp()
        .setFooter(
          "Powered by SRMKZILLA and hamster-charged batteries",
          "https://jack.srmkzilla.net/assets/srmkzilla_logo_white_mono.png"
        )
    );
  } catch (err) {
    incomingMessage.channel.send(
      `<@${messageType.incomingUser.id}>`,
      createBasicEmbed(ERRORS.INTERNAL_ERROR(messageType.channelType), "ERROR")
    );
    serverLogger("error", incomingMessage.content, err);
  }
}
