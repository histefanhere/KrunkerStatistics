const Discord = require('discord.js');
const commando = require('discord.js-commando');

// Basically the same as Discord.Client() but has many more useful command features
const bot = new commando.Client();

bot.commandPrefix = ">";

bot.registry.registerGroup('random', 'Random')
    .registerGroup('krunker', 'Krunker')
    .registerGroup('utils', 'Utility');

// I want to make my own help commands, not use yours!
//bot.registry.registerDefaults();
bot.registry.registerDefaultTypes();
bot.registry.registerCommandsIn(__dirname + "/commands");

bot.on('ready', () => {
    console.log('Bot started!');
    bot.user.setPresence({
        game: {
            name: '>help',
            type: 'LISTENING'
        },
        status: 'online'
    });
})

// Get the discord bot token from token.txt and start the bot.
var fs = require('fs');
fs.readFile('token.txt', 'utf8', function(error, data) {
    if (error) throw error;
    console.log(data);
    bot.login(data);
});