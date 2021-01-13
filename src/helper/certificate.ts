import { Message, MessageReaction, User } from "discord.js";
import { sendDirectMessageToUser } from "../controllers/inputHandler";
import {
  certificateMessage,
  certificateUserDirectMessage,
} from "../utils/constants";
import { certificateEmojifilter } from "../utils/filters";

export function certificateHandler(incomingMessage: Message) {
  incomingMessage.channel
    .send(certificateMessage)
    .then(async function (message: any) {
      await message.react("👍");
      // create a reaction collector on the specific message
      const collector = message.createReactionCollector(certificateEmojifilter);

      collector.on("collect", (reaction: MessageReaction, user: User) => {
        async function collect() {
          if (!user.bot) {
            if (reaction.emoji.name === "👍") {
              console.log(user);
              let nickname = message.guild?.member(user.id)?.displayName || "";
              message.channel.send(
                `${nickname} reacted with ${reaction.emoji.name}`
              );
              sendDirectMessageToUser(
                user,
                message,
                certificateUserDirectMessage
              );
            }
          }
        }
        collect();
      });
    })
    .catch((err) => {
      console.log("Oops! Some unknown error,", err);
    });
}
