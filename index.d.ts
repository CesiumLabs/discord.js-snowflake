declare module 'discord.js-snowflake' {
  import Discord from 'discord.js';

  type SnowflakeClientOptions = {
    /**
     * Command error message
     */
    commandErrorMessage: string;

    /**
     * Command not found message
     */
    commandNotFound: string;

    /**
     * Default commands prefix
     */
    defaultPrefix: string;

    /**
     * If it should set client mentions as command prefix
     */
    mentionPrefix: boolean;

    /**
     * The bot owner id(s)
     */
    owner: string;

    /**
     * Command dir name
     */
    commandsDir: string;

    /**
     * Events dir name
     */
    eventsDir: string;

    /**
     * If it should load default commands
     */
    loadDefaultCommands: boolean;

    /**
     * If it should handle commands by default
     */
    handleCommands: boolean;

    /**
     * If it should ignore bots
     */
    ignoreBots: boolean;

    /**
     * If it should log errors
     */
    logErrors: boolean;
  }

  type CommandHelpConfig = {
    /**
     * Command name
     */
    name: string;

    /**
     * Command description
     */
    description: string;

    /**
     * Command aliases
     */
    aliases: string[] | any[];

    /**
     * If the command should respond to the guild only
     */
    guildOnly: boolean;

    /**
     * If the command should be bot owner only
     */
    ownerOnly: boolean;

    /**
     * Guild member permissions (guild only)
     */
    permissions: string[] | any[];

    /**
     * Command cooldown in ms
     */
    cooldown: number;
  }

  type PromptMessage = string|number|bigint|boolean|symbol|readonly any[]|(Discord.MessageOptions & { split?: false|undefined; })|Discord.MessageEmbed|Discord.MessageAttachment|(Discord.MessageEmbed|Discord.MessageAttachment)[];
  
  namespace DiscordJsSnowflake {
    /**
     * Snowflake Client
     * @license GPL-3.0
     * @author Snowflake Studio ❄
     */
    export class SnowflakeClient extends Discord.Client {
      /**
       * SnowflakeClient Constructor
       * @param snowflakeClientOptions Snowflake Client Options
       * @param clientOptions Discord client options
       */
      constructor(snowflakeClientOptions?: Partial<SnowflakeClientOptions>,
        clientOptions?: Partial<Discord.ClientOptions>);

      /**
       * Checks if the cache has a command
       * @param name Command name to check
       */
      hasCommand(name: string): boolean;

      /**
       * Returns a command
       * @param name Command name
       */
      getCommand(name: string): Command;

      /**
       * Unloads command from the cache
       * @param name Command name to unload
       */
      unloadCommand(name: string): boolean;

      /**
       * Reloads a command
       * @param name Command name to reload
       */
      reloadCommand(name: string): void;

      /**
       * Login to discord gateway
       * @param token Discord bot token
       */
      login(token: string): Promise<string>;
    }

    export class Command {
      /**
       * The command base
       * @param client Discord client
       * @param conf Command help config
       */
      constructor(client: SnowflakeClient, conf?: Partial<CommandHelpConfig>);
  
      /**
       * The client that instantiated this command
       * @readonly
       */
      client: SnowflakeClient;
  
      /**
       * Command help config.
       */
      help: CommandHelpConfig;
  
      /**
       * The command category
       */
      category: string | null;
  
      /**
       * The command location
       */
      location: string | null;
  
      /**
       * Sets command category
       * @param ctg Command category
       */
      setCategory(ctg: string): void;
  
      /**
       * Sets command location
       * @param name Command location
       */
      setLocation(name: string): void;
  
      /**
       * Command executor
       * @param message The message
       * @param args Command args
       */
      execute(message: Message, args: string[]): Promise<void>;
  
      /**
       * Returns source code of the execute function of this command.
       */
      get source(): string;
    }

    export namespace DefaultCommands {
      class Ping extends DiscordJsSnowflake.Command {}

      /** UNCOMMENT IF EVAL CLASS IS EXPORTED
        class Eval extends DiscordJsSnowflake.Command {
          cleanText(text: string): string;
        }
      */
    }

    export class Guild extends Discord.Guild {
      /**
       * Represents a guild (or a server) on Discord.
       */
      constructor(...props: any[]);

      /**
       * Returns current guild prefix
       */
      prefix: string;
    }

    export class GuildMember extends Discord.GuildMember {
      /**
       * Represents a member of a guild on Discord.
       */
      constructor(...props: any[]);

      /**
       * If the current user is the bot owner
       * @readonly
       */
      isOwner: boolean;
    }

    export class Message extends Discord.Message {
      /**
       * Represents a message on Discord.
       */
      constructor(...props: any[]);

      /**
       * Handles the command
       */
      handleCommands(): Promise<boolean|Message|undefined>;
    }

    /**
     * Prompt message
     * @param message Message to prompt
     * @param channel Discord channel object
     * @param filter Prompt filter
     * @param [timeout=1000] Prompt timeout
     * @param [options={}] Prompt options
     * @example const filter = m => m.author.id === message.author.id;
     * const timeout = 10000;
     * const channel = message.channel;
     * const promptMessage = "What is your name?";
     * 
     * const name = await this.prompt(promptMessage, channel, filter, timeout);
     * return message.channel.send(`Your name is **${name}**!`);
     */
    export function MessagePrompt(message: PromptMessage,
      channel: Discord.TextChannel, filter: Discord.CollectorFilter,
      timeout?: number, options?: Discord.AwaitMessagesOptions)
        : Promise<Message|Message[]>;

    export class User extends Discord.User {
      /**
       * Represents a user on Discord.
       */
      constructor(...props: any[]);

      /**
       * If the current user is the bot owner
       * @readonly
       */
      isOwner: boolean;
    }

    /**
     * JavaScript Utility
     */
    export class Utils {  
      /**
       * Returns random number
       * @param min Min value
       * @param max Max value
       */
      static randint(min: number, max: number): number;
  
      /**
       * Shuffles Array
       * @param array Array to shuffle
       */
      static shuffleArray<T>(array: T[]): T[]
  
      /**
       * Returns random item from the array
       * @param arr Array
       * @param limit Item limit. Defaults to 1
       */
      static random<T>(arr: T[], limit?: number): T | T[];
  
      /**
       * Returns if the given number is even number
       * @param number The number
       */
      static isEven(number: number): boolean;
  
      /**
       * Returns if the given number is odd number
       * @param number The number
       */
      static isOdd(number: number): boolean;
  
      /**
       * Returns first x number of elements of Array
       * @param array Array
       * @param n Number of items to return
       */
      static first<T>(array: T[], n: number): T | T[];
  
      /**
       * Returns last x number of elements of Array
       * @param array Array
       * @param n Number of items to return
       */
      static last<T>(array: T[], n: number): T | T[];
  
      /**
       * Removes one or multiple items from the given array
       * @param {any[]} array Array to remove item(s) from
       * @param {any} item Any item to remove
       * @param {boolean} multiple If it should remove all matching items
       * @returns {any[]}
       */
      static remove<T>(array: T[], item: T, multiple: boolean): T[];
    }

    export const version: string;
  }

  export = DiscordJsSnowflake;
}
