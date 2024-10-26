const { SlashCommandBuilder, TextChannel, EmbedBuilder } = require("discord.js");
const { default: DisTube } = require("distube");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Muestra la lista actual de reproduccion de la cola"),

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

    const queue = distube.getQueue(voiceChannel);

    if (!queue) {
      return interaction.reply("No hay canciones en la cola");
    }

    const queueList = queue.songs
      .map((song, index) => {
        return `${index + 1}. ${song.name} - \`${song.formattedDuration}\``;
      })
      .join("\n");

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Lista de Reproducion Actual :twisted_rightwards_arrows:`)
          .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: `${interaction.user.avatarURL()}`,
          })
          .setDescription(
            `${queueList}`
          )
          .setColor("#f58ee4")
          .setTimestamp(),
      ]
    })
  },
};
