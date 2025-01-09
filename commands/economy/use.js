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
        const itemsName = inventory.map(item => item.id);
        let Bname = ''
        const apikey = 'AIzaSyCy4d0n5MqwpJSMVe4OBvK5_fLKpNqrM6E';



        if (!itemsName || !itemsName.includes(objeto)) {
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
                    const index = itemsName.indexOf(objeto);
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
                    ],
                });
                return;
            }
        }
        if(objeto === "anillo"){
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: `Error`,
                            iconURL: `${interaction.user.avatarURL()}`,
                        })
                        .setDescription(`Este objeto se utiliza solo para empeñar.
                            \n> Por favor ocupa el comando de /trade para poder ocupar este objeto.`)
                        .setColor("#ff0000")
                        .setTimestamp()
                        .setFooter({
                            text: `${interaction.guild.name}`,
                            iconURL: interaction.guild.iconURL(),
                        })
                ],
            });
            return;
        }
        if (objeto) {
            const premio = Math.floor(Math.random() * 2500) + 1;
            Bname = `${objeto}-happy`;
            const urlTenor = `https://tenor.googleapis.com/v2/search?q=${Bname}&key=${apikey}&client_key=my_test_app&limit=8`;
        
            try {
                const response = await axios.get(urlTenor);
                const results = response.data.results;
        
                if (results && results.length > 0 && results[0].media_formats && results[0].media_formats.gif) {
                    const randomIndex = Math.floor(Math.random() * results.length);
                    const gifURL = results[randomIndex].media_formats.gif.url;

                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: `Canjeo de ticket`,
                                    iconURL: `${interaction.user.avatarURL()}`,
                                })
                                .setDescription(`¡Haz utilizado correctamente el **Ticket de ${objeto}!**
                                    \n Has reclamado un premio de $${premio} pesos chilenos.
                                    > El objeto ha sido eliminado de tu inventario :(`)
                                .setColor(profiles[interaction.user.id].color)
                                .setTimestamp()
                                .setImage(gifURL)
                                .setFooter({
                                    text: `${interaction.guild.name}`,
                                    iconURL: interaction.guild.iconURL(),
                                })
                        ],
                    });
                    const index = itemsName.indexOf(objeto);
                    inventory.splice(index, 1);
                    profiles[interaction.user.id].balance += premio;
                    fs.writeFileSync(pathUsers, JSON.stringify(profiles, null, 2));
                } else {
                    console.error('No se encontraron resultados válidos para el GIF');
                    await interaction.reply({
                        content: 'No se pudo encontrar un GIF, intenta de nuevo más tarde.',
                    });
                }
            } catch (error) {
                console.error('Error al obtener los datos de Tenor:', error);
                await interaction.reply({
                    content: 'Hubo un error al intentar obtener el GIF.',
                });
            }
        }
        return;
}
};