const {
  SlashCommandBuilder,
  TextChannel,
  EmbedBuilder,
} = require("discord.js");
const { default: DisTube } = require("distube");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pausa la cancion actual en la cola"),

  async execute(interaction, distube) {
    const voiceChannel = interaction.member.voice.channel;

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
      await distube.pause(voiceChannel);
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: `${interaction.user.tag}`,
              iconURL: `${interaction.user.avatarURL()}`,
            })
            .setDescription(
              `¡La canción ha sido pausada! ejecute el comando de **resume** para reanudar la canción.. **:pause_button:**`
            )
            .setColor("#f58ee4")
            .setTimestamp(),
        ],
      });
    } catch (error) {
      console.error(error);
      await interaction.followUp(
        "Hubo un error al intentar reproducir la cancion"
      );
    }
  },
};
