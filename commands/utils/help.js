const commando = require('discord.js-commando');
const Discord = require('discord.js');

class helpCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'help',
            group: 'utils',
            memberName: 'help',
            description: 'Show the help menu.',
            details: 'Do you _really_ need help for the help command?',
            args: [{
                key: 'commandName',
                label: 'commandName',
                default: 'helpMenu',
                prompt: 'won\'t this never be shown because the argument is optional? hmmm',
                type: 'string'
            }],
            examples: ['help', 'help krunker', 'help roll']
        });
    }

    async run(message, args) {
        const embed = new Discord.RichEmbed({
            title: "Help menu",
            fields: [],
            color: 0xef2828
        });

        if (!(args.commandName === 'helpMenu')) {
            // non help command here, need to show specific info of a command
            const groups = this.client.registry.groups.array();
            // We need to find the specific command in all the groups that the user is looking for
            for (let i = 0; i < groups.length; i++) {
                const group = groups[i].commands.array();
                for (let j = 0; j < group.length; j++) {
                    let command = group[j];
                    if ((args.commandName === command.name) || (command.aliases.indexOf(args.commandName) >= 0)) {
                        //console.log(command);

                        // All commands must have a description!
                        embed.setTitle(`**Help for ${command.name} command**:`)
                        embed.addField(`Description`, `${command.description}\n${command.details}`)

                        // 
                        let usage_output = `${this.client.commandPrefix}${command.name}`;
                        if (command.argsCollector != null) {
                            for (let k = 0; k < command.argsCollector.args.length; k++) {
                                let argument = command.argsCollector.args[k];
                                if (argument.default === null) {
                                    usage_output += ` <${argument.label}>`
                                }
                                else {
                                    usage_output += ` [${argument.label} = ${argument.default}]`
                                }
                            }
                        }
                        embed.addField(`Usage`, usage_output);

                        let examples_output = '';
                        for (let k = 0; k < command.examples.length; k++) {
                            examples_output += `${this.client.commandPrefix}${command.examples[k]},\n`
                        }
                        examples_output = examples_output.slice(0, -2);
                        embed.addField(`Examples`, examples_output, true);



                        if (command.aliases.length > 0) {
                            embed.addField(`Aliases`, `${command.aliases.join(', ')}`)
                        }
                        message.channel.send(`${message.author} =>`, embed);
                        return;
                    }
                }
            }

            // If code gets to here user specified a command that doesn't exist
            message.channel.send(`Sorry, but a \`${args.commandName}\` command doesn't exist! For help, do \`${this.client.commandPrefix}help\``);
        }
        else
        {
            // general help command, show all commands and categorize them by their group
            const groups = this.client.registry.groups.array();
            for (let i = 0; i < groups.length; i++) {
                //console.log(groups[i]);
                const group = groups[i].commands.array();
                let group_data = "";
                for (let j = 0; j < group.length; j++) {
                    let command = group[j];
                    console.log(command);
                    group_data += `**${command.name}** - *${command.description}*\n`;
                }
                embed.addField(`${groups[i].name} commands:`, group_data)
            }
            message.channel.send(`${message.author} =>`, embed);
        }
    }
}

module.exports = helpCommand;

// [ CommandGroup {                                                                                                                 
//     id: 'random',                                                                                                                
//     name: 'Random',                                                                                                              
//     commands: Collection [Map] { 'roll' => [DiceRollCommand] },                                                                  
//     guarded: false,                                                                                                              
//     _globalEnabled: true },                                                                                                      
//   CommandGroup {                                                                                                                 
//     id: 'krunker',                                                                                                               
//     name: 'Krunker',                                                                                                             
//     commands: Collection [Map] { 'krunker' => [krunkerStatsCommand] },                                                           
//     guarded: false,                                                                                                              
//     _globalEnabled: true },                                                                                                      
//   CommandGroup {                                                                                                                 
//     id: 'utils',                                                                                                                 
//     name: 'Utilities',                                                                                                           
//     commands: Collection [Map] { 'help' => [helpCommand] },                                                                      
//     guarded: false,                                                                                                              
//     _globalEnabled: true } ]
