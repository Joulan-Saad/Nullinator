const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const permissionDeniedEmbed = new EmbedBuilder()
	.setColor(0xe800ff)
	.setDescription("You do not have permission to use this command! This bot is still in beta. Please report all bugs to DarkStalker#1223")

const errorEmbed = new EmbedBuilder()
	.setColor(0xe800ff)
	.setDescription("Error")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('admin')
		.setDescription('admin_commands')
        .addStringOption(option => 
            option.setName('password')
                  .setDescription('password')
                  .setRequired(true))
        .addStringOption(option => 
            option.setName('one')
                .setDescription('one'))
        .addStringOption(option => 
            option.setName('two')
                .setDescription('two'))
        .addStringOption(option => 
            option.setName('three')
                .setDescription('three'))
        .addStringOption(option => 
            option.setName('four')
                .setDescription('four')),
                  
	async execute(interaction) {
        if (interaction.user.id!='429018772742078494')
        {
            await interaction.reply({embeds: [permissionDeniedEmbed]});
            return;
        }
        if (interaction.options.getString('one').toLowerCase() === 'shut down')
        {
            await interaction.reply("Shutting down...");
            process.exitCode = 1;
        }
        if (interaction.options.getString('one').toLowerCase() === 'msg')
        {
            var guild = client.guilds.cache.get(interaction.options.getString('two'))
            var channel = guild.channels.cache.get(interaction.options.getString('three'))
            if (guild && channel){
                await channel.send(interaction.options.getString('four'))
            }
            else {
                await interaction.reply({embeds: [errorEmbed], ephemeral:true})
            }

        }
        
    }
};