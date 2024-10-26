const {
  SlashCommandBuilder,
  TextChannel,
  EmbedBuilder,
} = require("discord.js");
const { default: DisTube } = require("distube");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("current")
    .setDescription("Muestra la cancion o video reproduciendo actualmente"),

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
      const queue = distube.getQueue(voiceChannel);
      if (!queue || !queue.songs.length) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`Canciones en cola...`)
              .setAuthor({
                name: `${interaction.user.tag}`,
                iconURL: `${interaction.user.avatarURL()}`,
              })
              .setDescription(`No hay canciones actualmente en la cola. `)
              .setColor("#ff0000")
              .setTimestamp(),
          ],
        });
      }
      const currentSong = queue.songs[0];
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Cancion Reproduciendo ahora mismo`)
            .setAuthor({
              name: `${interaction.user.tag}`,
              iconURL: `${interaction.user.avatarURL()}`,
            })
            .setDescription(
              `**${currentSong.name}** - **${currentSong.formattedDuration}**`
            )
            .setColor("#f58ee4")
            .setTimestamp(),
        ],
      });
    } catch (error) {
      console.error(error);
    }
  },
};
