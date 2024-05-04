const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config.json');

const commandNameToDelete = "hello"; // Replace with the name of the command you want to delete

const rest = new REST({ version: '9' }).setToken(config.token);

(async () => {
    try {
        console.log('Started fetching application (/) commands...');
        const commands = await rest.get(
            Routes.applicationCommands(config.clientId)
        );

        const commandToDelete = commands.find(cmd => cmd.name === commandNameToDelete);

        if (!commandToDelete) {
            return console.log(`Command "${commandNameToDelete}" not found.`);
        }

        console.log(`Deleting command "${commandNameToDelete}"...`);
        await rest.delete(
            Routes.applicationCommand(config.clientId, commandToDelete.id)
        );

        console.log(`Successfully deleted command "${commandNameToDelete}".`);
    } catch (error) {
        console.error(error);
    }
})();
