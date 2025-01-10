/**
 * © Copyright IBM Corp. 2018 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

const utils = require('./utils');

/**
 * DateTime formatting and parsing functions
 * Implements the xpath-functions format-date-time specification
 * @type {{formatInteger, formatDateTime, parseInteger, parseDateTime}}
 */
const dateTime = (function () {
    'use strict';

    const stringToArray = utils.stringToArray;

    const few = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const ordinals = ['Zeroth', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth',
        'Eleventh', 'Twelfth', 'Thirteenth', 'Fourteenth', 'Fifteenth', 'Sixteenth', 'Seventeenth', 'Eighteenth', 'Nineteenth'];
    const decades = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety', 'Hundred'];
    const magnitudes = ['Thousand', 'Million', 'Billion', 'Trillion'];

    /**
     * converts a number into english words
     * @param {string} value - the value to format
     * @param {boolean} ordinal - ordinal or cardinal form
     * @returns {string} - representation in words
     */
    function numberToWords(value, ordinal) {
        var lookup = function (num, prev, ord) {
            var words = '';
            if (num <= 19) {
                words = (prev ? ' and ' : '') + (ord ? ordinals[num] : few[num]);
            } else if (num < 100) {
                const tens = Math.floor(num / 10);
                const remainder = num % 10;
                words = (prev ? ' and ' : '') + decades[tens - 2];
                if (remainder > 0) {
                    words += '-' + lookup(remainder, false, ord);
                } else if (ord) {
                    words = words.substring(0, words.length - 1) + 'ieth';
                }
            } else if (num < 1000) {
                const hundreds = Math.floor(num / 100);
                const remainder = num % 100;
                words = (prev ? ', ' : '') + few[hundreds] + ' Hundred';
                if (remainder > 0) {
                    words += lookup(remainder, true, ord);
                } else if (ord) {
                    words += 'th';
                }
            } else {
                var mag = Math.floor(Math.log10(num) / 3);
                if (mag > magnitudes.length) {
                    mag = magnitudes.length; // the largest word
                }
                const factor = Math.pow(10, mag * 3);
                const mant = Math.floor(num / factor);
                const remainder = num - mant * factor;
                words = (prev ? ', ' : '') + lookup(mant, false, false) + ' ' + magnitudes[mag - 1];
                if (remainder > 0) {
                    words += lookup(remainder, true, ord);
                } else if (ord) {
                    words += 'th';
                }
            }
            return words;
        };

        var words = lookup(value, false, ordinal);
        return words;
    }

    const wordValues = {};
    few.forEach(function (word, index) {
        wordValues[word.toLowerCase()] = index;
    });
    ordinals.forEach(function (word, index) {
        wordValues[word.toLowerCase()] = index;
    });
    decades.forEach(function (word, index) {
        const lword = word.toLowerCase();
        wordValues[lword] = (index + 2) * 10;
        wordValues[lword.substring(0, word.length - 1) + 'ieth'] = wordValues[lword];
    });
    wordValues.hundredth = 100;
    magnitudes.forEach(function (word, index) {
        const lword = word.toLowerCase();
        const val = Math.pow(10, (index + 1) * 3);
        wordValues[lword] = val;
        wordValues[lword + 'th'] = val;
    });

    /**
     * Converts a number in english words to numeric value
     * @param {string} text - the number in words
     * @returns {number} - the numeric value
     */
    function wordsToNumber(text) {
        const parts = text.split(/,\s|\sand\s|[\s\\-]/);
        const values = parts.map(part => wordValues[part]);
        let segs = [0];
        values.forEach(value => {
            if (value < 100) {
                let top = segs.pop();
                if (top >= 1000) {
                    segs.push(top);
                    top = 0;
                }
                segs.push(top + value);
            } else {
                segs.push(segs.pop() * value);
            }
        });
        const result = segs.reduce((a, b) => a + b, 0);
        return result;
    }

    const romanNumerals = [
        [1000, 'm'],
        [900, 'cm'],
        [500, 'd'],
        [400, 'cd'],
        [100, 'c'],
        [90, 'xc'],
        [50, 'l'],
        [40, 'xl'],
        [10, 'x'],
        [9, 'ix'],
        [5, 'v'],
        [4, 'iv'],
        [1, 'i']
    ];

    const romanValues = {'M': 1000, 'D': 500, 'C': 100, 'L': 50, 'X': 10, 'V': 5, 'I': 1};

    /**
     * converts a number to roman numerals
     * @param {number} value - the number
     * @returns {string} - the number in roman numerals
     */
    function decimalToRoman(value) {
        for (var index = 0; index < romanNumerals.length; index++) {
            const numeral = romanNumerals[index];
            if (value >= numeral[0]) {
                return numeral[1] + decimalToRoman(value - numeral[0]);
            }
        }
        return '';
    }

    /**
     * converts roman numerals to a number
     * @param {string} roman - roman number
     * @returns {number} - the numeric value
     */
    function romanToDecimal(roman) {
        var decimal = 0;
        var max = 1;
        for (var i = roman.length - 1; i >= 0; i--) {
            const digit = roman[i];
            const value = romanValues[digit];
            if (value < max) {
                decimal -= value;
            } else {
                max = value;
                decimal += value;
            }
        }
        return decimal;
    }

    /**
     * converts a number to spreadsheet style letters
     * @param {number} value - the number
     * @param {string} aChar - the character representing the start of the sequence, e.g. 'A'
     * @returns {string} - the letters
     */
    function decimalToLetters(value, aChar) {
        var letters = [];
        var aCode = aChar.charCodeAt(0);
        while (value > 0) {
            letters.unshift(String.fromCharCode((value - 1) % 26 + aCode));
            value = Math.floor((value - 1) / 26);
        }
        return letters.join('');
    }

    /**
     * converts spreadsheet style letters to a number
     * @param {string} letters - the letters
     * @param {string} aChar - the character representing the start of the sequence, e.g. 'A'
     * @returns {number} - the numeric value
     */
    function lettersToDecimal(letters, aChar) {
        var aCode = aChar.charCodeAt(0);
        var decimal = 0;
        for (var i = 0; i < letters.length; i++) {
            decimal += (letters.charCodeAt(letters.length - i - 1) - aCode + 1) * Math.pow(26, i);
        }
        return decimal;
    }

    /**
     * Formats an integer as specified by the XPath fn:format-integer function
     * See https://www.w3.org/TR/xpath-functions-31/#func-format-integer
     * @param {number} value - the number to be formatted
     * @param {string} picture - the picture string that specifies the format
     * @returns {string} - the formatted number
     */
    function formatInteger(value, picture) {
        if (typeof value === 'undefined') {
            return undefined;
        }

        value = Math.floor(value);

        const format = analyseIntegerPicture(picture);
        return _formatInteger(value, format);
    }

    const formats = {
        DECIMAL: 'decimal',
        LETTERS: 'letters',
        ROMAN: 'roman',
        WORDS: 'words',
        SEQUENCE: 'sequence'
    };

    const tcase = {
        UPPER: 'upper',
        LOWER: 'lower',
        TITLE: 'title'
    };

    /**
     * formats an integer using a preprocessed representation of the picture string
     * @param {number} value - the number to be formatted
     * @param {object} format - the preprocessed representation of the pucture string
     * @returns {string} - the formatted number
     * @private
     */
    function _formatInteger(value, format) {
        let formattedInteger;
        const negative = value < 0;
        value = Math.abs(value);
        switch (format.primary) {
            case formats.LETTERS:
                formattedInteger = decimalToLetters(value, format.case === tcase.UPPER ? 'A' : 'a');
                break;
            case formats.ROMAN:
                formattedInteger = decimalToRoman(value);
                if (format.case === tcase.UPPER) {
                    formattedInteger = formattedInteger.toUpperCase();
                }
                break;
            case formats.WORDS:
                formattedInteger = numberToWords(value, format.ordinal);
                if (format.case === tcase.UPPER) {
                    formattedInteger = formattedInteger.toUpperCase();
                } else if (format.case === tcase.LOWER) {
                    formattedInteger = formattedInteger.toLowerCase();
                }
                break;
            case formats.DECIMAL:
                formattedInteger = '' + value;
                // TODO use functionPad
                var padLength = format.mandatoryDigits - formattedInteger.length;
                if (padLength > 0) {
                    var padding = (new Array(padLength + 1)).join('0');
                    formattedInteger = padding + formattedInteger;
                }
                if (format.zeroCode !== 0x30) {
                    formattedInteger = stringToArray(formattedInteger).map(code => {
                        return String.fromCodePoint(code.codePointAt(0) + format.zeroCode - 0x30);
                    }).join('');
                }
                // insert the grouping-separator-signs, if any
                if (format.regular) {
                    const n = Math.floor((formattedInteger.length - 1) / format.groupingSeparators.position);
                    for (let ii = n; ii > 0; ii--) {
                        const pos = formattedInteger.length - ii * format.groupingSeparators.position;
                        formattedInteger = formattedInteger.substr(0, pos) + format.groupingSeparators.character + formattedInteger.substr(pos);
                    }
                } else {
                    format.groupingSeparators.reverse().forEach(separator => {
                        const pos = formattedInteger.length - separator.position;
                        formattedInteger = formattedInteger.substr(0, pos) + separator.character + formattedInteger.substr(pos);
                    });
                }

                if (format.ordinal) {
                    var suffix123 = {'1': 'st', '2': 'nd', '3': 'rd'};
                    var lastDigit = formattedInteger[formattedInteger.length - 1];
                    var suffix = suffix123[lastDigit];
                    if (!suffix || (formattedInteger.length > 1 && formattedInteger[formattedInteger.length - 2] === '1')) {
                        suffix = 'th';
                    }
                    formattedInteger = formattedInteger + suffix;
                }
                break;
            case formats.SEQUENCE:
                throw {
                    code: 'D3130',
                    value: format.token
                };
        }
        if (negative) {
            formattedInteger = '-' + formattedInteger;
        }

        return formattedInteger;
    }

    //TODO what about decimal groups in the unicode supplementary planes (surrogate pairs) ???
    const decimalGroups = [0x30, 0x0660, 0x06F0, 0x07C0, 0x0966, 0x09E6, 0x0A66, 0x0AE6, 0x0B66, 0x0BE6, 0x0C66, 0x0CE6, 0x0D66, 0x0DE6, 0x0E50, 0x0ED0, 0x0F20, 0x1040, 0x1090, 0x17E0, 0x1810, 0x1946, 0x19D0, 0x1A80, 0x1A90, 0x1B50, 0x1BB0, 0x1C40, 0x1C50, 0xA620, 0xA8D0, 0xA900, 0xA9D0, 0xA9F0, 0xAA50, 0xABF0, 0xFF10];

    /**
     * preprocesses the picture string
     * @param {string} picture - picture string
     * @returns {{type: string, primary: string, case: string, ordinal: boolean}} - analysed picture
     */
    function analyseIntegerPicture(picture) {
        const format = {
            type: 'integer',
            primary: formats.DECIMAL,
            case: tcase.LOWER,
            ordinal: false
        };

        let primaryFormat, formatModifier;
        const semicolon = picture.lastIndexOf(';');
        if (semicolon === -1) {
            primaryFormat = picture;
        } else {
            primaryFormat = picture.substring(0, semicolon);
            formatModifier = picture.substring(semicolon + 1);
            if (formatModifier[0] === 'o') {
                format.ordinal = true;
            }
        }

        /* eslnt-disable-next no-fallthrough */
        switch (primaryFormat) {
            case 'A':
                format.case = tcase.UPPER;
            /* eslnt-disable-next-line no-fallthrough */
            case 'a':
                format.primary = formats.LETTERS;
                break;
            case 'I':
                format.case = tcase.UPPER;
            /* eslnt-disable-next-line no-fallthrough */
            case 'i':
                format.primary = formats.ROMAN;
                break;
            case 'W':
                format.case = tcase.UPPER;
                format.primary = formats.WORDS;
                break;
            case 'Ww':
                format.case = tcase.TITLE;
                format.primary = formats.WORDS;
                break;
            case 'w':
                format.primary = formats.WORDS;
                break;
            default: {
                // this is a decimal-digit-pattern if it contains a decimal digit (from any unicode decimal digit group)
                let zeroCode = null;
                let mandatoryDigits = 0;
                let optionalDigits = 0;
                let groupingSeparators = [];
                let separatorPosition = 0;
                const formatCodepoints = stringToArray(primaryFormat).map(c => c.codePointAt(0)).reverse(); // reverse the array to determine positions of grouping-separator-signs
                formatCodepoints.forEach((codePoint) => {
                    // step though each char in the picture to determine the digit group
                    let digit = false;
                    for (let ii = 0; ii < decimalGroups.length; ii++) {
                        const group = decimalGroups[ii];
                        if (codePoint >= group && codePoint <= group + 9) {
                            // codepoint is part of this decimal group
                            digit = true;
                            mandatoryDigits++;
                            separatorPosition++;
                            if (zeroCode === null) {
                                zeroCode = group;
                            } else if (group !== zeroCode) {
                                // error! different decimal groups in the same pattern
                                throw {
                                    code: 'D3131'
                                };
                            }
                            break;
                        }
                    }
                    if (!digit) {
                        if (codePoint === 0x23) { // # - optional-digit-sign
                            separatorPosition++;
                            optionalDigits++;
                        } else {
                            // neither a decimal-digit-sign ot optional-digit-sign, assume it is a grouping-separator-sign
                            groupingSeparators.push({
                                position: separatorPosition,
                                character: String.fromCodePoint(codePoint)
                            });
                        }
                    }
                });
                if (mandatoryDigits > 0) {
                    format.primary = formats.DECIMAL;
                    // TODO validate decimal-digit-pattern

                    // the decimal digit family (codepoint offset)
                    format.zeroCode = zeroCode;
                    // the number of mandatory digits
                    format.mandatoryDigits = mandatoryDigits;
                    // the number of optional digits
                    format.optionalDigits = optionalDigits;
                    // grouping separator template
                    // are the grouping-separator-signs 'regular'?
                    const regularRepeat = function (separators) {
                        // are the grouping positions regular? i.e. same interval between each of them
                        // is there at least one separator?
                        if (separators.length === 0) {
                            return 0;
                        }
                        // are all the characters the same?
                        const sepChar = separators[0].character;
                        for (let ii = 1; ii < separators.length; ii++) {
                            if (separators[ii].character !== sepChar) {
                                return 0;
                            }
                        }
                        // are they equally spaced?
                        const indexes = separators.map(separator => separator.position);
                        const gcd = function (a, b) {
                            return b === 0 ? a : gcd(b, a % b);
                        };
                        // find the greatest common divisor of all the positions
                        const factor = indexes.reduce(gcd);
                        // is every position separated by this divisor? If so, it's regular
                        for (let index = 1; index <= indexes.length; index++) {
                            if (indexes.indexOf(index * factor) === -1) {
                                return 0;
                            }
                        }
                        return factor;
                    };

                    const regular = regularRepeat(groupingSeparators);
                    if (regular > 0) {
                        format.regular = true;
                        format.groupingSeparators = {
                            position: regular,
                            character: groupingSeparators[0].character
                        };
                    } else {
                        format.regular = false;
                        format.groupingSeparators = groupingSeparators;
                    }

                } else {
                    // this is a 'numbering sequence' which the spec says is implementation-defined
                    // this implementation doesn't support any numbering sequences at the moment.
                    format.primary = formats.SEQUENCE;
                    format.token = primaryFormat;
                }
            }
        }

        return format;
    }

    const defaultPresentationModifiers = {
        Y: '1', M: '1', D: '1', d: '1', F: 'n', W: '1', w: '1', X: '1', x: '1', H: '1', h: '1',
        P: 'n', m: '01', s: '01', f: '1', Z: '01:01', z: '01:01', C: 'n', E: 'n'
    };

    // §9.8.4.1 the format specifier is an array of string literals and variable markers
    /**
     * analyse the date-time picture string
     * @param {string} picture - picture string
     * @returns {{type: string, parts: Array}} - the analysed string
     */
    function analyseDateTimePicture(picture) {
        var spec = [];
        const format = {
            type: 'datetime',
            parts: spec
        };
        const addLiteral = function (start, end) {
            if (end > start) {
                let literal = picture.substring(start, end);
                // replace any doubled ]] with single ]
                // what if there are instances of single ']' ? - the spec doesn't say
                literal = literal.split(']]').join(']');
                spec.push({type: 'literal', value: literal});
            }
        };

        var start = 0, pos = 0;
        while (pos < picture.length) {
            if (picture.charAt(pos) === '[') {
                // check it's not a doubled [[
                if (picture.charAt(pos + 1) === '[') {
                    // literal [
                    addLiteral(start, pos);
                    spec.push({type: 'literal', value: '['});
                    pos += 2;
                    start = pos;
                    continue;
                }
                // start of variable marker
                // push the string literal (if there is one) onto the array
                addLiteral(start, pos);
                start = pos;
                // search forward to closing ]
                pos = picture.indexOf(']', start);
                // TODO handle error case if pos === -1
                if(pos === -1) {
                    // error - no closing bracket
                    throw {
                        code: 'D3135'
                    };
                }
                let marker = picture.substring(start + 1, pos);
                // whitespace within a variable marker is ignored (i.e. remove it)
                marker = marker.split(/\s+/).join('');
                var def = {
                    type: 'marker',
                    component: marker.charAt(0)  // 1. The component specifier is always present and is always a single letter.
                };
                var comma = marker.lastIndexOf(','); // 2. The width modifier may be recognized by the presence of a comma
                var presMod; // the presentation modifiers
                if (comma !== -1) {
                    // §9.8.4.2 The Width Modifier
                    const widthMod = marker.substring(comma + 1);
                    const dash = widthMod.indexOf('-');
                    let min, max;
                    const parseWidth = function (wm) {
                        if (typeof wm === 'undefined' || wm === '*') {
                            return undefined;
                        } else {
                            // TODO validate wm is an unsigned int
                            return parseInt(wm);
                        }
                    };
                    if (dash === -1) {
                        min = widthMod;
                    } else {
                        min = widthMod.substring(0, dash);
                        max = widthMod.substring(dash + 1);
                    }
                    const widthDef = {
                        min: parseWidth(min),
                        max: parseWidth(max)
                    };
                    def.width = widthDef;
                    presMod = marker.substring(1, comma);
                } else {
                    presMod = marker.substring(1);
                }
                if (presMod.length === 1) {
                    def.presentation1 = presMod; // first presentation modifier
                    //TODO validate the first presentation modifier - it's either N, n, Nn or it passes analyseIntegerPicture
                } else if (presMod.length > 1) {
                    var lastChar = presMod.charAt(presMod.length - 1);
                    if ('atco'.indexOf(lastChar) !== -1) {
                        def.presentation2 = lastChar;
                        if (lastChar === 'o') {
                            def.ordinal = true;
                        }
                        // 'c' means 'cardinal' and is the default (i.e. not 'ordinal')
                        // 'a' & 't' are ignored (not sure of their relevance to English numbering)
                        def.presentation1 = presMod.substring(0, presMod.length - 1);
                    } else {
                        def.presentation1 = presMod;
                        //TODO validate the first presentation modifier - it's either N, n, Nn or it passes analyseIntegerPicture,
                        // doesn't use ] as grouping separator, and if grouping separator is , then must have width modifier
                    }
                } else {
                    // no presentation modifier specified - apply the default;
                    def.presentation1 = defaultPresentationModifiers[def.component];
                }
                if (typeof def.presentation1 === 'undefined') {
                    // unknown component specifier
                    throw {
                        code: 'D3132',
                        value: def.component
                    };
                }
                if (def.presentation1[0] === 'n') {
                    def.names = tcase.LOWER;
                } else if (def.presentation1[0] === 'N') {
                    if (def.presentation1[1] === 'n') {
                        def.names = tcase.TITLE;
                    } else {
                        def.names = tcase.UPPER;
                    }
                } else if ('YMDdFWwXxHhmsf'.indexOf(def.component) !== -1) {
                    var integerPattern = def.presentation1;
                    if (def.presentation2) {
                        integerPattern += ';' + def.presentation2;
                    }
                    def.integerFormat = analyseIntegerPicture(integerPattern);
                    if (def.width && def.width.min !== undefined) {
                        if (def.integerFormat.mandatoryDigits < def.width.min) {
                            def.integerFormat.mandatoryDigits = def.width.min;
                        }
                    }
                    if (def.component === 'Y') {
                        // §9.8.4.4
                        def.n = -1;
                        if (def.width && def.width.max !== undefined) {
                            def.n = def.width.max;
                            def.integerFormat.mandatoryDigits = def.n;
                        } else {
                            var w = def.integerFormat.mandatoryDigits + def.integerFormat.optionalDigits;
                            if (w >= 2) {
                                def.n = w;
                            }
                        }
                    }
                    // if the previous part is also an integer with no intervening markup, then its width for parsing must be precisely defined
                    const previousPart = spec[spec.length - 1];
                    if (previousPart && previousPart.integerFormat) {
                        previousPart.integerFormat.parseWidth = previousPart.integerFormat.mandatoryDigits;
                    }
                }
                if (def.component === 'Z' || def.component === 'z') {
                    def.integerFormat = analyseIntegerPicture(def.presentation1);
                }
                spec.push(def);
                start = pos + 1;
            }
            pos++;
        }
        addLiteral(start, pos);
        return format;
    }

    const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const millisInADay = 1000 * 60 * 60 * 24;

    const startOfFirstWeek = function (ym) {
        // ISO 8601 defines the first week of the year to be the week that contains the first Thursday
        // XPath F&O extends this same definition for the first week of a month
        // the week starts on a Monday - calculate the millis for the start of the first week
        // millis for given 1st Jan of that year (at 00:00 UTC)
        const jan1 = Date.UTC(ym.year, ym.month);
        var dayOfJan1 = (new Date(jan1)).getUTCDay();
        if (dayOfJan1 === 0) {
            dayOfJan1 = 7;
        }
        // if Jan 1 is Fri, Sat or Sun, then add the number of days (in millis) to jan1 to get the start of week 1
        return dayOfJan1 > 4 ? jan1 + (8 - dayOfJan1) * millisInADay : jan1 - (dayOfJan1 - 1) * millisInADay;
    };

    const yearMonth = function (year, month) {
        return {
            year: year,
            month: month,
            nextMonth: function () {
                return (month === 11) ? yearMonth(year + 1, 0) : yearMonth(year, month + 1);
            },
            previousMonth: function () {
                return (month === 0) ? yearMonth(year - 1, 11) : yearMonth(year, month - 1);
            },
            nextYear: function () {
                return yearMonth(year + 1, month);
            },
            previousYear: function () {
                return yearMonth(year - 1, month);
            }
        };
    };

    const deltaWeeks = function (start, end) {
        return (end - start) / (millisInADay * 7) + 1;
    };

    const getDateTimeFragment = (date, component) => {
        let componentValue;
        switch (component) {
            case 'Y': // year
                componentValue = date.getUTCFullYear();
                break;
            case 'M': // month in year
                componentValue = date.getUTCMonth() + 1;
                break;
            case 'D': // day in month
                componentValue = date.getUTCDate();
                break;
            case 'd': { // day in year
                // millis for given date (at 00:00 UTC)
                const today = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
                // millis for given 1st Jan of that year (at 00:00 UTC)
                const firstJan = Date.UTC(date.getUTCFullYear(), 0);
                componentValue = (today - firstJan) / millisInADay + 1;
                break;
            }
            case 'F': // day of week
                componentValue = date.getUTCDay();
                if (componentValue === 0) {
                    // ISO 8601 defines days 1-7: Mon-Sun
                    componentValue = 7;
                }
                break;
            case 'W': { // week in year
                const thisYear = yearMonth(date.getUTCFullYear(), 0);
                const startOfWeek1 = startOfFirstWeek(thisYear);
                const today = Date.UTC(thisYear.year, date.getUTCMonth(), date.getUTCDate());
                let week = deltaWeeks(startOfWeek1, today);
                if (week > 52) {
                    // might be first week of the following year
                    const startOfFollowingYear = startOfFirstWeek(thisYear.nextYear());
                    if (today >= startOfFollowingYear) {
                        week = 1;
                    }
                } else if (week < 1) {
                    // must be end of the previous year
                    const startOfPreviousYear = startOfFirstWeek(thisYear.previousYear());
                    week = deltaWeeks(startOfPreviousYear, today);
                }
                componentValue = Math.floor(week);
                break;
            }
            case 'w': { // week in month
                const thisMonth = yearMonth(date.getUTCFullYear(), date.getUTCMonth());
                const startOfWeek1 = startOfFirstWeek(thisMonth);
                const today = Date.UTC(thisMonth.year, thisMonth.month, date.getUTCDate());
                let week = deltaWeeks(startOfWeek1, today);
                if (week > 4) {
                    // might be first week of the following month
                    const startOfFollowingMonth = startOfFirstWeek(thisMonth.nextMonth());
                    if (today >= startOfFollowingMonth) {
                        week = 1;
                    }
                } else if (week < 1) {
                    // must be end of the previous month
                    const startOfPreviousMonth = startOfFirstWeek(thisMonth.previousMonth());
                    week = deltaWeeks(startOfPreviousMonth, today);
                }
                componentValue = Math.floor(week);
                break;
            }
            case 'X': { // ISO week-numbering year
                // Extension: The F&O spec says nothing about how to access the year associated with the week-of-the-year
                // e.g. Sat 1 Jan 2005 is in the 53rd week of 2004.
                // The 'W' component specifier gives 53, but 'Y' will give 2005.
                // I propose to add 'X' as the component specifier to give the ISO week-numbering year (2004 in this example)
                const thisYear = yearMonth(date.getUTCFullYear(), 0);
                const startOfISOYear = startOfFirstWeek(thisYear);
                const endOfISOYear = startOfFirstWeek(thisYear.nextYear());
                const now = date.getTime();
                if (now < startOfISOYear) {
                    componentValue = thisYear.year - 1;
                } else if (now >= endOfISOYear) {
                    componentValue = thisYear.year + 1;
                } else {
                    componentValue = thisYear.year;
                }
                break;
            }
            case 'x': { // ISO week-numbering month
                // Extension: The F&O spec says nothing about how to access the month associated with the week-of-the-month
                // e.g. Sat 1 Jan 2005 is in the 5th week of December 2004.
                // The 'w' component specifier gives 5, but 'W' will give January and 'Y' will give 2005.
                // I propose to add 'x' as the component specifier to give the 'week-numbering' month (December in this example)
                const thisMonth = yearMonth(date.getUTCFullYear(), date.getUTCMonth());
                const startOfISOMonth = startOfFirstWeek(thisMonth);
                const nextMonth = thisMonth.nextMonth();
                const endOfISOMonth = startOfFirstWeek(nextMonth);
                const now = date.getTime();
                if (now < startOfISOMonth) {
                    componentValue = thisMonth.previousMonth().month + 1;
                } else if (now >= endOfISOMonth) {
                    componentValue = nextMonth.month + 1;
                } else {
                    componentValue = thisMonth.month + 1;
                }
                break;
            }
            case 'H': // hour in day (24 hours)
                componentValue = date.getUTCHours();
                break;
            case 'h': // hour in half-day (12 hours)
                componentValue = date.getUTCHours();
                componentValue = componentValue % 12;
                if (componentValue === 0) {
                    componentValue = 12;
                }
                break;
            case 'P': // am/pm marker
                componentValue = date.getUTCHours() >= 12 ? 'pm' : 'am';
                break;
            case 'm': // minute in hour
                componentValue = date.getUTCMinutes();
                break;
            case 's': // second in minute
                componentValue = date.getUTCSeconds();
                break;
            case 'f': // fractional seconds
                componentValue = date.getUTCMilliseconds();
                break;
            case 'Z': // timezone
            case 'z':
                // since the date object is constructed from epoch millis, the TZ component is always be UTC.
                break;
            case 'C': // calendar name
                componentValue = 'ISO';
                break;
            case 'E': // era
                componentValue = 'ISO';
                break;
        }
        return componentValue;
    };

    let iso8601Spec = null;

    /**
     * formats the date/time as specified by the XPath fn:format-dateTime function
     * @param {number} millis - the timestamp to be formatted, in millis since the epoch
     * @param {string} picture - the picture string that specifies the format
     * @param {string} timezone - the timezone to use
     * @returns {string} - the formatted timestamp
     */
    function formatDateTime(millis, picture, timezone) {
        var offsetHours = 0;
        var offsetMinutes = 0;

        if (typeof timezone !== 'undefined') {
            // parse the hour and minute offsets
            // assume for now the format supplied is +hhmm
            const offset = parseInt(timezone);
            offsetHours = Math.floor(offset / 100);
            offsetMinutes = offset % 100;
        }

        var formatComponent = function (date, markerSpec) {
            var componentValue = getDateTimeFragment(date, markerSpec.component);

            // §9.8.4.3 Formatting Integer-Valued Date/Time Components
            if ('YMDdFWwXxHhms'.indexOf(markerSpec.component) !== -1) {
                if (markerSpec.component === 'Y') {
                    // §9.8.4.4 Formatting the Year Component
                    if (markerSpec.n !== -1) {
                        componentValue = componentValue % Math.pow(10, markerSpec.n);
                    }
                }
                if (markerSpec.names) {
                    if (markerSpec.component === 'M' || markerSpec.component === 'x') {
                        componentValue = months[componentValue - 1];
                    } else if (markerSpec.component === 'F') {
                        componentValue = days[componentValue];
                    } else {
                        throw {
                            code: 'D3133',
                            value: markerSpec.component
                        };
                    }
                    if (markerSpec.names === tcase.UPPER) {
                        componentValue = componentValue.toUpperCase();
                    } else if (markerSpec.names === tcase.LOWER) {
                        componentValue = componentValue.toLowerCase();
                    }
                    if (markerSpec.width && componentValue.length > markerSpec.width.max) {
                        componentValue = componentValue.substring(0, markerSpec.width.max);
                    }
                } else {
                    componentValue = _formatInteger(componentValue, markerSpec.integerFormat);
                }
            } else if (markerSpec.component === 'f') {
                // TODO §9.8.4.5 Formatting Fractional Seconds
                componentValue = _formatInteger(componentValue, markerSpec.integerFormat);
            } else if (markerSpec.component === 'Z' || markerSpec.component === 'z') {
                // §9.8.4.6 Formatting timezones
                const offset = offsetHours * 100 + offsetMinutes;
                if (markerSpec.integerFormat.regular) {
                    componentValue = _formatInteger(offset, markerSpec.integerFormat);
                } else {
                    const numDigits = markerSpec.integerFormat.mandatoryDigits;
                    if (numDigits === 1 || numDigits === 2) {
                        componentValue = _formatInteger(offsetHours, markerSpec.integerFormat);
                        if (offsetMinutes !== 0) {
                            componentValue += ':' + formatInteger(offsetMinutes, '00');
                        }
                    } else if (numDigits === 3 || numDigits === 4) {
                        componentValue = _formatInteger(offset, markerSpec.integerFormat);
                    } else {
                        throw {
                            code: 'D3134',
                            value: numDigits
                        };
                    }
                }
                if (offset >= 0) {
                    componentValue = '+' + componentValue;
                }
                if (markerSpec.component === 'z') {
                    componentValue = 'GMT' + componentValue;
                }
                if (offset === 0 && markerSpec.presentation2 === 't') {
                    componentValue = 'Z';
                }
            } else if (markerSpec.component === 'P') {
                // §9.8.4.7 Formatting Other Components
                // Formatting P for am/pm
                // getDateTimeFragment() always returns am/pm lower case so check for UPPER here
                if (markerSpec.names === tcase.UPPER) {
                    componentValue = componentValue.toUpperCase();
                }
            }
            return componentValue;
        };

        let formatSpec;
        if(typeof picture === 'undefined') {
            // default to ISO 8601 format
            if (iso8601Spec === null) {
                iso8601Spec = analyseDateTimePicture('[Y0001]-[M01]-[D01]T[H01]:[m01]:[s01].[f001][Z01:01t]');
            }
            formatSpec = iso8601Spec;
        } else {
            formatSpec = analyseDateTimePicture(picture);
        }

        const offsetMillis = (60 * offsetHours + offsetMinutes) * 60 * 1000;
        const dateTime = new Date(millis + offsetMillis);

        let result = '';
        formatSpec.parts.forEach(function (part) {
            if (part.type === 'literal') {
                result += part.value;
            } else {
                result += formatComponent(dateTime, part);
            }
        });

        return result;
    }

    /**
     * Generate a regex to parse integers or timestamps
     * @param {object} formatSpec - object representing the format
     * @returns {object} - regex
     */
    function generateRegex(formatSpec) {
        var matcher = {};
        if (formatSpec.type === 'datetime') {
            matcher.type = 'datetime';
            matcher.parts = formatSpec.parts.map(function (part) {
                var res = {};
                if (part.type === 'literal') {
                    res.regex = part.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                } else if (part.component === 'Z' || part.component === 'z') {
                    // timezone
                    let separator;
                    if (!Array.isArray(part.integerFormat.groupingSeparators)) {
                        separator = part.integerFormat.groupingSeparators;
                    }
                    res.regex = '';
                    if (part.component === 'z') {
                        res.regex = 'GMT';
                    }
                    res.regex += '[-+][0-9]+';
                    if (separator) {
                        res.regex += separator.character + '[0-9]+';
                    }
                    res.parse = function(value) {
                        if (part.component === 'z') {
                            value = value.substring(3); // remove the leading GMT
                        }
                        let offsetHours = 0, offsetMinutes = 0;
                        if (separator) {
                            offsetHours = Number.parseInt(value.substring(0, value.indexOf(separator.character)));
                            offsetMinutes = Number.parseInt(value.substring(value.indexOf(separator.character) + 1));
                        } else {
                            // depends on number of digits
                            const numdigits = value.length - 1;
                            if (numdigits <= 2) {
                                // just hour offset
                                offsetHours = Number.parseInt(value);
                            } else {
                                offsetHours = Number.parseInt(value.substring(0, 3));
                                offsetMinutes = Number.parseInt(value.substring(3));
                            }
                        }
                        return offsetHours * 60 + offsetMinutes;
                    };
                } else if (part.integerFormat) {
                    res = generateRegex(part.integerFormat);
                } else {
                    // must be a month or day name
                    res.regex = '[a-zA-Z]+';
                    var lookup = {};
                    if (part.component === 'M' || part.component === 'x') {
                        // months
                        months.forEach(function (name, index) {
                            if (part.width && part.width.max) {
                                lookup[name.substring(0, part.width.max)] = index + 1;
                            } else {
                                lookup[name] = index + 1;
                            }
                        });
                    } else if (part.component === 'F') {
                        // days
                        days.forEach(function (name, index) {
                            if (index > 0) {
                                if (part.width && part.width.max) {
                                    lookup[name.substring(0, part.width.max)] = index;
                                } else {
                                    lookup[name] = index;
                                }
                            }
                        });
                    } else if (part.component === 'P') {
                        lookup = {'am': 0, 'AM': 0, 'pm': 1, 'PM': 1};
                    } else {
                        // unsupported 'name' option for this component
                        throw {
                            code: 'D3133',
                            value: part.component
                        };
                    }
                    res.parse = function (value) {
                        return lookup[value];
                    };
                }
                res.component = part.component;
                return res;
            });
        } else { // type === 'integer'
            matcher.type = 'integer';
            const isUpper = formatSpec.case === tcase.UPPER;

            switch (formatSpec.primary) {
                case formats.LETTERS:
                    matcher.regex = isUpper ? '[A-Z]+' : '[a-z]+';
                    matcher.parse = function (value) {
                        return lettersToDecimal(value, isUpper ? 'A' : 'a');
                    };
                    break;
                case formats.ROMAN:
                    matcher.regex = isUpper ? '[MDCLXVI]+' : '[mdclxvi]+';
                    matcher.parse = function (value) {
                        return romanToDecimal(isUpper ? value : value.toUpperCase());
                    };
                    break;
                case formats.WORDS:
                    matcher.regex = '(?:' + Object.keys(wordValues).concat('and', '[\\-, ]').join('|') + ')+';
                    matcher.parse = function (value) {
                        return wordsToNumber(value.toLowerCase());
                    };
                    break;
                case formats.DECIMAL:
                    matcher.regex = '[0-9]';
                    if (formatSpec.parseWidth) {
                        matcher.regex += `{${formatSpec.parseWidth}}`;
                    } else {
                        matcher.regex += '+';
                    }
                    if (formatSpec.ordinal) {
                        // ordinals
                        matcher.regex += '(?:th|st|nd|rd)';
                    }
                    matcher.parse = function (value) {
                        let digits = value;
                        if (formatSpec.ordinal) {
                            // strip off the suffix
                            digits = value.substring(0, value.length - 2);
                        }
                        // strip out the separators
                        if (formatSpec.regular) {
                            digits = digits.split(',').join('');
                        } else {
                            formatSpec.groupingSeparators.forEach(sep => {
                                digits = digits.split(sep.character).join('');
                            });
                        }
                        if (formatSpec.zeroCode !== 0x30) {
                            // apply offset
                            digits = digits.split('').map(char => String.fromCodePoint(char.codePointAt(0) - formatSpec.zeroCode + 0x30)).join('');
                        }
                        return parseInt(digits);
                    };
                    break;
                case formats.SEQUENCE:
                    throw {
                        code: 'D3130',
                        value: formatSpec.token
                    };
            }

        }
        return matcher;
    }

    /**
     * parse a string containing an integer as specified by the picture string
     * @param {string} value - the string to parse
     * @param {string} picture - the picture string
     * @returns {number} - the parsed number
     */
    function parseInteger(value, picture) {
        if (typeof value === 'undefined') {
            return undefined;
        }

        const formatSpec = analyseIntegerPicture(picture);
        const matchSpec = generateRegex(formatSpec);
        //const fullRegex = '^' + matchSpec.regex + '$';
        //const matcher = new RegExp(fullRegex);
        // TODO validate input based on the matcher regex
        const result = matchSpec.parse(value);
        return result;
    }

    /**
     * parse a string containing a timestamp as specified by the picture string
     * @param {string} timestamp - the string to parse
     * @param {string} picture - the picture string
     * @returns {number} - the parsed timestamp in millis since the epoch
     */
    function parseDateTime(timestamp, picture) {
        const formatSpec = analyseDateTimePicture(picture);
        const matchSpec = generateRegex(formatSpec);
        const fullRegex = '^' + matchSpec.parts.map(part => '(' + part.regex + ')').join('') + '$';

        const matcher = new RegExp(fullRegex, 'i'); // TODO can cache this against the picture
        var info = matcher.exec(timestamp);
        if (info !== null) {
            // validate what we've just parsed - do we have enough information to create a timestamp?
            // rules:
            // The date is specified by one of:
            //    {Y, M, D}    (dateA)
            // or {Y, d}       (dateB)
            // or {Y, x, w, F} (dateC)
            // or {X, W, F}    (dateD)
            // The time is specified by one of:
            //    {H, m, s, f}    (timeA)
            // or {P, h, m, s, f} (timeB)
            // All sets can have an optional Z
            // To create a timestamp (epoch millis) we need both date and time, but we can default missing
            // information according to the following rules:
            // - line up one combination of the above from date, and one from time, most significant value (MSV) to least significant (LSV
            // - for the values that have been captured, if there are any gaps between MSV and LSV, then throw an error
            //     (e.g.) if hour and seconds, but not minutes is given - throw
            //     (e.g.) if month, hour and minutes, but not day-of-month is given - throw
            // - anything right of the LSV should be defaulted to zero
            //     (e.g.) if hour and minutes given, default seconds and fractional seconds to zero
            //     (e.g.) if date only given, default the time to 0:00:00.000 (midnight)
            // - anything left of the MSV should be defaulted to the value of that component returned by $now()
            //     (e.g.) if time only given, default the date to today
            //     (e.g.) if month and date given, default to this year (and midnight, by previous rule)
            //   -- default values for X, x, W, w, F will be derived from the values returned by $now()

            // implement the above rules
            // determine which of the above date/time combinations we have by using bit masks

            //        Y X M x W w d D F P H h m s f Z
            // dateA  1 0 1 0 0 0 0 1 ?                     0 - must not appear
            // dateB  1 0 0 0 0 0 1 0 ?                     1 - can appear - relevant
            // dateC  0 1 0 1 0 1 0 0 1                     ? - can appear - ignored
            // dateD  0 1 0 0 1 0 0 0 1
            // timeA                    0 1 0 1 1 1
            // timeB                    1 0 1 1 1 1

            // create bitmasks based on the above
            //    date mask             YXMxWwdD
            const dmA = 161;  // binary 10100001
            const dmB = 130;  // binary 10000010
            const dmC = 84;   // binary 01010100
            const dmD = 72;   // binary 01001000
            //    time mask             PHhmsf
            const tmA = 23;   // binary 010111
            const tmB = 47;   // binary 101111

            const components = {};
            for (let i = 1; i < info.length; i++) {
                const mpart = matchSpec.parts[i - 1];
                if (mpart.parse) {
                    components[mpart.component] = mpart.parse(info[i]);
                }
            }

            if(Object.getOwnPropertyNames(components).length === 0) {
                // nothing specified
                return undefined;
            }

            let mask = 0;

            const shift = bit => {
                mask <<= 1;
                mask += bit ? 1 : 0;
            };

            const isType = type => {
                // shouldn't match any 0's, must match at least one 1
                return !(~type & mask) && !!(type & mask);
            };

            'YXMxWwdD'.split('').forEach(part => shift(components[part]));

            const dateA = isType(dmA);
            const dateB = !dateA && isType(dmB);
            const dateC = isType(dmC);
            const dateD = !dateC && isType(dmD);

            mask = 0;
            'PHhmsf'.split('').forEach(part => shift(components[part]));

            const timeA = isType(tmA);
            const timeB = !timeA && isType(tmB);

            // should only be zero or one date type and zero or one time type

            const dateComps = dateB ? 'YD' : dateC ? 'XxwF' : dateD? 'XWF' : 'YMD';
            const timeComps = timeB ? 'Phmsf' : 'Hmsf';

            const comps = dateComps + timeComps;

            // step through the candidate parts from most significant to least significant
            // default the most significant unspecified parts to current timestamp component
            // default the least significant unspecified parts to zero
            // if any gaps in between the specified parts, throw an error

            const now = this.environment.timestamp; // must get the fixed timestamp from jsonata

            let startSpecified = false;
            let endSpecified = false;
            comps.split('').forEach(part => {
                if(typeof components[part] === 'undefined') {
                    if(startSpecified) {
                        // past the specified block - default to zero
                        components[part] = ('MDd'.indexOf(part) !== -1) ? 1 : 0;
                        endSpecified = true;
                    } else {
                        // haven't hit the specified block yet, default to current timestamp
                        components[part] = getDateTimeFragment(now, part);
                    }
                } else {
                    startSpecified = true;
                    if(endSpecified) {
                        throw {
                            code: 'D3136'
                        };
                    }
                }
            });

            // validate and fill in components
            if (components.M > 0) {
                components.M -= 1;  // Date.UTC requires a zero-indexed month
            } else {
                components.M = 0; // default to January
            }
            if (dateB) {
                // millis for given 1st Jan of that year (at 00:00 UTC)
                const firstJan = Date.UTC(components.Y, 0);
                const offsetMillis = (components.d - 1) * 1000 * 60 * 60 * 24;
                const derivedDate = new Date(firstJan + offsetMillis);
                components.M = derivedDate.getUTCMonth();
                components.D = derivedDate.getUTCDate();
            }
            if (dateC) {
                // TODO implement this
                // parsing this format not currently supported
                throw {
                    code: 'D3136'
                };
            }
            if (dateD) {
                // TODO implement this
                // parsing this format (ISO week date) not currently supported
                throw {
                    code: 'D3136'
                };
            }
            if (timeB) {
                // 12hr to 24hr
                components.H = components.h === 12 ? 0 : components.h;
                if (components.P === 1) {
                    components.H += 12;
                }
            }

            var millis = Date.UTC(components.Y, components.M, components.D, components.H, components.m, components.s, components.f);
            if(components.Z || components.z) {
                // adjust for timezone
                millis -= (components.Z || components.z) * 60 * 1000;
            }
            return millis;
        }
    }

    // Regular expression to match an ISO 8601 formatted timestamp
    var iso8601regex = new RegExp('^\\d{4}(-[01]\\d)*(-[0-3]\\d)*(T[0-2]\\d:[0-5]\\d:[0-5]\\d)*(\\.\\d+)?([+-][0-2]\\d:?[0-5]\\d|Z)?$');

    /**
     * Converts an ISO 8601 timestamp to milliseconds since the epoch
     *
     * @param {string} timestamp - the timestamp to be converted
     * @param {string} [picture] - the picture string defining the format of the timestamp (defaults to ISO 8601)
     * @returns {Number} - milliseconds since the epoch
     */
    function toMillis(timestamp, picture) {
        // undefined inputs always return undefined
        if(typeof timestamp === 'undefined') {
            return undefined;
        }

        if(typeof picture === 'undefined') {
            if (!iso8601regex.test(timestamp)) {
                throw {
                    stack: (new Error()).stack,
                    code: "D3110",
                    value: timestamp
                };
            }

            return Date.parse(timestamp);
        } else {
            return parseDateTime.call(this, timestamp, picture);
        }
    }

    /**
     * Converts milliseconds since the epoch to an ISO 8601 timestamp
     * @param {Number} millis - milliseconds since the epoch to be converted
     * @param {string} [picture] - the picture string defining the format of the timestamp (defaults to ISO 8601)
     * @param {string} [timezone] - the timezone to format the timestamp in (defaults to UTC)
     * @returns {String} - the formatted timestamp
     */
    function fromMillis(millis, picture, timezone) {
        // undefined inputs always return undefined
        if(typeof millis === 'undefined') {
            return undefined;
        }

        return formatDateTime.call(this, millis, picture, timezone);
    }

    return {
        formatInteger, parseInteger, fromMillis, toMillis
    };
})();

module.exports = dateTime;
