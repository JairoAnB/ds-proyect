const { Events } = require("discord.js");
const { distube } = require("../index");
const { EmbedBuilder } = require("discord.js");
const { tradesInProgress } = require("../commands/economy/trade"); 
const fs = require("fs");
const pathUsers = "./user.json";

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    
    let profiles = JSON.parse(fs.readFileSync(pathUsers, "utf8"));
    let color = profiles[interaction.user.id]?.color || "#ff0000";
    const inventory = profiles[interaction.user.id]?.inventory || [];
    

    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) {
        console.error(`El comando no existe o no fue encontrado: ${interaction.commandName}`);
        return;
      }

      try {
        await command.execute(interaction, distube);
      } catch (error) {
        console.error(error);
        const response = {
          content: "Hubo un error al ejecutar el comando.",
          ephemeral: true,
        };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(response);
        } else {
          await interaction.reply(response);
        }
      }

    } else if (interaction.isButton()) {
      if (interaction.customId === "comandos") {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: `Muhammed Yusuf`,
                iconURL: `${interaction.user.avatarURL()}`,
              })
              .setDescription(
                "`Comandos disponibles:`\n`/play, /skip, /stop, /queue, /resume, /current, /pong, /help, /clima, /profile-create, /profile-edit`"
              )
              .setTimestamp()
              .setColor("#ffffff"),
          ],
          ephemeral: true,
        });
      } else if (interaction.customId === "vender") {
        let profiles = JSON.parse(fs.readFileSync(pathUsers, "utf8"));

        const itemToTrade = tradesInProgress.get(interaction.user.id);

        if (!itemToTrade) {
          return interaction.reply({
            content: "No se encontró el objeto para comerciar.",
            ephemeral: true,
          });
        }

        const probabilidad = Math.random();
        const ganar = 0.5;

        if (probabilidad <= ganar) {
          const recompensa = Math.floor(Math.random() * 10000) + 1;
          profiles[interaction.user.id].balance += recompensa;
          
          const inventory = profiles[interaction.user.id].inventory;
          const itemIndex = inventory.indexOf(itemToTrade);
          inventory.splice(itemIndex, 1);
          fs.writeFileSync(pathUsers, JSON.stringify(profiles, null, 2));

          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setAuthor({
                  name: `Felicitaciones`,
                  iconURL: `${interaction.user.avatarURL()}`,
                })
                .setDescription(
                  `¡Felicidades Has vendido el **${itemToTrade.name}**\n
                  > Has ganado **$${recompensa}** pesos chilenos.`
                )
                .setColor(color)
                .setTimestamp()
                .setImage("https://cdn.discordapp.com/attachments/803069581001621548/1303777581044334684/something.gif?ex=672cfcfe&is=672bab7e&hm=655987aa95e25cfc2593fb452b5b8c8b32863be8a366d463079dc030939c8bb1&")
                ,
            ],
          });
        } else {
          const inventory = profiles[interaction.user.id].inventory;
          const itemIndex = inventory.indexOf(itemToTrade);
          inventory.splice(itemIndex, 1);
          fs.writeFileSync(pathUsers, JSON.stringify(profiles, null, 2));
          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setAuthor({
                  name: `¡Uy!`,
                  iconURL: `${interaction.user.avatarURL()}`,
                })
                .setDescription(
                  `¡Lamentamos decirte que el mercader salio corriendo con tu **${itemToTrade.name}**!
                  > No has ganado ni un fukin verde..`
                )
                .setColor(color|| "#ff0000")
                .setImage("https://cdn.discordapp.com/attachments/803069581001621548/1303777581555908688/squid.gif?ex=672cfcfe&is=672bab7e&hm=efa7b4c2377fea64f9e02284525cc54c37744cf51368efa716a5958c3d29faa4&")
                .setTimestamp(),
            ],
          });
        }

        tradesInProgress.delete(interaction.user.id);
      }
    }
  },
  
};
