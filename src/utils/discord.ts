import Discord from "discord.js";

let bot: any;

export async function getDiscordBot() {
  try {
    if (!bot) {
      await initDiscordBot();
    }
    return bot;
  } catch (err) {
    console.log("Error connecting to Bot", err);
  }
}

export async function initDiscordBot() {
  try {
    bot = new Discord.Client();
    bot.login(process.env.DISCORD_TOKEN || "");
    return bot;
  } catch (err) {
    console.log("Error connecting to Bot", err);
  }
}
