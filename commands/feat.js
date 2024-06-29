const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const path = require('node:path');
const {feat} = require('./data/feats.json');
console.log(feat[0].name);

const tools = require(path.join(__dirname, '../util.js'));

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

        let entries = result.entries!=undefined ? cleanEntries(result.entries):'No description.'
        
        let statbonus = result.ability!=undefined ? determineStatBonus(result.ability[0]):"None";
        
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
        .setFooter({text: 'Skill proficiency fields not working as intended'});
        //.setFooter({ text: 'Some footer text here'})


		await interaction.reply({embeds: [featEmbed]});
	},
};

function determineStatBonus(data)
{
    if (data.choose != undefined)
    {
        choices = `Choose ${data.choose.amount} from:`
        for (stat in data.choose.from)
        {
            choices += ` ${data.choose.from[stat]}`
            if (stat!=data.choose.from.length-1){choices+=','}
            console.log(stat)
        }
        return choices
    }
    if (data.str){return '+1 str'}
    if (data.dex){return '+1 dex'}
    if (data.con){return '+1 con'}
    if (data.int){return '+1 int'}
    if (data.wis){return '+1 wis'}
    if (data.cha){return '+1 cha'}
    return 'Error'
}
/*
        console.log(result.ability)
        console.log(result.ability[0])
        console.log(result.ability[0].con)
        let statbonus = "Error";
        switch (result.ability[0])
        {
            case (result.ability[0].cha != undefined): {statbonus = "+1 Charisma";return;}
            case (result.ability[0].wis != undefined): {statbonus = "+1 Wisdom";return;}
            case (result.ability[0].int != undefined): {statbonus = "+1 Intelligence";return;}
            case (result.ability[0].str != undefined): {statbonus = "+1 Strength";return;}
            case (result.ability[0].con != undefined): {statbonus = "+1 Constitution";return;}
            case (result.ability[0].dex != undefined): {statbonus = "+1 Dexterity";return;}
            default: {statbonus = "None";}
        }
        */

function cleanEntries(data)
{
    entry = ""
    if (data[1].type!=undefined && data[1].type=='list')
    {
        entry+=`${data[0]}\n\n`;
        console.log(`data.items:\n${data.items}`)
        for (item in data[1].items)
        {
            entry+=`${data[1].items[item]}\n\n`
        }
        return entry;
    }

    for (line in data)
    {
        entry+=`${data[line]}\n\n`
    }
    return entry;
}
/*
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
    }*/