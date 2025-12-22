require("dotenv").config();
const fs = require("fs");
const path = require("path");
const {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});

// Collection to store commands
client.commands = new Collection();

// Load commands
const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
    console.log(`Loaded command: ${command.data.name}`);
  } else {
    console.warn(
      `[WARNING] Command at ${filePath} missing "data" or "execute"`,
    );
  }
}

// Register slash commands with Discord
async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log(`Refreshing ${commands.length} slash commands...`);

    // Use guild commands for faster updates during development
    if (process.env.GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(
          process.env.DISCORD_CLIENT_ID,
          process.env.GUILD_ID,
        ),
        { body: commands },
      );
      console.log("Successfully registered guild commands!");
    } else {
      // Use global commands for production
      await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
        { body: commands },
      );
      console.log("Successfully registered global commands!");
    }
  } catch (error) {
    console.error("Error registering commands:", error);
  }
}

// Handle interactions (slash commands)
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`Command ${interaction.commandName} not found`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}:`, error);
    const reply = {
      content: "❌ There was an error executing this command!",
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});

// When the bot is ready
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Start the bot
registerCommands();
client.login(process.env.DISCORD_TOKEN);
