const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = "./user.json";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("currency")
    .setDescription("Puedes tu dinero actual en el bot"),

  async execute(interaction) {
    let profiles;

    try {
      profiles = JSON.parse(fs.readFileSync(path, "utf8"));
    } catch (error) {
      console.error(error);
    }

    const color = profiles[interaction.user.id].color;
    try {
      if (!profiles[interaction.user.id]) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: `Muhammed Yusuf`,
                iconURL: `${interaction.user.avatarURL()}`,
              })
              .setDescription(
                `Error :x: La peticion no ha podido procesarse, Necesitas crearte un perfil antes de ocupar esta funcion.
                    \`/create-profile\` para continuar.`
              )
              .setColor("#ff0000")
              .setTimestamp(),
          ],
        });
        return;
      }
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: `Muhammed Yusuf`,
              iconURL: `${interaction.user.avatarURL()}`,
            })
            .setDescription(
              `Tu dinero actual es de $**${
                profiles[interaction.user.id].balance
              }** pesos chilenos.
                > ¡Sigue trabajando duro y honradamente para conseguir mas dinero!`
            )
            .setColor(color)
            .setThumbnail(
              "https://cdn.discordapp.com/attachments/803069581001621548/1299567796409208954/reshot-icon-money-and-card-SR3FGHLMWA.png?ex=671dac53&is=671c5ad3&hm=1179cd2687afdd81bc72c8ba45d16c14536d06e6712db5536136f80db89cc843&"
            )
            .setTimestamp(),
        ],
      });
    } catch (error) {
      console.error(error);
    }
  },
};
