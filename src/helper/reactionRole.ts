import {
  Message,
  TextChannel,
  PartialUser,
  MessageReaction,
  User,
} from "discord.js";
import { serverLogger } from "../utils/logger";
import { createBasicEmbed } from "../utils/messages";
import { COMMANDS, ERRORS, INFO } from "../utils/constants";
import { incomingMessageSchema } from "../models/incomingMessage";
import { roleSchema } from "../models/reactionRole";
import { getDbClient } from "../utils/database";
import { getRole, setRole } from "../utils/nodecache";

/**
 * Handles role assignment
 *
 * @param {Message} incomingMessage
 * @param {incomingMessageSchema} messageType
 */

export async function handleReactionRoles(
  incomingMessage: Message,
  messageType: incomingMessageSchema
) {
  const reactionRoleRegex = new RegExp(
    `^${COMMANDS.prefix} ${COMMANDS.reactionRole} (<#.+?>) (\{(?:.|\n)*\}) (\\[.*\\])$`
  );
  if (messageType.incomingUser.isMod) {
    try {
      if (reactionRoleRegex.test(incomingMessage.content.trim())) {
        const tokens = incomingMessage.content.match(
          reactionRoleRegex
        ) as Array<string>;
        const channelID = tokens[1].substring(2, tokens[1].length - 1);
        const description = tokens[2].substring(1, tokens[2].length - 1);
        let rolesArray = tokens[3]
          .substring(2, tokens[3].length - 2)
          .split("],[")
          .map((str) => str.trim());
        if (rolesArray.length < 2)
          return incomingMessage.channel.send(
            createBasicEmbed(ERRORS.ROLE_MISSING, "ERROR")
          );
        const roleRegex = new RegExp(`<@&.+>`);
        for (let i = 0; i < rolesArray.length; i += 2) {
          if (!roleRegex.test(rolesArray[i]))
            return incomingMessage.channel.send(
              createBasicEmbed(ERRORS.INVALID_ROLE, "ERROR")
            );
        }
        let optionsArray: Array<{
          roleID: string;
          emoji: string;
        }> = [];
        for (let i = 0; i < rolesArray.length; i += 2) {
          optionsArray.push({
            roleID: rolesArray[i].substring(3, rolesArray[i].length - 1),
            emoji: rolesArray[i + 1],
          });
        }
        createReactionRoleMessage(
          {
            description: description.trim(),
            guildName: incomingMessage.guild?.name!,
            channelID: channelID,
            messageID: "",
            options: optionsArray,
            reactions: [],
            guildID: incomingMessage.guild?.id!,
            timestamp: "",
          },
          incomingMessage,
          messageType
        );
      } else {
        serverLogger(
          "user-error",
          incomingMessage.content.trim(),
          "Syntax error"
        );
        incomingMessage.channel.send(
          `<@${messageType.incomingUser.id}>`,
          createBasicEmbed(ERRORS.ROLE_SYNTAX_ERROR, "ERROR")
        );
      }
    } catch (err) {
      incomingMessage.channel.send(
        `<@${messageType.incomingUser.id}>`,
        createBasicEmbed(ERRORS.ROLE_ERROR, "ERROR")
      );
      serverLogger(
        "user-error",
        err.message,
        "Announcement to invalid channel"
      );
    }
  } else {
    serverLogger("user-error", incomingMessage.content, "Unauthorized User");
    incomingMessage.channel.send(
      `<@${messageType.incomingUser.id}>`,
      createBasicEmbed(ERRORS.UNAUTHORIZED_USER, "ERROR")
    );
  }
}

const createReactionRoleMessage = async (
  roleData: roleSchema,
  incomingMessage: Message,
  messageType: incomingMessageSchema
) => {
  try {
    const channel = incomingMessage.guild?.channels.cache.find(
      (ch: any) => ch.id === roleData.channelID
    ) as TextChannel;
    if (!channel)
      return incomingMessage.channel.send("The channel does not exist");
    let message = await channel.send(
      createBasicEmbed(
        { title: "React to get your Roles!🎉", message: roleData.description },
        "REACTION_ROLE"
      )
    );
    roleData.messageID = message.id;
    roleData.timestamp = new Date();
    await addRoleData(roleData);
    for (let i = 0; i < roleData.options.length; i++) {
      await message.react(roleData.options[i].emoji);
    }
    incomingMessage.channel.send("Reaction role message Sent ✅");
  } catch (error) {
    serverLogger(
      "internal-error",
      "reaction role message error",
      error.message
    );
    incomingMessage.channel.send(
      `<@${messageType.incomingUser.id}>`,
      createBasicEmbed(ERRORS.ROLE_ERROR, "ERROR")
    );
  }
};

const addRoleData = async (roleData: roleSchema) => {
  try {
    const db = await (await getDbClient()).db().collection("reaction-roles");
    const { insertedCount } = await db.insertOne(roleData);
    if (insertedCount <= 0) throw { message: "MongoDB Poll Insert Error" };
    const result = await setRole(roleData);
    if (!result) throw { message: "nodecache error" };
  } catch (error) {
    serverLogger(
      "internal-error",
      "Unable to add Data to database and/or cache",
      error.message
    );
  }
};

const refreshRoleData = async (roleData: roleSchema) => {
  try {
    const db = await (await getDbClient()).db().collection("reaction-roles");
    await db.updateOne(
      { messageID: roleData.messageID },
      { $set: { reactions: roleData.reactions } }
    );
    const resultNodeCache = await setRole(roleData);
    if (!resultNodeCache) throw { message: "nodecache error" };
  } catch (error) {
    serverLogger(
      "internal-error",
      "Unable to update data on database and/or cache",
      error.message
    );
  }
};

export const addReaction = async (
  reaction: MessageReaction,
  user: User | PartialUser
) => {
  try {
    if (!user.bot) {
      const roleData = await getRole(reaction.message.id);
      if (roleData) {
        let userTag = roleData.reactions.find(
          (userData) => userData.id === user.id
        );
        if (userTag) {
          return reaction.users.remove(user.id);
        }
        let roles = roleData.options;
        roles.forEach(async (data) => {
          let emoji;
          const emojiRegex = new RegExp(`(\:.*\:)`);
          if (emojiRegex.test(data.emoji)) {
            emoji = (data.emoji.match(emojiRegex) as Array<string>)[0];
            emoji = emoji?.substring(1, emoji.length - 1);
          } else emoji = data.emoji;
          if (emoji === reaction.emoji.name) {
            let role = reaction.message.guild?.roles.cache.find(
              (role) => role.id === data.roleID
            );
            let userAdd = reaction.message.guild?.members.cache.get(user.id);
            if (role && userAdd) {
              if (userAdd.roles.cache.find((r) => r === role)) return;
              await userAdd.roles.add(role);
              roleData.reactions.push({
                id: user.id,
                tag: user.tag!,
                roleID: data.roleID,
              });
              await refreshRoleData(roleData);
              serverLogger("success", "role added", ``);
              const channel = reaction.message.guild?.channels.cache.find(
                (ch: any) => ch.id === process.env.LOGGER_CHANNEL_ID
              ) as TextChannel;
              if (channel)
                channel.send(
                  createBasicEmbed(
                    INFO.REACTION_ROLE_ADD(role, userAdd),
                    "LOG_2"
                  )
                );
            }
          }
        });
      }
    }
  } catch (error) {
    serverLogger("internal-error", "unable to assign roles", error.message);
  }
};

export const removeReaction = async (
  reaction: MessageReaction,
  user: User | PartialUser
) => {
  try {
    if (!user.bot) {
      const roleData = await getRole(reaction.message.id);
      if (!roleData) return;
      if (roleData) {
        let roles = roleData.options;
        roles.forEach(async (data) => {
          let emoji: string;
          const emojiRegex = new RegExp(`(\:.*\:)`);
          if (emojiRegex.test(data.emoji)) {
            emoji = (data.emoji.match(emojiRegex) as Array<string>)[0];
            emoji = emoji?.substring(1, emoji.length - 1);
          } else emoji = data.emoji;
          if (emoji === reaction.emoji.name) {
            let role = reaction.message.guild?.roles.cache.find(
              (role) => role.id === data.roleID
            );
            let userAdd = reaction.message.guild?.members.cache.get(user.id);
            if (role && userAdd) {
              if (userAdd.roles.cache.find((r) => r === role)) {
                await userAdd.roles.remove(role);
                serverLogger("success", "role removed", ``);
                roleData!.reactions = roleData!.reactions
                  .slice(
                    0,
                    roleData!.reactions.findIndex((i) => i.id === user.id)
                  )
                  .concat(
                    roleData!.reactions.slice(
                      roleData!.reactions.findIndex((i) => i.id === user.id) + 1
                    )
                  );
                await refreshRoleData(roleData);
                const channel = reaction.message.guild?.channels.cache.find(
                  (ch: any) => ch.id === process.env.LOGGER_CHANNEL_ID
                ) as TextChannel;
                if (channel)
                  channel.send(
                    createBasicEmbed(
                      INFO.REACTION_ROLE_REMOVE(role, userAdd),
                      "LOG_1"
                    )
                  );
              }
            }
          }
        });
      }
    }
  } catch (error) {
    serverLogger("internal-error", "unable to remove role", error.message);
  }
};
