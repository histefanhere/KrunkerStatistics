const Discord = require('discord.js');
const commando = require('discord.js-commando');
const { Krunker: Api, OrderBy, UserNotFoundError} = require("@fasetto/krunker.io")
const Krunker = new Api();

class krunkerStatsCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "krunker",
            aliases: ["get", "stats"],
            examples: ["krunker histefanhere", "krunker Username"],
            group: "krunker",
            memberName: "krunker",
            description: "Gets a krunker players statistics",
            details: "Use this command to quickly view your or anyones stats. See someone in game who's really good? Check them out with this command!",
            args: [
                {
                    key: "player",
                    label: 'player',
                    prompt: "please include a krunker username",
                    type: "string"
                }
            ],
            argsPromptLimit: 0,
        })
    }

    async run(message, args) {
        const response = message.channel.send(`${message.author} =>`, new Discord.RichEmbed({
            fields: [
            {
                name: `**${args.player}**:`,
                value: "*Please wait...*"
            }
            ]
        }));
        response.then(async (message_) => {
            try
            {
                const data = await Krunker.GetProfile(args.player);
                message_.edit(message_.content, new Discord.RichEmbed({
                    title: `**${args.player}**:`,
                    fields: [ {
                        name: "General:",
                        value: `**Level**: ${data.level}
                        **Clan**: ${data.clan}
                        **Score**: ${data.score}
                        **KR**: ${data.funds}`,
                        inline: true
                    }, {
                        name: "Games:",
                        value: `**Time**: ${data.playTime}
                        **Games**: ${data.totalGamesPlayed}
                        **Wins, Losses**: ${data.wins}, ${data.loses}
                        **W/L**: ${data.wl}`,
                        inline: true
                    }, {
                        name: "Stats:",
                        value: `**SPK:** ${data.spk}
                        **Wins**: ${data.wins}
                        **Loses**: ${data.loses}
                        **KDR**: ${data.kdr}`
                    }],
                    color: 0xea9920
                }));
            }
            catch (e)
            {
                if (e instanceof UserNotFoundError) {
                    message_.edit(message_.content, new Discord.RichEmbed({
                        fields: [
                        {
                            name: `**${args.player}**:`,
                            value: `*Player "${args.player}" not found!*`
                        }]
                    }));
                }
                else {
                    message_.edit(message_.content, new Discord.RichEmbed({
                        fields: [{
                            name: `**${args.player}**:`,
                            value: `*Error, Failed to reach Krunker Servers!*`
                        }]
                    }))
                    throw e;
                }
            }
        });
    }
}

module.exports = krunkerStatsCommand;