import { Message, TextChannel, NewsChannel } from "discord.js";
import { serverLogger } from "../utils/logger";
import {
  announcementMessage,
  invalidChannel,
  invalidCommand,
  unauthorizedUser,
} from "../utils/messages";
import { checkForAccessByRoles } from "../helper/roleAuth";
import { COMMANDS } from "../utils/constants";
export async function handleAnnouncements(incomingMessage: Message) {
  try {
    const isAllowed = await checkForAccessByRoles(incomingMessage.member, [
      "Moderator",
    ]);
    if (isAllowed) {
      const regex = new RegExp(
        `^${COMMANDS.prefix} ${COMMANDS.announce}( here | everyone | )<#.+> \{.*\} (.|\n)+$`,
        "g"
      );
      if (regex.test(incomingMessage.content)) {
        let channelId = incomingMessage.content.match(/<#.+?>/)![0];
        channelId = channelId.substring(2, channelId.length - 1);
        let title = incomingMessage.content.match(/\{.*?\}/)![0];
        title = title.substring(1, title.length - 1);
        const announcement = incomingMessage.content.substring(
          incomingMessage.content.indexOf("} ") + 2
        );
        const channel = incomingMessage.guild?.channels.cache.find(
          (ch) => ch.id == channelId
        );
        if (channel && (channel?.type === "text" || channel?.type === "news")) {
          const everyoneRegex = new RegExp(
            `^${COMMANDS.prefix} ${COMMANDS.announce} everyone`
          );
          const hereRegex = new RegExp(
            `^${COMMANDS.prefix} ${COMMANDS.announce} here`
          );
          if (everyoneRegex.test(incomingMessage.content)) {
            (channel as TextChannel | NewsChannel).send(
              "**📢 Announcement @everyone!**",
              {
                embed: announcementMessage(title, announcement),
              }
            );
          } else if (hereRegex.test(incomingMessage.content)) {
            (channel as TextChannel | NewsChannel).send(
              "**📢 Announcement @here!**",
              {
                embed: announcementMessage(title, announcement),
              }
            );
          } else {
            (channel as TextChannel | NewsChannel).send({
              embed: announcementMessage(title, announcement),
            });
          }
          incomingMessage.channel.send("Sent! :white_check_mark: ");
        } else {
          throw Error;
        }
      } else {
        serverLogger(
          "user-error",
          incomingMessage.content.split(" ").splice(0, 5),
          "Invalid command"
        );
        incomingMessage.channel.send(invalidCommand());
      }
    } else {
      serverLogger(
        "user-error",
        incomingMessage.content.split(" ").splice(0, 5),
        "Unauthorized User"
      );
      incomingMessage.channel.send(unauthorizedUser());
    }
  } catch (err) {
    incomingMessage.channel.send(invalidChannel());
    serverLogger(
      "user-error",
      incomingMessage.content.split(" ").splice(0, 5),
      "Announcement to invalid channel"
    );
  }
}
