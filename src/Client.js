const Discord = require("discord.js");
const fs = require("fs");

// <LoadStructures>
require("./Structures/Guild");
require("./Structures/GuildMember");
require("./Structures/User");
require("./Structures/Message");
// </LoadStructures>

/**
 * @typedef {object} SnowflakeClientOptions
 * @property {string} commandErrorMessage Command error message
 * @property {string} commandNotFound Command not found message
 * @property {string} defaultPrefix Default commands prefix
 * @property {boolean} mentionPrefix If it should set client mentions as command prefix
 * @property {string} owner The bot owner id(s)
 * @property {string} commandsDir Command dir name
 * @property {string} eventsDir Events dir name
 * @property {boolean} loadDefaultCommands If it should load default commands
 * @property {boolean} handleCommands If it should handle commands by default
 * @property {boolean} ignoreBots If it should ignore bots
 * @property {boolean} logErrors If it should log errors
 */

/**
 * Snowflake Client
 * @license GPL-3.0
 * @author Snowflake Studio ❄
 */
class SnowflakeClient extends Discord.Client {

    /**
     * SnowflakeClient Constructor
     * @param {SnowflakeClientOptions} snowflakeClientOptions Snowflake Client Options
     * @param {ClientOptions} clientOptions Discord client options
     */
    constructor(snowflakeClientOptions = {}, clientOptions = {}) {
        super(clientOptions);

        /**
         * Default commands prefix
         * @type {string}
         */
        this.prefix = snowflakeClientOptions.defaultPrefix || "!";

        /**
         * If the bot responds to mentions
         * @type {boolean}
         */
        this.mentionPrefix = typeof snowflakeClientOptions.mentionPrefix === "boolean" ? !!snowflakeClientOptions.mentionPrefix : false;

        /**
         * If it returns command error message.
         * @type {?string}
         */
        this.commandErrorMessage = snowflakeClientOptions.commandErrorMessage || null;

        /**
         * If it returns command not found message.
         * @type {?string}
         */
        this.commandNotFound = snowflakeClientOptions.commandNotFound || null;

        /**
         * The commands dir
         * @type {?string}
         */
        this.commandsDir = typeof snowflakeClientOptions.commandsDir === "string" ? snowflakeClientOptions.commandsDir : null;

        /**
         * The events dir
         * @type {?string}
         */
        this.eventsDir = typeof snowflakeClientOptions.eventsDir === "string" ? snowflakeClientOptions.eventsDir : null;

        /**
         * If it is loading default commands
         * @type {boolean}
         */
        this.loadDefaultCommands = typeof snowflakeClientOptions.loadDefaultCommands === "boolean" ? !!snowflakeClientOptions.loadDefaultCommands : true;

        /**
         * If the client is handling all commands by default
         * @type {boolean}
         */
        this.handleCommands = typeof snowflakeClientOptions.handleCommands === "boolean" ? !!snowflakeClientOptions.handleCommands : true;

        /**
         * If the client is ignoring bot messages
         * @type {boolean}
         */
        this.ignoreBots = typeof snowflakeClientOptions.ignoreBots === "boolean" ? !!snowflakeClientOptions.ignoreBots : true;

        /**
         * If the client is logging errors
         * @type {boolean}
         */
        this.logErrors = typeof snowflakeClientOptions.logErrors === "boolean" ? !!snowflakeClientOptions.logErrors : true;

        /**
         * Bot owner
         * @type {string|null}
         */
        this.owner = snowflakeClientOptions.owner || null;

        /**
         * Client commands collection
         * @type {Discord.Collection<string, any>}
         */
        this.commands = new Discord.Collection();

        /**
         * Client commands alias collection
         * @type {Discord.Collection<string, string>}
         */
        this.aliases = new Discord.Collection();
    }

    /**
     * Checks if the cache has a command
     * @param {string} name Command name to check
     * @returns {boolean}
     */
    hasCommand(name) {
        if (typeof name !== "string") return false;
        return this.commands.has(name) || this.aliases.has(name) && this.commands.has(this.aliases.has(name));
    }

    /**
     * Returns a command
     * @param {string} name Command name
     * @returns {Command}
     */
    getCommand(name) {
        if (typeof name !== "string") return;
        return this.commands.get(name) || this.commands.get(this.aliases.get(name));
    }

    /**
     * Loads all commands
     * @returns {void}
     * @private
     */
    loadCommands() {
        if (!this.commandsDir || !fs.existsSync(this.commandsDir)) throw new Error(`Couldn't locate commands dir: "${this.commandsDir}"`);

        // custom commands
        fs.readdir(this.commandsDir, (error, files) => {
            if (error) throw error;

            files.forEach(file => {
                fs.readdir(`${this.commandsDir}/${file}`, (err, commands) => {
                    if (err) throw err;
                    commands.forEach(command => {
                        const Prop = require(`${this.commandsDir}/${file}/${command}`);
                        const cmd = new Prop(this);
                        cmd.setLocation(`${this.commandsDir}/${file}/${command}`);
                        cmd.setCategory(file);

                        this.commands.set(cmd.help.name, cmd);
                        cmd.help.aliases.forEach(alias => this.aliases.set(alias, cmd.help.name));

                        // delete from cache
                        delete require.cache[require.resolve(`${this.commandsDir}/${file}/${command}`)];

                        this.emit("commandLoad", cmd.help.name, cmd, false);
                    });
                });
            });
        });

        // default commands
        if (!!this.loadDefaultCommands) {
            const commands = fs.readdirSync(`${__dirname}/DefaultCommands`);
            commands.forEach(command => {
                const Prop = require(`${__dirname}/DefaultCommands/${command}`);
                const prop = new Prop(this);

                this.commands.set(prop.help.name, prop);
                prop.help.aliases.forEach(alias => this.aliases.set(alias, prop.help.name));

                // delete from cache
                delete require.cache[require.resolve(`${__dirname}/DefaultCommands/${command}`)];

                this.emit("commandLoad", prop.help.name, prop, true);
            })
        }
    }

    /**
     * Loads all events
     * @returns {void}
     * @private
     */
    loadEvents() {
        if (!this.eventsDir || !fs.existsSync(this.eventsDir)) throw new Error(`Couldn't locate events dir: "${this.eventsDir}"`);
        fs.readdir(this.eventsDir, (error, files) => {
            if (error) throw error;

            files.forEach(file => {
                const Prop = require(`${this.eventsDir}/${file}`);
                const event = new Prop(this);
                const eventName = file.split(".").shift();

                this.on(eventName, (...args) => event.execute(...args));

                // delete from cache
                delete require.cache[require.resolve(`${this.eventsDir}/${file}`)];

                this.emit("eventLoad", eventName, event);
            });
        });
    }

    /**
     * Unloads command from the cache
     * @param {string} name Command name to unload
     * @returns {boolean}
     */
    unloadCommand(name) {
        if (!this.hasCommand(name)) throw new Error(`Command "${name}" is not available in cache!`);

        return this.commands.delete(name) || this.aliases.delete(name);
    }

    /**
     * Reloads a command
     * @param {string} name Command name to reload
     * @returns {void}
     */
    reloadCommand(name) {
        if (!this.hasCommand(name)) throw new Error(`Command "${name}" is not available in cache!`);

        // fetch command
        const cmd = this.getCommand(name);
        const Prop = require(cmd.location);
        const prop = new Prop(this);

        // update category and location
        prop.setCategory(cmd.category);
        prop.setLocation(cmd.location);

        // delete existing command from cache
        this.commands.delete(cmd.help.name);
        cmd.help.aliases.forEach(alias => this.aliases.delete(alias));

        // set new command
        this.commands.set(prop.help.name, prop);
        prop.help.aliases.forEach(alias => this.aliases.set(alias, prop.help.name));

        // remove from cache
        delete require.cache[require.resolve(cmd.location)];

        this.emit("commandReload", prop.help.name, prop);
    }

    /**
     * Login to discord gateway
     * @param {string} token Discord bot token
     * @returns {Promise<string>}
     */
    login(token) {

        // load commands
        this.loadCommands();

        // load events
        this.loadEvents();

        // login to discord
        return super.login(token);
    }

}

/**
 * Emitted whenever the client loads a command into cache
 * @event commandLoad
 * @property {string} name Command name
 * @property {any} command The command
 * @property {boolean} defaultCommand If the loaded command is a default command
 * @example client.on("commandLoad", name => {
 *     console.log(`Loaded command ${name}...`);
 * });
 */

/**
 * Emitted whenever client loads an event
 * @event eventLoad
 * @property {string} name Event name
 * @property {any} event The event
 * @example client.on("eventLoad", event => {
 *     console.log(`Loaded event ${event}...`);
 * });
 */

/**
 * Emitted whenever client reloads a command
 * @event commandReload
 * @property {string} name Command name
 * @property {any} command The command
 * @example client.on("commandReload", name => {
 *     console.log(`Re-loaded a command ${name}...`);
 * });
 */

/**
 * Emitted whenever user enters invalid command
 * @event commandNotFound
 * @property {Message} message The message object
 * @example client.on("commandNotFound", message => {
 *     console.log(`${message.author.tag} entered invalid command: ${message.commandName}`);
 * });
 */

/**
 * Emitted whenever command encounters error
 * @event commandError
 * @property {Error} error The error
 * @property {Message} message The message object
 * @example client.on("commandError", (error, message) => {
 *     console.log(`Something went wrong while running command: ${message.commandName}`);
 *     console.error(error);
 * });
 */

module.exports = SnowflakeClient;