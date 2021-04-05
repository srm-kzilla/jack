import { Message, VoiceChannel } from "discord.js";
import { config } from "dotenv";
import {
  handleIncomingChannelCommand,
  handleIncomingDMCommand,
} from "./src/controllers/incomingMessageHandler";
import { getDiscordBot, initDiscordBot } from "./src/utils/discord";
import { COMMANDS } from "./src/utils/constants";
import { initDbClient, initEventDbClient } from "./src/utils/database";
import { initCache, refreshKeys } from "./src/utils/nodecache";
import {
  handleChannelCreate,
  handleChannelDelete,
  handleChannelUpdate,
  handleEmojiCreate,
  handleEmojiDelete,
  handleMemberBan,
  handleMemberJoin,
  handleMemberLeave,
  handleMemberUnban,
  handleMemberUpdate,
  handleRoleCreate,
  handleRoleDelete,
  handleRoleUpdate,
  handleVoiceStatus,
} from "./src/helper/memberLogs";
import { serverLogger } from "./src/utils/logger";
import { checkForAccessByRoles } from "./src/helper/roleAuth";
import { incomingMessageSchema } from "./src/models/incomingMessage";
import { Delete } from "./src/models/customTypes";
import { guildJoin } from "./src/controllers/sendMessageHandler";
/******************************************
          Initialize Server
*******************************************/
async function createServer() {
  // Mount Initializers
  config();
  await initDbClient();
  await initEventDbClient();
  await initCache();
  await refreshKeys();

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
        const messageType: incomingMessageSchema = {
          channelType: message.channel.type,
          incomingUser: {
            username: message.author.username,
            discriminator: message.author.discriminator,
            id: message.author.id,
            isMod: await checkForAccessByRoles(message.member, [
              `${process.env.OPERATOR_ROLE_ID}`,
            ]),
          },
        };
        switch (message.channel.type) {
          /******************************************
                        Text channel
          *******************************************/
          case "text": {
            //check for our command
            handleIncomingChannelCommand(message, messageType);

            break;
          }
          /******************************************
                            DM channel
          *******************************************/
          case "dm": {
            handleIncomingDMCommand(message, messageType);
            break;
          }
          default: {
            serverLogger(
              "user-error",
              "ChannelNotSupported",
              "Channel Not Supported"
            );
          }
        }
        message.react(process.env.CUSTOM_EMOJI_ID!).catch((err) => {
          serverLogger("non-fatal-error", "Could not find custom emoji", err);
        });
      }
    }
  });

  client!.on("guildMemberAdd", (member) => {
    handleMemberJoin(member, client);
  });

  client!.on("guildMemberRemove", (member) => {
    handleMemberLeave(member, client);
  });

  client!.on("channelCreate", (channel) => {
    handleChannelCreate(channel, client);
  });

  client!.on("channelDelete", (channel) => {
    handleChannelDelete((channel as unknown) as Delete, client);
  });

  client!.on("channelUpdate", (channel) => {
    handleChannelUpdate(channel, client);
  });

  client!.on("emojiCreate", (emoji) => {
    handleEmojiCreate(emoji, client);
  });

  client!.on("emojiDelete", (event) => {
    handleEmojiDelete((event as unknown) as Delete, client);
  });

  client!.on("error", (error) => {
    serverLogger("error", "InternalError", error);
  });

  client!.on("guildBanAdd", (guild, user) => {
    handleMemberBan(guild, user);
  });

  client!.on("guildBanRemove", (guild, user) => {
    handleMemberUnban(guild, user);
  });

  client!.on("guildCreate", (guild) => {
    guildJoin(guild);
  }); //gets the job done but throws an unknown error

  client!.on("guildMemberUpdate", (oldUser, newUser) => {
    handleMemberUpdate(oldUser, newUser);
  });

  client!.on("roleCreate", (role) => {
    handleRoleCreate(role);
  });

  client!.on("roleDelete", (role) => {
    handleRoleDelete(role);
  });

  client!.on("roleUpdate", (oldRole, newrRole) => {
    handleRoleUpdate(oldRole, newrRole);
  });

  client!.on("voiceStateUpdate", (oldState, newState) => {
    handleVoiceStatus(oldState, newState);
  });
}

createServer();

/**
 * For better development experience
 */
process.on("SIGINT", () => {
  process.exit(0);
});
process.on("SIGTERM", () => {
  process.exit(0);
});
