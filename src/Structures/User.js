const Discord = require("discord.js");

Discord.Structures.extend("User", DiscordUser => {

    class User extends DiscordUser {

        /**
         * Represents a user on Discord.
         */
        constructor(...props) {
            super(...props);
        }

        /**
         * If the current user is the bot owner
         * @type {boolean}
         * @readonly
         */
        get isOwner() {
            return this.id === this.client.owner;
        }

    }

    return User;

})