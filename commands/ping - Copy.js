const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		//.setDMPermission(false); //controls if it can be used in DMs
		//.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers); 
		//controls if a member can use the command based on permissions
		
		.setName('message')
		.addIntegerOption(option => 
            option.setName('password')
                  .setDescription('password')
                  .setRequired(true))
		.addIntegerOption(option => 
		option.setName('channel')
				.setDescription('channel')
				.setRequired(true)),
	async execute(interaction) {
		
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