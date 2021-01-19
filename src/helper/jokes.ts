import axios from "axios";
import { Message } from "discord.js";
import { CONSTANTS } from "../utils/constants";
// import { memeMessage } from "../utils/messages";

export async function handleJokes(incomingMessage: Message) {
  const { data } = await axios.get(CONSTANTS.JOKES_URL_ENDPOINT);
  console.log(data);
  incomingMessage.channel.send(data[0].setup + data[0].punchline);
}

export async function handleMemes(incomingMessage: Message) {
  const { data } = await axios.get(CONSTANTS.MEMES_URL_ENDPOINT);
  console.log(data);
  incomingMessage.channel.send(data.title, {
    files: [data.url],
  });
}
