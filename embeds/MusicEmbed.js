const { EmbedBuilder } = require("discord.js");

const crearMusicEmbed = (song) => {
  return new EmbedBuilder()
    .setTitle(`🎶 Reproduciendo ahora mismo ${song.name} 🎶`)
    .setAuthor({
      name: `${song.user.tag}`,
      iconURL: `${song.user.avatarURL()}`,
    })
    .setURL(song.url)
    .setImage(song.thumbnail)
    .setColor("#f58ee4")
    .addFields(
      {
        name: "**Duración**",
        value: `${song.formattedDuration} ⏳`,
        inline: true,
      },
      {
        name: "**Vistas**",
        value: `${song.views} 🎥`,
        inline: true,
      },
      {
        name: "**Me gusta**",
        value: `${song.likes} ❤️`,
        inline: true,
      }
    )
    .setTimestamp()
};

module.exports = crearMusicEmbed;
