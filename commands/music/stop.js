const {
  SlashCommandBuilder,
  TextChannel,
  EmbedBuilder,
} = require("discord.js");
const { default: DisTube } = require("distube");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Detiene la cancion de la cola actual."),

  async execute(interaction, distube) {
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Error :x:`)
            .setAuthor({
              name: `${interaction.user.tag}`,
              iconURL: `${interaction.user.avatarURL()}`,
            })
            .setDescription(
              `La peticion no ha podido procesarse, asegurate de estar dentro de un canal 
              para utilizar esta funcion.`
            )
            .setColor("#ff0000")
            .setTimestamp(),
        ],
      });
    }

    if (!voiceChannel) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: `${interaction.user.tag}`,
              iconURL: `${interaction.user.avatarURL()}`,
            })
            .setDescription(
              `Error :x: La peticion no ha podido procesarse, asegurate de estar dentro de un canal 
              para utilizar esta funcion.`
            )
            .setColor("#ff0000")
            .setTimestamp(),
        ],
      });
    }

    try {
      await distube.stop(interaction.guild);
      await distube.voices.leave(interaction.guild);

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: `${interaction.user.tag}`,
              iconURL: `${interaction.user.avatarURL()}`,
            })
            .setDescription(
              `Deteniendo la cancion actual y saliendo del canal de voz... ⏹️`
            )
            .setColor("#f58ee4")
            .setTimestamp(),
        ],
      });
    } catch (error) {
      console.error(error);
      await interaction.followUp(
        "Hubo un error al intentar Detener la cancion"
      );
    }
  },
};
