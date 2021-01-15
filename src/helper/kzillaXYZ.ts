import axios from "axios";
import { Message } from "discord.js";
import { shrinkedURLMessage } from "../utils/messages";
import { CONSTANTS, ERRORS } from "../utils/constants";

export async function shrinkURL(longUrl: string) {
  const { data } = await axios.post(
    CONSTANTS.KZILLA_XYZ_SHRINK_URL_ENDPOINT,
    { longUrl: longUrl },
    { headers: { authorization: process.env.XYZ_WEBHOOK_TOKEN || "" } }
  );
  return data;
}

export async function handleShrinkURLMessage(incomingMessage: Message) {
  try {
    const longURL = incomingMessage.content.split(" ")[2];
    if (longURL) {
      const data = await shrinkURL(longURL);
      incomingMessage.channel.send(await shrinkedURLMessage(data));
    } else {
      //url missing
      incomingMessage.channel.send(ERRORS.URL_MISSING);
    }
  } catch (err) {
    console.log(err);
  }
}
