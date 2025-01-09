const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const pathUsers = "./user.json";
const pathShop = "./shop.json";

const cancelar = new ButtonBuilder()
  .setCustomId(`cancelar`)
  .setLabel(`Cancelar`)
  .setStyle(ButtonStyle.Danger);

const vender = new ButtonBuilder()
  .setCustomId(`vender`)
  .setLabel(`Vender Objeto`)
  .setStyle(ButtonStyle.Success);

const row = new ActionRowBuilder().addComponents(vender, cancelar);


const tradesInProgress = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trade')
    .setDescription('¡Intercambia objetos con el mercader por oro!')
    .addStringOption(option => 
      option.setName('objeto')
        .setDescription('Introduce el objeto a intercambiar')
        .setRequired(true)
    ),

  async execute(interaction) {
    let profiles = JSON.parse(fs.readFileSync(pathUsers, "utf8"));
    const objeto = interaction.options.getString("objeto");
    const inventory = profiles[interaction.user.id].inventory;
    const itemToTrade = inventory.find(item => item.id === objeto);

    if(itemToTrade !== "anillo") {
      return interaction.reply({
        content: "No puedes intercambiar ese objeto.",
        ephemeral: true,
      });
    }
    if (!itemToTrade) {
      return interaction.reply({
        content: "No tienes ese objeto en tu inventario.",
        ephemeral: true,
      });
    }
    tradesInProgress.set(interaction.user.id, itemToTrade);

    const embedTrade = new EmbedBuilder()
      .setAuthor({
        name: `Mercader de objetos`,
        iconURL: `${interaction.user.avatarURL()}`,
      })
      .setDescription(`### ¡Hola! Soy el mercader de objetos, estoy dispuesto a intercambiar tus objetos por dinero.\n
        > ¿Estás seguro de querer intercambiar **${itemToTrade.name}** por dinero?`)
      .setColor(profiles[interaction.user.id].color)
      .setImage("https://media.discordapp.net/attachments/803069581001621548/1303402344498724925/cd0t4vqjlrp51.webp?ex=672cf106&is=672b9f86&hm=09633d8dcc2a0491ecc0ffead1aaac74b94b0f25745fcade69b815c6f07d36aa&=&format=webp&width=722&height=936")
      .setTimestamp()

    try {
      await interaction.reply({
        embeds: [embedTrade],
        components: [row],
      });
    } catch (error) {
      console.error(error);
    }
  },
  
  tradesInProgress, 
};
