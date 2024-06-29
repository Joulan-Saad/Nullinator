const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const tools = require(path.join(__dirname, '../util.js'));

const spells = [];
const spellPathFiles = [];
const spellsPath = path.join(__dirname, '/data/spells');
const spellFiles = fs.readdirSync(spellsPath).filter(file => file.endsWith('.json'));

for (const file of spellFiles) {
    const filePath = path.join(spellsPath, file);
    const spellss = require(filePath);
    spellPathFiles.push(filePath);
    spells.push(spellss.data/*.toJSON()*/);
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('spell')
		.setDescription('returns spell info!')
        .addStringOption(option => 
            option.setName('spell_name')
                .setDescription('The name of the spell to search for')
                .setRequired(true)
                .setAutocomplete(true)),

    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
		const choices = ['Fireball', 'Eldritch Blast'];
		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
    },

	async execute(interaction) {

        let result;
        let found = false;

        for (var i = 0;i<spellPathFiles.length;i++)
        {
            const {spell} = require(spellPathFiles[i]);
            for (var a=0;a<spell.length;a++)
            {
                //console.log(spell[a].name);
                if (spell[a].name.toLowerCase() == interaction.options.getString('spell_name').toLowerCase())
                {
                    result = spell[a];
                    found = true;
                    break;
                    //if (result.source==result.source.replace("UA","")){break;}
                }
            }
        }
        
        if (!found)
        {
            await interaction.reply(`Spell "${interaction.options.getString('spell_name')}" not found`);
            return;
        }
        /*
        let send = `Spell name: ${result.name} ` +
        `\nSpell Level: ${result.level} (${result.school})` +
        `\nRange: ${result.range.type} (${result.range.distance.amount} ft)`+
        `\nSpell description:\n`;
        for (var text in result.entries)
        {
            send = send + `${text}\n`;
        }*/

        let entries = tools.cleanEntries(result.entries);
        
        let school = getSpellClass(result.school);

        let range = cleanRange(result.range);

        let components = tools.cleanComponents(result.components);

        let castTime = `${result.time[0].number} ${result.time[0].unit}`
        
        let higherlevelentries = '';
        if (result.entriesHigherLevel!=null){higherlevelentries = cleanHigherLevels(result.entriesHigherLevel);}
        
        
        let duration = `[Error retrieving duration] test:${result.duration[0].type}`
        switch (result.duration[0].type)
        {
            case "instant":
                duration = "Instant"; 
            break;
            case "timed":
                if (result.duration[0].concentration){duration = `${result.duration[0].duration["amount"]} ${result.duration[0].duration["type"]} (Concentration)`;}
                else {duration = `${result.duration[0].duration["amount"]} ${result.duration[0].duration["type"]}`;}
            break;
            default: 
                duration = `There is no benefit to upcasting this spell`;
        }

        const spellEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`${result.name}`)
            .setDescription(`Level ${result.level} (${school}) spell`)

            //.setURL('https://discord.js.org/')
            //.setAuthor({ name: 'DarkStalker', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
            //.setThumbnail('https://i.imgur.com/AfFp7pu.png')
            .addFields(
                /*{ name: "Information", value: `**Duration:** ${duration}
                                               \n**Components:** ${components}
                                               \n**Range:** ${range}
                                               \n**Source:** ${result.source}
                                               \n**Description:** \n${entries} 
                                               ${higherlevelentries}` },*/

                { name: 'Duration:', value: `${duration}`, inline: true },
                //`${(result.components["v"]==true)?"V, ":""}${(result.components["s"]==true)?"S,":""}`
                { name: 'Components:', value: components, inline: true },
                {name: 'Range: ', value: `${range}`, inline: true},
                {name: 'Source: ', value: `${result.source}`, inline: true},
                {name: 'Casting Time: ', value: `${castTime}`, inline: true},
                { name: 'Description', value: `${entries} ${higherlevelentries}` },


                /*{ name: '\u200B', value: '\u200B' },
                { name: 'Inline field title', value: 'Value 2', inline: true },
                { name: 'Inline field title', value: 'Value 3', inline: true },*/
            )
            //.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
            //.setImage('https://i.imgur.com/AfFp7pu.png')
            .setTimestamp()
            .setFooter({ text: `I\'ll be better than avrae one day
                                \nKnown bugs: Charts, long spell descriptions\n`})


		await interaction.reply({embeds: [spellEmbed], ephemeral:false});
        
        
	},
};

function getSpellClass(char)
{
    switch (char)
    {
        case 'A':
            return "Abjuration"; 
        case 'V':
            return "Evocation"; 
        case 'C':
            return "Conjuration"; 
        case 'D':
            return "Divination"; 
        case 'N':
            return "Necromancy"; 
        case 'E':
            return "Enchantment";
        case 'I':
            return "Illusion";
        case 'T':
            return "Transmutation";
        default:
            return "[Error retrieving school]"; 
    }
}

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
    while (entrys != entrys.replace(`@scaledamage`, ""))
    {
        entrys = entrys.replace("@scaledamage ", "");
        //console.log('loop3');
    }
    return entrys;
}

function cleanRange(range)
{
    switch(range.type)
    {
        case "point":
            if(range.distance["type"]=='self'){return "Self"}
            return `${range.distance["amount"]} ${range.distance["type"]}`;
            break;
        
        default:
            return "Error";
    }
}

function cleanComponents(comp)
{
    var total = "";
    if(comp.v){total = total+"V";}
    if(comp.s){total = total+", S";}
    if(comp.m!=null){total = total+", M ("+ comp.m + ")";}
    return total;
}

function cleanHigherLevels(res)
{
    if(res==null){return '';}

    return `\n\n**At Higher Levels:**\n${tools.cleanEntries(res[0].entries)}`;
}

