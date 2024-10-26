const {
  SlashCommandBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

const row = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId(`comandos`)
    .setLabel(`Ver comandos`)
    .setStyle(ButtonStyle.Primary)
);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Ocupa este comando si buscas ayuda con alguna funcion."),

  async execute(interaction) {
    const embedAyuda = new EmbedBuilder()
      .setAuthor({
        name: `Muhammed Yusuf`,
        iconURL: `${interaction.user.avatarURL()}`,
      })
      .setDescription(
        ` > **Recuerda darle los permisos necesarios al bot para su correcto funcionamiento.**
          ### ¿Cómo utilizo la función de música?
          > Para utilizar la función de música, primero necesitas entrar a un canal de voz. Después de eso, ocupando el comando \`/play\`, te pedirá la canción o video a buscar (*El bot ocupa YouTube como motor de búsqueda, así que como recomendación, si intentas buscar canciones ocupando _audio_ para limitar las búsquedas a no videos oficiales.*)
          > Después de buscar la canción o video deseada, el bot automáticamente entrará al canal de voz donde estés y reproducirá la canción o video solicitado. _(Puedes ocupar el comando de \`/current\` para ver la canción o video sonando en ese momento)_
          ### ¿Cómo detengo la reproducción del bot o salto una canción?
          > Para detener la reproducción del bot y desconectarlo, es tan fácil como escribir \`/stop\`, el bot automáticamente detendrá la reproducción de **todas** las canciones actuales y se saldrá del canal de donde estuvo principalmente. _Recomendado al terminar una sesión_. Por otra parte, para saltar canciones del bot, ocupas el comando \`/skip\` que en este caso, saltará la canción sonando actualmente, a otra que esté en la lista. *(si no hay canción en cola, te saldrá un mensaje de error denegando la acción.)*
          ### ¿Cómo veo la lista de reproducción actual del bot?
          > Para ver la lista de reproducción actual, solo necesitas escribir \`/queue\`, lo que te generará la lista de canciones en cola. Desde la primera hasta la última, siempre en orden en el que fueron agregadas. 
          ### ¿Cómo ocupo la función de consulta de clima?
          > Para ocupar la opción de consulta del clima, solo necesitas escribir \`/clima\` para desplegar el menú donde te pedirá obligatoriamente una ciudad a consultar. Cuando ingreses la ciudad, el bot te responderá con los siguientes datos; *Temperatura mínima, temperatura máxima y sensación actual del clima.*
          ### ¿Cómo ocupo la función de perfil de usuario?
          > Para poder ocupar correctamente la funcion de perfil, es necesario primero crearlo, para poder hacerlo ocupa el comando \`/profile-create\`, esto te habilitara el comando de \`/profile\` en el que podras revisar datos que pueden ser de importancia para ti. Hay campos en los cuales puedes editar, para ello haz uso del comando \`/profile-edit\` para entrar en el modo edicion tu perfil, dentro de ahi podras editar los campos que desees y esten disponibles. 

          > _**Recuerda que para poder cambiar el color de perfil, debes ingresar un codigo hexadecimal**_ (#ff0000)
          
          ### Si deseas ver todos los comandos disponibles de música, aprieta el botón de abajo que dice **Ver comandos**.
          `
      )
      .setColor("#2bff00")
      .setFooter({
        text: `${interaction.guild.name}`,
        iconURL: interaction.guild.iconURL(),
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embedAyuda],
      components: [row],
    });
  },
};
