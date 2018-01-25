import { isFunction, isNumeric, createSequence, isLambda, isArrayOfNumbers, isArrayOfStrings, createFrame } from './utils';
import { defineFunction } from './signatures';
import { apply, evaluateName } from './evaluate';

/**
 * Sum function
 * @param {Object} args - Arguments
 * @returns {number} Total value of arguments
 */
export function functionSum(args) {
    // undefined inputs always return undefined
    if (typeof args === "undefined") {
        return undefined;
    }

    var total = 0;
    args.forEach(function(num) {
        total += num;
    });
    return total;
}

/**
 * Count function
 * @param {Object} args - Arguments
 * @returns {number} Number of elements in the array
 */
export function functionCount(args) {
    // undefined inputs always return undefined
    if (typeof args === "undefined") {
        return 0;
    }

    return args.length;
}

/**
 * Max function
 * @param {Object} args - Arguments
 * @returns {number} Max element in the array
 */
export function functionMax(args) {
    // undefined inputs always return undefined
    if (typeof args === "undefined" || args.length === 0) {
        return undefined;
    }

    return Math.max.apply(Math, args);
}

/**
 * Min function
 * @param {Object} args - Arguments
 * @returns {number} Min element in the array
 */
export function functionMin(args) {
    // undefined inputs always return undefined
    if (typeof args === "undefined" || args.length === 0) {
        return undefined;
    }

    return Math.min.apply(Math, args);
}

/**
 * Average function
 * @param {Object} args - Arguments
 * @returns {number} Average element in the array
 */
export function functionAverage(args) {
    // undefined inputs always return undefined
    if (typeof args === "undefined" || args.length === 0) {
        return undefined;
    }

    var total = 0;
    args.forEach(function(num) {
        total += num;
    });
    return total / args.length;
}

/**
 * Stingify arguments
 * @param {Object} arg - Arguments
 * @returns {String} String from arguments
 */
export function functionString(arg) {
    // undefined inputs always return undefined
    if (typeof arg === "undefined") {
        return undefined;
    }

    var str;

    if (typeof arg === "string") {
        // already a string
        str = arg;
    } else if (isFunction(arg)) {
        // functions (built-in and lambda convert to empty string
        str = "";
    } else if (typeof arg === "number" && !isFinite(arg)) {
        throw {
            code: "D3001",
            value: arg,
            stack: new Error().stack,
        };
    } else
        str = JSON.stringify(arg, function(key, val) {
            return typeof val !== "undefined" && val !== null && val.toPrecision && isNumeric(val)
                ? Number(val.toPrecision(13))
                : val && isFunction(val) ? "" : val;
        });
    return str;
}

/**
 * Create substring based on character number and length
 * @param {String} str - String to evaluate
 * @param {Integer} start - Character number to start substring
 * @param {Integer} [length] - Number of characters in substring
 * @returns {string|*} Substring
 */
export function functionSubstring(str, start, length) {
    // undefined inputs always return undefined
    if (typeof str === "undefined") {
        return undefined;
    }

    return str.substr(start, length);
}

/**
 * Create substring up until a character
 * @param {String} str - String to evaluate
 * @param {String} chars - Character to define substring boundary
 * @returns {*} Substring
 */
export function functionSubstringBefore(str, chars) {
    // undefined inputs always return undefined
    if (typeof str === "undefined") {
        return undefined;
    }

    var pos = str.indexOf(chars);
    if (pos > -1) {
        return str.substr(0, pos);
    } else {
        return str;
    }
}

/**
 * Create substring after a character
 * @param {String} str - String to evaluate
 * @param {String} chars - Character to define substring boundary
 * @returns {*} Substring
 */
export function functionSubstringAfter(str, chars) {
    // undefined inputs always return undefined
    if (typeof str === "undefined") {
        return undefined;
    }

    var pos = str.indexOf(chars);
    if (pos > -1) {
        return str.substr(pos + chars.length);
    } else {
        return str;
    }
}

/**
 * Lowercase a string
 * @param {String} str - String to evaluate
 * @returns {string} Lowercase string
 */
export function functionLowercase(str) {
    // undefined inputs always return undefined
    if (typeof str === "undefined") {
        return undefined;
    }

    return str.toLowerCase();
}

/**
 * Uppercase a string
 * @param {String} str - String to evaluate
 * @returns {string} Uppercase string
 */
export function functionUppercase(str) {
    // undefined inputs always return undefined
    if (typeof str === "undefined") {
        return undefined;
    }

    return str.toUpperCase();
}

/**
 * length of a string
 * @param {String} str - string
 * @returns {Number} The number of characters in the string
 */
export function functionLength(str) {
    // undefined inputs always return undefined
    if (typeof str === "undefined") {
        return undefined;
    }

    return str.length;
}

/**
 * Normalize and trim whitespace within a string
 * @param {string} str - string to be trimmed
 * @returns {string} - trimmed string
 */
export function functionTrim(str) {
    // undefined inputs always return undefined
    if (typeof str === "undefined") {
        return undefined;
    }

    // normalize whitespace
    var result = str.replace(/[ \t\n\r]+/gm, " ");
    if (result.charAt(0) === " ") {
        // strip leading space
        result = result.substring(1);
    }
    if (result.charAt(result.length - 1) === " ") {
        // strip trailing space
        result = result.substring(0, result.length - 1);
    }
    return result;
}

/**
 * Pad a string to a minimum width by adding characters to the start or end
 * @param {string} str - string to be padded
 * @param {number} width - the minimum width; +ve pads to the right, -ve pads to the left
 * @param {string} [char] - the pad character(s); defaults to ' '
 * @returns {string} - padded string
 */
export function functionPad(str, width, char) {
    // undefined inputs always return undefined
    if (typeof str === "undefined") {
        return undefined;
    }

    if (typeof char === "undefined" || char.length === 0) {
        char = " ";
    }

    var result;
    var padLength = Math.abs(width) - str.length;
    if (padLength > 0) {
        var padding = new Array(padLength + 1).join(char);
        if (char.length > 1) {
            padding = padding.substring(0, padLength);
        }
        if (width > 0) {
            result = str + padding;
        } else {
            result = padding + str;
        }
    } else {
        result = str;
    }
    return result;
}

/**
 * Tests if the str contains the token
 * @param {String} str - string to test
 * @param {String} token - substring or regex to find
 * @returns {Boolean} - true if str contains token
 */
export function functionContains(str, token) {
    // undefined inputs always return undefined
    if (typeof str === "undefined") {
        return undefined;
    }

    var result;

    if (typeof token === "string") {
        result = str.indexOf(token) !== -1;
    } else {
        var matches = token(str);
        result = typeof matches !== "undefined";
    }

    return result;
}

/**
 * Match a string with a regex returning an array of object containing details of each match
 * @param {String} str - string
 * @param {String} regex - the regex applied to the string
 * @param {Integer} [limit] - max number of matches to return
 * @returns {Array} The array of match objects
 */
export function functionMatch(str, regex, limit) {
    // undefined inputs always return undefined
    if (typeof str === "undefined") {
        return undefined;
    }

    // limit, if specified, must be a non-negative number
    if (limit < 0) {
        throw {
            stack: new Error().stack,
            value: limit,
            code: "D3040",
            index: 3,
        };
    }

    var result = createSequence();

    if (typeof limit === "undefined" || limit > 0) {
        var count = 0;
        var matches = regex(str);
        if (typeof matches !== "undefined") {
            while (typeof matches !== "undefined" && (typeof limit === "undefined" || count < limit)) {
                result.push({
                    match: matches.match,
                    index: matches.start,
                    groups: matches.groups,
                });
                matches = matches.next();
                count++;
            }
        }
    }

    return result;
}

/**
 * Match a string with a regex returning an array of object containing details of each match
 * @param {String} str - string
 * @param {String} pattern - the substring/regex applied to the string
 * @param {String} replacement - text to replace the matched substrings
 * @param {Integer} [limit] - max number of matches to return
 * @returns {Array} The array of match objects
 */
function* functionReplace(str, pattern, replacement, limit) {
    // undefined inputs always return undefined
    if (typeof str === "undefined") {
        return undefined;
    }

    // pattern cannot be an empty string
    if (pattern === "") {
        throw {
            code: "D3010",
            stack: new Error().stack,
            value: pattern,
            index: 2,
        };
    }

    // limit, if specified, must be a non-negative number
    if (limit < 0) {
        throw {
            code: "D3011",
            stack: new Error().stack,
            value: limit,
            index: 4,
        };
    }

    var replacer;
    if (typeof replacement === "string") {
        replacer = function(regexMatch) {
            var substitute = "";
            // scan forward, copying the replacement text into the substitute string
            // and replace any occurrence of $n with the values matched by the regex
            var position = 0;
            var index = replacement.indexOf("$", position);
            while (index !== -1 && position < replacement.length) {
                substitute += replacement.substring(position, index);
                position = index + 1;
                var dollarVal = replacement.charAt(position);
                if (dollarVal === "$") {
                    // literal $
                    substitute += "$";
                    position++;
                } else if (dollarVal === "0") {
                    substitute += regexMatch.match;
                    position++;
                } else {
                    var maxDigits;
                    if (regexMatch.groups.length === 0) {
                        // no sub-matches; any $ followed by a digit will be replaced by an empty string
                        maxDigits = 1;
                    } else {
                        // max number of digits to parse following the $
                        maxDigits = Math.floor(Math.log(regexMatch.groups.length) * Math.LOG10E) + 1;
                    }
                    index = parseInt(replacement.substring(position, position + maxDigits), 10);
                    if (maxDigits > 1 && index > regexMatch.groups.length) {
                        index = parseInt(replacement.substring(position, position + maxDigits - 1), 10);
                    }
                    if (!isNaN(index)) {
                        if (regexMatch.groups.length > 0) {
                            var submatch = regexMatch.groups[index - 1];
                            if (typeof submatch !== "undefined") {
                                substitute += submatch;
                            }
                        }
                        position += index.toString().length;
                    } else {
                        // not a capture group, treat the $ as literal
                        substitute += "$";
                    }
                }
                index = replacement.indexOf("$", position);
            }
            substitute += replacement.substring(position);
            return substitute;
        };
    } else {
        replacer = replacement;
    }

    var result = "";
    var position = 0;

    if (typeof limit === "undefined" || limit > 0) {
        var count = 0;
        if (typeof pattern === "string") {
            var index = str.indexOf(pattern, position);
            while (index !== -1 && (typeof limit === "undefined" || count < limit)) {
                result += str.substring(position, index);
                result += replacement;
                position = index + pattern.length;
                count++;
                index = str.indexOf(pattern, position);
            }
            result += str.substring(position);
        } else {
            var matches = pattern(str);
            if (typeof matches !== "undefined") {
                while (typeof matches !== "undefined" && (typeof limit === "undefined" || count < limit)) {
                    result += str.substring(position, matches.start);
                    var replacedWith = yield* apply(replacer, [matches], null);
                    // check replacedWith is a string
                    if (typeof replacedWith === "string") {
                        result += replacedWith;
                    } else {
                        // not a string - throw error
                        throw {
                            code: "D3012",
                            stack: new Error().stack,
                            value: replacedWith,
                        };
                    }
                    position = matches.start + matches.match.length;
                    count++;
                    matches = matches.next();
                }
                result += str.substring(position);
            } else {
                result = str;
            }
        }
    } else {
        result = str;
    }

    return result;
}

/**
 * Base64 encode a string
 * @param {String} str - string
 * @returns {String} Base 64 encoding of the binary data
 */
export function functionBase64encode(str) {
    // undefined inputs always return undefined
    if (typeof str === "undefined") {
        return undefined;
    }
    // Use btoa in a browser, or Buffer in Node.js
    /* istanbul ignore next */
    if (typeof window !== "undefined") {
        return window.btoa(str);
    } else {
        return new global.Buffer(str, "binary").toString("base64");
    }
}

/**
 * Base64 decode a string
 * @param {String} str - string
 * @returns {String} Base 64 encoding of the binary data
 */
export function functionBase64decode(str) {
    // undefined inputs always return undefined
    if (typeof str === "undefined") {
        return undefined;
    }
    // Use btoa in a browser, or Buffer in Node.js
    /* istanbul ignore next */
    if (typeof window !== "undefined") {
        return window.atob(str);
    } else {
        return new global.Buffer(str, "base64").toString("binary");
    }
}

/**
 * Split a string into an array of substrings
 * @param {String} str - string
 * @param {String} separator - the token or regex that splits the string
 * @param {Integer} [limit] - max number of substrings
 * @returns {Array} The array of string
 */
export function functionSplit(str, separator, limit) {
    // undefined inputs always return undefined
    if (typeof str === "undefined") {
        return undefined;
    }

    // limit, if specified, must be a non-negative number
    if (limit < 0) {
        throw {
            code: "D3020",
            stack: new Error().stack,
            value: limit,
            index: 3,
        };
    }

    var result = [];

    if (typeof limit === "undefined" || limit > 0) {
        if (typeof separator === "string") {
            result = str.split(separator, limit);
        } else {
            var count = 0;
            var matches = separator(str);
            if (typeof matches !== "undefined") {
                var start = 0;
                while (typeof matches !== "undefined" && (typeof limit === "undefined" || count < limit)) {
                    result.push(str.substring(start, matches.start));
                    start = matches.end;
                    matches = matches.next();
                    count++;
                }
                if (typeof limit === "undefined" || count < limit) {
                    result.push(str.substring(start));
                }
            } else {
                result.push(str);
            }
        }
    }

    return result;
}

/**
 * Join an array of strings
 * @param {Array} strs - array of string
 * @param {String} [separator] - the token that splits the string
 * @returns {String} The concatenated string
 */
export function functionJoin(strs, separator) {
    // undefined inputs always return undefined
    if (typeof strs === "undefined") {
        return undefined;
    }

    // if separator is not specified, default to empty string
    if (typeof separator === "undefined") {
        separator = "";
    }

    return strs.join(separator);
}

/**
 * Formats a number into a decimal string representation using XPath 3.1 F&O fn:format-number spec
 * @param {number} value - number to format
 * @param {String} picture - picture string definition
 * @param {Object} [options] - override locale defaults
 * @returns {String} The formatted string
 */
export function functionFormatNumber(value, picture, options) {
    var defaults = {
        "decimal-separator": ".",
        "grouping-separator": ",",
        "exponent-separator": "e",
        infinity: "Infinity",
        "minus-sign": "-",
        NaN: "NaN",
        percent: "%",
        "per-mille": "\u2030",
        "zero-digit": "0",
        digit: "#",
        "pattern-separator": ";",
    };

    // if `options` is specified, then its entries override defaults
    var properties = defaults;
    if (typeof options !== "undefined") {
        Object.keys(options).forEach(function(key) {
            properties[key] = options[key];
        });
    }

    var decimalDigitFamily = [];
    var zeroCharCode = properties["zero-digit"].charCodeAt(0);
    for (var ii = zeroCharCode; ii < zeroCharCode + 10; ii++) {
        decimalDigitFamily.push(String.fromCharCode(ii));
    }

    var activeChars = decimalDigitFamily.concat([
        properties["decimal-separator"],
        properties["exponent-separator"],
        properties["grouping-separator"],
        properties.digit,
        properties["pattern-separator"],
    ]);

    var subPictures = picture.split(properties["pattern-separator"]);

    if (subPictures.length > 2) {
        throw {
            code: "D3080",
            stack: new Error().stack,
        };
    }

    var splitParts = function(subpicture) {
        var prefix = (function() {
            var ch;
            for (var ii = 0; ii < subpicture.length; ii++) {
                ch = subpicture.charAt(ii);
                if (activeChars.indexOf(ch) !== -1 && ch !== properties["exponent-separator"]) {
                    return subpicture.substring(0, ii);
                }
            }
        })();
        var suffix = (function() {
            var ch;
            for (var ii = subpicture.length - 1; ii >= 0; ii--) {
                ch = subpicture.charAt(ii);
                if (activeChars.indexOf(ch) !== -1 && ch !== properties["exponent-separator"]) {
                    return subpicture.substring(ii + 1);
                }
            }
        })();
        var activePart = subpicture.substring(prefix.length, subpicture.length - suffix.length);
        var mantissaPart, exponentPart, integerPart, fractionalPart;
        var exponentPosition = subpicture.indexOf(properties["exponent-separator"], prefix.length);
        if (exponentPosition === -1 || exponentPosition > subpicture.length - suffix.length) {
            mantissaPart = activePart;
            exponentPart = undefined;
        } else {
            mantissaPart = activePart.substring(0, exponentPosition);
            exponentPart = activePart.substring(exponentPosition + 1);
        }
        var decimalPosition = mantissaPart.indexOf(properties["decimal-separator"]);
        if (decimalPosition === -1) {
            integerPart = mantissaPart;
            fractionalPart = suffix;
        } else {
            integerPart = mantissaPart.substring(0, decimalPosition);
            fractionalPart = mantissaPart.substring(decimalPosition + 1);
        }
        return {
            prefix: prefix,
            suffix: suffix,
            activePart: activePart,
            mantissaPart: mantissaPart,
            exponentPart: exponentPart,
            integerPart: integerPart,
            fractionalPart: fractionalPart,
            subpicture: subpicture,
        };
    };

    // validate the picture string, F&O 4.7.3
    var validate = function(parts) {
        var error;
        var ii;
        var subpicture = parts.subpicture;
        var decimalPos = subpicture.indexOf(properties["decimal-separator"]);
        if (decimalPos !== subpicture.lastIndexOf(properties["decimal-separator"])) {
            error = "D3081";
        }
        if (subpicture.indexOf(properties.percent) !== subpicture.lastIndexOf(properties.percent)) {
            error = "D3082";
        }
        if (subpicture.indexOf(properties["per-mille"]) !== subpicture.lastIndexOf(properties["per-mille"])) {
            error = "D3083";
        }
        if (subpicture.indexOf(properties.percent) !== -1 && subpicture.indexOf(properties["per-mille"]) !== -1) {
            error = "D3084";
        }
        var valid = false;
        for (ii = 0; ii < parts.mantissaPart.length; ii++) {
            var ch = parts.mantissaPart.charAt(ii);
            if (decimalDigitFamily.indexOf(ch) !== -1 || ch === properties.digit) {
                valid = true;
                break;
            }
        }
        if (!valid) {
            error = "D3085";
        }
        var charTypes = parts.activePart
            .split("")
            .map(function(char) {
                return activeChars.indexOf(char) === -1 ? "p" : "a";
            })
            .join("");
        if (charTypes.indexOf("p") !== -1) {
            error = "D3086";
        }
        if (decimalPos !== -1) {
            if (
                subpicture.charAt(decimalPos - 1) === properties["grouping-separator"] ||
                subpicture.charAt(decimalPos + 1) === properties["grouping-separator"]
            ) {
                error = "D3087";
            }
        } else if (parts.integerPart.charAt(parts.integerPart.length - 1) === properties["grouping-separator"]) {
            error = "D3088";
        }
        if (subpicture.indexOf(properties["grouping-separator"] + properties["grouping-separator"]) !== -1) {
            error = "D3089";
        }
        var optionalDigitPos = parts.integerPart.indexOf(properties.digit);
        if (
            optionalDigitPos !== -1 &&
            parts.integerPart
                .substring(0, optionalDigitPos)
                .split("")
                .filter(function(char) {
                    return decimalDigitFamily.indexOf(char) > -1;
                }).length > 0
        ) {
            error = "D3090";
        }
        optionalDigitPos = parts.fractionalPart.lastIndexOf(properties.digit);
        if (
            optionalDigitPos !== -1 &&
            parts.fractionalPart
                .substring(optionalDigitPos)
                .split("")
                .filter(function(char) {
                    return decimalDigitFamily.indexOf(char) > -1;
                }).length > 0
        ) {
            error = "D3091";
        }
        var exponentExists = typeof parts.exponentPart === "string";
        if (
            exponentExists &&
            parts.exponentPart.length > 0 &&
            (subpicture.indexOf(properties.percent) !== -1 || subpicture.indexOf(properties["per-mille"]) !== -1)
        ) {
            error = "D3092";
        }
        if (
            exponentExists &&
            (parts.exponentPart.length === 0 ||
                parts.exponentPart.split("").filter(function(char) {
                    return decimalDigitFamily.indexOf(char) === -1;
                }).length > 0)
        ) {
            error = "D3093";
        }
        if (error) {
            throw {
                code: error,
                stack: new Error().stack,
            };
        }
    };

    // analyse the picture string, F&O 4.7.4
    var analyse = function(parts) {
        var getGroupingPositions = function(part, toLeft?) {
            var positions = [];
            var groupingPosition = part.indexOf(properties["grouping-separator"]);
            while (groupingPosition !== -1) {
                var charsToTheRight = (toLeft ? part.substring(0, groupingPosition) : part.substring(groupingPosition))
                    .split("")
                    .filter(function(char) {
                        return decimalDigitFamily.indexOf(char) !== -1 || char === properties.digit;
                    }).length;
                positions.push(charsToTheRight);
                groupingPosition = parts.integerPart.indexOf(properties["grouping-separator"], groupingPosition + 1);
            }
            return positions;
        };
        var integerPartGroupingPositions = getGroupingPositions(parts.integerPart);
        var regular = function(indexes) {
            // are the grouping positions regular? i.e. same interval between each of them
            if (indexes.length === 0) {
                return 0;
            }
            var gcd = function(a, b) {
                return b === 0 ? a : gcd(b, a % b);
            };
            // find the greatest common divisor of all the positions
            var factor = indexes.reduce(gcd);
            // is every position separated by this divisor? If so, it's regular
            for (var index = 1; index <= indexes.length; index++) {
                if (indexes.indexOf(index * factor) === -1) {
                    return 0;
                }
            }
            return factor;
        };

        var regularGrouping = regular(integerPartGroupingPositions);
        var fractionalPartGroupingPositions = getGroupingPositions(parts.fractionalPart, true);

        var minimumIntegerPartSize = parts.integerPart.split("").filter(function(char) {
            return decimalDigitFamily.indexOf(char) !== -1;
        }).length;
        var scalingFactor = minimumIntegerPartSize;

        var fractionalPartArray = parts.fractionalPart.split("");
        var minimumFactionalPartSize = fractionalPartArray.filter(function(char) {
            return decimalDigitFamily.indexOf(char) !== -1;
        }).length;
        var maximumFactionalPartSize = fractionalPartArray.filter(function(char) {
            return decimalDigitFamily.indexOf(char) !== -1 || char === properties.digit;
        }).length;
        var exponentPresent = typeof parts.exponentPart === "string";
        if (minimumIntegerPartSize === 0 && maximumFactionalPartSize === 0) {
            if (exponentPresent) {
                minimumFactionalPartSize = 1;
                maximumFactionalPartSize = 1;
            } else {
                minimumIntegerPartSize = 1;
            }
        }
        if (exponentPresent && minimumIntegerPartSize === 0 && parts.integerPart.indexOf(properties.digit) !== -1) {
            minimumIntegerPartSize = 1;
        }
        if (minimumIntegerPartSize === 0 && minimumFactionalPartSize === 0) {
            minimumFactionalPartSize = 1;
        }
        var minimumExponentSize = 0;
        if (exponentPresent) {
            minimumExponentSize = parts.exponentPart.split("").filter(function(char) {
                return decimalDigitFamily.indexOf(char) !== -1;
            }).length;
        }

        return {
            integerPartGroupingPositions: integerPartGroupingPositions,
            regularGrouping: regularGrouping,
            minimumIntegerPartSize: minimumIntegerPartSize,
            scalingFactor: scalingFactor,
            prefix: parts.prefix,
            fractionalPartGroupingPositions: fractionalPartGroupingPositions,
            minimumFactionalPartSize: minimumFactionalPartSize,
            maximumFactionalPartSize: maximumFactionalPartSize,
            minimumExponentSize: minimumExponentSize,
            suffix: parts.suffix,
            picture: parts.subpicture,
        };
    };

    var parts = subPictures.map(splitParts);
    parts.forEach(validate);

    var variables = parts.map(analyse);

    if (variables.length === 1) {
        variables.push(JSON.parse(JSON.stringify(variables[0])));
        variables[1].prefix = properties["minus-sign"] + variables[1].prefix;
    }

    // TODO cache the result of the analysis

    // format the number
    // bullet 1: TODO: NaN - not sure we'd ever get this in JSON
    var pic;
    // bullet 2:
    if (value >= 0) {
        pic = variables[0];
    } else {
        pic = variables[1];
    }
    var adjustedNumber;
    // bullet 3:
    if (pic.picture.indexOf(properties.percent) !== -1) {
        adjustedNumber = value * 100;
    } else if (pic.picture.indexOf(properties["per-mille"]) !== -1) {
        adjustedNumber = value * 1000;
    } else {
        adjustedNumber = value;
    }
    // bullet 4:
    // TODO: infinity - not sure we'd ever get this in JSON
    // bullet 5:
    var mantissa, exponent;
    if (pic.minimumExponentSize === 0) {
        mantissa = adjustedNumber;
    } else {
        // mantissa * 10^exponent = adjustedNumber
        var maxMantissa = Math.pow(10, pic.scalingFactor);
        var minMantissa = Math.pow(10, pic.scalingFactor - 1);
        mantissa = adjustedNumber;
        exponent = 0;
        while (mantissa < minMantissa) {
            mantissa *= 10;
            exponent -= 1;
        }
        while (mantissa > maxMantissa) {
            mantissa /= 10;
            exponent += 1;
        }
    }
    // bullet 6:
    var roundedNumber = functionRound(mantissa, pic.maximumFactionalPartSize);
    // bullet 7:
    var makeString = function(value, dp) {
        var str = Math.abs(value).toFixed(dp);
        if (properties["zero-digit"] !== "0") {
            str = str
                .split("")
                .map(function(digit) {
                    if (digit >= "0" && digit <= "9") {
                        return decimalDigitFamily[digit.charCodeAt(0) - 48];
                    } else {
                        return digit;
                    }
                })
                .join("");
        }
        return str;
    };
    var stringValue = makeString(roundedNumber, pic.maximumFactionalPartSize);
    var decimalPos = stringValue.indexOf(".");
    if (decimalPos === -1) {
        stringValue = stringValue + properties["decimal-separator"];
    } else {
        stringValue = stringValue.replace(".", properties["decimal-separator"]);
    }
    while (stringValue.charAt(0) === properties["zero-digit"]) {
        stringValue = stringValue.substring(1);
    }
    while (stringValue.charAt(stringValue.length - 1) === properties["zero-digit"]) {
        stringValue = stringValue.substring(0, stringValue.length - 1);
    }
    // bullets 8 & 9:
    decimalPos = stringValue.indexOf(properties["decimal-separator"]);
    var padLeft = pic.minimumIntegerPartSize - decimalPos;
    var padRight = pic.minimumFactionalPartSize - (stringValue.length - decimalPos - 1);
    stringValue = (padLeft > 0 ? new Array(padLeft + 1).join("0") : "") + stringValue;
    stringValue = stringValue + (padRight > 0 ? new Array(padRight + 1).join("0") : "");
    decimalPos = stringValue.indexOf(properties["decimal-separator"]);
    // bullet 10:
    if (pic.regularGrouping > 0) {
        var groupCount = Math.floor((decimalPos - 1) / pic.regularGrouping);
        for (var group = 1; group <= groupCount; group++) {
            stringValue = [
                stringValue.slice(0, decimalPos - group * pic.regularGrouping),
                properties["grouping-separator"],
                stringValue.slice(decimalPos - group * pic.regularGrouping),
            ].join("");
        }
    } else {
        pic.integerPartGroupingPositions.forEach(function(pos) {
            stringValue = [
                stringValue.slice(0, decimalPos - pos),
                properties["grouping-separator"],
                stringValue.slice(decimalPos - pos),
            ].join("");
            decimalPos++;
        });
    }
    // bullet 11:
    decimalPos = stringValue.indexOf(properties["decimal-separator"]);
    pic.fractionalPartGroupingPositions.forEach(function(pos) {
        stringValue = [
            stringValue.slice(0, pos + decimalPos + 1),
            properties["grouping-separator"],
            stringValue.slice(pos + decimalPos + 1),
        ].join("");
    });
    // bullet 12:
    decimalPos = stringValue.indexOf(properties["decimal-separator"]);
    if (pic.picture.indexOf(properties["decimal-separator"]) === -1 || decimalPos === stringValue.length - 1) {
        stringValue = stringValue.substring(0, stringValue.length - 1);
    }
    // bullet 13:
    if (typeof exponent !== "undefined") {
        var stringExponent = makeString(exponent, 0);
        padLeft = pic.minimumExponentSize - stringExponent.length;
        if (padLeft > 0) {
            stringExponent = new Array(padLeft + 1).join("0") + stringExponent;
        }
        stringValue =
            stringValue +
            properties["exponent-separator"] +
            (exponent < 0 ? properties["minus-sign"] : "") +
            stringExponent;
    }
    // bullet 14:
    stringValue = pic.prefix + stringValue + pic.suffix;
    return stringValue;
}

/**
 * Converts a number to a string using a specified number base
 * @param {string} value - the number to convert
 * @param {number} [radix] - the number base; must be between 2 and 36. Defaults to 10
 * @returns {string} - the converted string
 */
export function functionFormatBase(value, radix) {
    // undefined inputs always return undefined
    if (typeof value === "undefined") {
        return undefined;
    }

    value = functionRound(value);

    if (typeof radix === "undefined") {
        radix = 10;
    } else {
        radix = functionRound(radix);
    }

    if (radix < 2 || radix > 36) {
        throw {
            code: "D3100",
            stack: new Error().stack,
            value: radix,
        };
    }

    var result = value.toString(radix);

    return result;
}

/**
 * Cast argument to number
 * @param {Object} arg - Argument
 * @returns {Number} numeric value of argument
 */
export function functionNumber(arg) {
    var result;

    // undefined inputs always return undefined
    if (typeof arg === "undefined") {
        return undefined;
    }

    if (typeof arg === "number") {
        // already a number
        result = arg;
    } else if (
        typeof arg === "string" &&
        /^-?(0|([1-9][0-9]*))(\.[0-9]+)?([Ee][-+]?[0-9]+)?$/.test(arg) &&
        !isNaN(parseFloat(arg)) &&
        isFinite(parseFloat(arg))
    ) {
        result = parseFloat(arg);
    } else {
        throw {
            code: "D3030",
            value: arg,
            stack: new Error().stack,
            index: 1,
        };
    }
    return result;
}

/**
 * Absolute value of a number
 * @param {Number} arg - Argument
 * @returns {Number} absolute value of argument
 */
export function functionAbs(arg) {
    var result;

    // undefined inputs always return undefined
    if (typeof arg === "undefined") {
        return undefined;
    }

    result = Math.abs(arg);
    return result;
}

/**
 * Rounds a number down to integer
 * @param {Number} arg - Argument
 * @returns {Number} rounded integer
 */
export function functionFloor(arg) {
    var result;

    // undefined inputs always return undefined
    if (typeof arg === "undefined") {
        return undefined;
    }

    result = Math.floor(arg);
    return result;
}

/**
 * Rounds a number up to integer
 * @param {Number} arg - Argument
 * @returns {Number} rounded integer
 */
export function functionCeil(arg) {
    var result;

    // undefined inputs always return undefined
    if (typeof arg === "undefined") {
        return undefined;
    }

    result = Math.ceil(arg);
    return result;
}

/**
 * Round to half even
 * @param {Number} arg - Argument
 * @param {Number} precision - number of decimal places
 * @returns {Number} rounded integer
 */
export function functionRound(arg, precision?) {
    var result;

    // undefined inputs always return undefined
    if (typeof arg === "undefined") {
        return undefined;
    }

    if (precision) {
        // shift the decimal place - this needs to be done in a string since multiplying
        // by a power of ten can introduce floating point precision errors which mess up
        // this rounding algorithm - See 'Decimal rounding' in
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
        // Shift
        var value = arg.toString().split("e");
        arg = +(value[0] + "e" + (value[1] ? +value[1] + precision : precision));
    }

    // round up to nearest int
    result = Math.round(arg);
    var diff = result - arg;
    if (Math.abs(diff) === 0.5 && Math.abs(result % 2) === 1) {
        // rounded the wrong way - adjust to nearest even number
        result = result - 1;
    }
    if (precision) {
        // Shift back
        value = result.toString().split("e");
        /* istanbul ignore next */
        result = +(value[0] + "e" + (value[1] ? +value[1] - precision : -precision));
    }
    if (Object.is(result, -0)) {
        // ESLint rule 'no-compare-neg-zero' suggests this way
        // JSON doesn't do -0
        result = 0;
    }
    return result;
}

/**
 * Square root of number
 * @param {Number} arg - Argument
 * @returns {Number} square root
 */
export function functionSqrt(arg) {
    var result;

    // undefined inputs always return undefined
    if (typeof arg === "undefined") {
        return undefined;
    }

    if (arg < 0) {
        throw {
            stack: new Error().stack,
            code: "D3060",
            index: 1,
            value: arg,
        };
    }

    result = Math.sqrt(arg);

    return result;
}

/**
 * Raises number to the power of the second number
 * @param {Number} arg - the base
 * @param {Number} exp - the exponent
 * @returns {Number} rounded integer
 */
export function functionPower(arg, exp) {
    var result;

    // undefined inputs always return undefined
    if (typeof arg === "undefined") {
        return undefined;
    }

    result = Math.pow(arg, exp);

    if (!isFinite(result)) {
        throw {
            stack: new Error().stack,
            code: "D3061",
            index: 1,
            value: arg,
            exp: exp,
        };
    }

    return result;
}

/**
 * Returns a random number 0 <= n < 1
 * @returns {number} random number
 */
export function functionRandom() {
    return Math.random();
}

/**
 * Evaluate an input and return a boolean
 * @param {*} arg - Arguments
 * @returns {boolean} Boolean
 */
export function functionBoolean(arg) {
    // cast arg to its effective boolean value
    // boolean: unchanged
    // string: zero-length -> false; otherwise -> true
    // number: 0 -> false; otherwise -> true
    // null -> false
    // array: empty -> false; length > 1 -> true
    // object: empty -> false; non-empty -> true
    // function -> false

    // undefined inputs always return undefined
    if (typeof arg === "undefined") {
        return undefined;
    }

    var result = false;
    if (Array.isArray(arg)) {
        if (arg.length === 1) {
            result = functionBoolean(arg[0]);
        } else if (arg.length > 1) {
            var trues = arg.filter(function(val) {
                return functionBoolean(val);
            });
            result = trues.length > 0;
        }
    } else if (typeof arg === "string") {
        if (arg.length > 0) {
            result = true;
        }
    } else if (isNumeric(arg)) {
        if (arg !== 0) {
            result = true;
        }
    } else if (arg !== null && typeof arg === "object") {
        if (Object.keys(arg).length > 0) {
            // make sure it's not a lambda function
            if (!(isLambda(arg) || arg._jsonata_function)) {
                result = true;
            }
        }
    } else if (typeof arg === "boolean" && arg === true) {
        result = true;
    }
    return result;
}

/**
 * returns the Boolean NOT of the arg
 * @param {*} arg - argument
 * @returns {boolean} - NOT arg
 */
export function functionNot(arg) {
    return !functionBoolean(arg);
}

/**
 * Create a map from an array of arguments
 * @param {Array} [arr] - array to map over
 * @param {Function} func - function to apply
 * @returns {Array} Map array
 */
function* functionMap(arr, func) {
    // undefined inputs always return undefined
    if (typeof arr === "undefined") {
        return undefined;
    }

    var result = createSequence();
    // do the map - iterate over the arrays, and invoke func
    for (var i = 0; i < arr.length; i++) {
        var func_args = [arr[i]]; // the first arg (value) is required
        // the other two are optional - only supply it if the function can take it
        var length =
            typeof func === "function"
                ? func.length
                : func._jsonata_function === true ? func.implementation.length : func.arguments.length;
        if (length >= 2) {
            func_args.push(i);
        }
        if (length >= 3) {
            func_args.push(arr);
        }
        // invoke func
        var res = yield* apply(func, func_args, null);
        if (typeof res !== "undefined") {
            result.push(res);
        }
    }

    return result;
}

// This generator function does not have a yield(), presumably to make it
// consistent with other similar functions.
/**
 * Create a map from an array of arguments
 * @param {Array} [arr] - array to filter
 * @param {Function} func - predicate function
 * @returns {Array} Map array
 */
function* functionFilter(arr, func) {
    // eslint-disable-line require-yield
    // undefined inputs always return undefined
    if (typeof arr === "undefined") {
        return undefined;
    }

    var result = createSequence();

    var predicate = function(value, index, array) {
        var it = apply(func, [value, index, array], null);
        // returns a generator - so iterate over it
        var res = it.next();
        while (!res.done) {
            res = it.next(res.value);
        }
        return res.value;
    };

    for (var i = 0; i < arr.length; i++) {
        var entry = arr[i];
        if (functionBoolean(predicate(entry, i, arr))) {
            result.push(entry);
        }
    }

    return result;
}

/**
 * Convolves (zips) each value from a set of arrays
 * @param {Array} [args] - arrays to zip
 * @returns {Array} Zipped array
 */
export function functionZip() {
    // this can take a variable number of arguments
    var result = [];
    var args = Array.prototype.slice.call(arguments);
    // length of the shortest array
    var length = Math.min.apply(
        Math,
        args.map(function(arg) {
            if (Array.isArray(arg)) {
                return arg.length;
            }
            return 0;
        }),
    );
    for (var i = 0; i < length; i++) {
        var tuple = args.map(arg => {
            return arg[i];
        });
        result.push(tuple);
    }
    return result;
}

/**
 * Fold left function
 * @param {Array} sequence - Sequence
 * @param {Function} func - Function
 * @param {Object} init - Initial value
 * @returns {*} Result
 */
function* functionFoldLeft(sequence, func, init) {
    // undefined inputs always return undefined
    if (typeof sequence === "undefined") {
        return undefined;
    }

    var result;

    if (
        !(
            func.length === 2 ||
            (func._jsonata_function === true && func.implementation.length === 2) ||
            func.arguments.length === 2
        )
    ) {
        throw {
            stack: new Error().stack,
            code: "D3050",
            index: 1,
        };
    }

    var index;
    if (typeof init === "undefined" && sequence.length > 0) {
        result = sequence[0];
        index = 1;
    } else {
        result = init;
        index = 0;
    }

    while (index < sequence.length) {
        result = yield* apply(func, [result, sequence[index]], null);
        index++;
    }

    return result;
}

/**
 * Return keys for an object
 * @param {Object} arg - Object
 * @returns {Array} Array of keys
 */
export function functionKeys(arg) {
    var result = createSequence();

    if (Array.isArray(arg)) {
        // merge the keys of all of the items in the array
        var merge = {};
        arg.forEach(function(item) {
            var keys = functionKeys(item);
            if (Array.isArray(keys)) {
                keys.forEach(function(key) {
                    merge[key] = true;
                });
            }
        });
        result = functionKeys(merge);
    } else if (arg !== null && typeof arg === "object" && !isLambda(arg)) {
        result = Object.keys(arg);
        if (result.length === 0) {
            result = undefined;
        }
    } else {
        result = undefined;
    }
    return result;
}

/**
 * Return value from an object for a given key
 * @param {Object} object - Object
 * @param {String} key - Key in object
 * @returns {*} Value of key in object
 */
export function functionLookup(object, key) {
    var result = evaluateName({ value: key }, object, {});
    return result;
}

/**
 * Append second argument to first
 * @param {Array|Object} arg1 - First argument
 * @param {Array|Object} arg2 - Second argument
 * @returns {*} Appended arguments
 */
export function functionAppend(arg1, arg2) {
    // disregard undefined args
    if (typeof arg1 === "undefined") {
        return arg2;
    }
    if (typeof arg2 === "undefined") {
        return arg1;
    }
    // if either argument is not an array, make it so
    if (!Array.isArray(arg1)) {
        arg1 = createSequence(arg1);
    }
    if (!Array.isArray(arg2)) {
        arg2 = [arg2];
    }
    Array.prototype.push.apply(arg1, arg2);
    return arg1;
}

/**
 * Determines if the argument is undefined
 * @param {*} arg - argument
 * @returns {boolean} False if argument undefined, otherwise true
 */
export function functionExists(arg) {
    if (typeof arg === "undefined") {
        return false;
    } else {
        return true;
    }
}

/**
 * Splits an object into an array of object with one property each
 * @param {*} arg - the object to split
 * @returns {*} - the array
 */
export function functionSpread(arg) {
    var result = createSequence();

    if (Array.isArray(arg)) {
        // spread all of the items in the array
        arg.forEach(function(item) {
            result = functionAppend(result, functionSpread(item));
        });
    } else if (arg !== null && typeof arg === "object" && !isLambda(arg)) {
        for (var key in arg) {
            var obj = {};
            obj[key] = arg[key];
            result.push(obj);
        }
    } else {
        result = arg;
    }
    return result;
}

/**
 * Merges an array of objects into a single object.  Duplicate properties are
 * overridden by entries later in the array
 * @param {*} arg - the objects to merge
 * @returns {*} - the object
 */
export function functionMerge(arg) {
    // undefined inputs always return undefined
    if (typeof arg === "undefined") {
        return undefined;
    }

    var result = {};

    arg.forEach(function(obj) {
        for (var prop in obj) {
            result[prop] = obj[prop];
        }
    });
    return result;
}

/**
 * Reverses the order of items in an array
 * @param {Array} arr - the array to reverse
 * @returns {Array} - the reversed array
 */
export function functionReverse(arr) {
    // undefined inputs always return undefined
    if (typeof arr === "undefined") {
        return undefined;
    }

    if (arr.length <= 1) {
        return arr;
    }

    var length = arr.length;
    var result = new Array(length);
    for (var i = 0; i < length; i++) {
        result[length - i - 1] = arr[i];
    }

    return result;
}

/**
 *
 * @param {*} obj - the input object to iterate over
 * @param {*} func - the function to apply to each key/value pair
 * @returns {Array} - the resultant array
 */
function* functionEach(obj, func) {
    var result = createSequence();

    for (var key in obj) {
        var func_args = [obj[key], key];
        // invoke func
        result.push(yield* apply(func, func_args, null));
    }

    return result;
}

/**
 * Implements the merge sort (stable) with optional comparator function
 *
 * @param {Array} arr - the array to sort
 * @param {*} comparator - comparator function
 * @returns {Array} - sorted array
 */
export function functionSort(arr, comparator) {
    // undefined inputs always return undefined
    if (typeof arr === "undefined") {
        return undefined;
    }

    if (arr.length <= 1) {
        return arr;
    }

    var comp;
    if (typeof comparator === "undefined") {
        // inject a default comparator - only works for numeric or string arrays
        if (!isArrayOfNumbers(arr) && !isArrayOfStrings(arr)) {
            throw {
                stack: new Error().stack,
                code: "D3070",
                index: 1,
            };
        }

        comp = function(a, b) {
            return a > b;
        };
    } else if (typeof comparator === "function") {
        // for internal usage of functionSort (i.e. order-by syntax)
        comp = comparator;
    } else {
        comp = function(a, b) {
            var it = apply(comparator, [a, b], null);
            // returns a generator - so iterate over it
            var comp = it.next();
            while (!comp.done) {
                comp = it.next(comp.value);
            }
            return comp.value;
        };
    }

    var merge = function(l, r) {
        var merge_iter = function(result, left, right) {
            if (left.length === 0) {
                Array.prototype.push.apply(result, right);
            } else if (right.length === 0) {
                Array.prototype.push.apply(result, left);
            } else if (comp(left[0], right[0])) {
                // invoke the comparator function
                // if it returns true - swap left and right
                result.push(right[0]);
                merge_iter(result, left, right.slice(1));
            } else {
                // otherwise keep the same order
                result.push(left[0]);
                merge_iter(result, left.slice(1), right);
            }
        };
        var merged = [];
        merge_iter(merged, l, r);
        return merged;
    };

    var sort = function(array) {
        if (array.length <= 1) {
            return array;
        } else {
            var middle = Math.floor(array.length / 2);
            var left = array.slice(0, middle);
            var right = array.slice(middle);
            left = sort(left);
            right = sort(right);
            return merge(left, right);
        }
    };

    var result = sort(arr);

    return result;
}

/**
 * Randomly shuffles the contents of an array
 * @param {Array} arr - the input array
 * @returns {Array} the shuffled array
 */
export function functionShuffle(arr) {
    // undefined inputs always return undefined
    if (typeof arr === "undefined") {
        return undefined;
    }

    if (arr.length <= 1) {
        return arr;
    }

    // shuffle using the 'inside-out' variant of the Fisher-Yates algorithm
    var result = new Array(arr.length);
    for (var i = 0; i < arr.length; i++) {
        var j = Math.floor(Math.random() * (i + 1)); // random integer such that 0 ≤ j ≤ i
        if (i !== j) {
            result[i] = result[j];
        }
        result[j] = arr[i];
    }

    return result;
}

/**
 * Applies a predicate function to each key/value pair in an object, and returns an object containing
 * only the key/value pairs that passed the predicate
 *
 * @param {object} arg - the object to be sifted
 * @param {object} func - the predicate function (lambda or native)
 * @returns {object} - sifted object
 */
export function functionSift(arg, func) {
    var result = {};

    var predicate = function(value, key, object) {
        var it = apply(func, [value, key, object], null);
        // returns a generator - so iterate over it
        var res = it.next();
        while (!res.done) {
            res = it.next(res.value);
        }
        return res.value;
    };

    for (var item in arg) {
        var entry = arg[item];
        if (functionBoolean(predicate(entry, item, arg))) {
            result[item] = entry;
        }
    }

    // empty objects should be changed to undefined
    if (Object.keys(result).length === 0) {
        result = undefined;
    }

    return result;
}

// Regular expression to match an ISO 8601 formatted timestamp
var iso8601regex = new RegExp("^\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d:[0-5]\\d|Z)$");

/**
 * Converts an ISO 8601 timestamp to milliseconds since the epoch
 *
 * @param {string} timestamp - the ISO 8601 timestamp to be converted
 * @returns {Number} - milliseconds since the epoch
 */
export function functionToMillis(timestamp) {
    // undefined inputs always return undefined
    if (typeof timestamp === "undefined") {
        return undefined;
    }

    if (!iso8601regex.test(timestamp)) {
        throw {
            stack: new Error().stack,
            code: "D3110",
            value: timestamp,
        };
    }

    return Date.parse(timestamp);
}

/**
 * Converts milliseconds since the epoch to an ISO 8601 timestamp
 * @param {Number} millis - milliseconds since the epoch to be converted
 * @returns {String} - an ISO 8601 formatted timestamp
 */
export function functionFromMillis(millis) {
    // undefined inputs always return undefined
    if (typeof millis === "undefined") {
        return undefined;
    }

    return new Date(millis).toISOString();
}

/**
 * Clones an object
 * @param {Object} arg - object to clone (deep copy)
 * @returns {*} - the cloned object
 */
export function functionClone(arg) {
    // undefined inputs always return undefined
    if (typeof arg === "undefined") {
        return undefined;
    }

    return JSON.parse(functionString(arg));
}

export function createStandardFrame() {
    const staticFrame = createFrame(null);
    bindStandardFunctions(staticFrame);
    return staticFrame;    
}

export function bindStandardFunctions(frame) {
        // Function registration
        frame.bind('sum', defineFunction(functionSum, '<a<n>:n>'));
        frame.bind('count', defineFunction(functionCount, '<a:n>'));
        frame.bind('max', defineFunction(functionMax, '<a<n>:n>'));
        frame.bind('min', defineFunction(functionMin, '<a<n>:n>'));
        frame.bind('average', defineFunction(functionAverage, '<a<n>:n>'));
        frame.bind('string', defineFunction(functionString, '<x-:s>'));
        frame.bind('substring', defineFunction(functionSubstring, '<s-nn?:s>'));
        frame.bind('substringBefore', defineFunction(functionSubstringBefore, '<s-s:s>'));
        frame.bind('substringAfter', defineFunction(functionSubstringAfter, '<s-s:s>'));
        frame.bind('lowercase', defineFunction(functionLowercase, '<s-:s>'));
        frame.bind('uppercase', defineFunction(functionUppercase, '<s-:s>'));
        frame.bind('length', defineFunction(functionLength, '<s-:n>'));
        frame.bind('trim', defineFunction(functionTrim, '<s-:s>'));
        frame.bind('pad', defineFunction(functionPad, '<s-ns?:s>'));
        frame.bind('match', defineFunction(functionMatch, '<s-f<s:o>n?:a<o>>'));
        frame.bind('contains', defineFunction(functionContains, '<s-(sf):b>')); // TODO <s-(sf<s:o>):b>
        frame.bind('replace', defineFunction(functionReplace, '<s-(sf)(sf)n?:s>')); // TODO <s-(sf<s:o>)(sf<o:s>)n?:s>
        frame.bind('split', defineFunction(functionSplit, '<s-(sf)n?:a<s>>')); // TODO <s-(sf<s:o>)n?:a<s>>
        frame.bind('join', defineFunction(functionJoin, '<a<s>s?:s>'));
        frame.bind('formatNumber', defineFunction(functionFormatNumber, '<n-so?:s>'));
        frame.bind('formatBase', defineFunction(functionFormatBase, '<n-n?:s>'));
        frame.bind('number', defineFunction(functionNumber, '<(ns)-:n>'));
        frame.bind('floor', defineFunction(functionFloor, '<n-:n>'));
        frame.bind('ceil', defineFunction(functionCeil, '<n-:n>'));
        frame.bind('round', defineFunction(functionRound, '<n-n?:n>'));
        frame.bind('abs', defineFunction(functionAbs, '<n-:n>'));
        frame.bind('sqrt', defineFunction(functionSqrt, '<n-:n>'));
        frame.bind('power', defineFunction(functionPower, '<n-n:n>'));
        frame.bind('random', defineFunction(functionRandom, '<:n>'));
        frame.bind('boolean', defineFunction(functionBoolean, '<x-:b>'));
        frame.bind('not', defineFunction(functionNot, '<x-:b>'));
        frame.bind('map', defineFunction(functionMap, '<af>'));
        frame.bind('zip', defineFunction(functionZip, '<a+>'));
        frame.bind('filter', defineFunction(functionFilter, '<af>'));
        frame.bind('reduce', defineFunction(functionFoldLeft, '<afj?:j>')); // TODO <f<jj:j>a<j>j?:j>
        frame.bind('sift', defineFunction(functionSift, '<o-f?:o>'));
        frame.bind('keys', defineFunction(functionKeys, '<x-:a<s>>'));
        frame.bind('lookup', defineFunction(functionLookup, '<x-s:x>'));
        frame.bind('append', defineFunction(functionAppend, '<xx:a>'));
        frame.bind('exists', defineFunction(functionExists, '<x:b>'));
        frame.bind('spread', defineFunction(functionSpread, '<x-:a<o>>'));
        frame.bind('merge', defineFunction(functionMerge, '<a<o>:o>'));
        frame.bind('reverse', defineFunction(functionReverse, '<a:a>'));
        frame.bind('each', defineFunction(functionEach, '<o-f:a>'));
        frame.bind('sort', defineFunction(functionSort, '<af?:a>'));
        frame.bind('shuffle', defineFunction(functionShuffle, '<a:a>'));
        frame.bind('base64encode', defineFunction(functionBase64encode, '<s-:s>'));
        frame.bind('base64decode', defineFunction(functionBase64decode, '<s-:s>'));
        frame.bind('toMillis', defineFunction(functionToMillis, '<s-:n>'));
        frame.bind('fromMillis', defineFunction(functionFromMillis, '<n-:s>'));
        frame.bind('clone', defineFunction(functionClone, '<(oa)-:o>'));
    
    
}