const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const sharp = require("sharp");
const axios = require("axios");
const pathUsers = "./user.json";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("usar")
        .setDescription("Usa un objeto que esté en tu inventario")
        .addStringOption(option =>
            option.setName("objeto")
                .setDescription("Ingresa el id del objeto a ocupar")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("url")
                .setDescription("Ingresa la URL del banner a ocupar (solo para el objeto banner, imagen de mínimo 600x200px)")),

    async execute(interaction) {
        const objeto = interaction.options.getString("objeto");
        const url = interaction.options.getString("url");
        let profiles;

        try {
            profiles = JSON.parse(fs.readFileSync(pathUsers, "utf8"));
        } catch (error) {
            console.error("Error al leer el archivo de perfiles:", error);
            return interaction.reply({
                content: "Ocurrió un error al acceder a los datos de perfil.",
                ephemeral: true
            });
        }

        const inventory = profiles[interaction.user.id]?.inventory;

        if (!inventory || !inventory.includes(objeto)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: `Error`,
                            iconURL: `${interaction.user.avatarURL()}`,
                        })
                        .setDescription(`:x: El objeto que intentas usar no existe en tu inventario.`)
                        .setColor("#ff0000")
                        .setTimestamp()
                        .setFooter({
                            text: `${interaction.guild.name}`,
                            iconURL: interaction.guild.iconURL(),
                        })
                ],
            });
        }

        if (objeto === "banner") {
            const banner_width = 600;
            const banner_height = 165;
            try {
                const response = await axios({
                    url: url,
                    responseType: "arraybuffer",
                });

                const buffer = Buffer.from(response.data, 'binary');
                const { width, height } = await sharp(buffer).metadata();


                if (width >= banner_width && height >= banner_height) {
                    profiles[interaction.user.id].banner = url; 
                    const index = inventory.indexOf(objeto);
                    inventory.splice(index, 1);
                    fs.writeFileSync(pathUsers, JSON.stringify(profiles, null, 2));

                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: `Banner de ${interaction.user.username}`,
                                    iconURL: `${interaction.user.avatarURL()}`,
                                })
                                .setDescription(`:white_check_mark: La imagen cumple con los requisitos.
                                    \n El banner ha sido cambiado correctamente.
                                    \n > El objeto ha sido eliminado de tu inventario :(`)
                                .setColor("#00ff00")
                                .setTimestamp()
                                .setFooter({
                                    text: `${interaction.guild.name}`,
                                    iconURL: interaction.guild.iconURL(),
                                })
                        ],
                    });
                } else {
                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: `Error`,
                                    iconURL: `${interaction.user.avatarURL()}`,
                                })
                                .setDescription(`:x: La imagen no cumple con los requisitos.
                                    \n> El ancho de la imagen debe ser de un minumo de 600px y el largo de 200px.`)
                                .setColor("#ff0000")
                                .setTimestamp()
                                .setFooter({
                                    text: `${interaction.guild.name}`,
                                    iconURL: interaction.guild.iconURL(),
                                })
                        ],
                    });
                }
            } catch (error) {
                console.error("Error al procesar la imagen:", error);
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: `Error`,
                                iconURL: `${interaction.user.avatarURL()}`,
                            })
                            .setDescription(`:x: Ocurrió un error al procesar la imagen. Asegúrate de que la URL sea válida y que la imagen cumpla los requisitos minimos.`)
                            .setColor("#ff0000")
                            .setTimestamp()
                            .setFooter({
                                text: `${interaction.guild.name}`,
                                iconURL: interaction.guild.iconURL(),
                            })
                    ],
                });
            }
        }
    }
};
