import { Message } from "discord.js";
import { config } from "dotenv";
import {
  handleIncomingChannelCommand,
  handleIncomingDMCommand,
} from "./src/controllers/incomingMessageHandler";
import { getDiscordBot, initDiscordBot } from "./src/utils/discord";
import { COMMANDS } from "./src/utils/constants";
import { initDbClient } from "./src/utils/database";
import { handleMemberJoin, handleMemberLeave } from "./src/helper/memberLogs";
/******************************************
          Initialize Server
*******************************************/
async function createServer() {
  // Mount Initializers
  config();
  await initDiscordBot();
  await initDbClient();
  const client = await getDiscordBot();

  client!.on("ready", () => {
    if (client) console.log(`Logged in as ${client.user!.tag}!`);
  });
  client!.on("message", async (message: Message) => {
    /******************************************
          Check if input is by Human
    *******************************************/
    if (!message.author.bot) {
      if (message.content.split(" ")[0] == COMMANDS.prefix) {
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

  client!.on("guildMemberAdd", (member) => {
    handleMemberJoin(member, client);
  });

  client!.on("guildMemberRemove", (member) => {
    handleMemberLeave(member, client);
  });
}

createServer();
