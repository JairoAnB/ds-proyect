const fs = require("fs");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const path = "./user.json";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inventario")
    .setDescription("Muestra el inventario del usuario"),

  async execute(interaction) {
    let profiles;
    profiles = JSON.parse(fs.readFileSync(path, "utf8"));

    const inventory = profiles[interaction.user.id].inventory;

    try {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `Inventario de ${interaction.user.username}`,
          iconURL: interaction.user.avatarURL(),
        })
        .setColor("#ff0000")
        .setThumbnail(
          "https://cdn.discordapp.com/attachments/803069581001621548/1299747625410498654/reshot-icon-backpack-UYQGM37N2B.png?ex=671e53ce&is=671d024e&hm=50caf915de8f5c0de62e5b180fb809a3741efdebe71458b0a9c72e455f746b29&"
        ).setFooter({
          text: `${interaction.guild.name}`,
          iconURL: interaction.guild.iconURL(),
        })
        .setTimestamp();

      if (inventory.length === 0) {
        embed.addFields({
          value: "No tienes objetos en tu inventario",
        });
      } else {
        const chunkSize = 10;
        for (let i = 0; i < inventory.length; i += chunkSize) {
          const chunk = inventory.slice(i, i + chunkSize).join("\n");
          embed.addFields({
            name: `Objetos disponibles`,
            value: chunk,
          });
        }
      }

      await interaction.reply({
        embeds: [embed],
      });
    } catch (error) {
      console.error(error);
    }
  },
};
