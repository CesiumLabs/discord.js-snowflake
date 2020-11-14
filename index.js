module.exports = {
    ...require("discord.js"),
    Client: require("./src/Client"),
    Command: require("./src/Command/Command"),
    DefaultCommands: {
        Ping: require("./src/DefaultCommands/ping")
    },
    Guild: require("./src/Structures/Guild"),
    GuildMember: require("./src/Structures/GuildMember"),
    Message: require("./src/Structures/Message"),
    MessagePrompt: require("./src/PromptManager/MessagePrompt"),
    User: require("./src/Structures/User"),
    Utils: require("./src/Utils"),
    version: require("./package.json").version
};