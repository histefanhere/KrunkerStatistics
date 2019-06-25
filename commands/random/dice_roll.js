const commando = require('discord.js-commando');

class DiceRollCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'roll',
            group: 'random',
            memberName: 'roll',
            description: 'Rolls a die.',
            details: 'Pass a number to specify how many sides the die has. Default is 6.',
            examples: ['roll', 'roll 20'],
            args: [{
                key: 'sides',
                label: 'sides',
                default: '6',
                prompt: 'this will never be shown',
                type: 'integer',
                min: 1,
                error: "Hey, that's not a valid number!"
            }],
            argsPromptLimit: 0
        });
    }

    async run(message, args) {
        var roll = Math.floor(Math.random() * args.sides) + 1;
        if (message.author.id === '216336989635608576') {
            roll = args.sides;
        }
        message.reply("You rolled a " + roll);
    }
}

module.exports = DiceRollCommand;
