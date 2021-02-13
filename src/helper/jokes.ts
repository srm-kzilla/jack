import axios from "axios";
import { Message } from "discord.js";
import { incomingMessageSchema } from "../models/incomingMessage";
import { CONSTANTS, ERRORS } from "../utils/constants";
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
    incomingMessage.channel.send(data[0].setup + data[0].punchline);
  } catch (err) {
    incomingMessage.channel.send(
      `<@${messageType.incomingUser.id}>`,
      createBasicEmbed(ERRORS.INTERNAL_ERROR, "ERROR")
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
    incomingMessage.channel.send(data.title, {
      files: [data.url],
    });
  } catch (err) {
    incomingMessage.channel.send(
      `<@${messageType.incomingUser.id}>`,
      createBasicEmbed(ERRORS.INTERNAL_ERROR, "ERROR")
    );
    serverLogger("error", incomingMessage.content, err);
  }
}
