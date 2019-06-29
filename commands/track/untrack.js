const Discord = require('Discord.js');
const commando = require('discord.js-commando');
const askAPI = require('../../ask.js');
const question = new askAPI();

class untrackCommand extends commando.Command {
    constructor(client) {
        question.assignClient(client);
        super(client, {
            name: "untrack",
            examples: ["untrack"],
            group: "track",
            memberName: "untrack",
            description: "Stop tracking a player.",
            details: "Will end the association between a Discord user and a Krunker Player, should one exist."
        })
    }

    async run(message, args) {
        const response = await question.ask(message, 'Are you sure you want to untrack?',{
            "👍": {
                response: "accept",
                colour: 0x20f020
            },
            "👎": {
                response: "decline",
                colour: 0xf02020
            }
        });
        console.log(response);

    }
}
//client.on('messageReactionAdd' (reaction, user) => {
//    console.log('detected a reaction!')
//});

// async function ask(question, answers, timeout=10) {
//}
module.exports = untrackCommand;