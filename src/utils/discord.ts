import Discord, { Intents, Client } from "discord.js";

let bot: Client;

export async function getDiscordBot() {
  try {
    if (!bot) {
      await initDiscordBot();
    }
    return bot;
  } catch (err) {
    console.log("❌   Error connecting to Bot", err);
  }
}

export async function initDiscordBot() {
  try {
    let intents = new Intents(Intents.NON_PRIVILEGED);
    intents.add("GUILD_MEMBERS");
    bot = new Discord.Client({ ws: { intents: intents } });
    await bot.login(process.env.DISCORD_TOKEN || "");
    console.log("✔️   Discord Bot Login");
    bot.user!.setActivity("#kzjack help", {
      name: "#kzjack help",
      type: "LISTENING",
      url: "https://jack.srmkzilla.net",
    });
    return bot;
  } catch (err) {
    console.log("❌ Error connecting to Bot", err);
  }
}
