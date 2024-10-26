const { joinVoiceChannel } = require("@discordjs/voice");
const { Distube, Queue } = require("distube");

module.exports = (client) => {
  const distube = new Distube(client, {
    searchSongs: true,
    emitNewSongOnly: true,
    leaveOnempty: false,
    nsfw: true,
    savePreviousSongs: true,
    maxSongs: 10,
    emitAddSongWhenCreatingQueue: true,
  });

  distube.on("playSong", (queue, song) => {
    queue.textChannel.send(
      `Reproduciendo **${song.name}** - **${song.formattedDuration}**`
    );
  });
  distube.on("finishQueue", (queue) => {
    queue.textChannel.send(
      "La cola ha finalizado, gracias por utilizar el bot"
    );
  });
  
  distube.on("disconnect", (queue) => {
    queue.textChannel.send("Saliendo del canal de voz...");
  });
  distube.on("error", (queue, error) => {
    console.error(error);
    queue.textChannel.send(
      "Hubo un error al intentar reproducir la cancion: " + error
    );
  });
  distube.on("finishSong", (queue, song) => {
    queue.textChannel.send(`La cancion **${song.name}** a terminado.`);
  });
};
