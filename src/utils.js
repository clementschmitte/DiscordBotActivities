const { MessageEmbed } = require("discord.js");

function removeFromArray(item, array) {
    var index = array.indexOf(item);
    if (index !== -1)
        array.splice(index, 1);
    return array
}

async function sendNewAmongUsEmbed(reaction, user, idPoll) {
    
    if (reaction.emoji.name === '✅') {
        console.log(`Dispo\t | from {${user.username}}`)
        if (idPoll[reaction.message.id].dispo.includes(user.username) === false) {
            idPoll[reaction.message.id].dispo = removeFromArray("-", idPoll[reaction.message.id].dispo)
            idPoll[reaction.message.id].dispo.push(user.username)
            if (idPoll[reaction.message.id].noDispo.includes(user.username) === true) {
                idPoll[reaction.message.id].noDispo = removeFromArray(user.username, idPoll[reaction.message.id].noDispo)
                if (idPoll[reaction.message.id].noDispo.length === 0)
                    idPoll[reaction.message.id].noDispo.push("-")
            }
        }
    } else if (reaction.emoji.name === '❎') {
        console.log(`NoDispo\t | from {${user.username}}`)
        if (idPoll[reaction.message.id].noDispo.includes(user.username) === false) {
            idPoll[reaction.message.id].noDispo = removeFromArray("-", idPoll[reaction.message.id].noDispo)
            idPoll[reaction.message.id].noDispo.push(user.username)
            if (idPoll[reaction.message.id].dispo.includes(user.username) === true) {
                idPoll[reaction.message.id].dispo = removeFromArray(user.username, idPoll[reaction.message.id].dispo)
                if (idPoll[reaction.message.id].dispo.length === 0)
                    idPoll[reaction.message.id].dispo.push("-")
            }
        }
    } else if (reaction.emoji.name === '🚮') {
        reaction.remove()
        await reaction.message.channel.send(`Voulez-vous vraiment supprimer l'activité ${idPoll[reaction.message.id].game} <@${user.id}> ?`)
            .then((res) => {
                res.react('✔')
                res.react('❌')
                idPoll[res.id] = {
                    delete: true,
                    idEmbed: reaction.message.id,
                    message: res,
                    idAuthor: user.id
                }
            })
        return idPoll
    } else if (reaction.emoji.name === '✔') {
        console.log(user)
        if (idPoll[reaction.message.id].delete === false || user.id !== idPoll[reaction.message.id].idAuthor) return;
        await idPoll[reaction.message.id].message.delete()
        await idPoll[idPoll[reaction.message.id].idEmbed].message.delete()
        delete idPoll[idPoll[reaction.message.id].idEmbed]
        delete idPoll[reaction.message.id]
        return idPoll
    } else if (reaction.emoji.name === '❌') {
        if (idPoll[reaction.message.id].delete === false || user.id !== idPoll[reaction.message.id].idAuthor) return;
        idPoll[idPoll[reaction.message.id].idEmbed].message.react('🚮')
        await idPoll[reaction.message.id].message.delete()
        delete idPoll[reaction.message.id]
        return idPoll
    }

    reaction.message.delete()
    let there = idPoll[reaction.message.id].dispo.length

    if (idPoll[reaction.message.id].dispo.length === 1 && idPoll[reaction.message.id].dispo[0] === "-")
        there = 0

    
    const msgEmbed = new MessageEmbed()
                    .setColor(idPoll[reaction.message.id].dispo.length >= 10 ? '#13d162' : '#c92914')
                    .setTitle(`${idPoll[reaction.message.id].game}`)
                    .addField(`Aujourd\'hui | ${idPoll[reaction.message.id].hour}`, `${there}`)
                    .addField('Disponible(s) :', idPoll[reaction.message.id].dispo)
                    .addField('Non disponible(s) :', idPoll[reaction.message.id].noDispo)
                    .setTimestamp()
                    .setFooter('Plannification partie among us', 'https://i.imgur.com/yceXbrZ.png');
    reaction.message.channel.send(msgEmbed)
        .then((res) => {
            idPoll[res.id] = idPoll[reaction.message.id]
            idPoll[res.id].message = res
            delete idPoll[reaction.message.id]
            res.react('✅')
            res.react('❎')
            res.react('🚮')
            return idPoll
        })
}

module.exports = { sendNewAmongUsEmbed };
