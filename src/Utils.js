class Utils {

    /**
     * JavaScript Utility
     */
    constructor() {
        throw new Error(`The ${this.constructor.name} class may not be instantiated!`);
    }

    /**
     * Returns random number
     * @param {number} min Min value
     * @param {number} max Max value
     * @returns {number}
     */
    static randint(min = 0, max = 1) {
        if (typeof min !== "number" || typeof max !== "number") return 0;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /**
     * Shuffles Array
     * @param {any[]} array Array to shuffle
     * @returns {any[]}
     */
    static shuffleArray(array) {
        if (!Array.isArray(array)) return [];

        return array.sort(() => 0.5 - Math.random());
    }

    /**
     * Returns random item from the array
     * @param {any[]} arr Array
     * @param {number} limit Item limit. Defaults to 1
     * @returns {any|any[]}
     */
    static random(arr = [], limit = 1) {
        if (!arr || !Array.isArray(arr)) return;
        if (typeof limit !== "number" || limit <= 1) return arr[Math.floor(Math.random() * arr.length)];
        let temparr = [];

        for (let i = 0; i < limit; i++) temparr.push(arr[Math.floor(Math.random() * arr.length)]);

        return temparr;
    }

    /**
     * Returns if the given number is even number
     * @param {number} number The number
     * @returns {boolean}
     */
    static isEven(number) {
        if (typeof number !== "number" || !isFinite(number)) return false;
        if (number === 0) return false;
        return number % 2 === 0;
    }

    /**
     * Returns if the given number is odd number
     * @param {number} number The number
     * @returns {boolean}
     */
    static isOdd(number) {
        if (typeof number !== "number" || !isFinite(number)) return false;
        if (number === 0) return false;
        return !Utils.isEven(number);
    }

    /**
     * Returns first x number of elements of Array
     * @param {any[]} array Array
     * @param {number} n Number of items to return
     * @returns {any|any[]}
     */
    static first(array = [], n = 0) {
        if (typeof n !== "number" || n < 0) n = 0;
        if (!Array.isArray(array)) array = [];
        if (n === 0) return array[0];
        
        return array.slice(0, n);
    }

    /**
     * Returns last x number of elements of Array
     * @param {any[]} array Array
     * @param {number} n Number of items to return
     * @returns {any|any[]}
     */
    static last(array = [], n = 0) {
        if (!Array.isArray(array)) array = [];
        array = array.reverse();

        return Utils.first(array, n);
    }

    /**
     * Removes one or multiple items from the given array
     * @param {any[]} array Array to remove item(s) from
     * @param {any} item Any item to remove
     * @param {boolean} multiple If it should remove all matching items
     * @returns {any[]}
     */
    static remove(array = [], item, multiple = false) {
        if (!Array.isArray(array)) return [];
        if (!multiple) {
            const hasItem = array.some(x => x === item);
            if (!hasItem) return [];
            const index = array.findIndex(x => x === item);
            return array.splice(index, 1);
        }

        return array.filter(x => x !== item);
    }
}

module.exports = Utils;