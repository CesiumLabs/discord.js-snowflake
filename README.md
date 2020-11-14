# Discord.js Snowflake
Simple **[discord.js](https://npmjs.com/package/discord.js)** framework.

> Note: This package is under development. Do not use it in production!

# Installing

```sh
$ npm install discord.js-snowflake
```

# Example

## index.js

```js
const Discord = require("discord.js-snowflake");
const client = new Discord.Client({
    defaultPrefix: "!",
    ignoreBots: true,
    commandsDir: __dirname + "/commands",
    eventsDir: __dirname + "/events",
    handleCommands: true, // set this to false if you want to handle it manually. If true, it runs command handler in every msg
    loadDefaultCommands: true,
    owner: "YOUR_DISCORD_ID",
    logErrors: true,
    commandErrorMessage: "❌ | Something went wrong while running command **{{command}}**\n```xl\n{{error}}\n```",
    commandNotFound: "❌ | Command **{{command}}** not found!"
});
```

## events/ready.js

```js
class Ready {

    constructor(client) {
        this.client = client;
    }

    execute() {
        console.log("Bot is online!");
    }

}

module.exports = Ready;
```

## commands/avatar.js

```js
const { Command, MessageEmbed } = require("discord.js-snowflake");

class Avatar extends Command {

    constructor(client) {
        super(client, {
            name: "avatar",
            aliases: ["av"],
            description: "Shows avatar of the user"
        });
    }

    async execute(message, args) {
        const user = message.mentions.users.first() || message.author;
        const avatar = user.displayAvatarURL({ dynamic: true, size: 2048 });

        const embed = new MessageEmbed()
            .setTitle(`Avatar of ${user.tag}`)
            .setColor("RANDOM")
            .setImage(avatar);

        return message.channel.send(embed);
    }

}

module.exports = Avatar;
```

# Default Commands Available
- ping
- eval

# Links
### **[Discord Server](https://discord.gg/2SUybzb)**

## © 2020 - **[Snowflake Studio ❄](https://snowflakedev.xyz)**