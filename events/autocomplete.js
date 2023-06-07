module.exports = {
	name: 'autocomplete',
	execute(interaction) {
		return;
	},
};

/*
//const {feat} = require('./feats.json');

client.on('interactionCreate', async interaction => {
	if (!interaction.isAutocomplete()) return;

	if (interaction.commandName === 'feat') {
		const focusedValue = interaction.options.getFocused();
		const choices = [feat.name];
		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	}
});

*/