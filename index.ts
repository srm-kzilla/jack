import { DMChannel, Message, User } from "discord.js";
import { config } from "dotenv";
import { handleIncomingCommand } from "./src/controllers/inputHandler";
import { getDiscordBot, initDiscordBot } from "./src/utils/discord";

// DotEnv config
config();

// DiscordJS initialization
async function createServer() {
  await initDiscordBot();
  const client = await getDiscordBot();

  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });
  client.on("message", async (incomingMessage: Message) => {
    //check for human input
    if (!incomingMessage.author.bot) {
      let startCommand = "-srmkzilla";
      let message = incomingMessage.content;
      //check for our command
      if (message.split(" ")[0] == startCommand) {
        handleIncomingCommand(incomingMessage);
      }
    }
    // Else Message is not meant for this command
  });
}

createServer();
