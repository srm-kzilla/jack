import axios from "axios";
import { Message } from "discord.js";
import { CONSTANTS } from "../utils/constants";
import { serverLogger } from "../utils/logger";
import { internalError } from "../utils/messages";
// import { memeMessage } from "../utils/messages";

export async function handleJokes(incomingMessage: Message) {
  try {
    const { data } = await axios.get(CONSTANTS.JOKES_URL_ENDPOINT);
    console.log(data);
    incomingMessage.channel.send(data[0].setup + data[0].punchline);
  } catch (err) {
    incomingMessage.channel.send(internalError());
    serverLogger("error", incomingMessage.content, err);
  }
}

export async function handleMemes(incomingMessage: Message) {
  try {
    const { data } = await axios.get(CONSTANTS.MEMES_URL_ENDPOINT);
    console.log(data);
    incomingMessage.channel.send(data.title, {
      files: [data.url],
    });
  } catch (err) {
    incomingMessage.channel.send(internalError());
    serverLogger("error", incomingMessage.content, err);
  }
}
