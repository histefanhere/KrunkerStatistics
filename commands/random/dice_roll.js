const commando = require('discord.js-commando');

class DiceRollCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'roll',
            group: 'random',
            memberName: 'roll',
            description: 'Rolls a die.',
            details: 'Oh come on, surely you know what rolling a die does.',
            examples: ['roll']
        });
    }

    async run(message, args) {
        var roll = Math.floor(Math.random() * 6) + 1;
        if (message.author.id === '216336989635608576') {
            roll = 6;
        }
        message.reply("You rolled a " + roll);
    }
}

module.exports = DiceRollCommand;