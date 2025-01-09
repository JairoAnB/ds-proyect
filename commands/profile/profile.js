const {
  SlashCommandBuilder,
  TextChannel,
  EmbedBuilder,
} = require("discord.js");
const fs = require("fs");
const path = "./user.json";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Muestra tu perfil de usuario"),

  async execute(interaction) {
    try {
      const profiles = JSON.parse(fs.readFileSync(path, "utf8"));
      const avatar = interaction.user.avatarURL();
      const username = interaction.user.username;
      const nickname = interaction.member.nickname;

      if (profiles[interaction.user.id]) {
        await await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: `📜 Perfil de ${interaction.user.username}`,
                iconURL: `${interaction.user.avatarURL()}`,
              })
              .setColor(profiles[interaction.user.id].color)
              .setThumbnail(avatar)
              .addFields(
                {
                  name: "👤 **Usuario**",
                  value: username || "No hay nombre de usuario",
                  inline: true,
                },
                {
                  name: "🏳️ **Pronombres**",
                  value:
                    profiles[interaction.user.id].pronombres ||
                    "No hay pronombres",
                  inline: true,
                },
                {
                  name: "🎨 **Color**",
                  value: profiles[interaction.user.id].color || "No hay color",
                  inline: true,
                },
                {
                  name: "💬 **Apodo**",
                  value: nickname || "No hay apodo",
                  inline: true,
                },
                {
                  name: "📅 **Cuenta creada**",
                  value: profiles[interaction.user.id].userCreated,
                  inline: true,
                },
                {
                  name: " 🌍**País**",
                  value: profiles[interaction.user.id].userCountry,
                  inline: true,
                },
                {
                  name: "📜 ═══════════ **Sobre mí** ═══════════",
                  value:
                    profiles[interaction.user.id].description ||
                    "No hay descripción",
                  inline: false,
                }
              )
              .setDescription(
                `-# **Se unió al servidor el:** ${
                  profiles[interaction.user.id].joined
                }`
              ).setImage(profiles[interaction.user.id].banner)
              .setTimestamp(),
          ],
        });
      } else {
        await interaction.reply("No tienes un perfil creado.");
      }
    } catch (error) {
      console.error(error);
    }
  },
};
