class Command {

    /**
     * The command base
     * @param {SnowflakeClient} client Discord client
     * @param {CommandHelpConfig} conf Command help config
     */
    constructor(client, conf = {}) {

        /**
         * The client that instantiated this command
         * @name Command#client
         * @type {SnowflakeClient}
         * @readonly
         */
        Object.defineProperty(this, "client", {
            value: client
        });

        /**
         * @typedef {object} CommandHelpConfig
         * @property {string} name Command name
         * @property {string} description Command description
         * @property {[]|string[]} aliases Command aliases
         * @property {boolean} guildOnly If the command should respond to the guild only
         * @property {boolean} ownerOnly If the command should be bot owner only
         * @property {string[]|[]} permissions Guild member permissions (guild only)
         * @property {number} cooldown Command cooldown in ms
         */

        /**
         * Command help config.
         * @type {CommandHelpConfig}
         */
        this.help = {
            name: conf.name || null,
            description: conf.description || "No description provided!",
            aliases: conf.aliases || [],
            guildOnly: !!conf.guildOnly,
            ownerOnly: !!conf.ownerOnly,
            permissions: [],
            cooldown: typeof conf.cooldown === "number" ? conf.cooldown : 1000
        };

        /**
         * The command category
         * @type {string}
         */
        this.category = "Others";
        
        /**
         * The command location
         * @type {?string}
         */
        this.location = null;
    }

    /**
     * Sets command category
     * @param {string} ctg Command category
     * @returns {void}
     */
    setCategory(ctg) {
        if (!ctg || typeof ctg !== "string") return;
        this.category = ctg;
    }

    /**
     * Sets command location
     * @param {string} name Command location
     * @returns {void}
     */
    setLocation(name) {
        if (!name || typeof name !== "string") return;
        this.location = name;
    }

    /**
     * Command executor
     * @param {Message} message The message
     * @param {string[]} args Command args
     * @returns {Promise<void>}
     */
    async execute(message, args) {
        // empty method
    }

    /**
     * Returns source code of the execute function of this command.
     * @type {string}
     */
    get source() {
        return this.execute.toString();
    }

    valueOf() {
        return this.help.name;
    }
    
}

module.exports = Command;