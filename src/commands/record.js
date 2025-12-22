const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("record")
    .setDescription("Start a recording session in the voice channel")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Name for this recording session")
        .setRequired(false),
    ),

  async execute(interaction) {
    const recordingName = interaction.options.getString("name") || "Untitled";

    await interaction.reply(`🔴 Recording "${recordingName}" started!`);
    // TODO: Add actual recording logic here
  },
};
