const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

// for guild-based commands
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);

// for global commands
rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);

rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);

/*
To delete commands, use the following: 

You can obtain the command ID in Server Settings -> 
Integrations -> Bots and Apps and choose your bot. Then, right click a command and click Copy ID. 

// for guild-based commands
rest.delete(Routes.applicationGuildCommand(clientId, guildId, 'commandId'))
.then(() => console.log('Successfully deleted guild command'))
.catch(console.error);

// for global commands
rest.delete(Routes.applicationCommand(clientId, 'commandId'))
.then(() => console.log('Successfully deleted application command'))
.catch(console.error);
*/

/*
To delete all commands in the respective scope (one guild, all global commands) 
you can pass an empty array when setting commands:

// for guild-based commands
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);

// for global commands
rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);

Discord's API doesn't currently provide an easy way to delete guild-based commands that occur 
on multiple guilds from all places at once. Each will need a call of the above endpoint, 
while specifying the respective guild and command id. Note, that the same command will have a different id, 
if deployed to a different guild! 
*/