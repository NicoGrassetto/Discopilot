const { SlashCommandBuilder } = require("discord.js");

// We create a voting pool to be filled with the members in the voice channel at the time of the command
const pool = new Map();
// THE VOTING POOL HAS THE FOLLOWING STRUCTURE:
// KEY: voice channel ID
// VALUE: Set of user IDs of members in that voice channel at the time of the command
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const row = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId("yes")
    .setLabel("✅ Yes")
    .setStyle(ButtonStyle.Success),
  new ButtonBuilder()
    .setCustomId("no")
    .setLabel("❌ No")
    .setStyle(ButtonStyle.Danger),
);

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
    const voiceChannel = interaction.member.voice.channel;
    const recordingName = interaction.options.getString("name") || "Untitled";

    if (!voiceChannel || voiceChannel.id !== interaction.channelId) {
      return interaction.reply({
        content:
          "You must use this command from within the voice channel you're in!",
        ephemeral: true,
      });
    }

    // We first check if there's no ongoing recording session for this channel
    if (pool.has(interaction.channelId)) {
      return interaction.reply({
        content:
          "There is already an active recording ongoing for this channel!",
        ephemeral: true,
      });
    }

    // From now on all clear!
    const members = voiceChannel.members;
    pool.set(interaction.channelId, new Set([...members.keys()]));

    // We start the timer (60 seconds)
    // 1. Send a message with buttons
    const message = await interaction.reply({
      content: `Vote to start recording "${recordingName}"!`,
      components: [row], // row contains your buttons
      fetchReply: true, // important: returns the message object
    });

    // 2. Create a collector on that message
    const collector = message.createMessageComponentCollector({
      time: 60000, // stops after 60 seconds
    });

    // =========WE COLLECT VOTES=========
    collector.on("collect", async (buttonInteraction) => {
      const votersSet = pool.get(interaction.channelId);

      // Validate that the voter is in the voting pool
      if (!votersSet || !votersSet.has(buttonInteraction.user.id)) {
        return buttonInteraction.reply({
          content: "You're not in the voting pool for this recording!",
          ephemeral: true,
        });
      }

      if (buttonInteraction.customId === "yes") {
        // Whenever someone clicks yes we remove the person from the pool.
        votersSet.delete(buttonInteraction.user.id);
        await buttonInteraction.reply({
          content: "Thanks for voting yes!",
          ephemeral: true,
        });

        // Check if everyone has voted yes
        if (votersSet.size === 0) {
          collector.stop("all_yes");
        }
      } else {
        // it's a no so early termination
        await buttonInteraction.reply({
          content: "You voted no. Recording will be cancelled.",
          ephemeral: true,
        });
        collector.stop("no_vote");
      }
    });

    collector.on("end", async (collected, reason) => {
      // Disable the buttons
      const disabledRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("yes")
          .setLabel("✅ Yes")
          .setStyle(ButtonStyle.Success)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("no")
          .setLabel("❌ No")
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true),
      );

      await message.edit({ components: [disabledRow] });

      // Clean up the pool entry
      pool.delete(interaction.channelId);

      if (reason === "all_yes") {
        // Everyone voted yes - start recording
        await interaction.followUp(`🔴 Recording "${recordingName}" started!`);
        // TODO: Add actual recording logic here
      } else if (reason === "no_vote") {
        // Someone voted no
        await interaction.followUp(
          "Recording cancelled because someone voted no.",
        );
      } else {
        // Timeout or other reason
        await interaction.followUp(
          "Recording cancelled due to insufficient votes (timeout).",
        );
      }
    });
  },
};
