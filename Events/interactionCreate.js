const { Events } = require("discord.js");
const { distube } = require("../index");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) {
        console.error(
          `El comando no existe o no fue encontrado: ${interaction.commandName}`
        );
        return;
      }

      try {
        await command.execute(interaction, distube);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "Hubo un error al ejecutar el comando.",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "Hubo un error al ejecutar el comando.",
            ephemeral: true,
          });
        }
      }
    } else if (interaction.isButton()) {
      if (interaction.customId === "comandos") {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: `Muhammed Yusuf`,
                iconURL: `${interaction.user.avatarURL()}`,
              })
              .setDescription(
                `\`Comandos disponibles: 
                /play,/skip,/stop,/queue,/resume,/current,/pong,/help,/clima,/profile-create,/profile-edit,\``
              )
              .setTimestamp()
              .setColor("#ffffff"),
          ],
          ephemeral: true,
        });
      }
    }
  },
};
