import { Message, MessageReaction, User } from "discord.js";
import { sendDirectMessageToUser } from "../controllers/inputHandler";
import { emailSchema } from "../models/email";
import {
  certificateEmoji,
  getYourCertificateChannelMessage,
  certificateUserDirectMessage,
  internalError,
} from "../utils/constants";
import { ERRORS } from "../utils/errors";
import { certificateEmojifilter } from "../utils/filters";
import { getUserCertificate } from "../service/certificate-service";

async function collectReactions(user: any, reaction: any, message: any) {
  if (!user.bot) {
    if (reaction.emoji.name === certificateEmoji[0]) {
      //TODO transfer the log to another channel
      message.channel.send(
        `${
          message.guild?.member(user.id)?.displayName || user.username
        } just collected their certificate!`
      );
      sendDirectMessageToUser(user, message, certificateUserDirectMessage);
    }
  }
}

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
          collectReactions(user, reaction, message);
        });
      });
  } catch (err) {
    incomingMessage.channel.send(internalError);
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
    console.log(err);
    if (err.name == "ValidationError")
      incomingMessage.channel.send(ERRORS.INVALID_EMAIL);
    else incomingMessage.channel.send(internalError);
  }
}
