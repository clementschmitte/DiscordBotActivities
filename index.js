const Discord = require('discord.js');
const cmdIndex = require('./src/cmd');
const utils = require('./src/utils');

let idPoll = {};

const client = new Discord.Client();
const cmdArray = {
	'sad': (message, args) => {
		return cmdIndex.cmdSad(message, args);
	},
	'justice': (message, args) => {
		return cmdIndex.cmdJustice(message, args);
	},
	'tg': (message, args) => {
		return cmdIndex.cmdTg(message, args);
	},
	'activity': (message, args) => {
		amongUsAsyncCmd(message, args)
		return message.delete()
	},
};

async function amongUsAsyncCmd(message, args) {
	let temp = idPoll
	const result = await cmdIndex.cmdTest(message, args, temp)
}

client.once('ready', () => {
	console.log('Ready');

	client.user.setPresence({
		status: 'online',
		activity: {
			name: '*h | Prêt à vous divertir.',
			type: 'PLAYING',
		},
	});
});

client.login('ODA1ODE1NDE3MzQzNTc0MDU2.YBgYFg.pS53NbZJ6WlU5v30TA9Lf1v9xG0');

client.on('message', (message) => {
	const prefix = '*';
	if (message.author.bot) return;
	if (!message.guild) return;
	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);

	if (message.content.startsWith(prefix) && cmdArray[args[0]] !== undefined) {
		cmdArray[args[0]](message, args);
	}
});

client.on('messageReactionAdd', function(reaction, user) {
	if (user.bot) return;
	if (idPoll === [] || idPoll[reaction.message.id] === undefined) return;
	if (reaction.emoji.name !== '✅' && reaction.emoji.name !== '❎' && reaction.emoji.name !== '🚮' && reaction.emoji.name !== '✔' && reaction.emoji.name !== '❌') return;
	
	let temp = idPoll
	utils.sendNewAmongUsEmbed(reaction, user, temp)
});