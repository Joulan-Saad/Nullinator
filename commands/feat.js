const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const {feat} = require('./data/feats.json');
console.log(feat[0].name);

const tools = require('./utilities/utilities.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('feat')
		.setDescription('Display information about a feat')
        .addStringOption(option => 
            option.setName('feat_name')
                  .setDescription('The name of the feat to search for')
                  .setRequired(true)),


	async execute(interaction) {

        let result;
        let found = false;
        for (var i=0;i<feat.length;i++)
        {
            if (feat[i].name.toLowerCase() == interaction.options.getString('feat_name').toLowerCase())
            {
                result = feat[i];
                found = true;
                break;
            }
        }
        if (!found)
        {
            await interaction.reply(`Feat "${interaction.options.getString('feat_name')}" not found`);
            return;
        }

        let entries = result.entries[0];
        for (var i = 1;i<result.entries.length;i++)
        {
            if (result.entries[i].type=="list")
            {
                for (var a=0;a<result.entries[i].items.length;a++)
                {
                    entries = entries.concat("\n\n",result.entries[i].items[a]);
                }
            }
            
        }
        while (entries != entries.replace("@skill ", ""))
        {
            entries = entries.replace("@skill ", "");
        }
        let statbonus = "Error";/*
        switch (result.ability)
        {
            case (result.ability.cha === parseInt(1)): {statbonus = "+1 Charisma";return;}
            case (result.ability.wis != undefined): {statbonus = "+1 Wisdom";return;}
            case (result.ability.int != undefined): {statbonus = "+1 Intelligence";return;}
            case (result.ability.str != undefined): {statbonus = "+1 Strength";return;}
            case (result.ability.con != undefined): {statbonus = "+1 Constitution";return;}
            case (result.ability.dex != undefined): {statbonus = "+1 Dexterity";return;}
            default: {statbonus = "None";}
            
        }*/
        let featRequirements = result.prerequisite!=undefined ? tools.cleanFeatPrereqs(result.prerequisite):"None";

        const featEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(result.name)
        .addFields(
            { name: `Prerequisite:`, value: featRequirements},
            { name: `Stat bonus:`, value: `${statbonus}`},
            { name: `Skill proficiencies granted:`, value: `${(result.skillProficiencies!=undefined)?result.skillProficiencies:"None"}`},
            { name: 'Description', value: `${entries}`, inline: true },
            
            //{ name: 'Inline field title', value: 'Some value here', inline: true },
        )
        //.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
        .setTimestamp()
        .setFooter({text: 'Stat bonus and skill proficiency fields not working as intended'});
        //.setFooter({ text: 'Some footer text here'})


		await interaction.reply({embeds: [featEmbed]});
	},
};
