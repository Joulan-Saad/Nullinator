const fs = require('node:fs');
const path = require('node:path');
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const tools = require('./utilities/utilities.js');
//console.log(typeof tools.cleanEntries); // => 'function'

const classPathFiles = [];
const classPath = path.join(__dirname, 'class');
const classFiles = fs.readdirSync(classPath).filter(file => file.endsWith('.json'));

for (const file of classFiles) {
    const filePath = path.join(classPath, file);
    const classess = require(filePath);
    classPathFiles.push(filePath);
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('classfeat')
		.setDescription('Display information about a class feature')
        .addStringOption(option => 
            option.setName('classfeat_name')
                  .setDescription('The name of the class feature to search for')
                  .setRequired(true)),


	async execute(interaction) {

        let result;
        let found = false;

        for (var i = 0;i<classPathFiles.length;i++)
        {
            //console.log(i);
            if (found){break;}
            const {classFeature} = require(classPathFiles[i]);
            for (var a=0;a<classFeature.length;a++)
            {
                if (classFeature[a].name.toLowerCase() === interaction.options.getString('classfeat_name').toLowerCase())
                {
                    result = classFeature[a];
                    found = true;
                    break;
                }
            }
            const {subclassFeature} = require(classPathFiles[i]);
            for (var b=0;b<subclassFeature.length;b++)
            {
                //console.log(subclassFeature.name);
                if (subclassFeature[b].name.toLowerCase() === interaction.options.getString('classfeat_name').toLowerCase())
                {
                    result = subclassFeature[b];
                    found = true;
                    break;
                }
            }

        }
        
        if (!found)
        {
            await interaction.reply(`Classfeat "${interaction.options.getString('classfeat_name')}" not found`);
            return;
        }

        let entries = tools.cleanEntries(result.entries);
        

        const featEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        //.setTitle(result.name)
        .addFields(
            { name: `Class:`, value: `${result.className}${result.subclassShortName==undefined?'':' (' + result.subclassShortName + ')'}`, inline:true},
            { name: `${result.name}:`, value: `${entries}`},

            /*{ name: `Stat bonus:`, value: `${statbonus}`},
            { name: `Skill proficiencies granted:`, value: `${(result.skillProficiencies!=undefined)?result.skillProficiencies:"None"}`},
            { name: 'Description', value: `${entries}`, inline: true },*/
            
            //{ name: 'Inline field title', value: 'Some value here', inline: true },
        )
        //.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
        .setTimestamp()
        .setFooter({text: "Known bugs: Features that are too long will return an error"});
        //.setFooter({ text: 'Some footer text here'})


		await interaction.reply({embeds: [featEmbed]});
	},
};

function cleanEntries(entry)
{
    var entrys = entry[0];
    for (var i = 1;i<entry.length;i++)
    {
        if(entry[i].type=="list") 
        {
            entrys = entrys.concat("\n",entrys);
            for (var a = 0;a<entry[i].items.length;a++)
            {entrys = entrys.concat("\n - ",entry[i].items[a]);}
        }
        else {entrys = entrys.concat("\n\n",entry[i]);}
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
    if(entrys.length>1024){return "Longer than the character limit";}
    return entrys;
}