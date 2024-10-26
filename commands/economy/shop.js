const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const { execute } = require("./economyCurrency");
const path = "./user.json";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tienda")
    .setDescription("Muestra la tienda actual de objetos disponibles."),

  async execute(interaction) {
    const profiles = JSON.parse(fs.readFileSync(path, "utf8"));
    const color = profiles[interaction.user.id].color;
    try {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: `Tienda de objetos`,
              iconURL: `${interaction.user.avatarURL()}`,
            })
            .addFields(
              {
                name: "Anillo de oro",
                value: "**$100**\n`anillo`",
                inline: true,
              },
              {
                name: "Peluche de Haerin\u200B",
                value: "$**1000**\n`haerin`\n\u200B",
                inline: true,
              },
              {
                name: "Peluche de Hanni\u200B",
                value: "$**1000**\n`hanni`\n\u200B",
                inline: true,
              },
              {
                name: "Peluche de Hyein\u200B",
                value: "$**1000**\n`hyein`\n\u200B",
                inline: true,
              },
              {
                name: "Peluche de Danielle\u200B",
                value: "$**1000**\n`danielle`\n\u200B",
                inline: true,
              },
              {
                name: "Peluche de Minji\u200B",
                value: "$**1000**\n`minji`\n\u200B",
                inline: true,
              }
            )
            .setColor(color)
            .setTimestamp(),
        ],
      });
      return;
    } catch (error) {
      console.error(error);
    }
  },
};