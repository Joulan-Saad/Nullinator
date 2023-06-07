const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		//.setDMPermission(false); //controls if it can be used in DMs
		//.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers); 
		//controls if a member can use the command based on permissions
		
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		//await interaction.reply({content: 'Ping!', ephemeral: true});
		await interaction.deferReply({ephemeral:false}); 
		//.deferReply() must be sent first, 
		//and will not allow message edits or prior responses
		await wait(2000);
		await interaction.editReply("Pong!");
		//const message = await interaction.fetchReply();
		//console.log(message);
		await wait(1000);
		await interaction.deleteReply();
		await interaction.followUp({content:'Pong again!',ephemeral:true});
	},
};

/*
const string = interaction.options.getString('input');
const boolean = interaction.options.getBoolean('bool');
const user = interaction.options.getUser('target');
const member = interaction.options.getMember('target');
const channel = interaction.options.getChannel('destination');
const role = interaction.options.getRole('role');
const integer = interaction.options.getInteger('int');
const number = interaction.options.getNumber('num');
const mentionable = interaction.options.getMentionable('mentionable');
const attachment = interaction.options.getAttachment('attachment');
*/