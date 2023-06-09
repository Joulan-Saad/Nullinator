const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
//const { token } = require('./config - Heart-Crises.json');
const { execute } = require('./events/interactionCreate');
//const { ActivityType } = require('discord.js');

/*const permissionDeniedEmbed = new EmbedBuilder()
	.setColor(0xe800ff)
	.setDescription("You do not have permission to use this command! This bot is still in beta. Please report all bugs to DarkStalker#1223")*/


const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//client.user.setActivity('the screams of the damned', { type: ActivityType.Listening });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}



client.on('interactionCreate', async interaction => {
	
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);