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

// Get the discord bot token from token.json and start the bot.
try
{
    var token = require("./token.json").token;
    //console.log(token);
    bot.login(token);
}
catch (e)
{
    throw e;
}
