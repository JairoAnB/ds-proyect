const {
  SlashCommandBuilder,
  TextChannel,
  EmbedBuilder,
} = require("discord.js");
const { default: DisTube } = require("distube");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Salta la cancion actual a la siguente. "),

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
      await distube.skip(voiceChannel);
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: `${interaction.user.tag}`,
              iconURL: `${interaction.user.avatarURL()}`,
            })
            .setDescription(
              `¡La canción ha sido Skipeada! por **${interaction.user.tag}** **:fast_forward:**. `
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
