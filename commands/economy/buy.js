const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const pathUsers = "./user.json";
const pathShop = "./store.json";


module.exports = {
    data: new SlashCommandBuilder().setName("comprar").setDescription("Compra un objeto de la tienda")
        .addStringOption(option =>
                option.setName("objeto")
                .setDescription("id del objeto a comprar")
                .setRequired(true)),
    
    async execute(interaction) { 
        let profiles;
        profiles = JSON.parse(fs.readFileSync(pathUsers, "utf8"));
        let shop;
        shop = JSON.parse(fs.readFileSync(pathShop, "utf8"));
        objeto = interaction.options.getString("objeto");
        const inventory = profiles[interaction.user.id].inventory;

        const itemToBuy = shop.items.find(item => item.id === objeto);
        try {

            if(!itemToBuy){
                return interaction.reply({
                    embeds: [
                      new EmbedBuilder()
                        .setAuthor({
                          name: `Error`,
                          iconURL: `${interaction.user.avatarURL()}`,
                        })
                        .setDescription(
                          `:x: El objeto que intentas comprar no existe en la tienda.`
                        )
                        .setColor("#ff0000")
                        .setTimestamp().setFooter(interaction.user.tag),
                    ],
                  });
            }else{
                if(profiles[interaction.user.id].balance < itemToBuy.price){
                    return interaction.reply({
                        embeds: [
                          new EmbedBuilder()
                            .setAuthor({
                              name: `Error`,
                              iconURL: `${interaction.user.avatarURL()}`,
                            })
                            .setDescription(
                              `
                              :x: No tienes suficiente dinero para comprar **${itemToBuy.name}**.\n
                              > Sigue ocupando el comando de \`/trabajar\` para ganar dinero`
                            )
                            .setColor("#ff0000")
                            .setTimestamp()
                            .setFooter({ text: interaction.user.tag }),
                        ],
                      });
                }else{
                    profiles[interaction.user.id].balance -= itemToBuy.price;
                    inventory.push(itemToBuy.name);
                    fs.writeFileSync(pathUsers, JSON.stringify(profiles, null, 2));
                    interaction.reply({
                        embeds: [
                          new EmbedBuilder()
                            .setAuthor({
                              name: `¡Objeto comprado!`,
                              iconURL: `${interaction.user.avatarURL()}`,
                            })
                            .setDescription(
                              `
                              :white_check_mark: ¡Felicidades! has comprado ${itemToBuy.name} por la modica suma de $${itemToBuy.price}.
                                > Tu dinero actual es de $${profiles[interaction.user.id].balance} pesos chilenos.
                                > Puedes ver tu inventario con el comando \`/inventario\`
                                > Puedes usar tu objeto con el comando \`/usar\`
                              `
                            )
                            .setColor("#ff0000")
                            .setFooter({
                                text: `${interaction.guild.name}`,
                                iconURL: interaction.guild.iconURL(),
                              })
                            .setTimestamp(),
                        ],
                      });
                }
            }
        } catch (error) {
            console.log(error)
            
        }










    }
}