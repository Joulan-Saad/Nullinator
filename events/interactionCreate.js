module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		console.log(`${interaction.user.tag} in #${interaction.channel.name}(${interaction.guild.name}) triggered an interaction(${interaction}).`);

		//console.log(`Interaction used: ${interaction.command}`);
		//console.log(interaction);
		
	},
	
};