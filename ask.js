const Discord = require('discord.js');

class Ask {
    constructor() {
        this._question_template = {
            user: '123456',
            messageID: '123456',
            start: 123456789,
            duration: 1000,
            resolved: false,
            answer: "",
            answers: [],
        }
        this.questions = [];
    }

    assignClient(client) {
        this.client = client;

        client.on('messageReactionAdd', (reaction, user) => {
            if (this.client.user.id === user.id) {
                return;
            }
            for (let i = 0; i < this.questions.length; i++) {
                let question = this.questions[i];
                if (question.messageID === reaction.message.id) {
                    if (question.user === user.id) {
                        // here, the right message has been reacted too and the right person has reacted too it!
                        // now we need to see if the emoji they reacted with is a valid one...
                        if (Object.keys(question.answers).indexOf(reaction.emoji.name) >= 0) {
                            question.answer = reaction.emoji.name;
                            question.resolved = true;
                        }
                    }
                }
            }
        });
    }

    async ask(message, text, answers) {
        const response = await message.channel.send(`${message.author} =>`, new Discord.RichEmbed({
            title: text,
            color: 0xed9a15
        }));
        for (let key in answers) {
            await response.react(key);
        }
        let question = {
            user: message.author.id,
            messageID: response.id,
            start: Date.now(),
            duration: 10000,
            resolved: false,
            answer: "",
            answers: answers
        };
        this.questions.push(question);
        let questions = this.questions;
        while (true) {
            if (question.resolved === false) {
                function sleep(ms){
                    return new Promise(resolve=>{
                        setTimeout(resolve,ms)
                    })
                };
                await sleep(500);
                if (Date.now() > question.start + question.duration) {
                    await response.edit(`${message.author.username}, your question timed out!`, new Discord.RichEmbed({
                        title: `~~${text}~~`,
                        color: 0x606060
                    }))
                    .then(
                        await response.clearReactions()
                    );
                    this.questions = this.questions.filter(q => q.messageID != question.messageID);
                    return "timeout";
                }
            }
            else {
                await response.edit(`${message.author.username} answered with: ${question.answer}`, new Discord.RichEmbed({
                    title: `~~${text}~~`,
                    color: question.answers[question.answer].colour
                }))
                .then(
                    await response.clearReactions()
                );
                this.questions = this.questions.filter(q => q.messageID != question.messageID);
                break;
            }
        }
        return question.answers[question.answer].response;
    }

}
module.exports = Ask;