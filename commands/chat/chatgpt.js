const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
require('dotenv').config();
module.exports = {
    data: new SlashCommandBuilder()
        .setName("chat")
        .setDescription("¡Pregúntale al bot lo que desees!")
        .addStringOption(option =>
            option.setName("mensaje")
                .setDescription("Mensaje a preguntar")
                .setRequired(true)
        ),

    async execute(interaction) {
        const message = interaction.options.getString("mensaje");

        try {
          const { ChatGPTAPI } = await import('chatgpt');
          const api = new ChatGPTAPI({
            apiKey: process.env.openApiKey
          });
            const response = await api.sendMessage(message);

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: `${interaction.user.tag}`,
                            iconURL: `${interaction.user.avatarURL()}`,
                        })
                        .setDescription(
                            `**Pregunta:**\n${message}\n\n**Respuesta:**\n${response.text}`
                        )
                        .setColor("#ff0000")
                        .setTimestamp(),
                ],
            });
        } catch (error) {
            console.error(error);
            console.error("Error al buscar la respuesta:", error);
            await interaction.reply({
                content: 'Ocurrió un error al buscar la respuesta. Por favor, inténtalo más tarde.',
                ephemeral: true,
            });
        }
    },
};
