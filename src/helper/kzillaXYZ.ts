import axios from "axios";
import { Message } from "discord.js";
import {
  internalError,
  invalidURL,
  shrinkedURLMessage,
} from "../utils/messages";
import { CONSTANTS, ERRORS } from "../utils/constants";
import { serverLogger } from "../utils/logger";

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
 */
export async function handleShrinkURLMessage(incomingMessage: Message) {
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
      incomingMessage.channel.send(ERRORS.URL_MISSING);
    }
  } catch (err) {
    if (err.isAxiosError && err.response.status == 400) {
      serverLogger("user-error", incomingMessage.content, "Malformed URL");
      incomingMessage.channel.send(invalidURL());
    } else {
      serverLogger("error", incomingMessage.content, err);
      incomingMessage.channel.send(internalError());
    }
  }
}
