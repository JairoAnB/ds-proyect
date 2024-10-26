const { EmbedBuilder } = require("discord.js");

const musicEmbedAddSong = (song) => {
  return new EmbedBuilder()
    .setAuthor({
      name: `${song.user.tag}`,
      iconURL: `${song.user.avatarURL()}`,
    })
    .setDescription(`¡Canción [${song.name}](${song.url}) Añadida a la cola!`)
    .setThumbnail(song.thumbnail)
    .setColor("#f58ee4")
    .setTimestamp();
};

module.exports = musicEmbedAddSong;
