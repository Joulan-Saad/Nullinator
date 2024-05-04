const { Events } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const whitelist = ['Shugo', 'HCO', 'Kingdoms of Legends', 'HCE', 'Esteem', 'Shadow Esteem', 'The Lost Mining City Of Ultreagh-Svindi', 
			'Tales of Apocrypha: Bringers of Paradise', 'Out of the Abyss', 'The Wild Beyond the Witchlight', 'Secrets of Sihirheim', 'test role'];

const whitelistID = ["429018772742078494", "481839801918554122"];

const permissionDeniedEmbed = new EmbedBuilder()
	.setColor(0xe800ff)
	.setDescription("You do not have permission to use this command! This bot is still in beta. Please report all bugs to DarkStalker#1223 or thedarkstalker.")
	

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {

		
		
		if (interaction.isChatInputCommand())
		{
			if (interaction.member.roles.cache.some(role => whitelist.includes(role.name)) || whitelistID.includes(interaction.user.id) || interaction.guild.id=='931626653338185819')
			{
				console.log(`${interaction.user.tag} in #${interaction.channel.name}(${interaction.guild.name}) triggered an interaction(${interaction}).`);
				const { commandName } = interaction;
				const command = interaction.client.commands.get(interaction.commandName);
				if (!command) return;

				try {
					await command.execute(interaction);
				} catch (error) {
					console.error(error);
					await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
				}
				
			}
			else {
				console.log(`${interaction.user.tag} in #${interaction.channel.name}(${interaction.guild.name}) triggered an interaction(${interaction}), but was denied permission!`);
				await interaction.reply({embeds: [permissionDeniedEmbed], ephemeral:true});
				return;
			}
		}

//---------------------------

		if (interaction.isAutocomplete()) 
		{
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command){console.error(`No command matching ${interaction.commandName} was found`); return;}

			try {
				command.autocomplete(interaction);
			} catch (error) {
				console.error(error);
			}
		}
	}
};