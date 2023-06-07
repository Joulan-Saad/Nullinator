const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls some dice')
        .addIntegerOption((option) => 
            option.setName('number') 
                  .setDescription('Number of dice to roll')
                  .setRequired(true)
                  //.setType(4)
                  //.setMinValue(1)
                  )
        .addIntegerOption(option => 
            option.setName('dice')
                  .setDescription('How many sides each dice has')
                  .setRequired(true))
        .addIntegerOption(option => 
            option.setName('mod')
                  .setDescription('The modifier to add to the roll')
                  .setRequired(false)),

	async execute(interaction) {
        const input1 = interaction.options.getInteger('number');
        const input2 = interaction.options.getInteger('dice');
        var total=0;
        var rolls = [];
        for (var i = input1-1;i>=0;i--)
        {
            var random = getRandomInteger(1,input2);
            total+=random;
            rolls[i] = random;
        }
        total += (interaction.options.getInteger('mod')==null)?0:interaction.options.getInteger('mod');
		await interaction.reply({content: input1 + 'd' + input2 + `${(interaction.options.getInteger('mod')==null)?('(' + rolls + ')'):(' ('+ rolls + ')' + ' + ' + interaction.options.getInteger('mod'))} = ` + total, ephemeral: false});
	},
};

function getRandomInteger(lower, upper)
{
	//Returns a random integer within the upper and lower limit provided by the variables lower and upper
	
	//R = parseInt(rnd * (upper - (lower-1)) + lower)
	var multiplier = upper - (lower - 1);
	var rnd = parseInt(Math.random() * multiplier) + lower;
	
	return rnd;
}
/* 
var num = 1;
var dice = 20;
var total = 0;
num = parseInt(args[0]);
dice = parseInt(args[1]); 
if (isNaN(num) || num==null || num=='' || isNaN(dice) || dice==null || dice=='') {msg.channel.send("Not a number or inappropriate input"); return;}
if (dice==0){msg.channel.send("Fuck off with that 0 dice bullshit. I ain't out here tryina break reality."); return;}
if (num>10 && msg.author.id!="429018772742078494" && msg.author.id!="175397180897492992")
{
    msg.reply("Big number, big stinky. Do not attempt to roll more than 10 dice"); return;
}
if (args[2]!=NaN && args[2]!=null){var modifier = args[2];}
for (var i = 0; i<num;i++) {
    var rolled = getRandomInteger(1,dice);
    
    if (num>1 && (args[2]!=NaN && args[2]!=null)){
        if (dice==20 && rolled==20){msg.channel.send("Rolled: ".concat("d",dice,"(**",rolled," CRIT!**)","+",modifier," - Result: ",(parseInt(rolled)+parseInt(modifier)).toString()));}
        else {msg.channel.send("Rolled: ".concat("d",dice,"(",rolled,")","+",modifier," - Result: ",(parseInt(rolled)+parseInt(modifier)).toString()));}
        total+=parseInt(rolled)+parseInt(modifier);
    }
    else if (num>1){
        if (dice==20 && rolled==20){msg.channel.send("Rolled: ".concat("d",dice.toString(),"(**",rolled," CRIT!**) - Result: ",rolled.toString()));}
        else {msg.channel.send("Rolled: ".concat("d",dice.toString()," - Result: ",rolled.toString()));}
        total+=parseInt(rolled);
    }
    else if ((args[2]!=NaN && args[2]!=null)){total+=parseInt(rolled)+parseInt(modifier);}
    else {total+=parseInt(rolled);}
}
if (num==1 && dice == 20 && total==(20+parseInt(modifier)) && args[2]!=NaN && args[2]!=null){msg.channel.send("Rolled: ".concat(num.toString()," d",dice,"+",modifier.toString()," - Total: **",total.toString()," CRIT!**"));}
else if (num==1 && dice == 20 && total==(20+parseInt(modifier))){msg.channel.send("Rolled ".concat(num.toString(),"d",dice.toString()," = ","**",total.toString()," CRIT!**"));}
else if (args[2]!=NaN && args[2]!=null){msg.channel.send("Rolled: ".concat(num.toString()," d",dice,"+",modifier.toString()," - Total: ",total.toString()));}
else {msg.channel.send("Rolled ".concat(num.toString(),"d",dice.toString()," = ",total.toString()));}
*/