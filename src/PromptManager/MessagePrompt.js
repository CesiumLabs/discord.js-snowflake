/**
 * @typedef {string|number|bigint|boolean|symbol|readonly any[]|(MessageOptions & { split?: false|undefined; })|MessageEmbed|MessageAttachment|(MessageEmbed|MessageAttachment)[]} PromptMessage
 */

/**
 * Prompt message
 * @param {PromptMessage} message Message to prompt
 * @param {TextChannel} channel Discord channel object
 * @param {CollectorFilter} filter Prompt filter
 * @param {number} [timeout=1000] Prompt timeout
 * @param {AwaitMessagesOptions} [options={}] Prompt options
 * @returns {Promise<Message|Message[]>}
 * @example const filter = m => m.author.id === message.author.id;
 * const timeout = 10000;
 * const channel = message.channel;
 * const promptMessage = "What is your name?";
 * 
 * const name = await this.prompt(promptMessage, channel, filter, timeout);
 * return message.channel.send(`Your name is **${name}**!`);
 */
function MessagePrompt(message, channel, filter, timeout = 1000, options = {}) {
    return new Promise(async (resolve, reject) => {
        if (!message) reject(new Error("Prompt message was not provided!"));
        await channel.send(message).catch(reject);

        channel.awaitMessages(filter, {
            time: typeof timeout === "number" ? timeout : 1000,
            max: typeof options.max === "number" && options.max > 0 ? options.max : 1,
            errors: options.errors || ["time"],
            ...options
        })
        .then(collected => {
            const m = typeof options.max === "number" && options.max > 0 && options.max === 1 ? collected.first() : [...collected.values()];

            resolve(m);
        })
        .catch(e => {
            if (e.includes("time")) resolve(null);
            reject(e);
        });
    });
}

module.exports = MessagePrompt;