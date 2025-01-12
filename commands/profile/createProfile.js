const fs = require("fs");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const path = "./user.json";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile-create")
    .setDescription("Crea el perfil de usuario."),

  async execute(interaction) {
    let profiles;

    try {
      profiles = JSON.parse(fs.readFileSync(path, "utf8"));
    } catch (error) {
      profiles = {};
    }

    try {
      if (!profiles[interaction.user.id]) {
        profiles[interaction.user.id] = {
          username: interaction.user.username,
          description: "No hay descripción",
          color: "#ff0000",
          nickname: interaction.member.nickname,
          pronombres: "No hay pronombres",
          joined: interaction.member.joinedAt.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          }),
          balance: 0,
          userCreated: interaction.user.createdAt.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          }),
          userCountry: "No asignado",
          banner: "https://cdn.discordapp.com/attachments/803069581001621548/1300003767726641202/Banner.png?ex=671f425b&is=671df0db&hm=81ee9faf4b7e74f0c9220a49de54465766845112865926a039643325e74e7a3d&",
          inventory:[]
        };

        fs.writeFileSync(path, JSON.stringify(profiles, null, 2), "utf8");

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: `Muhammed Yusuf`,
                iconURL: `${interaction.user.avatarURL()}`,
              })
              .setDescription(
                `Se ha creado correctamente el perfil de ${interaction.user.username}`
              )
              .setThumbnail(`${interaction.user.avatarURL()}`)
              .setColor("#ff0000")
              .setTimestamp(),
          ],
        });
      } else {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: `Muhammed Yusuf`,
                iconURL: `${interaction.user.avatarURL()}`,
              })
              .setDescription(
                `Error al crear el perfil de ${interaction.user.username}, ya existe un perfil creado.`
              )
              .setColor("#ff0000")
              .setTimestamp(),
          ],
        });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply(
        "Ha ocurrido un error al crear el perfil de usuario."
      );
    }
  },
};
