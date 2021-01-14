import { Message, MessageReaction, User } from "discord.js";
import { sendDirectMessageToUser } from "../controllers/inputHandler";
import { emailSchema } from "../models/email";
import {
  certificateEmoji,
  getYourCertificateChannelMessage,
  certificateUserDirectMessage,
} from "../utils/constants";
import { ERRORS } from "../utils/errors";
import { certificateEmojifilter } from "../utils/filters";
import { getUserCertificate } from "../service/certificate-service";
// Reaction handler
export function certificateHandler(incomingMessage: Message) {
  try {
    incomingMessage.channel
      .send(getYourCertificateChannelMessage("Tech-Troduction"))
      .then(async function (message: any) {
        await message.react(certificateEmoji[0]);
        // create a reaction collector on the specific message
        const collector = message.createReactionCollector(
          certificateEmojifilter
        );

        collector.on("collect", (reaction: MessageReaction, user: User) => {
          async function collect() {
            if (!user.bot) {
              if (reaction.emoji.name === certificateEmoji[0]) {
                // add check for database
                message.channel.send(
                  `${
                    message.guild?.member(user.id)?.displayName || user.username
                  } just collected their certificate!`
                );

                // message.channel.send(certificateUserDirectMessage);
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
  } catch (err) {
    console.log("Oops! Some unknown error,", err);
  }
}
export async function certificateDMHandler(incomingMessage: Message) {
  const email = incomingMessage.content.split(" ")[2];
  try {
    if (!email) {
      incomingMessage.channel.send(ERRORS.EMAIL_MISSING);
    }
    await emailSchema.validate(email);
    // Send Certificate Here
    getUserCertificate(incomingMessage, email);
  } catch (err) {
    incomingMessage.channel.send(ERRORS.INVALID_EMAIL);
  }
}
