const Command = require("../Command/Command");

class Ping extends Command {

    constructor(client) {
        super(client, {
            name: "ping",
            description: "Shows bot ping",
            aliases: ["pong", "latency"],
            guildOnly: false,
            ownerOnly: false,
            permissions: []
        });

        this.setCategory("General");
        this.setLocation(__dirname + "/ping.js");
    }

    async execute(message, args) {

        const ping = this.client.ws.ping;
        const start = message.createdTimestamp;

        return message.channel.send("Pinging...")
            .then(m => {
                const end = Date.now() - start;
                m.edit(`Pong!\nMessage Latency: \`${end}ms\`\nBot Latency: \`${Math.round(ping)}ms\``);
            });
    }

}

module.exports = Ping;