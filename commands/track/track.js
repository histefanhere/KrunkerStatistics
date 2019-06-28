const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require('fs');
const { Krunker: Api, OrderBy, UserNotFoundError} = require("@fasetto/krunker.io")
const Krunker = new Api();

class trackCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "track",
            examples: ["track histefanhere", "track Username"],
            group: "track",
            memberName: "track",
            description: "Begin tracking a krunker player.",
            details: "Use this command to tell the bot to start monitoring the krunker player passed to it. Limit to 1 per discord user.",
            args: [{
                key: "player",
                label: "player",
                prompt: "Please include a Krunker username.",
                type: "string"
            }],
            argsPromptLimit: 0
        })
    }

    async run(message, args) {
        function genEmbed() {
            return new Discord.RichEmbed({
                fields: [
                {
                    name: `Tracking of "**${args.player}**":`,
                    value: values.join("\n")
                }]
            });
        }
        let values = [];
        values.push("***Checking if Discord user is tracking a player...***");

        const response = message.channel.send(`${message.author} =>`, genEmbed());
        response.then(async (m) => {
            //try
            //{
                // First we must check if the discord player is already tracking a player.
                let filename = `${__dirname}\\..\\..\\playerdata\\users.json`;
                fs.readFile(filename, 'utf8', async (err, contents) => {
                    if (err) {
                        console.log("Whoops! Error in reading playerdata\\users.json, what happenned?");
                        throw err;
                    }
                    let users = JSON.parse(contents);
                    if (users.discordID.includes(`${message.author}`)) {
                        // discord user already has a registered discord player

                        // This code is not needed here, it will be used in a different command
                        let userI = users.discordID.indexOf(`${message.author}`);
                        let player = users.krunkerID[users.playerIndex[userI]];

                        values.pop();
                        values.push(`*Discord user is already tracking player* "${player.name}", *Aborted!*`);
                        m.edit(m.content, genEmbed());
                    }
                    else {
                        // discord user does not have a registered krunker player - we're good!

                        values.pop();
                        values.push(`*Discord user does not have registered Krunker player*`,
                            `***Finding Krunker player...***`);
                        m.edit(m.content, genEmbed());

                        try
                        {
                            const data = await Krunker.GetProfile(args.player);
                            //const data = {id: "12345", name:"histefanhere"};

                            values.pop();
                            values.push(`*Found Krunker player* "${data.name}"`,
                                `***Adding data to database...***`);
                            m.edit(m.content, genEmbed());

                            users.discordID.push(`${message.author}`);
                            let playerIndex = users.krunkerID.indexOf(data.id);

                            if (playerIndex >= 0) {
                                // Krunker player is already registered
                                users.playerIndex.push(playerIndex);

                                filename = `${__dirname}\\..\\..\\playerdata\\users.json`;
                                fs.writeFile(filename, JSON.stringify(users), (err) => {
                                    if (err) throw err;

                                    values.pop();
                                    values.push(`*Added data to database*`,
                                        `Successfully completed tracking setup!`);
                                    m.edit(m.content, genEmbed());
                                });
                            }
                            else {
                                // Krunker player is not yet registered
                                users.krunkerID.push(data.id);
                                users.krunkerName.push(data.name);
                                users.playerIndex.push(users.krunkerID.indexOf(data.id));

                                filename = `${__dirname}\\..\\..\\playerdata\\users.json`
                                fs.writeFile(filename, JSON.stringify(users), (err) => {
                                    if (err) throw err;

                                    filename = `${__dirname}\\..\\..\\playerdata\\${data.id}.json`;
                                    fs.writeFile(filename, "{}", (err) => {
                                        if (err) throw err;
                                        values.pop();
                                        values.push(`*Added data to database*`,
                                            `Successfully completed tracking setup!`);
                                        m.edit(m.content, genEmbed());
                                    });
                                });
                            }
                        }
                        catch (e) {
                            if (e instanceof UserNotFoundError) {
                                values.pop();
                                values.push(`Failed to find player "${args.player}"! Aborting Operation.`);
                                m.edit(m.content, genEmbed());
                            }
                            else {
                                values.pop();
                                values.push(`Failed to reach Krunker Servers! Please try again later.`);
                                m.edit(m.content, genEmbed());
                                throw e;
                            }
                        }
                    }
                })
                // let filename = `${__dirname}\\..\\..\\playerdata\\${data.id}.json`;
                // fs.readFile(filename, 'utf8', (err, contents) => {
                //     if (err) {
                //         // File does not exist
                //         fs.writeFile(filename, `{"discords":["${message.author}"],"data":${JSON.stringify(data)}`, (err) => {
                //             if (err) console.log(err);
                //             console.log("Successfully wrote to file");
                //         });
                //     }
                //     else {
                //         // File exists!
                //     };
                // });
        })
    }
}

module.exports = trackCommand;