const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('letra')
        .setDescription('Busca la letra de una canción.')
        .addStringOption(option => 
            option.setName('artista')
            .setDescription('Nombre del artista')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('cancion')
            .setDescription('Nombre de la canción')
            .setRequired(true)),

    async execute(interaction) {
        const artist = interaction.options.getString('artista');
        const song = interaction.options.getString('cancion');
        const url = `https://api.lyrics.ovh/v1/${artist}/${song}`;

        try {
            const response = await axios.get(url);
            const lyrics = response.data.lyrics;

            if (!lyrics) {
                return interaction.reply('No se encontró la letra en Lyrics.ovh.');
            }

            const formattedLyrics = lyrics.replace(/(\r\n|\n|\r){2,}/g, '\n\n') 
                                        .replace(/(\r\n|\n|\r)/g, '\n');

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Letra de la canción **${song}** de **${artist}**`)
                        .setAuthor({
                            name: `${interaction.user.tag}`,
                            iconURL: `${interaction.user.avatarURL()}`,
                        })
                        .setDescription(`**Letra:**\n${formattedLyrics.slice(0, 4096)}`)
                        .setColor("#ff0000")
                        .setTimestamp()
                ],
            });

        } catch (error) {
            console.error(error);
            interaction.reply('Ocurrió un error al buscar la letra.');
        }
    }
};
