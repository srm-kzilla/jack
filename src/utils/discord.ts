import Discord from "discord.js";

let bot: Discord.Client;

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
    await bot.login(process.env.DISCORD_TOKEN || "");
    bot.user!.setActivity("#kzjack help", {
      name: "#kzjack help",
      type: "LISTENING",
      url: "https://srmkzilla.net",
    });
    return bot;
  } catch (err) {
    console.log("Error connecting to Bot", err);
  }
}
