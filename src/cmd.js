/* eslint-disable indent */

const { MessageEmbed } = require("discord.js");

/* eslint-disable no-unused-vars */
function serverLog(message, cmd, content = null) {
	console.log(`${cmd}\t | from {${message.author.username}}` + (content === null ? '' : ` with content: ${content}`));
}


function cmdSad(message, args) {
	serverLog(message, 'Sad');
	message.channel.send('Je suis triste... :tired_face:');
	message.delete();
}

function cmdJustice(message, args) {
	serverLog(message, 'Justice');
	const roleColor = message.guild.me.displayHexColor;
	message.channel.send({
		embed: {
			description: 'Justice pour Zyed, Justice pour Bouna :scales:',
			color: `${roleColor}`,
		},
		files: [{
			attachment: './assets/test.png',
			name: 'test.png',
		}],
	});
	message.delete();
}

function cmdTg(message, args) {
	if (args.length > 1) {
		const msg = args.join(' ').slice(3);
		serverLog(message, 'Tg', msg);
		message.channel.send(`Ta gueule ${msg}.`, { tts: true });
		message.delete();
	} else {
    	const roleColor = message.guild.me.displayHexColor;
        message.channel.send({
            embed: {
                color: `${roleColor}`,
                description: '*tg [Votre texte]\n\nExemple:\n*tg Anchois ptn\n\t-> Ta gueule Anchois ptn.'
            }
        })
    }
}

async function cmdTest(message, args, idPoll) {
    if (args.length < 3) {
        const roleColor = message.guild.me.displayHexColor;
        message.channel.send({
            embed: {
                color: `${roleColor}`,
                description: '*activity [Votre activité] [Votre horaire]\n\nExemple:\n*activity amongus 20h30\n\t-> Among Us ce soir 20h30 ?'
            }
        })
        return;
    }
    const msgEmbed = new MessageEmbed()
                    .setColor('#c92914')
                    .setTitle(`${args[1]}`)
                    .addField(`Aujourd\'hui | ${args[2]}`, `1`)
                    .addField('Disponible :', `${message.author.username}`)
                    .addField('Non disponible(s) :', '-')
                    .setTimestamp()
                    .setFooter('Plannificateur d\'activités.', 'https://i.imgur.com/yceXbrZ.png');

    
    message.channel.send(`||<@&803314869788082226>||`, msgEmbed)
        .then((res) => {
            idPoll[res.id] = {
                dispo: [
                    message.author.username
                ],
                noDispo: [
                    '-'
                ],
                game: args[1],
                hour: args[2],
                delete: false,
                message: res
            }
            res.react('✅')
            res.react('❎')
            res.react('🚮')
            return idPoll
        })
}

async function checkReact(test, user) {
    const userReactions = test.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
    try {
        for (const reaction of userReactions.values()) {
            await reaction.users.remove(user.id);
        }
    } catch (error) {
        console.error('Failed to remove reactions.');
    }
}

module.exports = { cmdSad, cmdJustice, cmdTg, cmdTest };