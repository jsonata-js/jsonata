import { operators, escapes } from "./constants";

export interface Token {
    type: string;
    value: any;
    position: number;
}

export type Tokenizer = (prefix: boolean) => Token;

// Tokenizer (lexer) - invoked by the parser to return one token at a time
export function tokenizer(path: string): Tokenizer {
    var position = 0;
    var length = path.length;

    var create = function(type: string, value: any): Token {
        var obj = { type: type, value: value, position: position };
        return obj;
    };

    var scanRegex = function() {
        // the prefix '/' will have been previously scanned. Find the end of the regex.
        // search for closing '/' ignoring any that are escaped, or within brackets
        var start = position;
        var depth = 0;
        var pattern;
        var flags;
        while (position < length) {
            var currentChar = path.charAt(position);
            if (currentChar === "/" && path.charAt(position - 1) !== "\\" && depth === 0) {
                // end of regex found
                pattern = path.substring(start, position);
                if (pattern === "") {
                    throw {
                        code: "S0301",
                        stack: new Error().stack,
                        position: position,
                    };
                }
                position++;
                currentChar = path.charAt(position);
                // flags
                start = position;
                while (currentChar === "i" || currentChar === "m") {
                    position++;
                    currentChar = path.charAt(position);
                }
                flags = path.substring(start, position) + "g";
                return new RegExp(pattern, flags);
            }
            if (
                (currentChar === "(" || currentChar === "[" || currentChar === "{") &&
                path.charAt(position - 1) !== "\\"
            ) {
                depth++;
            }
            if (
                (currentChar === ")" || currentChar === "]" || currentChar === "}") &&
                path.charAt(position - 1) !== "\\"
            ) {
                depth--;
            }

            position++;
        }
        throw {
            code: "S0302",
            stack: new Error().stack,
            position: position,
        };
    };

    var next = (prefix: boolean) => {
        if (position >= length) return null;
        var currentChar = path.charAt(position);
        // skip whitespace
        while (position < length && " \t\n\r\v".indexOf(currentChar) > -1) {
            position++;
            currentChar = path.charAt(position);
        }
        // test for regex
        if (prefix !== true && currentChar === "/") {
            position++;
            return create("regex", scanRegex());
        }
        // handle double-char operators
        if (currentChar === "." && path.charAt(position + 1) === ".") {
            // double-dot .. range operator
            position += 2;
            return create("operator", "..");
        }
        if (currentChar === ":" && path.charAt(position + 1) === "=") {
            // := assignment
            position += 2;
            return create("operator", ":=");
        }
        if (currentChar === "!" && path.charAt(position + 1) === "=") {
            // !=
            position += 2;
            return create("operator", "!=");
        }
        if (currentChar === ">" && path.charAt(position + 1) === "=") {
            // >=
            position += 2;
            return create("operator", ">=");
        }
        if (currentChar === "<" && path.charAt(position + 1) === "=") {
            // <=
            position += 2;
            return create("operator", "<=");
        }
        if (currentChar === "*" && path.charAt(position + 1) === "*") {
            // **  descendant wildcard
            position += 2;
            return create("operator", "**");
        }
        if (currentChar === "~" && path.charAt(position + 1) === ">") {
            // ~>  chain function
            position += 2;
            return create("operator", "~>");
        }
        // test for single char operators
        if (operators.hasOwnProperty(currentChar)) {
            position++;
            return create("operator", currentChar);
        }
        // test for string literals
        if (currentChar === '"' || currentChar === "'") {
            var quoteType = currentChar;
            // double quoted string literal - find end of string
            position++;
            var qstr = "";
            while (position < length) {
                currentChar = path.charAt(position);
                if (currentChar === "\\") {
                    // escape sequence
                    position++;
                    currentChar = path.charAt(position);
                    if (escapes.hasOwnProperty(currentChar)) {
                        qstr += escapes[currentChar];
                    } else if (currentChar === "u") {
                        // \u should be followed by 4 hex digits
                        var octets = path.substr(position + 1, 4);
                        if (/^[0-9a-fA-F]+$/.test(octets)) {
                            var codepoint = parseInt(octets, 16);
                            qstr += String.fromCharCode(codepoint);
                            position += 4;
                        } else {
                            throw {
                                code: "S0104",
                                stack: new Error().stack,
                                position: position,
                            };
                        }
                    } else {
                        // illegal escape sequence
                        throw {
                            code: "S0103",
                            stack: new Error().stack,
                            position: position,
                            token: currentChar,
                        };
                    }
                } else if (currentChar === quoteType) {
                    position++;
                    return create("string", qstr);
                } else {
                    qstr += currentChar;
                }
                position++;
            }
            throw {
                code: "S0101",
                stack: new Error().stack,
                position: position,
            };
        }
        // test for numbers
        var numregex = /^-?(0|([1-9][0-9]*))(\.[0-9]+)?([Ee][-+]?[0-9]+)?/;
        var match = numregex.exec(path.substring(position));
        if (match !== null) {
            var num = parseFloat(match[0]);
            if (!isNaN(num) && isFinite(num)) {
                position += match[0].length;
                return create("number", num);
            } else {
                throw {
                    code: "S0102",
                    stack: new Error().stack,
                    position: position,
                    token: match[0],
                };
            }
        }
        // test for quoted names (backticks)
        var name;
        if (currentChar === "`") {
            // scan for closing quote
            position++;
            var end = path.indexOf("`", position);
            if (end !== -1) {
                name = path.substring(position, end);
                position = end + 1;
                return create("name", name);
            }
            position = length;
            throw {
                code: "S0105",
                stack: new Error().stack,
                position: position,
            };
        }
        // test for names
        var i = position;
        var ch;
        for (;;) {
            ch = path.charAt(i);
            if (i === length || " \t\n\r\v".indexOf(ch) > -1 || operators.hasOwnProperty(ch)) {
                if (path.charAt(position) === "$") {
                    // variable reference
                    name = path.substring(position + 1, i);
                    position = i;
                    return create("variable", name);
                } else {
                    name = path.substring(position, i);
                    position = i;
                    switch (name) {
                        case "or":
                        case "in":
                        case "and":
                            return create("operator", name);
                        case "true":
                            return create("value", true);
                        case "false":
                            return create("value", false);
                        case "null":
                            return create("value", null);
                        default:
                            if (position === length && name === "") {
                                // whitespace at end of input
                                return null;
                            }
                            return create("name", name);
                    }
                }
            } else {
                i++;
            }
        }
    };

    return next;
}
