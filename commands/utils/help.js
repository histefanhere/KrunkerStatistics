const commando = require('discord.js-commando');

class helpCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'help',
            group: 'utils',
            memberName: 'help',
            description: 'show this menu'
        });
    }

    async run(message, args) {
        // TODO: this help message. Can I get here all registered commands and groups?
        message.channel.send('lol, you ain\'t getting no help');
    }
}

module.exports = helpCommand;