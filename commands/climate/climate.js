const {
  SlashCommandBuilder,
  TextChannel,
  EmbedBuilder,
} = require("discord.js");
const axios = require("axios");
const { execute } = require("../music/pause");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("clima")
    .setDescription("Muestra el clima actual de la ciudad deseada.")
    .addStringOption((option) =>
      option
        .setName("ciudad")
        .setDescription("Ingresa el nombre de la ciudad")
        .setRequired(true)
    ),

  async execute(interaction) {
    const apiKey = `a63c690d19f12dc7a365078909ff5902`;
    const ciudad = interaction.options.getString("ciudad");
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric`;

    try {
      const response = await axios.get(url);
      const weatherData = response.data;
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: `Muhammed Yusuf`,
              iconURL: `${interaction.user.avatarURL()}`,
            })
            .setDescription(
              `### 🌍 **${ciudad}**  

            > 🌡️ **Temperatura actual:** **${weatherData.main.temp}°C**
            > 🌡️ **Temperatura mínima:** **${weatherData.main.temp_min}°C**
            > 🔥 **Temperatura máxima:** **${weatherData.main.temp_max}°C**
            > 🌬️ **Sensación térmica:** **${weatherData.main.feels_like}°C**
            > 💧 **Humedad:** **${weatherData.main.humidity}%**
              `
            )
            .setThumbnail(
              `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`
            )
            .setColor("#ff0000")
            .setTimestamp(),
        ],
      });
    } catch (error) {
      if (error.response) {
        await interaction.reply(
          `No se pudo obtener el clima para **${ciudad}** ya que no existe. Intenta nuevamente.`
        );
      } else if (error.request) {
        await interaction.reply(
          `Error en la respuesta. no se pudo obtener el clima para **${ciudad}**. ${error.response.data.message}`
        );
      } else {
        console.error("Error", error.message);
        await interaction.reply(
          `error inesperado, revisa la consola para ver mas informacion.`
        );
      }
    }
  },
};
