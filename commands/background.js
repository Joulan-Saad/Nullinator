const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const path = require('node:path');
const {background} = require('./data/backgrounds.json');

const tools = require(path.join(__dirname, '../util.js'));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('background')
		.setDescription('Display information about a background')
        .addStringOption(option => 
            option.setName('background_name')
                  .setDescription('The name of the background to search for')
                  .setRequired(true)),


	async execute(interaction) {

        let result;
        let found = false;
        for (var i=0;i<background.length;i++)
        {
            if (background[i].name.toLowerCase() == interaction.options.getString('background_name').toLowerCase())
            {
                result = background[i];
                found = true;
                break;
            }
        }
        if (!found)
        {
            await interaction.reply(`Background "${interaction.options.getString('background_name')}" not found`);
            return;
        }

        //Skills, languages/tools/vehicles, equipment, Feature

        //TODO: add a bunch of field objects into an array and use smth to detect whether each object needs to be added.

        let skills = result.skillProficiencies!=undefined ? displaySkills(result.skillProficiencies[0]):"Error or no skill proficiencies"

        let languages = result.languageProficiencies!=undefined ? result.languageProficiencies:"Error or no language proficiencies"

        let equipment = result.startingEquipment!=undefined ? displayEquipment(result.startingEquipment):"Error or no starting equipment"

        let feature = result.entries!=undefined ? result.entries:"Error or no feature"

        //console.log(skills)
        //console.log(languages)
        //console.log(equipment)
        //console.log(feature)

        const backgroundEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(result.name)
        .addFields(
            { name: `Skills:`, value: `${skills}`},
            { name: `Language:`, value: `${languages}`},
            { name: `Equipment:`, value: `${equipment}`},
            { name: 'Feature:', value: `${feature}`, inline: true },
            
            //{ name: 'Inline field title', value: 'Some value here', inline: true },
        )
        //.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
        .setTimestamp()
        .setFooter({text: 'This is a WIP'});
        //.setFooter({ text: 'Some footer text here'})


		await interaction.reply({embeds: [backgroundEmbed]});
	},
};


//[ { insight: true, religion: true } ]
function displaySkills(skills)
{
    let skillsList = []
    if(skills.acrobatics){skillsList.push("Acrobatics")}
    if(skills.arcana){skillsList.push("Arcana")}
    if(skills.animal_handling){skillsList.push("Animal Handling")}
    if(skills.athletics){skillsList.push("Athletics")}
    if(skills.deception){skillsList.push("Deception")}
    if(skills.history){skillsList.push("History")}
    if(skills.insight){skillsList.push("Insight")}
    if(skills.intimidation){skillsList.push("Intimidation")}
    if(skills.investigation){skillsList.push("Investigation")}
    if(skills.medicine){skillsList.push("Medicine")}
    if(skills.nature){skillsList.push("Nature")}
    if(skills.perception){skillsList.push("Perception")}
    if(skills.performance){skillsList.push("Performance")}
    if(skills.persuasion){skillsList.push("Persuasion")}
    if(skills.religion){skillsList.push("Religion")}
    if(skills.sleight_of_hand){skillsList.push("Sleight of Hand")}
    if(skills.stealth){skillsList.push("Stealth")}
    if(skills.survival){skillsList.push("Survival")}
    return skillsList;
}

function displayEquipment(equipment)
{
    let equipmentList = []

    //console.log(equipment[0])
    for (numList in equipment)
    {
        for (item in equipment[numList])
        {
            console.log(equipment[numList][item])
        }
    }
    return ("WIP")
}

/*----------------------------------------------------------------

[ 'Insight', 'Religion' ] DONE

[ { anyStandard: 2 } ]

[
  {
    _: [ [Object], [Object], [Object], 'common clothes|phb', [Object] ]
  },
  { a: [ [Object] ], b: [ [Object] ] }
]
[
    {"_": [{"item": "holy symbol|phb","displayName": "holy symbol (a gift to you when you entered the priesthood)"},
            {"special": "sticks of incense","quantity": 5},
            {"special": "vestments"},
            "common clothes|phb",
            {"item": "pouch|phb","containsValue": 1500}]
    },
    {
        "a": [{"item": "book|phb","displayName": "prayer book"}],
        "b": [{"special": "prayer wheel"}]
    }
]



[
  {
    type: 'list',
    style: 'list-hang-notitle',
    items: [ [Object], [Object], [Object] ]
  },
  {
    name: 'Feature: Shelter of the Faithful',
    type: 'entries',
    entries: [
      'As an acolyte, you command the respect of those who share your faith, and you can perform the religious ceremonies of your deity. You and your adventuring companions can expect to receive free healing and care at a temple, shrine, or other established presence of your faith, though you must provide any material components needed for spells. Those who share your religion will support you (but only you) at a modest lifestyle.',
      'You might also have ties to a specific temple dedicated to your chosen deity or pantheon, and you have a residence there. This could be the temple where you used to serve, if you remain on good terms with it, or a temple where you have found a new home. While near your temple, you can call upon the priests for assistance, provided the assistance you ask for is not hazardous and you remain in good standing with your temple.'
    ],
    data: { isFeature: true }
  },
  {
    name: 'Suggested Characteristics',
    type: 'entries',
    entries: [
      'Acolytes are shaped by their experience in temples or other religious communities. Their study of the history and tenets of their faith and their relationships to temples, shrines, or hierarchies affect their mannerisms and ideals. Their flaws might be some hidden hypocrisy or heretical idea, or an ideal or bond taken to an extreme.',
      [Object],
      [Object],
      [Object],
      [Object]
    ]
  }
]


*/
