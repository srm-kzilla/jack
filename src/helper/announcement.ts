import { Message, TextChannel } from "discord.js";
import { serverLogger } from "../utils/logger";
import {
  announcementMessage,
  invalidChannel,
  invalidCommand,
  unauthorizedUser,
} from "../utils/messages";
import { checkForAccessByRoles } from "../helper/roleAuth";
export async function handleAnnouncements(incomingMessage: Message) {
  try {
    const isAllowed = await checkForAccessByRoles(incomingMessage.member, [
      "Moderator",
    ]);
    if (isAllowed) {
      let channelId = incomingMessage.content.split(" ")[2];
      channelId = channelId.substring(2, channelId.length - 1);
      let title = incomingMessage.content.split("<")[2];
      title = title.substring(0, title.indexOf(">"));
      const tempString = incomingMessage.content.split(">")[2];
      const index = incomingMessage.content.indexOf(tempString);
      const announcement = incomingMessage.content.substring(index);
      if (!announcement) {
        serverLogger(
          "user-error",
          incomingMessage.content.split(" ").splice(0, 5),
          "Announcement text missing"
        );
        incomingMessage.channel.send(invalidCommand());
      } else {
        const channel = incomingMessage.guild?.channels.cache.find(
          (ch) => ch.id == channelId
        );
        if (channel && (channel?.type === "text" || channel?.type === "news")) {
          //@ts-ignore
          channel.send("@everyone", {
            embed: announcementMessage(title, announcement),
          });
          incomingMessage.channel.send("Sent! :white_check_mark: ");
        } else {
          throw Error;
        }
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
