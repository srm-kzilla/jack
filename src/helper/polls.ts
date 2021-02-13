import { Message, MessageReaction, TextChannel, User } from "discord.js";
import { pollSchema } from "../models/poll";
import {
  createPollMessage,
  createPollResult,
  createBasicEmbed,
} from "../utils/messages";
import { getPoll, refreshKeys, setPoll } from "../utils/nodecache";
import { nanoid } from "nanoid";
import { checkForAccessByRoles } from "./roleAuth";
import { serverLogger } from "../utils/logger";
import { getDiscordBot } from "../utils/discord";
import { COMMANDS, CONSTANTS, ERRORS } from "../utils/constants";
import { getDbClient } from "../utils/database";
import { pollEmojiFilter } from "../utils/filters";
import { incomingMessageSchema } from "../models/incomingMessage";

/**
 *Handles create poll command
 * @param {Message} incomingMessage
 * @param {incomingMessageSchema} messageType
 */
export const createPoll = async (
  incomingMessage: Message,
  messageType: incomingMessageSchema
) => {
  const pollRegex = new RegExp(
    `^${COMMANDS.prefix} ${COMMANDS.createPoll} create (<#.+?>) ({.*?}) (\\[.*\\])$`
  );
  if (messageType.incomingUser.isMod) {
    try {
      if (pollRegex.test(incomingMessage.content)) {
        const tokens = incomingMessage.content.match(
          pollRegex
        ) as Array<string>;
        const channelID = tokens[1].substring(2, tokens[1].length - 1);
        const title = tokens[2].substring(1, tokens[2].length - 1);
        const optionsArray = tokens[3]
          .substring(2, tokens[3].length - 2)
          .split("],[");
        if (optionsArray.length > 9) {
          return incomingMessage.channel.send(
            createBasicEmbed(
              {
                title: "Invalid arguments!",
                message:
                  `
            Maximum number of options supported: **9**
            **Syntax for Poll Command:**\n
            ` +
                  "`" +
                  COMMANDS.prefix +
                  ` ${COMMANDS.createPoll} create <channel> {<Some Question>} [[<Option 1>],[<Option 2>],[<Option 3>],[<Option 4>]]` +
                  "`",
              },
              "ERROR"
            )
          );
        }
        const poll: pollSchema = {
          title: title.trim(),
          channelID: channelID,
          pollID: nanoid(8),
          options: optionsArray.map((option, index) => {
            return {
              emoji: CONSTANTS.pollReactions[index],
              value: option.trim(),
              reactions: [],
            };
          }),
          timestamp: new Date(),
        };
        await addPoll(incomingMessage, poll);
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
    } catch (err) {
      serverLogger("internal-error", "Internal Error", err);
      incomingMessage.channel.send(
        `<@${messageType.incomingUser.id}>`,
        createBasicEmbed(ERRORS.INTERNAL_ERROR(messageType.channelType), "ERROR")
      );
    }
  } else {
    serverLogger("user-error", incomingMessage.content, "Unauthorized User");
    incomingMessage.channel.send(
      `<@${messageType.incomingUser.id}>`,
      createBasicEmbed(ERRORS.UNAUTHORIZED_USER, "ERROR")
    );
  }
};

const addPoll = async (incomingMessage: Message, poll: pollSchema) => {
  const db = await (await getDbClient()).db().collection("polls");
  const { insertedCount } = await db.insertOne(poll);
  if (insertedCount <= 0) throw "MongoDB Poll Insert Error";
  const result = await setPoll(poll);
  if (!result) throw "NodeCache SET pollKey Error";
  const client = await getDiscordBot();
  const pollMessage = await (client!.channels.cache.get(
    poll.channelID
  ) as TextChannel).send(createPollMessage(poll));
  await Promise.all(
    poll.options.map(async (option) => {
      await pollMessage.react(option.emoji);
    })
  );
  const pollCollector = pollMessage.createReactionCollector(pollEmojiFilter);
  pollCollector.on("collect", async (reaction: MessageReaction, user: User) => {
    const { result } = await db.updateOne(
      { pollID: poll.pollID, "options.emoji": reaction.emoji.name },
      {
        $addToSet: {
          "options.$.reactions": `${user.username}#${user.discriminator}`,
        },
      }
    );
    if (!(result.ok == 1)) throw "MongoDB Query Error: Failed to Add Reaction";
  });
  incomingMessage.channel.send(
    createBasicEmbed(
      {
        title: "**New Poll Created! :white_check_mark:**",
        message:
          "**Poll ID:** `" +
          poll.pollID +
          "`\n**Time of Creation:** " +
          poll.timestamp,
      },
      "INFO"
    )
  );
};

/**
 * Handles poll result command
 * @param {Message} incomingMessage
 * @param {incomingMessageSchema} messageType
 */
export const getResult = async (
  incomingMessage: Message,
  messageType: incomingMessageSchema
) => {
  const isAllowed = await checkForAccessByRoles(incomingMessage.member, [
    `${process.env.OPERATOR_ROLE_ID}`,
  ]);
  const resultRegex = new RegExp(
    `^${COMMANDS.prefix} ${COMMANDS.createPoll} result (.+)$`
  );
  if (isAllowed) {
    try {
      if (resultRegex.test(incomingMessage.content)) {
        const tokens = incomingMessage.content.match(
          resultRegex
        ) as Array<string>;
        const pollID = tokens[1];
        await refreshKeys();
        const poll = await getPoll(pollID);
        if (!poll)
          return incomingMessage.channel.send(
            createBasicEmbed(ERRORS.INVALID_POLL, "ERROR")
          );
        incomingMessage.channel.send(createPollResult(poll));
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
    } catch (err) {
      serverLogger("internal-error", "Internal Error", err);
      incomingMessage.channel.send(
        `<@${messageType.incomingUser.id}>`,
        createBasicEmbed(ERRORS.INTERNAL_ERROR(messageType.channelType), "ERROR")
      );
    }
  } else {
    serverLogger("user-error", incomingMessage.content, "Unauthorized User");
    incomingMessage.channel.send(
      `<@${messageType.incomingUser.id}>`,
      createBasicEmbed(ERRORS.UNAUTHORIZED_USER, "ERROR")
    );
  }
};
