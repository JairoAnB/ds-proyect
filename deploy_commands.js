const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

token = process.env.token;
client_id = process.env.client_id;
guild_id = process.env.guild_id;

const commands = [];
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(`Cuidado, el comando ${filePath} está perdido.`);
    }
  }
}

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log(
      `Empezando a cargar ${commands.length} aplicación (/) commands.`
    );
    const data = await rest.put(
      Routes.applicationGuildCommands(client_id, guild_id),
      {
        body: commands,
      }
    );
    console.log(
      `Recargado correctamente ${data.length} aplicación (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();
