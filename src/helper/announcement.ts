import { Message, TextChannel, NewsChannel } from "discord.js";
import { serverLogger } from "../utils/logger";
import { announcementMessage, createBasicEmbed } from "../utils/messages";
import { COMMANDS, ERRORS } from "../utils/constants";
import { incomingMessageSchema } from "../models/incomingMessage";

/**
 * Handles all announcements
 *
 * @param {Message} incomingMessage
 * @param {incomingMessageSchema} messageType
 */

export async function handleAnnouncements(
  incomingMessage: Message,
  messageType: incomingMessageSchema
) {
  try {
    if (messageType.incomingUser.isMod) {
      const regex = new RegExp(
        `^${COMMANDS.prefix} ${COMMANDS.announce}( here | everyone | | <@&.+> )<#.+> \{.*\} (.|\n)+$`,
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
          const roleMentionRegex = new RegExp(
            `^${COMMANDS.prefix} ${COMMANDS.announce} <@&.+>`
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
          } else if (roleMentionRegex.test(incomingMessage.content)) {
            let roleId = incomingMessage.content.split(" ")[2];
            roleId = roleId.substring(3, roleId.length - 1);
            console.log(roleId);
            (channel as TextChannel | NewsChannel).send(
              `**📢 Announcement <@&${roleId}>!**`,
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
        incomingMessage.channel.send(
          `<@${messageType.incomingUser.id}>`,
          createBasicEmbed(ERRORS.INVALID_COMMAND, "ERROR")
        );
      }
    } else {
      serverLogger(
        "user-error",
        incomingMessage.content.split(" ").splice(0, 5),
        "Unauthorized User"
      );
      incomingMessage.channel.send(
        `<@${messageType.incomingUser.id}>`,
        createBasicEmbed(ERRORS.UNAUTHORIZED_USER, "ERROR")
      );
    }
  } catch (err) {
    incomingMessage.channel.send(
      `<@${messageType.incomingUser.id}>`,
      createBasicEmbed(ERRORS.INVALID_CHANNEL, "ERROR")
    );
    serverLogger(
      "user-error",
      incomingMessage.content.split(" ").splice(0, 5),
      "Announcement to invalid channel"
    );
  }
}
