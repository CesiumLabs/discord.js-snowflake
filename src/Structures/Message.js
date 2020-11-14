const Discord = require("discord.js");

Discord.Structures.extend("Message", DiscordMessage => {

    class Message extends DiscordMessage {

        /**
         * Represents a message on Discord.
         */
        constructor(...props) {
            super(...props);

            if (!!this.client.handleCommands) this.handleCommands();
        }

        /**
         * Handles the command
         * @returns {Promise<boolean|Message|undefined>}
         */
        async handleCommands() {
            if (this.author.bot && !!this.client.ignoreBots) return;
            const prefix = this.guild ? (this.guild.prefix || "!") : "!";

            // prefix manager
            const pref = () => {
                if (this.content.startsWith(prefix)) return prefix;
            }

            if (!pref()) return;

            const { args, command } = this._getArgs(pref());

            this.cleanArgs = this._getCleanArgs(pref()).args;
            this.args = args;
            this.commandName = command;

            const cmd = this.client.getCommand(command);
            if (!cmd) {
                this.client.emit("commandNotFound", this);

                if (!this.client.commandNotFound || typeof this.client.commandNotFound !== "string") return;
                const m = this.client.commandNotFound
                    .replace(/{{command}}/g, command);
                
                return this.channel.send(m);
            };

            if (cmd.help.guildOnly && this.channel.type === "dm") {
                const err = new Error("Cannot access guildOnly command in DMs");
                if (!!this.client.commandErrorMessage && typeof this.client.commandErrorMessage === "string") {
                    const m = this.client.commandErrorMessage
                        .replace(/{{error}}/g, `${err}`)
                        .replace(/{{command}}/g, command);
                    this.channel.send(m);
                }
                if (this.client.logErrors) console.error(err);
                return this.client.emit("commandError", err, this);
            }

            // check permissions
            if (this.guild && !this.member.hasPermission(cmd.help.permissions)) {
                const err = new Error("Member does not have enough permissions to execute this command!");
                if (!!this.client.commandErrorMessage && typeof this.client.commandErrorMessage === "string") {
                    const m = this.client.commandErrorMessage
                        .replace(/{{error}}/g, `${err}`)
                        .replace(/{{command}}/g, command);
                    this.channel.send(m);
                }
                if (this.client.logErrors) console.error(err);
                return this.client.emit("commandError", err, this);
            }

            if (!!cmd.help.ownerOnly && this.author.id !== this.client.owner) {
                const err = new Error("Member is not a bot owner to execute this command!");
                if (!!this.client.commandErrorMessage && typeof this.client.commandErrorMessage === "string") {
                    const m = this.client.commandErrorMessage
                        .replace(/{{error}}/g, `${err}`)
                        .replace(/{{command}}/g, command);
                    this.channel.send(m);
                }
                if (this.client.logErrors) console.error(err);
                return this.client.emit("commandError", err, this);
            }

            try {
                await cmd.execute(this, this.args);
            } catch(e) {
                if (!!this.client.commandErrorMessage && typeof this.client.commandErrorMessage === "string") {
                    const m = this.client.commandErrorMessage
                        .replace(/{{error}}/g, `${e}`)
                        .replace(/{{command}}/g, command);
                    this.channel.send(m);
                }
                if (this.client.logErrors) console.error(e);
                this.client.emit("commandError", e, this);
            }
        }

        /**
         * @typedef {object} CommandArgs
         * @property {?string} command The command
         * @property {string[]|[]} args The args
         */

        /**
         * Returns command args
         * @param {string} prefix The commands prefix
         * @returns {CommandArgs}
         * @private
         */
        _getArgs(prefix) {
            if (!prefix || typeof prefix !== "string") return {
                command: null,
                args: []
            };
            const chunk = this.content.slice(prefix.length).trim().split(/ +/);
            return {
                command: chunk.shift().toLowerCase(),
                args: chunk
            };
        }

        /**
         * Returns command args (cleaned)
         * @param {string} prefix The commands prefix
         * @returns {CommandArgs}
         * @private
         */
        _getCleanArgs(prefix) {
            if (!prefix || typeof prefix !== "string") return {
                command: null,
                args: []
            };
            const chunk = this.cleanContent.slice(prefix.length).trim().split(/ +/);
            return {
                command: chunk.shift().toLowerCase(),
                args: chunk
            };
        }

    }

    return Message;

});