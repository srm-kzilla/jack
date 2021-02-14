import axios from "axios";
import { Message } from "discord.js";
import { createBasicEmbed, shrinkedURLMessage } from "../utils/messages";
import { COLORS, CONSTANTS, ERRORS } from "../utils/constants";
import { serverLogger } from "../utils/logger";
import { incomingMessageSchema } from "../models/incomingMessage";

/**
 * Shrinks looong URL using KZILLA.XYZ
 *
 * @param {shrink} longUrl
 */
export async function shrinkURL(longUrl: string) {
  const { data } = await axios.post(
    CONSTANTS.KZILLA_XYZ_SHRINK_URL_ENDPOINT,
    { longUrl: longUrl },
    { headers: { authorization: process.env.XYZ_WEBHOOK_TOKEN || "" } }
  );
  return data;
}

/**
 * Handles commands for shrinking message
 *
 * @param {Message} incomingMessage
 * @param {incomingMessageSchema} messageType
 */
export async function handleShrinkURLMessage(
  incomingMessage: Message,
  messageType: incomingMessageSchema
) {
  try {
    const longURL = incomingMessage.content.split(" ")[2];
    if (longURL) {
      const data = await shrinkURL(longURL);
      incomingMessage.channel.send(await shrinkedURLMessage(data));
      serverLogger(
        "success",
        incomingMessage.content,
        `Shrinked URL ${longURL}`
      );
    } else {
      serverLogger("user-error", incomingMessage.content, "No URL");
      incomingMessage.channel.send(
        `<@${messageType.incomingUser.id}>`,
        createBasicEmbed(ERRORS.URL_MISSING, "ERROR")
      );
    }
  } catch (err) {
    if (err.isAxiosError && err.response.status == 400) {
      serverLogger("user-error", incomingMessage.content, "Malformed URL");
      incomingMessage.channel.send(
        `<@${messageType.incomingUser.id}>`,
        createBasicEmbed(ERRORS.INVALID_URL, "ERROR")
      );
    } else {
      serverLogger("error", incomingMessage.content, err);
      incomingMessage.channel.send(
        `<@${messageType.incomingUser.id}>`,
        createBasicEmbed(ERRORS.UNAUTHORIZED_USER, "ERROR")
      );
    }
  }
}
