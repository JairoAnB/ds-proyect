const fs = require("fs");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { execute } = require("./economyCurrency");
const path = "./user.json";

const coldowns = new Map();
const coldownTime = 60000;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("trabajar")
    .setDescription("Con este comando puedes trabajar y ganar dinero"),

  async execute(interaction) {
    let profiles;
    try {
      profiles = JSON.parse(fs.readFileSync(path, "utf8"));
    } catch (error) {
      console.error(error);
    }

    try {
      if (!profiles[interaction.user.id]) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: `Muhammed Yusuf`,
                iconURL: `${interaction.user.avatarURL()}`,
              })
              .setDescription(
                `Error :x: La peticion no ha podido procesarse, Necesitas crearte un perfil antes de ocupar esta funcion.
                      \`/create-profile\` para continuar.`
              )
              .setColor("#ff0000")
              .setTimestamp(),
          ],
        });
        return;
      }
      if(profiles[interaction.user.id].balance < 0){

      }
      const now = Date.now();
      if (coldowns.has(interaction.user.id)) {
        const ultimoUso = coldowns.get(interaction.user.id);
        const tiempoRestante = coldownTime - (now - ultimoUso);
        if (tiempoRestante > 0) {
          minutosRestantes = Math.ceil(tiempoRestante / 1000);
          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setAuthor({
                  name: `Muhammed Yusuf`,
                  iconURL: `${interaction.user.avatarURL()}`,
                })
                .setDescription(
                  `Debes esperar **${tiempoRestante}** para volver a utilizar este comando. :x:`
                )
                .setColor("#ff0000")
                .setTimestamp(),
            ],
          });
          return;
        }
      }
      const trabajos = [
        "has trabajado en cocina haciendo unos buenos vasos con agua",
        "has trabajado siendo un gamer profesional",
        "has trabajado vendiendo metanfetamina en la esquina de tu casa",
        "has trabajado armando complejos algoritmos para mc donalds",
        "has trabajado robando casas y te han atrapado, pero haz conseguido salir",
        "has trabajado de stripper en un club nocturno",
        "has trabajado de sicario y casi te matan en la primera mision",
        "has trabajado como editor de elded, casi te come en tu primer dia",
        "has trabajado como proveedor de cloroformo para la isla epstein",
        "has trabajado como secuestrador de bebes para la DINA",
        "has trabajado como vendedor de organos en el mercado nergro",
        "has trabajado como traductor sin brazos de criollo haitiano en braille, descifrando escritos con tu pene",
        "has trabajado como analista de semen boliviano en la autopsia del cangri ",
        "has trabajado como chofer de Muhammed Yusuf, pero te despidio por ser un pobre maricon",
        "has trabajado como pescador tradicional birmano para triplicar el pib nominal y per capita de tu pais",
      ];

      const trabajoAleatorio =
        trabajos[Math.floor(Math.random() * trabajos.length)];
      const pago = Math.floor(Math.random() * 500) + 1;

      profiles[interaction.user.id].balance =
        profiles[interaction.user.id].balance + pago;

      fs.writeFileSync(path, JSON.stringify(profiles, null, 2));

      coldowns.set(interaction.user.id, now);
      const color = profiles[interaction.user.id].color;
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: `Muhammed Yusuf`,
              iconURL: `${interaction.user.avatarURL()}`,
            })
            .setDescription(
              `**${trabajoAleatorio}**... por tu arduo trabajo has recibido la mediocre suma de **$${pago}** pesos chilenos.
              
                 > Ojala no te hayan pagado con billetes falsos...`
            )
            .setColor(color)
            .setFooter({
              text: `${interaction.guild.name}`,
              iconURL: interaction.guild.iconURL(),
            })
            .setThumbnail(
              "https://static-00.iconduck.com/assets.00/gold-coin-icon-512x512-ehq45y6s.png"
            )
            .setTimestamp(),
        ],
      });
      return;
    } catch (error) {
      console.error(error);
    }
  },
};
