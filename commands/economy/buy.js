const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = "./user.json";

module.exports = {
    data: new SlashCommandBuilder().setName("comprar").setDescription("Compra un objeto de la tienda.")
        .addStringOption(option =>
                option.setName("objeto")
                .setDescription("Nombre del objeto a comprar.")
                .setRequired(true)),
    
    async execute(interaction) { 
        let profiles;
        profiles = JSON.parse(fs.readFileSync(path, "utf8"));
    
        const inventory = profiles[interaction.user.id].inventory;
    }
}