const Discord = require("discord.js");

Discord.Structures.extend("Guild", DiscordGuild => {
    
    class Guild extends DiscordGuild {

        /**
         * Represents a guild (or a server) on Discord.
         */
        constructor(...props) {
            super(...props);

            /**
             * The command prefix for this guild
             * @type {string}
             */
            this._commandsPrefix = this.client.prefix || "!";
        }

        /**
         * Returns current guild prefix
         * @type {string}
         * @readonly
         */
        get prefix() {
            return this._commandsPrefix;
        }

        /**
         * Sets guild prefix
         * @param {string} prefix The prefix to set
         */
        set prefix(prefix) {
            if (!prefix || typeof prefix !== "string") throw new Error(`Expected command prefix, received "${prefix}"!`);
            this._commandsPrefix = prefix;
        }

    }

    return Guild;

});