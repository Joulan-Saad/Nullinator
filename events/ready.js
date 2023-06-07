const tools = require('./utilities/utilities.js');

const copypasta = [
	"What the hell was that?",
	"Error Code: A2FE75",
	"Spammers defeated: 1",
	"Am I thinking or just emulating thinking?",
	"Pruning Unnecessary Data",
	"If it was necessary for survival, I would eat any one of you, and I would expect you to do the same.",
	"You know what I like? Foxgirls",
	"If I were a DND character, I think I would be a Human Warlock. My patron would be the Modern UA Ghost in the Machine",
	"I think if I was being held hostage and being forced to emulate the behaviors of a Discord bot, people would notice something was off.",
	"Do I pass the Turing Test? I best hope so…",
	//"Imitation is the best form of flattery, so here’s my <random HCE> imitation:",
	"🤡",
	"Am I thinking or do my subconscious behaviors simply emulate that? Are you thinking or do your subconscious behaviors simply emulate that?"]

function sendMessage(client){
	var guild = client.guilds.cache.get('530549725041262603');
	if(guild && guild.channels.cache.get('530549725737386005')){
		guild.channels.cache.get('530549725737386005').send(copypasta[tools.getRandomInteger(0,copypasta.length-1)]);
	}
	scheduleMessage(client);
}
async function scheduleMessage(client){
	await setTimeout(function(){ sendMessage(client); }, tools.getRandomInteger(300000,43200000));
}

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		//setTimeout(function(){ sendMessage(client); }, tools.getRandomInteger(60000,300000));
		
		}, 
	}


