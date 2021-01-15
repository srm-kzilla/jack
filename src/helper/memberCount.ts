import { Message } from "discord.js";
import { internalError } from "../utils/messages";
import { membersCountMessage } from "../utils/messages";
export async function handleGetMemberCount(incomingMessage: Message) {
  try {
    const memberCount = incomingMessage.guild?.memberCount;
    const bots = incomingMessage.guild?.members.cache.filter(
      (member) => !member.user.bot
    ).size;
    incomingMessage.channel.send(
      await membersCountMessage(memberCount || 0, bots || 0)
    );
  } catch (err) {
    console.log(err);
    incomingMessage.channel.send(internalError());
  }
}
// var memberCount = guild.members.filter(member => !member.user.bot).size;
