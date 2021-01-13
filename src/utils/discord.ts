import Discord from "discord.js";

let bot: any;

export async function getDiscordBot() {
  if (!bot) {
    await initDiscordBot();
  }
  return bot;
}

export async function initDiscordBot() {
  bot = new Discord.Client();
  bot.login(process.env.DISCORD_TOKEN);
  return bot;
}
