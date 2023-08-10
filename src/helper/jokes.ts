import axios from "axios";
import { Message, MessageEmbed } from "discord.js";
import { incomingMessageSchema } from "../models/incomingMessage";
import {
  COLORS,
  CONSTANTS,
  ERRORS,
  randomMemesEndpoint,
} from "../utils/constants";
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
    const { data } = await axios.get(CONSTANTS.JOKE_API);
    if (!data.error)
      return incomingMessage.channel.send(
        new MessageEmbed()
          .setDescription(`**${data.joke}**`)
          .setColor(COLORS.INFO)
          .setTimestamp()
          .setFooter(CONSTANTS.FOOTER, CONSTANTS.FOOTER_LOGO_URL)
      );
    incomingMessage.channel.send(
      new MessageEmbed()
        .setTitle(ERRORS.JOKE_API_NOT_WORKING)
        .setColor(COLORS.ERROR)
        .setTimestamp()
        .setFooter(CONSTANTS.FOOTER, CONSTANTS.FOOTER_LOGO_URL)
    );
  } catch (err) {
    incomingMessage.channel.send(
      `<@${messageType.incomingUser.id}>`,
      createBasicEmbed(ERRORS.INTERNAL_ERROR(messageType.channelType), "ERROR")
    );
    serverLogger("error", incomingMessage.content, err);
  }
}

async function extractMeme(url: string) {
  const { data } = await axios.get(url);
  const children = data?.data?.children?.filter((child: any) => child.data.url.endsWith(".jpg") || child.data.url.endsWith(".png"));
  return children[Math.floor(Math.random() * children.length)].data;
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
    const { title, url } = await extractMeme(randomMemesEndpoint());
    incomingMessage.channel.send(
      new MessageEmbed()
        .setDescription(`**${title}**`)
        .setColor(COLORS.INFO)
        .setImage(url)
        .setTimestamp()
        .setFooter(CONSTANTS.FOOTER, CONSTANTS.FOOTER_LOGO_URL)
    );
  } catch (err) {
    incomingMessage.channel.send(
      `<@${messageType.incomingUser.id}>`,
      createBasicEmbed(ERRORS.INTERNAL_ERROR(messageType.channelType), "ERROR")
    );
    serverLogger("error", incomingMessage.content, err);
  }
}
