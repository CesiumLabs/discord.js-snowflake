const Command = require("../Command/Command");

class Ping extends Command {

    constructor(client) {
        super(client, {
            name: "eval",
            description: "Evaluates arbitrary JavaScript code",
            aliases: ["ev"],
            guildOnly: true,
            ownerOnly: true,
            permissions: []
        });

        this.setCategory("Developer");
        this.setLocation(__dirname + "/eval.js");
    }

    async execute(message, args) {
        const code = args.join(" ");
        if (!code) return message.channel.send("❌ | Please specify the code to eval!");

        try {
            let ev = eval(code);

            ev = this.cleanText(ev);
            return message.channel.send(ev, { code: "xl", split: true });
        } catch(e) {
            return message.channel.send(`${e}`, { code: "xl", split: true });
        }
    }

    cleanText(text) {
        if (typeof text !== "string") text = require("util").inspect(text, { depth: 1 });
        text = text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203))
            .replace(new RegExp(this.client.token, "g"), "XXXXXXXXXXXXXXXXXXXXX.XXXXXXXXXXX.XXXXXXXXXXXXX");
        return text;
    }

}

module.exports = Ping;