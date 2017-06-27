/**
* © Copyright IBM Corp. 2016, 2017 All Rights Reserved
*   Project name: JSONata
*   This project is licensed under the MIT License, see LICENSE
*/

/**
 * Sum function
 * @param {Object} args - Arguments
 * @returns {number} Total value of arguments
 */
export function functionSum (args) {
    // undefined inputs always return undefined
    if (typeof args === 'undefined') {
        return undefined;
    }

    var total = 0;
    args.forEach(function (num) {total += num;});
    return total;
}

/**
 * Count function
 * @param {Object} args - Arguments
 * @returns {number} Number of elements in the array
 */
export function functionCount (args) {
    // undefined inputs always return undefined
    if (typeof args === 'undefined') {
        return 0;
    }

    return args.length;
}

/**
 * Max function
 * @param {Object} args - Arguments
 * @returns {number} Max element in the array
 */
export function functionMax (args) {
    // undefined inputs always return undefined
    if (typeof args === 'undefined' || args.length === 0) {
        return undefined;
    }

    return Math.max.apply(Math, args);
}

/**
 * Min function
 * @param {Object} args - Arguments
 * @returns {number} Min element in the array
 */
export function functionMin (args) {
    // undefined inputs always return undefined
    if (typeof args === 'undefined' || args.length === 0) {
        return undefined;
    }

    return Math.min.apply(Math, args);
}

/**
 * Average function
 * @param {Object} args - Arguments
 * @returns {number} Average element in the array
 */
export function functionAverage (args) {
    // undefined inputs always return undefined
    if (typeof args === 'undefined' || args.length === 0) {
        return undefined;
    }

    var total = 0;
    args.forEach(function (num) {total += num;});
    return total / args.length;
}
