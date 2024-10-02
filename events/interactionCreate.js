const { Events } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const whitelist = ['Nerds','AOTC','Shugo', 'HCO', 'Kingdoms of Legends', 'HCE', 'Esteem', 'Shadow Esteem', 'The Lost Mining City Of Ultreagh-Svindi', 
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
			if (interaction.member.roles.cache.some(role => whitelist.includes(role.name)) || whitelistID.includes(interaction.user.id) || interaction.guild.id=='931626653338185819' || interaction.guild.id=='530549725041262603')
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

		var verifyId = ['approve','deny','deny_with_reason']
		if (interaction.isButton() && verifyId.includes(interaction.customId)){

			const memberTag = interaction.message.embeds[0].fields[0].value; // This gets the username from the embed
			const guildMember = interaction.guild.members.cache.find(m => m.user.tag === memberTag);

			if (!guildMember) {
				return interaction.reply({ content: 'Could not find the user.', ephemeral: false });
			}

			if (interaction.customId === 'approve') {
				// Add 'Player' role to the user
				const role = interaction.guild.roles.cache.find(r => r.name === 'Player');
				if (role) {
					try {
						guildMember.roles.add(role);
						await interaction.update({ content: `${guildMember.user.tag} has been approved!\nHandled by: <@${interaction.user.id}>`, components: [] });
						try {
							await guildMember.send('You have been verified and given access to Heart-Crises. Please enjoy your stay and be sure to follow the rules.');
						} catch (error) {
							console.error('Failed to send DM to the user:', error);
						}
					} catch (error) {
						console.error('Failed to find user:', error);
						await interaction.update({ content: `${guildMember.user.tag} could not be found (perhaps the user left the server?)\nHandled by: <@${interaction.user.id}>`, components: [] });
						
					}
				}	
					
			} else if (interaction.customId === 'deny') {
				await interaction.update({ content: `${guildMember.user.tag} has been denied.\nHandled by: <@${interaction.user.id}>`, components: [] });

				try {
					await guildMember.send('Unfortunately, your request to join Heart-Crises has been denied.');
				} catch (error) {
					console.error('Failed to send DM to the user:', error);
				}
			} else if (interaction.customId === 'deny_with_reason') {
				// Ask the moderator to provide a reason for denial
				const filter = msg => msg.author.id === interaction.user.id;
				
				// Send a prompt to the moderator asking for a reason
				await interaction.reply({ content: 'Please provide a reason to deny this user. Remember to ping me or reply to this message with pings on.', ephemeral: false });
			
				// Wait for the moderator's message (up to 60 seconds)
				try {
					const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });

					const botMentionRegex = new RegExp(`<@!?${interaction.client.user.id}>`, 'g'); // Regex to match the bot mention
					const reason = collected.first().content.replace(botMentionRegex, '').trim();; // Get the reason from the moderator's message			
					
					// Send a DM to the user explaining the reason for denial
					try {
						if (reason==='') {await guildMember.send(`Your request to verify has been denied`);}
						else {await guildMember.send(`Your request to verify has been denied for the following reason: ${reason}`);}
					} catch (error) {
						console.error('Failed to send DM to the user:', error);
					}
			
					// Disable the buttons on the original message
					const disabledRow = new ActionRowBuilder()
						.addComponents(
							new ButtonBuilder()
								.setCustomId('approve')
								.setLabel('Approve')
								.setStyle(ButtonStyle.Success)
								.setDisabled(true),
							new ButtonBuilder()
								.setCustomId('deny')
								.setLabel('Deny')
								.setStyle(ButtonStyle.Danger)
								.setDisabled(true),
							new ButtonBuilder()
								.setCustomId('deny_with_reason')
								.setLabel('Deny with Reason')
								.setStyle(ButtonStyle.Secondary)
								.setDisabled(true)
						);
			
					// Update the original message with the reason and disable the buttons
					await interaction.message.edit({ 
						content: `${guildMember.user.tag} has been denied with the following reason: ${reason}\nHandled by: <@${interaction.user.id}>`, 
						components: [disabledRow] 
					});
			
					// Also, update the ephemeral reply
					//await interaction.editReply({ content: `The user has been denied for the following reason: ${reason}`, ephemeral: false });
					await interaction.deleteReply();
					await collected.first().delete()
			
				} catch (error) {
					await interaction.editReply({ content: 'No reason provided. Action canceled.', ephemeral: false });
					console.error('Moderator did not provide a reason in time.');
					console.log(error)
				}
			}			
		}

	}
};