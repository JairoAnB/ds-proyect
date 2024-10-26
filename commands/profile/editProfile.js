const { profile } = require("console");
const {
  SlashCommandBuilder,
  TextChannel,
  EmbedBuilder,
} = require("discord.js");
const fs = require("fs");
const path = "./user.json";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile-edit")
    .setDescription("Te permite poder editar tu perfil de usuario")
    .addStringOption((option) => {
      return option
        .setName("biografia")
        .setDescription("Ingresa tu nueva biografia para tu perfil")
        .setRequired(false);
    })
    .addStringOption((option) => {
      return option
        .setName("color")
        .setDescription("Ingresa el color para tu perfil en hexadecimal")
        .setRequired(false);
    })
    .addStringOption((option) => {
      return option
        .setName("pais")
        .setDescription("Ingresa el pais para tu perfil")
        .setRequired(false);
    })
    .addStringOption((option) => {
      return option
        .setName("pronombres")
        .setDescription("Ingresa tu pronombre para tu perfil")
        .setRequired(false);
    }),

  async execute(interaction) {
    try {
      const profiles = JSON.parse(fs.readFileSync(path, "utf8"));
      const biografia = interaction.options.getString("biografia");
      const color = interaction.options.getString("color");
      const userid = interaction.user.id;
      const pais = interaction.options.getString("pais");
      const pronombres = interaction.options.getString("pronombres");
      let update = false;

      if (biografia) {
        profiles[userid].description = biografia;
        update = true;
      }
      if (color) {
        profiles[userid].color = color;
        update = true;
      }

      if (pais) {
        profiles[userid].userCountry = pais;
        update = true;
      }

      if (pronombres) {
        profiles[userid].pronombres = pronombres;
        update = true;
      }

      if (update) {
        fs.writeFileSync(path, JSON.stringify(profiles, null, 2));

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: `${interaction.user.username}`,
                iconURL: `${interaction.user.avatarURL()}`,
              })
              .setDescription(
                `
                  ### ¡Se ha actualizado tu perfil correctamente! ` +
                  (biografia ? ` Se ha añadido una nueva *Biografía*, ` : "") +
                  (color ? `un nuevo *color*, ` : "") +
                  (pais ? `un nuevo *pais* ` : "") +
                  (pronombres ? `y un nuevo *pronombre*` : "") +
                  `
                 > ¡Escribe \`/profile\` para ver los cambios!`
              )
              .setThumbnail(interaction.user.avatarURL())
              .setColor("#f58ee4")
              .setFooter({
                text: `${interaction.guild.name}`,
                iconURL: interaction.guild.iconURL(),
              })
              .setTimestamp(),
          ],
        });
      } else {
        await interaction.reply("Error al actualizar el perfil.");
      }
    } catch (error) {
      console.error(error);
    }
  },
};
