const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const permissionDeniedEmbed = new EmbedBuilder()
	.setColor(0xe800ff)
	.setDescription("You do not have permission to use this command! This bot is still in beta. Please report all bugs to DarkStalker#1223")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('item')
		.setDescription('item information')
        .addStringOption(option => 
            option.setName('item_name')
                  .setDescription('name of item to search for')
                  .setRequired(true)),
	async execute(interaction) {

        let result;
        let found = false;

        
        const {item} = require('./5etools/data/items.json');
        for (var a=0;a<item.length;a++)
        {
            //console.log(item[a].name);
            if (item[a].name.toLowerCase() == interaction.options.getString('item_name').toLowerCase())
            {
                result = item[a];
                found = true;
                break;
            }
        }
        const {variant} = require('./5etools/data/magicvariants.json');
        for (var a=0;a<variant.length;a++)
        {
            //console.log(item[a].name);
            if (variant[a].name.toLowerCase() == interaction.options.getString('item_name').toLowerCase())
            {
                result = variant[a];
                found = true;
                break;
            }
        }
        
        if (!found)
        {
            await interaction.reply(`Item "${interaction.options.getString('item_name')}" not found`);
            return;
        }

        let entries = cleanEntries(result.entries);

        const itemEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(result.name)
        .addFields(
            { name: 'Description', value: `${entries}`, inline: true },
        )
        .setTimestamp()
        .setFooter({text: 'Known bugs: Tables, some attributes, and base items like plain old daggers/swords/other weapons'});


		await interaction.reply({embeds: [itemEmbed]});
        
    }
};

function cleanEntries(entry)
{
    var entrys = entry[0];
    for (var i = 1;i<entry.length;i++)
    {
        entrys = entrys.concat("\n\n",entry[i]);
        //console.log('loop1');
    }
    while (entrys != entrys.replace("@damage ", ""))
    {
        entrys = entrys.replace("@damage ", "");
        //console.log('loop2');
    }
    while (entrys != entrys.replace("@dice ", ""))
    {
        entrys = entrys.replace("@dice ", "");
        //console.log('loop3');
    }
    while (entrys != entrys.replace("@condition ", ""))
    {
        entrys = entrys.replace("@condition ", "");
        //console.log('loop3');
    }
    return entrys;
}