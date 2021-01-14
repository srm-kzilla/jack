import { Message } from "discord.js";
import { config } from "dotenv";
import {
  handleIncomingChannelCommand,
  handleIncomingDMCommand,
} from "./src/controllers/inputHandler";
import { startCommand } from "./src/utils/constants";
import { getDiscordBot, initDiscordBot } from "./src/utils/discord";

/******************************************
          Initialize Server
*******************************************/
async function createServer() {
  // Mount Initializers
  config();
  await initDiscordBot();
  const client = await getDiscordBot();

  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });
  client.on("message", async (message: Message) => {
    /******************************************
          Check if input is by Human
    *******************************************/
    if (!message.author.bot) {
      if (message.content.split(" ")[0] == startCommand) {
        switch (message.channel.type) {
          /******************************************
                        Text channel
          *******************************************/
          case "text": {
            //check for our command
            handleIncomingChannelCommand(message);

            break;
          }
          /******************************************
                            DM channel
          *******************************************/
          case "dm": {
            handleIncomingDMCommand(message);
            break;
          }
          default: {
            console.log("Channel not supported");
          }
        }
      }
    }
  });
}

createServer();
