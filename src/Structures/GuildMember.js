const Discord = require("discord.js");

Discord.Structures.extend("GuildMember", DiscordMember => {

    class GuildMember extends DiscordMember {

        /**
         * Represents a member of a guild on Discord.
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
            return this.user.id === this.client.owner;
        }

    }

    return GuildMember;

})