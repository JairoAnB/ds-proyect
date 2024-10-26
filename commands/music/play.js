const {
  SlashCommandBuilder,
  TextChannel,
  EmbedBuilder,
} = require("discord.js");
const { default: DisTube } = require("distube");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Reproduce una cancion por el buscador de youtube")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("Ingresa el nombre de la cancion")
        .setRequired(true)
    ),

  async execute(interaction, distube) {
    const song = interaction.options.getString("song");
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

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: `${interaction.user.avatarURL()}`,
          })
          .setDescription(
            `Buscando en Youtube los resultados para **${song}**... 🔎 `
          )
          .setColor("#f58ee4")
          .setTimestamp(),
      ],
    });
    try {
      await distube.play(voiceChannel, song, {
        textChannel: interaction.channel,
        member: interaction.member,
      });
    } catch (error) {
      console.error(error);
      await interaction.followUp(
        "Hubo un error al intentar reproducir la cancion"
      );
    }
  },
};
