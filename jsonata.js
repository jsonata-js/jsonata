/**
 * © Copyright IBM Corp. 2016, 2017 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

/**
 * @module JSONata
 * @description JSON query and transformation language
 */

/**
 * jsonata
 * @function
 * @param {Object} expr - JSONata expression
 * @returns {{evaluate: evaluate, assign: assign}} Evaluated expression
 */
var jsonata = (function() {
    'use strict';

    var operators = {
        '.': 75,
        '[': 80,
        ']': 0,
        '{': 70,
        '}': 0,
        '(': 80,
        ')': 0,
        ',': 0,
        '@': 75,
        '#': 70,
        ';': 80,
        ':': 80,
        '?': 20,
        '+': 50,
        '-': 50,
        '*': 60,
        '/': 60,
        '%': 60,
        '|': 20,
        '=': 40,
        '<': 40,
        '>': 40,
        '`': 80,
        '^': 40,
        '**': 60,
        '..': 20,
        ':=': 10,
        '!=': 40,
        '<=': 40,
        '>=': 40,
        '~>': 40,
        'and': 30,
        'or': 25,
        'in': 40,
        '&': 50,
        '!': 0,   // not an operator, but needed as a stop character for name tokens
        '~': 0   // not an operator, but needed as a stop character for name tokens
    };

    var escapes = {  // JSON string escape sequences - see json.org
        '"': '"',
        '\\': '\\',
        '/': '/',
        'b': '\b',
        'f': '\f',
        'n': '\n',
        'r': '\r',
        't': '\t'
    };

    // Tokenizer (lexer) - invoked by the parser to return one token at a time
    var tokenizer = function (path) {
        var position = 0;
        var length = path.length;

        var create = function (type, value) {
            var obj = {type: type, value: value, position: position};
            return obj;
        };

        var scanRegex = function() {
            // the prefix '/' will have been previously scanned. Find the end of the regex.
            // search for closing '/' ignoring any that are escaped, or within brackets
            var start = position;
            var depth = 0;
            var pattern;
            var flags;
            while(position < length) {
                var currentChar = path.charAt(position);
                if(currentChar === '/' && path.charAt(position - 1) !== '\\' && depth === 0) {
                    // end of regex found
                    pattern = path.substring(start, position);
                    if(pattern === '') {
                        throw {
                            code: "S0301",
                            stack: (new Error()).stack,
                            position: position
                        };
                    }
                    position++;
                    currentChar = path.charAt(position);
                    // flags
                    start = position;
                    while(currentChar === 'i' || currentChar === 'm') {
                        position++;
                        currentChar = path.charAt(position);
                    }
                    flags = path.substring(start, position) + 'g';
                    return new RegExp(pattern, flags);
                }
                if((currentChar === '(' || currentChar === '[' || currentChar === '{') && path.charAt(position - 1) !== '\\' ) {
                    depth++;
                }
                if((currentChar === ')' || currentChar === ']' || currentChar === '}') && path.charAt(position - 1) !== '\\' ) {
                    depth--;
                }

                position++;
            }
            throw {
                code: "S0302",
                stack: (new Error()).stack,
                position: position
            };
        };

        var next = function (prefix) {
            if (position >= length) return null;
            var currentChar = path.charAt(position);
            // skip whitespace
            while (position < length && ' \t\n\r\v'.indexOf(currentChar) > -1) {
                position++;
                currentChar = path.charAt(position);
            }
            // test for regex
            if (prefix !== true && currentChar === '/') {
                position++;
                return create('regex', scanRegex());
            }
            // handle double-char operators
            if (currentChar === '.' && path.charAt(position + 1) === '.') {
                // double-dot .. range operator
                position += 2;
                return create('operator', '..');
            }
            if (currentChar === ':' && path.charAt(position + 1) === '=') {
                // := assignment
                position += 2;
                return create('operator', ':=');
            }
            if (currentChar === '!' && path.charAt(position + 1) === '=') {
                // !=
                position += 2;
                return create('operator', '!=');
            }
            if (currentChar === '>' && path.charAt(position + 1) === '=') {
                // >=
                position += 2;
                return create('operator', '>=');
            }
            if (currentChar === '<' && path.charAt(position + 1) === '=') {
                // <=
                position += 2;
                return create('operator', '<=');
            }
            if (currentChar === '*' && path.charAt(position + 1) === '*') {
                // **  descendant wildcard
                position += 2;
                return create('operator', '**');
            }
            if (currentChar === '~' && path.charAt(position + 1) === '>') {
                // ~>  chain function
                position += 2;
                return create('operator', '~>');
            }
            // test for single char operators
            if (operators.hasOwnProperty(currentChar)) {
                position++;
                return create('operator', currentChar);
            }
            // test for string literals
            if (currentChar === '"' || currentChar === "'") {
                var quoteType = currentChar;
                // double quoted string literal - find end of string
                position++;
                var qstr = "";
                while (position < length) {
                    currentChar = path.charAt(position);
                    if (currentChar === '\\') { // escape sequence
                        position++;
                        currentChar = path.charAt(position);
                        if (escapes.hasOwnProperty(currentChar)) {
                            qstr += escapes[currentChar];
                        } else if (currentChar === 'u') {
                            // \u should be followed by 4 hex digits
                            var octets = path.substr(position + 1, 4);
                            if (/^[0-9a-fA-F]+$/.test(octets)) {
                                var codepoint = parseInt(octets, 16);
                                qstr += String.fromCharCode(codepoint);
                                position += 4;
                            } else {
                                throw {
                                    code: "S0104",
                                    stack: (new Error()).stack,
                                    position: position
                                };
                            }
                        } else {
                            // illegal escape sequence
                            throw {
                                code: "S0103",
                                stack: (new Error()).stack,
                                position: position,
                                token: currentChar
                            };

                        }
                    } else if (currentChar === quoteType) {
                        position++;
                        return create('string', qstr);
                    } else {
                        qstr += currentChar;
                    }
                    position++;
                }
                throw {
                    code: "S0101",
                    stack: (new Error()).stack,
                    position: position
                };
            }
            // test for numbers
            var numregex = /^-?(0|([1-9][0-9]*))(\.[0-9]+)?([Ee][-+]?[0-9]+)?/;
            var match = numregex.exec(path.substring(position));
            if (match !== null) {
                var num = parseFloat(match[0]);
                if (!isNaN(num) && isFinite(num)) {
                    position += match[0].length;
                    return create('number', num);
                } else {
                    throw {
                        code: "S0102",
                        stack: (new Error()).stack,
                        position: position,
                        token: match[0]
                    };
                }
            }
            // test for names
            var i = position;
            var ch;
            var name;
            for (;;) {
                ch = path.charAt(i);
                if (i === length || ' \t\n\r\v'.indexOf(ch) > -1 || operators.hasOwnProperty(ch)) {
                    if (path.charAt(position) === '$') {
                        // variable reference
                        name = path.substring(position + 1, i);
                        position = i;
                        return create('variable', name);
                    } else {
                        name = path.substring(position, i);
                        position = i;
                        switch (name) {
                            case 'or':
                            case 'in':
                            case 'and':
                                return create('operator', name);
                            case 'true':
                                return create('value', true);
                            case 'false':
                                return create('value', false);
                            case 'null':
                                return create('value', null);
                            default:
                                if (position === length && name === '') {
                                    // whitespace at end of input
                                    return null;
                                }
                                return create('name', name);
                        }
                    }
                } else {
                    i++;
                }
            }
        };

        return next;
    };

    /**
     * Parses a function signature definition and returns a validation function
     * @param {string} signature - the signature between the <angle brackets>
     * @returns {Function} validation function
     */
    function parseSignature(signature) {
        // create a Regex that represents this signature and return a function that when invoked,
        // returns the validated (possibly fixed-up) arguments, or throws a validation error
        // step through the signature, one symbol at a time
        var position = 1;
        var params = [];
        var param = {};
        var prevParam = param;
        while (position < signature.length) {
            var symbol = signature.charAt(position);
            if(symbol === ':') {
                // TODO figure out what to do with the return type
                // ignore it for now
                break;
            }

            var next = function() {
                params.push(param);
                prevParam = param;
                param = {};
            };

            var findClosingBracket = function(str, start, openSymbol, closeSymbol) {
                // returns the position of the closing symbol (e.g. bracket) in a string
                // that balances the opening symbol at position start
                var depth = 1;
                var position = start;
                while(position < str.length) {
                    position++;
                    symbol = str.charAt(position);
                    if(symbol === closeSymbol) {
                        depth--;
                        if(depth === 0) {
                            // we're done
                            break; // out of while loop
                        }
                    } else if(symbol === openSymbol) {
                        depth++;
                    }
                }
                return position;
            };

            switch (symbol) {
                case 's': // string
                case 'n': // number
                case 'b': // boolean
                case 'l': // not so sure about expecting null?
                case 'o': // object
                    param.regex = '[' + symbol + 'm]';
                    param.type = symbol;
                    next();
                    break;
                case 'a': // array
                    //  normally treat any value as singleton array
                    param.regex = '[asnblfom]';
                    param.type = symbol;
                    param.array = true;
                    next();
                    break;
                case 'f': // function
                    param.regex = 'f';
                    param.type = symbol;
                    next();
                    break;
                case 'j': // any JSON type
                    param.regex = '[asnblom]';
                    param.type = symbol;
                    next();
                    break;
                case 'x': // any type
                    param.regex = '[asnblfom]';
                    param.type = symbol;
                    next();
                    break;
                case '-': // use context if param not supplied
                    prevParam.context = true;
                    prevParam.contextRegex = new RegExp(prevParam.regex); // pre-compiled to test the context type at runtime
                    prevParam.regex += '?';
                    break;
                case '?': // optional param
                case '+': // one or more
                    prevParam.regex += symbol;
                    break;
                case '(': // choice of types
                    // search forward for matching ')'
                    var endParen = findClosingBracket(signature, position, '(', ')');
                    var choice = signature.substring(position + 1, endParen);
                    if(choice.indexOf('<') === -1) {
                        // no parameterized types, simple regex
                        param.regex = '[' + choice + 'm]';
                    } else {
                        // TODO harder
                        throw {
                            code: "S0402",
                            stack: (new Error()).stack,
                            value: choice,
                            offset: position
                        };
                    }
                    param.type = '(' + choice + ')';
                    position = endParen;
                    next();
                    break;
                case '<': // type parameter - can only be applied to 'a' and 'f'
                    if(prevParam.type === 'a' || prevParam.type === 'f') {
                        // search forward for matching '>'
                        var endPos = findClosingBracket(signature, position, '<', '>');
                        prevParam.subtype = signature.substring(position + 1, endPos);
                        position = endPos;
                    } else {
                        throw {
                            code: "S0401",
                            stack: (new Error()).stack,
                            value: prevParam.type,
                            offset: position
                        };
                    }
                    break;
            }
            position++;
        }
        var regexStr = '^' +
          params.map(function(param) {
              return '(' + param.regex + ')';
          }).join('') +
          '$';
        var regex = new RegExp(regexStr);
        var getSymbol = function(value) {
            var symbol;
            if(isFunction(value)) {
                symbol = 'f';
            } else {
                var type = typeof value;
                switch (type) {
                    case 'string':
                        symbol = 's';
                        break;
                    case 'number':
                        symbol = 'n';
                        break;
                    case 'boolean':
                        symbol = 'b';
                        break;
                    case 'object':
                        if (value === null) {
                            symbol = 'l';
                        } else if (Array.isArray(value)) {
                            symbol = 'a';
                        } else {
                            symbol = 'o';
                        }
                        break;
                    case 'undefined':
                        // any value can be undefined, but should be allowed to match
                        symbol = 'm'; // m for missing
                }
            }
            return symbol;
        };

        var throwValidationError = function(badArgs, badSig) {
            // to figure out where this went wrong we need apply each component of the
            // regex to each argument until we get to the one that fails to match
            var partialPattern = '^';
            var goodTo = 0;
            for(var index = 0; index < params.length; index++) {
                partialPattern += params[index].regex;
                var match = badSig.match(partialPattern);
                if(match === null) {
                    // failed here
                    throw {
                        code: "T0410",
                        stack: (new Error()).stack,
                        value: badArgs[goodTo],
                        index: goodTo + 1
                    };
                }
                goodTo = match[0].length;
            }
            // if it got this far, it's probably because of extraneous arguments (we
            // haven't added the trailing '$' in the regex yet.
            throw {
                code: "T0410",
                stack: (new Error()).stack,
                value: badArgs[goodTo],
                index: goodTo + 1
            };
        };

        return {
            definition: signature,
            validate: function(args, context) {
                var suppliedSig = '';
                args.forEach(function(arg) {
                    suppliedSig += getSymbol(arg);
                });
                var isValid = regex.exec(suppliedSig);
                if(isValid) {
                    var validatedArgs = [];
                    var argIndex = 0;
                    params.forEach(function(param, index) {
                        var arg = args[argIndex];
                        var match = isValid[index + 1];
                        if(match === '') {
                            if (param.context) {
                                // substitute context value for missing arg
                                // first check that the context value is the right type
                                var contextType = getSymbol(context);
                                // test contextType against the regex for this arg (without the trailing ?)
                                if(param.contextRegex.test(contextType)) {
                                    validatedArgs.push(context);
                                } else {
                                    // context value not compatible with this argument
                                    throw {
                                        code: "T0411",
                                        stack: (new Error()).stack,
                                        value: context,
                                        index: argIndex + 1
                                    };
                                }
                            } else {
                                validatedArgs.push(arg);
                                argIndex++;
                            }
                        } else {
                            // may have matched multiple args (if the regex ends with a '+'
                            // split into single tokens
                            match.split('').forEach(function(single) {
                                if (param.type === 'a') {
                                    if (single === 'm') {
                                        // missing (undefined)
                                        arg = undefined;
                                    } else {
                                        arg = args[argIndex];
                                        var arrayOK = true;
                                        // is there type information on the contents of the array?
                                        if (typeof param.subtype !== 'undefined') {
                                            if (single !== 'a' && match !== param.subtype) {
                                                arrayOK = false;
                                            } else if (single === 'a') {
                                                if (arg.length > 0) {
                                                    var itemType = getSymbol(arg[0]);
                                                    if (itemType !== param.subtype.charAt(0)) { // TODO recurse further
                                                        arrayOK = false;
                                                    } else {
                                                        // make sure every item in the array is this type
                                                        var differentItems = arg.filter(function (val) {
                                                            return (getSymbol(val) !== itemType);
                                                        });
                                                        arrayOK = (differentItems.length === 0);
                                                    }
                                                }
                                            }
                                        }
                                        if (!arrayOK) {
                                            throw {
                                                code: "T0412",
                                                stack: (new Error()).stack,
                                                value: arg,
                                                index: argIndex + 1,
                                                type: param.subtype // TODO translate symbol to type name
                                            };
                                        }
                                        // the function expects an array. If it's not one, make it so
                                        if (single !== 'a') {
                                            arg = [arg];
                                        }
                                    }
                                    validatedArgs.push(arg);
                                    argIndex++;
                                } else {
                                    validatedArgs.push(arg);
                                    argIndex++;
                                }
                            });
                        }
                    });
                    return validatedArgs;
                }
                throwValidationError(args, suppliedSig);
            }
        };
    }

    // This parser implements the 'Top down operator precedence' algorithm developed by Vaughan R Pratt; http://dl.acm.org/citation.cfm?id=512931.
    // and builds on the Javascript framework described by Douglas Crockford at http://javascript.crockford.com/tdop/tdop.html
    // and in 'Beautiful Code', edited by Andy Oram and Greg Wilson, Copyright 2007 O'Reilly Media, Inc. 798-0-596-51004-6

    var parser = function (source) {
        var node;
        var lexer;

        var symbol_table = {};

        var base_symbol = {
            nud: function () {
                return this;
            }
        };

        var symbol = function (id, bp) {
            var s = symbol_table[id];
            bp = bp || 0;
            if (s) {
                if (bp >= s.lbp) {
                    s.lbp = bp;
                }
            } else {
                s = Object.create(base_symbol);
                s.id = s.value = id;
                s.lbp = bp;
                symbol_table[id] = s;
            }
            return s;
        };

        var advance = function (id, infix) {
            if (id && node.id !== id) {
                var code;
                if(node.id === '(end)') {
                    // unexpected end of buffer
                    code = "S0203";
                } else {
                    code = "S0202";
                }
                throw {
                    code: code,
                    stack: (new Error()).stack,
                    position: node.position,
                    token: node.id,
                    value: id
                };
            }
            var next_token = lexer(infix);
            if (next_token === null) {
                node = symbol_table["(end)"];
                node.position = source.length;
                return node;
            }
            var value = next_token.value;
            var type = next_token.type;
            var symbol;
            switch (type) {
                case 'name':
                case 'variable':
                    symbol = symbol_table["(name)"];
                    break;
                case 'operator':
                    symbol = symbol_table[value];
                    if (!symbol) {
                        throw {
                            code: "S0204",
                            stack: (new Error()).stack,
                            position: next_token.position,
                            token: value
                        };
                    }
                    break;
                case 'string':
                case 'number':
                case 'value':
                    type = "literal";
                    symbol = symbol_table["(literal)"];
                    break;
                case 'regex':
                    type = "regex";
                    symbol = symbol_table["(regex)"];
                    break;
                    /* istanbul ignore next */
                default:
                    throw {
                        code: "S0205",
                        stack: (new Error()).stack,
                        position: next_token.position,
                        token: value
                    };
            }

            node = Object.create(symbol);
            node.value = value;
            node.type = type;
            node.position = next_token.position;
            return node;
        };

        // Pratt's algorithm
        var expression = function (rbp) {
            var left;
            var t = node;
            advance(null, true);
            left = t.nud();
            while (rbp < node.lbp) {
                t = node;
                advance();
                left = t.led(left);
            }
            return left;
        };

        // match infix operators
        // <expression> <operator> <expression>
        // left associative
        var infix = function (id, bp, led) {
            var bindingPower = bp || operators[id];
            var s = symbol(id, bindingPower);
            s.led = led || function (left) {
                this.lhs = left;
                this.rhs = expression(bindingPower);
                this.type = "binary";
                return this;
            };
            return s;
        };

        // match infix operators
        // <expression> <operator> <expression>
        // right associative
        var infixr = function (id, bp, led) {
            var bindingPower = bp || operators[id];
            var s = symbol(id, bindingPower);
            s.led = led || function (left) {
                this.lhs = left;
                this.rhs = expression(bindingPower - 1); // subtract 1 from bindingPower for right associative operators
                this.type = "binary";
                return this;
            };
            return s;
        };

        // match prefix operators
        // <operator> <expression>
        var prefix = function (id, nud) {
            var s = symbol(id);
            s.nud = nud || function () {
                this.expression = expression(70);
                this.type = "unary";
                return this;
            };
            return s;
        };

        symbol("(end)");
        symbol("(name)");
        symbol("(literal)");
        symbol("(regex)");
        symbol(":");
        symbol(";");
        symbol(",");
        symbol(")");
        symbol("]");
        symbol("}");
        symbol(".."); // range operator
        infix("."); // field reference
        infix("+"); // numeric addition
        infix("-"); // numeric subtraction
        infix("*"); // numeric multiplication
        infix("/"); // numeric division
        infix("%"); // numeric modulus
        infix("="); // equality
        infix("<"); // less than
        infix(">"); // greater than
        infix("!="); // not equal to
        infix("<="); // less than or equal
        infix(">="); // greater than or equal
        infix("&"); // string concatenation
        infix("and"); // Boolean AND
        infix("or"); // Boolean OR
        infix("in"); // is member of array
        infixr(":="); // bind variable
        prefix("-"); // unary numeric negation
        infix("~>"); // function application

        // field wildcard (single level)
        prefix('*', function () {
            this.type = "wildcard";
            return this;
        });

        // descendant wildcard (multi-level)
        prefix('**', function () {
            this.type = "descendant";
            return this;
        });

        // function invocation
        infix("(", operators['('], function (left) {
            // left is is what we are trying to invoke
            this.procedure = left;
            this.type = 'function';
            this.arguments = [];
            if (node.id !== ')') {
                for (;;) {
                    if (node.type === 'operator' && node.id === '?') {
                        // partial function application
                        this.type = 'partial';
                        this.arguments.push(node);
                        advance('?');
                    } else {
                        this.arguments.push(expression(0));
                    }
                    if (node.id !== ',') break;
                    advance(',');
                }
            }
            advance(")", true);
            // if the name of the function is 'function' or λ, then this is function definition (lambda function)
            if (left.type === 'name' && (left.value === 'function' || left.value === '\u03BB')) {
                // all of the args must be VARIABLE tokens
                this.arguments.forEach(function (arg, index) {
                    if (arg.type !== 'variable') {
                        throw {
                            code: "S0208",
                            stack: (new Error()).stack,
                            position: arg.position,
                            token: arg.value,
                            value: index + 1
                        };
                    }
                });
                this.type = 'lambda';
                // is the next token a '<' - if so, parse the function signature
                if(node.id === '<') {
                    var sigPos = node.position;
                    var depth = 1;
                    var sig = '<';
                    while(depth > 0 && node.id !== '{' && node.id !== '(end)') {
                        var tok = advance();
                        if(tok.id === '>') {
                            depth--;
                        } else if(tok.id === '<') {
                            depth++;
                        }
                        sig += tok.value;
                    }
                    advance('>');
                    try {
                        this.signature = parseSignature(sig);
                    } catch(err) {
                        // insert the position into this error
                        err.position = sigPos + err.offset;
                        throw err;
                    }
                }
                // parse the function body
                advance('{');
                this.body = expression(0);
                advance('}');
            }
            return this;
        });

        // parenthesis - block expression
        prefix("(", function () {
            var expressions = [];
            while (node.id !== ")") {
                expressions.push(expression(0));
                if (node.id !== ";") {
                    break;
                }
                advance(";");
            }
            advance(")", true);
            this.type = 'block';
            this.expressions = expressions;
            return this;
        });

        // array constructor
        prefix("[", function () {
            var a = [];
            if (node.id !== "]") {
                for (;;) {
                    var item = expression(0);
                    if (node.id === "..") {
                        // range operator
                        var range = {type: "binary", value: "..", position: node.position, lhs: item};
                        advance("..");
                        range.rhs = expression(0);
                        item = range;
                    }
                    a.push(item);
                    if (node.id !== ",") {
                        break;
                    }
                    advance(",");
                }
            }
            advance("]", true);
            this.lhs = a;
            this.type = "unary";
            return this;
        });

        // filter - predicate or array index
        infix("[", operators['['], function (left) {
            if(node.id === "]") {
                // empty predicate means maintain singleton arrays in the output
                var step = left;
                while(step && step.type === 'binary' && step.value === '[') {
                    step = step.lhs;
                }
                step.keepArray = true;
                advance("]");
                return left;
            } else {
                this.lhs = left;
                this.rhs = expression(operators[']']);
                this.type = 'binary';
                advance("]", true);
                return this;
            }
        });

        // order-by
        infix("^", operators['^'], function (left) {
            advance("(");
            var terms = [];
            for(;;) {
                var term = {
                    descending: false
                };
                if (node.id === "<") {
                    // ascending sort
                    advance("<");
                } else if (node.id === ">") {
                    // descending sort
                    term.descending = true;
                    advance(">");
                } else {
                    //unspecified - default to ascending
                }
                term.expression = expression(0);
                terms.push(term);
                if(node.id !== ",") {
                    break;
                }
                advance(",");
            }
            advance(")");
            this.lhs = left;
            this.rhs = terms;
            this.type = 'binary';
            return this;
        });

        var objectParser = function (left) {
            var a = [];
            if (node.id !== "}") {
                for (;;) {
                    var n = expression(0);
                    advance(":");
                    var v = expression(0);
                    a.push([n, v]); // holds an array of name/value expression pairs
                    if (node.id !== ",") {
                        break;
                    }
                    advance(",");
                }
            }
            advance("}", true);
            if(typeof left === 'undefined') {
                // NUD - unary prefix form
                this.lhs = a;
                this.type = "unary";
            } else {
                // LED - binary infix form
                this.lhs = left;
                this.rhs = a;
                this.type = 'binary';
            }
            return this;
        };

        // object constructor
        prefix("{", objectParser);

        // object grouping
        infix("{", operators['{'], objectParser);

        // if/then/else ternary operator ?:
        infix("?", operators['?'], function (left) {
            this.type = 'condition';
            this.condition = left;
            this.then = expression(0);
            if (node.id === ':') {
                // else condition
                advance(":");
                this.else = expression(0);
            }
            return this;
        });

        // tail call optimization
        // this is invoked by the post parser to analyse lambda functions to see
        // if they make a tail call.  If so, it is replaced by a thunk which will
        // be invoked by the trampoline loop during function application.
        // This enables tail-recursive functions to be written without growing the stack
        var tail_call_optimize = function(expr) {
            var result;
            if(expr.type === 'function') {
                var thunk = {type: 'lambda', thunk: true, arguments: [], position: expr.position};
                thunk.body = expr;
                result = thunk;
            } else if(expr.type === 'condition') {
                // analyse both branches
                expr.then = tail_call_optimize(expr.then);
                if(typeof expr.else !== 'undefined') {
                    expr.else = tail_call_optimize(expr.else);
                }
                result = expr;
            } else if(expr.type === 'block') {
                // only the last expression in the block
                var length = expr.expressions.length;
                if(length > 0) {
                    expr.expressions[length - 1] = tail_call_optimize(expr.expressions[length - 1]);
                }
                result = expr;
            } else {
                result = expr;
            }
            return result;
        };

        // post-parse stage
        // the purpose of this is flatten the parts of the AST representing location paths,
        // converting them to arrays of steps which in turn may contain arrays of predicates.
        // following this, nodes containing '.' and '[' should be eliminated from the AST.
        var ast_optimize = function (expr) {
            var result;
            switch (expr.type) {
                case 'binary':
                    switch (expr.value) {
                        case '.':
                            var lstep = ast_optimize(expr.lhs);
                            result = {type: 'path', steps: []};
                            if (lstep.type === 'path') {
                                Array.prototype.push.apply(result.steps, lstep.steps);
                            } else {
                                result.steps = [lstep];
                            }
                            var rest = ast_optimize(expr.rhs);
                            if(rest.type !== 'path') {
                                rest = {type: 'path', steps: [rest]};
                            }
                            Array.prototype.push.apply(result.steps, rest.steps);
                            // any steps within a path that are literals, should be changed to 'name'
                            result.steps.filter(function(step) {
                                return step.type === 'literal';
                            }).forEach(function(lit) {
                                lit.type = 'name';
                            });
                            // any step that signals keeping a singleton array, should be flagged on the path
                            if(result.steps.filter(function(step) { return step.keepArray === true;}).length > 0) {
                                result.keepSingletonArray = true;
                            }
                            // if first step is a path constructor, flag it for special handling
                            if(result.steps[0].type === 'unary' && result.steps[0].value === '[') {
                                result.steps[0].consarray = true;
                            }
                            break;
                        case '[':
                            // predicated step
                            // LHS is a step or a predicated step
                            // RHS is the predicate expr
                            result = ast_optimize(expr.lhs);
                            var step = result;
                            if(result.type === 'path') {
                                step = result.steps[result.steps.length - 1];
                            }
                            if (typeof step.group !== 'undefined') {
                                throw {
                                    code: "S0209",
                                    stack: (new Error()).stack,
                                    position: expr.position
                                };
                            }
                            if (typeof step.predicate === 'undefined') {
                                step.predicate = [];
                            }
                            step.predicate.push(ast_optimize(expr.rhs));
                            break;
                        case '{':
                            // group-by
                            // LHS is a step or a predicated step
                            // RHS is the object constructor expr
                            result = ast_optimize(expr.lhs);
                            if (typeof result.group !== 'undefined') {
                                throw {
                                    code: "S0210",
                                    stack: (new Error()).stack,
                                    position: expr.position
                                };
                            }
                            // object constructor - process each pair
                            result.group = {
                                lhs: expr.rhs.map(function (pair) {
                                    return [ast_optimize(pair[0]), ast_optimize(pair[1])];
                                }),
                                position: expr.position
                            };
                            break;
                        case '^':
                            // order-by
                            // LHS is the array to be ordered
                            // RHS defines the terms
                            result = {type: 'sort', value: expr.value, position: expr.position};
                            result.lhs = ast_optimize(expr.lhs);
                            result.rhs = expr.rhs.map(function (terms) {
                                return {
                                    descending: terms.descending,
                                    expression: ast_optimize(terms.expression)
                                };
                            });
                            break;
                        case ':=':
                            result = {type: 'bind', value: expr.value, position: expr.position};
                            result.lhs = ast_optimize(expr.lhs);
                            result.rhs = ast_optimize(expr.rhs);
                            break;
                        case '~>':
                            result = {type: 'apply', value: expr.value, position: expr.position};
                            result.lhs = ast_optimize(expr.lhs);
                            result.rhs = ast_optimize(expr.rhs);
                            break;
                        default:
                            result = {type: expr.type, value: expr.value, position: expr.position};
                            result.lhs = ast_optimize(expr.lhs);
                            result.rhs = ast_optimize(expr.rhs);
                    }
                    break;
                case 'unary':
                    result = {type: expr.type, value: expr.value, position: expr.position};
                    if (expr.value === '[') {
                        // array constructor - process each item
                        result.lhs = expr.lhs.map(function (item) {
                            return ast_optimize(item);
                        });
                    } else if (expr.value === '{') {
                        // object constructor - process each pair
                        result.lhs = expr.lhs.map(function (pair) {
                            return [ast_optimize(pair[0]), ast_optimize(pair[1])];
                        });
                    } else {
                        // all other unary expressions - just process the expression
                        result.expression = ast_optimize(expr.expression);
                        // if unary minus on a number, then pre-process
                        if (expr.value === '-' && result.expression.type === 'literal' && isNumeric(result.expression.value)) {
                            result = result.expression;
                            result.value = -result.value;
                        }
                    }
                    break;
                case 'function':
                case 'partial':
                    result = {type: expr.type, name: expr.name, value: expr.value, position: expr.position};
                    result.arguments = expr.arguments.map(function (arg) {
                        return ast_optimize(arg);
                    });
                    result.procedure = ast_optimize(expr.procedure);
                    break;
                case 'lambda':
                    result = {type: expr.type, arguments: expr.arguments, signature: expr.signature, position: expr.position};
                    var body = ast_optimize(expr.body);
                    result.body = tail_call_optimize(body);
                    break;
                case 'condition':
                    result = {type: expr.type, position: expr.position};
                    result.condition = ast_optimize(expr.condition);
                    result.then = ast_optimize(expr.then);
                    if (typeof expr.else !== 'undefined') {
                        result.else = ast_optimize(expr.else);
                    }
                    break;
                case 'block':
                    result = {type: expr.type, position: expr.position};
                    // array of expressions - process each one
                    result.expressions = expr.expressions.map(function (item) {
                        return ast_optimize(item);
                    });
                    // TODO scan the array of expressions to see if any of them assign variables
                    // if so, need to mark the block as one that needs to create a new frame
                    break;
                case 'name':
                    result = {type: 'path', steps: [expr]};
                    //                    result.type = 'path';
                    if(expr.keepArray) {
                        result.keepSingletonArray = true;
                    }
                    break;
                case 'literal':
                case 'wildcard':
                case 'descendant':
                case 'variable':
                case 'regex':
                    result = expr;
                    break;
                case 'operator':
                    // the tokens 'and' and 'or' might have been used as a name rather than an operator
                    if (expr.value === 'and' || expr.value === 'or' || expr.value === 'in') {
                        expr.type = 'name';
                        result = ast_optimize(expr);
                    } else if (expr.value === '?') {
                        // partial application
                        result = expr;
                    } else {
                        throw {
                            code: "S0201",
                            stack: (new Error()).stack,
                            position: expr.position,
                            token: expr.value
                        };
                    }
                    break;
                default:
                    var code = "S0206";
                    /* istanbul ignore else */
                    if (expr.id === '(end)') {
                        code = "S0207";
                    }
                    throw {
                        code: code,
                        stack: (new Error()).stack,
                        position: expr.position,
                        token: expr.value
                    };
            }
            return result;
        };

        // now invoke the tokenizer and the parser and return the syntax tree
        lexer = tokenizer(source);
        advance();
        // parse the tokens
        var expr = expression(0);
        if (node.id !== '(end)') {
            throw {
                code: "S0201",
                stack: (new Error()).stack,
                position: node.position,
                token: node.value
            };
        }
        expr = ast_optimize(expr);

        return expr;
    };

    // Start of Evaluator code

    var staticFrame = createFrame(null);

    /**
     * Check if value is a finite number
     * @param {float} n - number to evaluate
     * @returns {boolean} True if n is a finite number
     */
    function isNumeric(n) {
        var isNum = false;
        if(typeof n === 'number') {
            var num = parseFloat(n);
            isNum = !isNaN(num);
            if (isNum && !isFinite(num)) {
                throw {
                    code: "D1001",
                    value: n,
                    stack: (new Error()).stack
                };
            }
        }
        return isNum;
    }

    /**
     * Returns true if the arg is an array of strings
     * @param {*} arg - the item to test
     * @returns {boolean} True if arg is an array of strings
     */
    function isArrayOfStrings(arg) {
        var result = false;
        /* istanbul ignore else */
        if(Array.isArray(arg)) {
            result = (arg.filter(function(item){return typeof item !== 'string';}).length === 0);
        }
        return result;
    }

    /**
     * Returns true if the arg is an array of numbers
     * @param {*} arg - the item to test
     * @returns {boolean} True if arg is an array of numbers
     */
    function isArrayOfNumbers(arg) {
        var result = false;
        if(Array.isArray(arg)) {
            result = (arg.filter(function(item){return !isNumeric(item);}).length === 0);
        }
        return result;
    }

    // Polyfill
    /* istanbul ignore next */
    Number.isInteger = Number.isInteger || function(value) {
        return typeof value === "number" &&
          isFinite(value) &&
          Math.floor(value) === value;
    };

    /**
     * Evaluate expression against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluate(expr, input, environment) {
        var result;

        var entryCallback = environment.lookup('__evaluate_entry');
        if(entryCallback) {
            entryCallback(expr, input, environment);
        }

        switch (expr.type) {
            case 'path':
                result = yield * evaluatePath(expr.steps, input, environment);
                result = normalizeSequence(result, expr.keepSingletonArray);
                break;
            case 'binary':
                result = yield * evaluateBinary(expr, input, environment);
                break;
            case 'unary':
                result = yield * evaluateUnary(expr, input, environment);
                break;
            case 'name':
                result = evaluateName(expr, input, environment);
                break;
            case 'literal':
                result = evaluateLiteral(expr, input, environment);
                break;
            case 'wildcard':
                result = evaluateWildcard(expr, input, environment);
                break;
            case 'descendant':
                result = evaluateDescendants(expr, input, environment);
                break;
            case 'condition':
                result = yield * evaluateCondition(expr, input, environment);
                break;
            case 'block':
                result = yield * evaluateBlock(expr, input, environment);
                break;
            case 'bind':
                result = yield * evaluateBindExpression(expr, input, environment);
                break;
            case 'regex':
                result = evaluateRegex(expr, input, environment);
                break;
            case 'function':
                result = yield * evaluateFunction(expr, input, environment);
                break;
            case 'variable':
                result = evaluateVariable(expr, input, environment);
                break;
            case 'lambda':
                result = evaluateLambda(expr, input, environment);
                break;
            case 'partial':
                result = yield * evaluatePartialApplication(expr, input, environment);
                break;
            case 'apply':
                result = yield * evaluateApplyExpression(expr, input, environment);
                break;
            case 'sort':
                result = yield * evaluateSortExpression(expr, input, environment);
                break;
        }

        if(environment.lookup('__jsonata_async') &&
          (typeof result === 'undefined' || result === null || typeof result.then !== 'function')) {
            result = Promise.resolve(result);
        }
        result = yield result;

        if (expr.hasOwnProperty('predicate')) {
            result = yield * applyPredicates(expr.predicate, result, environment);
            result = normalizeSequence(result);

        }
        if (expr.hasOwnProperty('group')) {
            result = yield * evaluateGroupExpression(expr.group, result, environment);
        }

        var exitCallback = environment.lookup('__evaluate_exit');
        if(exitCallback) {
            exitCallback(expr, input, environment, result);
        }

        return result;
    }

    /**
     * Evaluate path expression against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluatePath(expr, input, environment) {
        var inputSequence;
        // expr is an array of steps
        // if the first step is a variable reference ($...), including root reference ($$),
        //   then the path is absolute rather than relative
        if (expr[0].type === 'variable') {
            inputSequence = [input]; // dummy singleton sequence for first (absolute) step
        } else if (Array.isArray(input)) {
            inputSequence = input;
        } else {
            // if input is not an array, make it so
            inputSequence = [input];
        }

        var resultSequence;

        // evaluate each step in turn
        for(var ii = 0; ii < expr.length; ii++) {
            var step = expr[ii];

            // if the first step is an explicit array constructor, then just evaluate that (i.e. don't iterate over a context array)
            if(ii === 0 && step.consarray) {
                resultSequence = yield * evaluate(step, inputSequence, environment);
            } else {
                resultSequence = yield * evaluateStep(step, inputSequence, environment);
            }

            if(typeof resultSequence === 'undefined' || resultSequence.length === 0) {
                break;
            }
            inputSequence = resultSequence;
        }

        return resultSequence;
    }

    /**
     * Normalize a JSONata sequence - singleton arrays become atomic values
     * @param {Array} sequence - input sequence
     * @param {Boolean} keepSingleton - keep singleton sequences as arrays
     * @returns {*} normalized sequence
     */
    function normalizeSequence(sequence, keepSingleton) {
        var result;
        if(typeof sequence === 'undefined') {
            result = undefined;
        } else if(!Array.isArray(sequence)) {
            result = sequence;
        } else if (sequence.length === 1) {
            if(keepSingleton) {
                result = sequence;
            } else {
                result = sequence[0];
            }
        } else if (sequence.length > 1) {
            result = sequence;
        }
        return result;
    }

    /**
     * Evaluate a step within a path
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluateStep(expr, input, environment) {
        var result = [];


        for(var ii = 0; ii < input.length; ii++) {
            var res = yield * evaluate(expr, input[ii], environment);
            if (!(Array.isArray(res) && (expr.value !== '[' )) && !expr.consarray) {
                res = [res];
            }
            // is res an array - if so, flatten it into the parent array
            res.forEach(function (innerRes) {
                if (typeof innerRes !== 'undefined') {
                    result.push(innerRes);
                }
            });
        }
        return result;
    }

    /**
     * Apply predicates to input data
     * @param {Object} predicates - Predicates
     * @param {Object} input - Input data to apply predicates against
     * @param {Object} environment - Environment
     * @returns {*} Result after applying predicates
     */
    function* applyPredicates(predicates, input, environment) {
        var inputSequence = input;
        // lhs potentially holds an array
        // we want to iterate over the array, and only keep the items that are
        // truthy when applied to the predicate.
        // if the predicate evaluates to an integer, then select that index

        var results = [];
        for(var ii = 0; ii < predicates.length; ii++) {
            var predicate = predicates[ii];
            // if it's not an array, turn it into one
            // since in XPath >= 2.0 an item is equivalent to a singleton sequence of that item
            // if input is not an array, make it so
            if (!Array.isArray(inputSequence)) {
                inputSequence = [inputSequence];
            }
            results = [];
            if (predicate.type === 'literal' && isNumeric(predicate.value)) {
                var index = predicate.value;
                if (!Number.isInteger(index)) {
                    // round it down
                    index = Math.floor(index);
                }
                if (index < 0) {
                    // count in from end of array
                    index = inputSequence.length + index;
                }
                results = inputSequence[index];
            } else {
                results = yield * evaluateFilter(predicate, inputSequence, environment);
            }
            inputSequence = results;
        }
        return results;
    }

    /**
     * Apply filter predicate to input data
     * @param {Object} predicate - filter expression
     * @param {Object} input - Input data to apply predicates against
     * @param {Object} environment - Environment
     * @returns {*} Result after applying predicates
     */
    function* evaluateFilter(predicate, input, environment) {
        var results = [];
        for(var index = 0; index < input.length; index++) {
            var item = input[index];
            var res = yield * evaluate(predicate, item, environment);
            if (isNumeric(res)) {
                res = [res];
            }
            if(isArrayOfNumbers(res)) {
                res.forEach(function(ires) {
                    if (!Number.isInteger(ires)) {
                        // round it down
                        ires = Math.floor(ires);
                    }
                    if (ires < 0) {
                        // count in from end of array
                        ires = input.length + ires;
                    }
                    if (ires === index) {
                        results.push(item);
                    }
                });
            } else if (functionBoolean(res)) { // truthy
                results.push(item);
            }
        }
        return results;
    }

    /**
     * Evaluate binary expression against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function * evaluateBinary(expr, input, environment) {
        var result;
        var lhs = yield * evaluate(expr.lhs, input, environment);
        var rhs = yield * evaluate(expr.rhs, input, environment);
        var op = expr.value;

        try {
            switch (op) {
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    result = evaluateNumericExpression(lhs, rhs, op);
                    break;
                case '=':
                case '!=':
                case '<':
                case '<=':
                case '>':
                case '>=':
                    result = evaluateComparisonExpression(lhs, rhs, op);
                    break;
                case '&':
                    result = evaluateStringConcat(lhs, rhs);
                    break;
                case 'and':
                case 'or':
                    result = evaluateBooleanExpression(lhs, rhs, op);
                    break;
                case '..':
                    result = evaluateRangeExpression(lhs, rhs);
                    break;
                case 'in':
                    result = evaluateIncludesExpression(lhs, rhs);
                    break;
            }
        } catch(err) {
            err.position = expr.position;
            err.token = op;
            throw err;
        }
        return result;
    }

    /**
     * Evaluate unary expression against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluateUnary(expr, input, environment) {
        var result;

        switch (expr.value) {
            case '-':
                result = yield * evaluate(expr.expression, input, environment);
                if (isNumeric(result)) {
                    result = -result;
                } else {
                    throw {
                        code: "D1002",
                        stack: (new Error()).stack,
                        position: expr.position,
                        token: expr.value,
                        value: result
                    };
                }
                break;
            case '[':
                // array constructor - evaluate each item
                result = [];
                for(var ii = 0; ii < expr.lhs.length; ii++) {
                    var item = expr.lhs[ii];
                    var value = yield * evaluate(item, input, environment);
                    if (typeof value !== 'undefined') {
                        if(item.value === '[') {
                            result.push(value);
                        } else {
                            result = functionAppend(result, value);
                        }
                    }
                }
                break;
            case '{':
                // object constructor - apply grouping
                result = yield * evaluateGroupExpression(expr, input, environment);
                break;

        }
        return result;
    }

    /**
     * Evaluate name object against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function evaluateName(expr, input, environment) {
        // lookup the 'name' item in the input
        var result;
        if (Array.isArray(input)) {
            result = [];
            for(var ii = 0; ii < input.length; ii++) {
                var res =  evaluateName(expr, input[ii], environment);
                if (typeof res !== 'undefined') {
                    result.push(res);
                }
            }
        } else if (input !== null && typeof input === 'object') {
            result = input[expr.value];
        }
        result = normalizeSequence(result);
        return result;
    }

    /**
     * Evaluate literal against input data
     * @param {Object} expr - JSONata expression
     * @returns {*} Evaluated input data
     */
    function evaluateLiteral(expr) {
        return expr.value;
    }

    /**
     * Evaluate wildcard against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @returns {*} Evaluated input data
     */
    function evaluateWildcard(expr, input) {
        var result;
        var results = [];
        if (input !== null && typeof input === 'object') {
            Object.keys(input).forEach(function (key) {
                var value = input[key];
                if(Array.isArray(value)) {
                    value = flatten(value);
                    results = functionAppend(results, value);
                } else {
                    results.push(value);
                }
            });
        }

        result = normalizeSequence(results);
        return result;
    }

    /**
     * Returns a flattened array
     * @param {Array} arg - the array to be flatten
     * @param {Array} flattened - carries the flattened array - if not defined, will initialize to []
     * @returns {Array} - the flattened array
     */
    function flatten(arg, flattened) {
        if(typeof flattened === 'undefined') {
            flattened = [];
        }
        if(Array.isArray(arg)) {
            arg.forEach(function (item) {
                flatten(item, flattened);
            });
        } else {
            flattened.push(arg);
        }
        return flattened;
    }

    /**
     * Evaluate descendants against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @returns {*} Evaluated input data
     */
    function evaluateDescendants(expr, input) {
        var result;
        var resultSequence = [];
        if (typeof input !== 'undefined') {
            // traverse all descendants of this object/array
            recurseDescendants(input, resultSequence);
            if (resultSequence.length === 1) {
                result = resultSequence[0];
            } else {
                result = resultSequence;
            }
        }
        return result;
    }

    /**
     * Recurse through descendants
     * @param {Object} input - Input data
     * @param {Object} results - Results
     */
    function recurseDescendants(input, results) {
        // this is the equivalent of //* in XPath
        if (!Array.isArray(input)) {
            results.push(input);
        }
        if (Array.isArray(input)) {
            input.forEach(function (member) {
                recurseDescendants(member, results);
            });
        } else if (input !== null && typeof input === 'object') {
            Object.keys(input).forEach(function (key) {
                recurseDescendants(input[key], results);
            });
        }
    }

    /**
     * Evaluate numeric expression against input data
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @param {Object} op - opcode
     * @returns {*} Result
     */
    function evaluateNumericExpression(lhs, rhs, op) {
        var result;

        if (typeof lhs === 'undefined' || typeof rhs === 'undefined') {
            // if either side is undefined, the result is undefined
            return result;
        }

        if (!isNumeric(lhs)) {
            throw {
                code: "T2001",
                stack: (new Error()).stack,
                value: lhs
            };
        }
        if (!isNumeric(rhs)) {
            throw {
                code: "T2002",
                stack: (new Error()).stack,
                value: rhs
            };
        }

        switch (op) {
            case '+':
                result = lhs + rhs;
                break;
            case '-':
                result = lhs - rhs;
                break;
            case '*':
                result = lhs * rhs;
                break;
            case '/':
                result = lhs / rhs;
                break;
            case '%':
                result = lhs % rhs;
                break;
        }
        return result;
    }

    /**
     * Evaluate comparison expression against input data
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @param {Object} op - opcode
     * @returns {*} Result
     */
    function evaluateComparisonExpression(lhs, rhs, op) {
        var result;

        // type checks
        var ltype = typeof lhs;
        var rtype = typeof rhs;

        if (ltype === 'undefined' || rtype === 'undefined') {
            // if either side is undefined, the result is false
            return false;
        }

        var validate = function() {
            // if aa or bb are not string or numeric values, then throw an error
            if (!(ltype === 'string' || ltype === 'number') || !(rtype === 'string' || rtype === 'number')) {
                throw {
                    code: "T2010",
                    stack: (new Error()).stack,
                    value: !(ltype === 'string' || ltype === 'number') ? lhs : rhs
                };
            }

            //if aa and bb are not of the same type
            if (ltype !== rtype) {
                throw {
                    code: "T2009",
                    stack: (new Error()).stack,
                    value: lhs,
                    value2: rhs
                };
            }
        };

        switch (op) {
            case '=':
                result = lhs === rhs;
                break;
            case '!=':
                result = (lhs !== rhs);
                break;
            case '<':
                validate();
                result = lhs < rhs;
                break;
            case '<=':
                validate();
                result = lhs <= rhs;
                break;
            case '>':
                validate();
                result = lhs > rhs;
                break;
            case '>=':
                validate();
                result = lhs >= rhs;
                break;
        }
        return result;
    }

    /**
     * Inclusion operator - in
     *
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @returns {boolean} - true if lhs is a member of rhs
     */
    function evaluateIncludesExpression(lhs, rhs) {
        var result = false;

        if (typeof lhs === 'undefined' || typeof rhs === 'undefined') {
            // if either side is undefined, the result is false
            return false;
        }

        if(!Array.isArray(rhs)) {
            rhs = [rhs];
        }

        for(var i = 0; i < rhs.length; i++) {
            if(rhs[i] === lhs) {
                result = true;
                break;
            }
        }

        return result;
    }

    /**
     * Evaluate boolean expression against input data
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @param {Object} op - opcode
     * @returns {*} Result
     */
    function evaluateBooleanExpression(lhs, rhs, op) {
        var result;

        switch (op) {
            case 'and':
                result = functionBoolean(lhs) && functionBoolean(rhs);
                break;
            case 'or':
                result = functionBoolean(lhs) || functionBoolean(rhs);
                break;
        }
        return result;
    }

    /**
     * Evaluate string concatenation against input data
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @returns {string|*} Concatenated string
     */
    function evaluateStringConcat(lhs, rhs) {
        var result;

        var lstr = '';
        var rstr = '';
        if (typeof lhs !== 'undefined') {
            lstr = functionString(lhs);
        }
        if (typeof rhs !== 'undefined') {
            rstr = functionString(rhs);
        }

        result = lstr.concat(rstr);
        return result;
    }

    /**
     * Evaluate group expression against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {{}} Evaluated input data
     */
    function* evaluateGroupExpression(expr, input, environment) {
        var result = {};
        var groups = {};
        // group the input sequence by 'key' expression
        if (!Array.isArray(input)) {
            input = [input];
        }
        var allPromises = [];
        for(var itemIndex = 0; itemIndex < input.length; itemIndex++) {
            for(var pairIndex = 0; pairIndex < expr.lhs.length; pairIndex++) {
                allPromises.push(yield * evaluate(expr.lhs[pairIndex][0], input[itemIndex], environment));
            }
        }

        var it = allPromises.entries();
        input.forEach(function (item) {
            expr.lhs.forEach(function (pair) {
                var key = it.next().value[1];
                // key has to be a string
                if (typeof  key !== 'string') {
                    throw {
                        code: "T1003",
                        stack: (new Error()).stack,
                        position: expr.position,
                        value: key
                    };
                }
                var entry = {data: item, expr: pair[1]};
                if (groups.hasOwnProperty(key)) {
                    // a value already exists in this slot
                    // append it as an array
                    groups[key].data = functionAppend(groups[key].data, item);
                } else {
                    groups[key] = entry;
                }
            });
        });
        // iterate over the groups to evaluate the 'value' expression
        allPromises = [];
        var key;
        for (key in groups) {
            var entry = groups[key];
            allPromises.push(yield * evaluate(entry.expr, entry.data, environment));
        }
        it = allPromises.entries();
        for (key in groups) {
            var value = it.next().value[1];
            result[key] = value;
        }

        return result;
    }

    /**
     * Evaluate range expression against input data
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @returns {Array} Resultant array
     */
    function evaluateRangeExpression(lhs, rhs) {
        var result;

        if (typeof lhs === 'undefined' || typeof rhs === 'undefined') {
            // if either side is undefined, the result is undefined
            return result;
        }

        if (lhs > rhs) {
            // if the lhs is greater than the rhs, return undefined
            return result;
        }

        if (!Number.isInteger(lhs)) {
            throw {
                code: "T2003",
                stack: (new Error()).stack,
                value: lhs
            };
        }
        if (!Number.isInteger(rhs)) {
            throw {
                code: "T2004",
                stack: (new Error()).stack,
                value: rhs
            };
        }

        result = new Array(rhs - lhs + 1);
        for (var item = lhs, index = 0; item <= rhs; item++, index++) {
            result[index] = item;
        }
        return result;
    }

    /**
     * Evaluate bind expression against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluateBindExpression(expr, input, environment) {
        // The RHS is the expression to evaluate
        // The LHS is the name of the variable to bind to - should be a VARIABLE token
        var value = yield * evaluate(expr.rhs, input, environment);
        if (expr.lhs.type !== 'variable') {
            throw {
                code: "D2005",
                stack: (new Error()).stack,
                position: expr.position,
                token: expr.value,
                value: expr.lhs.type === 'path' ? expr.lhs.steps[0].value : expr.lhs.value
            };
        }
        environment.bind(expr.lhs.value, value);
        return value;
    }

    /**
     * Evaluate condition against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluateCondition(expr, input, environment) {
        var result;
        var condition = yield * evaluate(expr.condition, input, environment);
        if (functionBoolean(condition)) {
            result = yield * evaluate(expr.then, input, environment);
        } else if (typeof expr.else !== 'undefined') {
            result = yield * evaluate(expr.else, input, environment);
        }
        return result;
    }

    /**
     * Evaluate block against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluateBlock(expr, input, environment) {
        var result;
        // create a new frame to limit the scope of variable assignments
        // TODO, only do this if the post-parse stage has flagged this as required
        var frame = createFrame(environment);
        // invoke each expression in turn
        // only return the result of the last one
        for(var ii = 0; ii < expr.expressions.length; ii++) {
            result = yield * evaluate(expr.expressions[ii], input, frame);
        }

        return result;
    }

    /**
     * Prepare a regex
     * @param {Object} expr - expression containing regex
     * @returns {Function} Higher order function representing prepared regex
     */
    function evaluateRegex(expr) {
        expr.value.lastIndex = 0;
        var closure = function(str) {
            var re = expr.value;
            var result;
            var match = re.exec(str);
            if(match !== null) {
                result = {
                    match: match[0],
                    start: match.index,
                    end: match.index + match[0].length,
                    groups: []
                };
                if(match.length > 1) {
                    for(var i = 1; i < match.length; i++) {
                        result.groups.push(match[i]);
                    }
                }
                result.next = function() {
                    if(re.lastIndex >= str.length) {
                        return undefined;
                    } else {
                        var next = closure(str);
                        if(next && next.match === '' && re.lastIndex === expr.value.lastIndex) {
                            // matches zero length string; this will never progress
                            throw {
                                code: "D1004",
                                stack: (new Error()).stack,
                                position: expr.position,
                                value: expr.value.source
                            };
                        }
                        return next;
                    }
                };
            }

            return result;
        };
        return closure;
    }

    /**
     * Evaluate variable against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function evaluateVariable(expr, input, environment) {
        // lookup the variable value in the environment
        var result;
        // if the variable name is empty string, then it refers to context value
        if (expr.value === '') {
            result = input;
        } else {
            result = environment.lookup(expr.value);
        }
        return result;
    }

    /**
     * sort / order-by operator
     * @param {Object} expr - AST for operator
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Ordered sequence
     */
    function* evaluateSortExpression(expr, input, environment) {
        var result;

        // evaluate the lhs, then sort the results in order according to rhs expression
        var lhs = yield * evaluate(expr.lhs, input, environment);

        // sort the lhs array
        // use comparator function
        var comparator = function(a, b) {
            // expr.rhs is an array of order-by in priority order
            var comp = 0;
            for(var index = 0; comp === 0 && index < expr.rhs.length; index++) {
                var term = expr.rhs[index];
                //evaluate the rhs expression in the context of a
                var aa = driveGenerator(term.expression, a, environment);
                //evaluate the rhs expression in the context of b
                var bb = driveGenerator(term.expression, b, environment);

                // type checks
                var atype = typeof aa;
                var btype = typeof bb;
                // undefined should be last in sort order
                if(atype === 'undefined') {
                    // swap them, unless btype is also undefined
                    comp = (btype === 'undefined') ? 0 : 1;
                    continue;
                }
                if(btype === 'undefined') {
                    comp = -1;
                    continue;
                }

                // if aa or bb are not string or numeric values, then throw an error
                if(!(atype === 'string' || atype === 'number') || !(btype === 'string' || btype === 'number')) {
                    throw {
                        code: "T2008",
                        stack: (new Error()).stack,
                        position: expr.position,
                        value: !(atype === 'string' || atype === 'number') ? aa : bb
                    };
                }

                //if aa and bb are not of the same type
                if(atype !== btype) {
                    throw {
                        code: "T2007",
                        stack: (new Error()).stack,
                        position: expr.position,
                        value: aa,
                        value2: bb
                    };
                }
                if(aa === bb) {
                    // both the same - move on to next term
                    continue;
                } else if (aa < bb) {
                    comp = -1;
                } else {
                    comp = 1;
                }
                if(term.descending === true) {
                    comp = -comp;
                }
            }
            // only swap a & b if comp equals 1
            return comp === 1;
        };

        result = functionSort(lhs, comparator);

        return result;
    }

    /**
     * Evaluate an expression by driving the generator to completion
     * Used when it's not possible to yield
     * @param {Object} expr - AST
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} result
     */
    function driveGenerator(expr, input, environment) {
        var gen = evaluate(expr, input, environment);
        // returns a generator - so iterate over it
        var comp = gen.next();
        while (!comp.done) {
            comp = gen.next(comp.value);
        }
        return comp.value;
    }

    var chain = driveGenerator(parser('function($f, $g) { function($x){ $g($f($x)) } }'), null, staticFrame);

    /**
     * Apply the function on the RHS using the sequence on the LHS as the first argument
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluateApplyExpression(expr, input, environment) {
        var result;

        var arg1 = yield * evaluate(expr.lhs, input, environment);

        if(expr.rhs.type === 'function') {
            // this is a function _invocation_; invoke it with arg1 at the start
            result = yield * evaluateFunction(expr.rhs, input, environment, {context: arg1});
        } else {
            var func = yield * evaluate(expr.rhs, input, environment);

            if(!isFunction(func)) {
                throw {
                    code: "T2006",
                    stack: (new Error()).stack,
                    position: expr.position,
                    value: func
                };
            }

            if(isFunction(arg1)) {
                // this is function chaining (func1 ~> func2)
                // λ($f, $g) { λ($x){ $g($f($x)) } }
                result = yield * apply(chain, [arg1, func], environment, null);
            } else {
                result = yield * apply(func, [arg1], environment, null);
            }

        }

        return result;
    }

    /**
     *
     * @param {Object} arg - expression to test
     * @returns {boolean} - true if it is a function (lambda or built-in)
     */
    function isFunction(arg) {
        return ((arg && (arg._jsonata_function === true || arg._jsonata_lambda === true)) || typeof arg === 'function');
    }

    /**
     * Tests whether arg is a lambda function
     * @param {*} arg - the value to test
     * @returns {boolean} - true if it is a lambda function
     */
    function isLambda(arg) {
        return arg && arg._jsonata_lambda === true;
    }

    /**
     * @param {Object} arg - expression to test
     * @returns {boolean} - true if it is a generator i.e. the result from calling a
     * generator function
     */
    function isGenerator(arg) {
        return (
            typeof arg === 'object' &&
            Symbol.iterator in arg &&
            typeof arg[Symbol.iterator] === 'function' &&
            'next' in arg &&
            typeof arg.next === 'function'
        );
    }

    /**
     * Evaluate function against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @param {Object} [applyto] - LHS of ~> operator
     * @returns {*} Evaluated input data
     */
    function* evaluateFunction(expr, input, environment, applyto) {
        var result;
        // evaluate the arguments
        var evaluatedArgs = [];
        for(var ii = 0; ii < expr.arguments.length; ii++) {
            evaluatedArgs.push(yield * evaluate(expr.arguments[ii], input, environment));
        }
        if(applyto) {
            // insert the first argument from the LHS of ~>
            evaluatedArgs.unshift(applyto.context);
        }
        // lambda function on lhs
        // create the procedure
        // can't assume that expr.procedure is a lambda type directly
        // could be an expression that evaluates to a function (e.g. variable reference, parens expr etc.
        // evaluate it generically first, then check that it is a function.  Throw error if not.
        var proc = yield * evaluate(expr.procedure, input, environment);

        if (typeof proc === 'undefined' && expr.procedure.type === 'path' && environment.lookup(expr.procedure.steps[0].value)) {
            // help the user out here if they simply forgot the leading $
            throw {
                code: "T1005",
                stack: (new Error()).stack,
                position: expr.position,
                token: expr.procedure.steps[0].value
            };
        }
        // apply the procedure
        try {
            result = yield * apply(proc, evaluatedArgs, input);
        } catch (err) {
            // add the position field to the error
            err.position = expr.position;
            // and the function identifier
            err.token = expr.procedure.type === 'path' ? expr.procedure.steps[0].value : expr.procedure.value;
            throw err;
        }
        return result;
    }

    /**
     * Apply procedure or function
     * @param {Object} proc - Procedure
     * @param {Array} args - Arguments
     * @param {Object} self - Self
     * @returns {*} Result of procedure
     */
    function* apply(proc, args, self) {
        var result;
        result = yield * applyInner(proc, args, self);
        while(isLambda(result) && result.thunk === true) {
            // trampoline loop - this gets invoked as a result of tail-call optimization
            // the function returned a tail-call thunk
            // unpack it, evaluate its arguments, and apply the tail call
            var next = yield * evaluate(result.body.procedure, result.input, result.environment);
            var evaluatedArgs = [];
            for(var ii = 0; ii < result.body.arguments.length; ii++) {
                evaluatedArgs.push(yield * evaluate(result.body.arguments[ii], result.input, result.environment));
            }

            result = yield * applyInner(next, evaluatedArgs, self);
        }
        return result;
    }

    /**
     * Apply procedure or function
     * @param {Object} proc - Procedure
     * @param {Array} args - Arguments
     * @param {Object} self - Self
     * @returns {*} Result of procedure
     */
    function* applyInner(proc, args, self) {
        var result;
        var validatedArgs = args;
        if(proc) {
            validatedArgs = validateArguments(proc.signature, args, self);
        }
        if (isLambda(proc)) {
            result = yield * applyProcedure(proc, validatedArgs);
        } else if (proc && proc._jsonata_function === true) {
            result = proc.implementation.apply(self, validatedArgs);
            // `proc.implementation` might be a generator function
            // and `result` might be a generator - if so, yield
            if(isGenerator(result)) {
                result = yield *result;
            }
        } else if (typeof proc === 'function') {
            result = proc.apply(self, validatedArgs);
        } else {
            throw {
                code: "T1006",
                stack: (new Error()).stack
            };
        }
        return result;
    }

    /**
     * Evaluate lambda against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {{lambda: boolean, input: *, environment: *, arguments: *, body: *}} Evaluated input data
     */
    function evaluateLambda(expr, input, environment) {
        // make a function (closure)
        var procedure = {
            _jsonata_lambda: true,
            input: input,
            environment: environment,
            arguments: expr.arguments,
            signature: expr.signature,
            body: expr.body
        };
        if(expr.thunk === true) {
            procedure.thunk = true;
        }
        return procedure;
    }

    /**
     * Evaluate partial application
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluatePartialApplication(expr, input, environment) {
        // partially apply a function
        var result;
        // evaluate the arguments
        var evaluatedArgs = [];
        for(var ii = 0; ii < expr.arguments.length; ii++) {
            var arg = expr.arguments[ii];
            if (arg.type === 'operator' && arg.value === '?') {
                evaluatedArgs.push(arg);
            } else {
                evaluatedArgs.push(yield * evaluate(arg, input, environment));
            }
        }
        // lookup the procedure
        var proc = yield * evaluate(expr.procedure, input, environment);
        if (typeof proc === 'undefined' && expr.procedure.type === 'path' && environment.lookup(expr.procedure.steps[0].value)) {
            // help the user out here if they simply forgot the leading $
            throw {
                code: "T1007",
                stack: (new Error()).stack,
                position: expr.position,
                token: expr.procedure.steps[0].value
            };
        }
        if (isLambda(proc)) {
            result = partialApplyProcedure(proc, evaluatedArgs);
        } else if (proc && proc._jsonata_function === true) {
            result = partialApplyNativeFunction(proc.implementation, evaluatedArgs);
        } else if (typeof proc === 'function') {
            result = partialApplyNativeFunction(proc, evaluatedArgs);
        } else {
            throw {
                code: "T1008",
                stack: (new Error()).stack,
                position: expr.position,
                token: expr.procedure.type === 'path' ? expr.procedure.steps[0].value : expr.procedure.value
            };
        }
        return result;
    }

    /**
     * Validate the arguments against the signature validator (if it exists)
     * @param {Function} signature - validator function
     * @param {Array} args - function arguments
     * @param {*} context - context value
     * @returns {Array} - validated arguments
     */
    function validateArguments(signature, args, context) {
        if(typeof signature === 'undefined') {
            // nothing to validate
            return args;
        }
        var validatedArgs = signature.validate(args, context);
        return validatedArgs;
    }

    /**
     * Apply procedure
     * @param {Object} proc - Procedure
     * @param {Array} args - Arguments
     * @returns {*} Result of procedure
     */
    function* applyProcedure(proc, args) {
        var result;
        var env = createFrame(proc.environment);
        proc.arguments.forEach(function (param, index) {
            env.bind(param.value, args[index]);
        });
        if (typeof proc.body === 'function') {
            // this is a lambda that wraps a native function - generated by partially evaluating a native
            result = yield * applyNativeFunction(proc.body, env);
        } else {
            result = yield * evaluate(proc.body, proc.input, env);
        }
        return result;
    }

    /**
     * Partially apply procedure
     * @param {Object} proc - Procedure
     * @param {Array} args - Arguments
     * @returns {{lambda: boolean, input: *, environment: {bind, lookup}, arguments: Array, body: *}} Result of partially applied procedure
     */
    function partialApplyProcedure(proc, args) {
        // create a closure, bind the supplied parameters and return a function that takes the remaining (?) parameters
        var env = createFrame(proc.environment);
        var unboundArgs = [];
        proc.arguments.forEach(function (param, index) {
            var arg = args[index];
            if (arg && arg.type === 'operator' && arg.value === '?') {
                unboundArgs.push(param);
            } else {
                env.bind(param.value, arg);
            }
        });
        var procedure = {
            _jsonata_lambda: true,
            input: proc.input,
            environment: env,
            arguments: unboundArgs,
            body: proc.body
        };
        return procedure;
    }

    /**
     * Partially apply native function
     * @param {Function} native - Native function
     * @param {Array} args - Arguments
     * @returns {{lambda: boolean, input: *, environment: {bind, lookup}, arguments: Array, body: *}} Result of partially applying native function
     */
    function partialApplyNativeFunction(native, args) {
        // create a lambda function that wraps and invokes the native function
        // get the list of declared arguments from the native function
        // this has to be picked out from the toString() value
        var sigArgs = getNativeFunctionArguments(native);
        sigArgs = sigArgs.map(function (sigArg) {
            return '$' + sigArg.trim();
        });
        var body = 'function(' + sigArgs.join(', ') + '){ _ }';

        var bodyAST = parser(body);
        bodyAST.body = native;

        var partial = partialApplyProcedure(bodyAST, args);
        return partial;
    }

    /**
     * Apply native function
     * @param {Object} proc - Procedure
     * @param {Object} env - Environment
     * @returns {*} Result of applying native function
     */
    function* applyNativeFunction(proc, env) {
        var sigArgs = getNativeFunctionArguments(proc);
        // generate the array of arguments for invoking the function - look them up in the environment
        var args = sigArgs.map(function (sigArg) {
            return env.lookup(sigArg.trim());
        });

        var result = proc.apply(null, args);
        if(isGenerator(result)) {
            result = yield * result;
        }
        return result;
    }

    /**
     * Get native function arguments
     * @param {Function} func - Function
     * @returns {*|Array} Native function arguments
     */
    function getNativeFunctionArguments(func) {
        var signature = func.toString();
        var sigParens = /\(([^)]*)\)/.exec(signature)[1]; // the contents of the parens
        var sigArgs = sigParens.split(',');
        return sigArgs;
    }

    /**
     * Creates a function definition
     * @param {Function} func - function implementation in Javascript
     * @param {string} signature - JSONata function signature definition
     * @returns {{implementation: *, signature: *}} function definition
     */
    function defineFunction(func, signature) {
        var definition = {
            _jsonata_function: true,
            implementation: func
        };
        if(typeof signature !== 'undefined') {
            definition.signature = parseSignature(signature);
        }
        return definition;
    }

    /**
     * Sum function
     * @param {Object} args - Arguments
     * @returns {number} Total value of arguments
     */
    function functionSum(args) {
        // undefined inputs always return undefined
        if(typeof args === 'undefined') {
            return undefined;
        }

        var total = 0;
        args.forEach(function(num){total += num;});
        return total;
    }

    /**
     * Count function
     * @param {Object} args - Arguments
     * @returns {number} Number of elements in the array
     */
    function functionCount(args) {
        // undefined inputs always return undefined
        if(typeof args === 'undefined') {
            return 0;
        }

        return args.length;
    }

    /**
     * Max function
     * @param {Object} args - Arguments
     * @returns {number} Max element in the array
     */
    function functionMax(args) {
        // undefined inputs always return undefined
        if(typeof args === 'undefined' || args.length === 0) {
            return undefined;
        }

        return Math.max.apply(Math, args);
    }

    /**
     * Min function
     * @param {Object} args - Arguments
     * @returns {number} Min element in the array
     */
    function functionMin(args) {
        // undefined inputs always return undefined
        if(typeof args === 'undefined' || args.length === 0) {
            return undefined;
        }

        return Math.min.apply(Math, args);
    }

    /**
     * Average function
     * @param {Object} args - Arguments
     * @returns {number} Average element in the array
     */
    function functionAverage(args) {
        // undefined inputs always return undefined
        if(typeof args === 'undefined' || args.length === 0) {
            return undefined;
        }

        var total = 0;
        args.forEach(function(num){total += num;});
        return total/args.length;
    }

    /**
     * Stingify arguments
     * @param {Object} arg - Arguments
     * @returns {String} String from arguments
     */
    function functionString(arg) {
        // undefined inputs always return undefined
        if(typeof arg === 'undefined') {
            return undefined;
        }

        var str;

        if (typeof arg === 'string') {
            // already a string
            str = arg;
        } else if(isFunction(arg)) {
            // functions (built-in and lambda convert to empty string
            str = '';
        } else if (typeof arg === 'number' && !isFinite(arg)) {
            throw {
                code: "D3001",
                value: arg,
                stack: (new Error()).stack
            };
        } else
            str = JSON.stringify(arg, function (key, val) {
                return (typeof val !== 'undefined' && val !== null && val.toPrecision && isNumeric(val)) ? Number(val.toPrecision(13)) :
                    (val && isFunction(val)) ? '' : val;
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
    function functionSubstring(str, start, length) {
        // undefined inputs always return undefined
        if(typeof str === 'undefined') {
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
    function functionSubstringBefore(str, chars) {
        // undefined inputs always return undefined
        if(typeof str === 'undefined') {
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
    function functionSubstringAfter(str, chars) {
        // undefined inputs always return undefined
        if(typeof str === 'undefined') {
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
    function functionLowercase(str) {
        // undefined inputs always return undefined
        if(typeof str === 'undefined') {
            return undefined;
        }

        return str.toLowerCase();
    }

    /**
     * Uppercase a string
     * @param {String} str - String to evaluate
     * @returns {string} Uppercase string
     */
    function functionUppercase(str) {
        // undefined inputs always return undefined
        if(typeof str === 'undefined') {
            return undefined;
        }

        return str.toUpperCase();
    }

    /**
     * length of a string
     * @param {String} str - string
     * @returns {Number} The number of characters in the string
     */
    function functionLength(str) {
        // undefined inputs always return undefined
        if(typeof str === 'undefined') {
            return undefined;
        }

        return str.length;
    }

    /**
     * Normalize and trim whitespace within a string
     * @param {string} str - string to be trimmed
     * @returns {string} - trimmed string
     */
    function functionTrim(str) {
        // undefined inputs always return undefined
        if(typeof str === 'undefined') {
            return undefined;
        }

        // normalize whitespace
        var result = str.replace(/[ \t\n\r]+/gm, ' ');
        if(result.charAt(0) === ' ') {
            // strip leading space
            result = result.substring(1);
        }
        if(result.charAt(result.length - 1) === ' ') {
            // strip trailing space
            result = result.substring(0, result.length - 1);
        }
        return result;
    }

    /**
     * Tests if the str contains the token
     * @param {String} str - string to test
     * @param {String} token - substring or regex to find
     * @returns {Boolean} - true if str contains token
     */
    function functionContains(str, token) {
        // undefined inputs always return undefined
        if(typeof str === 'undefined') {
            return undefined;
        }

        var result;

        if(typeof token === 'string') {
            result = (str.indexOf(token) !== -1);
        } else {
            var matches = token(str);
            result = (typeof matches !== 'undefined');
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
    function functionMatch(str, regex, limit) {
        // undefined inputs always return undefined
        if(typeof str === 'undefined') {
            return undefined;
        }

        // limit, if specified, must be a non-negative number
        if(limit < 0) {
            throw {
                stack: (new Error()).stack,
                value: limit,
                code: 'D3040',
                index: 3
            };
        }

        var result = [];

        if(typeof limit === 'undefined' || limit > 0) {
            var count = 0;
            var matches = regex(str);
            if (typeof matches !== 'undefined') {
                while (typeof matches !== 'undefined' && (typeof limit === 'undefined' || count < limit)) {
                    result.push({
                        match: matches.match,
                        index: matches.start,
                        groups: matches.groups
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
        if(typeof str === 'undefined') {
            return undefined;
        }

        // pattern cannot be an empty string
        if(pattern === '') {
            throw {
                code: "D3010",
                stack: (new Error()).stack,
                value: pattern,
                index: 2
            };
        }

        // limit, if specified, must be a non-negative number
        if(limit < 0) {
            throw {
                code: "D3011",
                stack: (new Error()).stack,
                value: limit,
                index: 4
            };
        }

        var replacer;
        if(typeof replacement === 'string') {
            replacer = function (regexMatch) {
                var substitute = '';
                // scan forward, copying the replacement text into the substitute string
                // and replace any occurrence of $n with the values matched by the regex
                var position = 0;
                var index = replacement.indexOf('$', position);
                while (index !== -1 && position < replacement.length) {
                    substitute += replacement.substring(position, index);
                    position = index + 1;
                    var dollarVal = replacement.charAt(position);
                    if (dollarVal === '$') {
                        // literal $
                        substitute += '$';
                        position++;
                    } else if (dollarVal === '0') {
                        substitute += regexMatch.match;
                        position++;
                    } else {
                        var maxDigits;
                        if(regexMatch.groups.length === 0) {
                            // no sub-matches; any $ followed by a digit will be replaced by an empty string
                            maxDigits = 1;
                        } else {
                            // max number of digits to parse following the $
                            maxDigits = Math.floor(Math.log(regexMatch.groups.length) * Math.LOG10E) + 1;
                        }
                        index = parseInt(replacement.substring(position, position + maxDigits), 10);
                        if(maxDigits > 1 && index > regexMatch.groups.length) {
                            index = parseInt(replacement.substring(position, position + maxDigits - 1), 10);
                        }
                        if (!isNaN(index)) {
                            if(regexMatch.groups.length > 0 ) {
                                var submatch = regexMatch.groups[index - 1];
                                if (typeof submatch !== 'undefined') {
                                    substitute += submatch;
                                }
                            }
                            position += index.toString().length;
                        } else {
                            // not a capture group, treat the $ as literal
                            substitute += '$';
                        }
                    }
                    index = replacement.indexOf('$', position);
                }
                substitute += replacement.substring(position);
                return substitute;
            };
        } else {
            replacer = replacement;
        }

        var result = '';
        var position = 0;

        if(typeof limit === 'undefined' || limit > 0) {
            var count = 0;
            if(typeof pattern === 'string') {
                var index = str.indexOf(pattern, position);
                while(index !== -1 && (typeof limit === 'undefined' || count < limit)) {
                    result += str.substring(position, index);
                    result += replacement;
                    position = index + pattern.length;
                    count++;
                    index = str.indexOf(pattern, position);
                }
                result += str.substring(position);
            } else {
                var matches = pattern(str);
                if (typeof matches !== 'undefined') {
                    while (typeof matches !== 'undefined' && (typeof limit === 'undefined' || count < limit)) {
                        result += str.substring(position, matches.start);
                        var replacedWith = yield * apply(replacer, [matches], null);
                        // check replacedWith is a string
                        if(typeof replacedWith === 'string') {
                            result += replacedWith;
                        } else {
                            // not a string - throw error
                            throw {
                                code: "D3012",
                                stack: (new Error()).stack,
                                value: replacedWith
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
    function functionBase64encode(str) {
        // undefined inputs always return undefined
        if(typeof str === 'undefined') {
            return undefined;
        }
        // Use btoa in a browser, or Buffer in Node.js

        var btoa = typeof window !== 'undefined' ?
            /* istanbul ignore next */ window.btoa :
            function(str) {
                // Simply doing `new Buffer` at this point causes Browserify to pull
                // in the entire Buffer browser library, which is large and unnecessary.
                // Using `global.Buffer` defeats this.
                return new global.Buffer(str, 'binary').toString('base64');
            };
        return btoa(str);
    }

    /**
     * Base64 decode a string
     * @param {String} str - string
     * @returns {String} Base 64 encoding of the binary data
     */
    function functionBase64decode(str) {
        // undefined inputs always return undefined
        if(typeof str === 'undefined') {
            return undefined;
        }
        // Use btoa in a browser, or Buffer in Node.js
        var atob = typeof window !== 'undefined' ?
            /* istanbul ignore next */ window.atob :
            function(str) {
                // Simply doing `new Buffer` at this point causes Browserify to pull
                // in the entire Buffer browser library, which is large and unnecessary.
                // Using `global.Buffer` defeats this.
                return new global.Buffer(str, 'base64').toString('binary');
            };
        return atob(str);
    }

    /**
     * Split a string into an array of substrings
     * @param {String} str - string
     * @param {String} separator - the token or regex that splits the string
     * @param {Integer} [limit] - max number of substrings
     * @returns {Array} The array of string
     */
    function functionSplit(str, separator, limit) {
        // undefined inputs always return undefined
        if(typeof str === 'undefined') {
            return undefined;
        }

        // limit, if specified, must be a non-negative number
        if(limit < 0) {
            throw {
                code: "D3020",
                stack: (new Error()).stack,
                value: limit,
                index: 3
            };
        }

        var result = [];

        if(typeof limit === 'undefined' || limit > 0) {
            if (typeof separator === 'string') {
                result = str.split(separator, limit);
            } else {
                var count = 0;
                var matches = separator(str);
                if (typeof matches !== 'undefined') {
                    var start = 0;
                    while (typeof matches !== 'undefined' && (typeof limit === 'undefined' || count < limit)) {
                        result.push(str.substring(start, matches.start));
                        start = matches.end;
                        matches = matches.next();
                        count++;
                    }
                    if(typeof limit === 'undefined' || count < limit) {
                        result.push(str.substring(start));
                    }
                } else {
                    result = [str];
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
    function functionJoin(strs, separator) {
        // undefined inputs always return undefined
        if(typeof strs === 'undefined') {
            return undefined;
        }

        // if separator is not specified, default to empty string
        if(typeof separator === 'undefined') {
            separator = "";
        }

        return strs.join(separator);
    }

    /**
     * Cast argument to number
     * @param {Object} arg - Argument
     * @returns {Number} numeric value of argument
     */
    function functionNumber(arg) {
        var result;

        // undefined inputs always return undefined
        if(typeof arg === 'undefined') {
            return undefined;
        }

        if (typeof arg === 'number') {
            // already a number
            result = arg;
        } else if(typeof arg === 'string' && /^-?(0|([1-9][0-9]*))(\.[0-9]+)?([Ee][-+]?[0-9]+)?$/.test(arg) && !isNaN(parseFloat(arg)) && isFinite(arg)) {
            result = parseFloat(arg);
        } else {
            throw {
                code: "D3030",
                value: arg,
                stack: (new Error()).stack,
                index: 1
            };
        }
        return result;
    }

    /**
     * Absolute value of a number
     * @param {Number} arg - Argument
     * @returns {Number} absolute value of argument
     */
    function functionAbs(arg) {
        var result;

        // undefined inputs always return undefined
        if(typeof arg === 'undefined') {
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
    function functionFloor(arg) {
        var result;

        // undefined inputs always return undefined
        if(typeof arg === 'undefined') {
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
    function functionCeil(arg) {
        var result;

        // undefined inputs always return undefined
        if(typeof arg === 'undefined') {
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
    function functionRound(arg, precision) {
        var result;

        // undefined inputs always return undefined
        if(typeof arg === 'undefined') {
            return undefined;
        }

        if(precision) {
            // shift the decimal place - this needs to be done in a string since multiplying
            // by a power of ten can introduce floating point precision errors which mess up
            // this rounding algorithm - See 'Decimal rounding' in
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
            // Shift
            var value = arg.toString().split('e');
            arg = +(value[0] + 'e' + (value[1] ? (+value[1] + precision) : precision));

        }

        // round up to nearest int
        result = Math.round(arg);
        var diff = result - arg;
        if(Math.abs(diff) === 0.5 && Math.abs(result % 2) === 1) {
            // rounded the wrong way - adjust to nearest even number
            result = result - 1;
        }
        if(precision) {
            // Shift back
            value = result.toString().split('e');
            /* istanbul ignore next */
            result = +(value[0] + 'e' + (value[1] ? (+value[1] - precision) : -precision));
        }
        if(Object.is(result, -0)) { // ESLint rule 'no-compare-neg-zero' suggests this way
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
    function functionSqrt(arg) {
        var result;

        // undefined inputs always return undefined
        if(typeof arg === 'undefined') {
            return undefined;
        }

        if(arg < 0) {
            throw {
                stack: (new Error()).stack,
                code: "D3060",
                index: 1,
                value: arg
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
    function functionPower(arg, exp) {
        var result;

        // undefined inputs always return undefined
        if(typeof arg === 'undefined') {
            return undefined;
        }

        result = Math.pow(arg, exp);

        if(!isFinite(result)) {
            throw {
                stack: (new Error()).stack,
                code: "D3061",
                index: 1,
                value: arg,
                exp: exp
            };
        }

        return result;
    }

    /**
     * Returns a random number 0 <= n < 1
     * @returns {number} random number
     */
    function functionRandom() {
        return Math.random();
    }

    /**
     * Evaluate an input and return a boolean
     * @param {*} arg - Arguments
     * @returns {boolean} Boolean
     */
    function functionBoolean(arg) {
        // cast arg to its effective boolean value
        // boolean: unchanged
        // string: zero-length -> false; otherwise -> true
        // number: 0 -> false; otherwise -> true
        // null -> false
        // array: empty -> false; length > 1 -> true
        // object: empty -> false; non-empty -> true
        // function -> false

        // undefined inputs always return undefined
        if(typeof arg === 'undefined') {
            return undefined;
        }

        var result = false;
        if (Array.isArray(arg)) {
            if (arg.length === 1) {
                result = functionBoolean(arg[0]);
            } else if (arg.length > 1) {
                var trues = arg.filter(function(val) {return functionBoolean(val);});
                result = trues.length > 0;
            }
        } else if (typeof arg === 'string') {
            if (arg.length > 0) {
                result = true;
            }
        } else if (isNumeric(arg)) {
            if (arg !== 0) {
                result = true;
            }
        } else if (arg !== null && typeof arg === 'object') {
            if (Object.keys(arg).length > 0) {
                // make sure it's not a lambda function
                if (!(isLambda(arg) || arg._jsonata_function)) {
                    result = true;
                }
            }
        } else if (typeof arg === 'boolean' && arg === true) {
            result = true;
        }
        return result;
    }

    /**
     * returns the Boolean NOT of the arg
     * @param {*} arg - argument
     * @returns {boolean} - NOT arg
     */
    function functionNot(arg) {
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
        if(typeof arr === 'undefined') {
            return undefined;
        }

        var result = [];
        // do the map - iterate over the arrays, and invoke func
        for (var i = 0; i < arr.length; i++) {
            var func_args = [arr[i]]; // the first arg (value) is required
            // the other two are optional - only supply it if the function can take it
            var length = typeof func === 'function' ? func.length :
                func._jsonata_function === true ? func.implementation.length : func.arguments.length;
            if(length >= 2) {
                func_args.push(i);
            }
            if(length >= 3) {
                func_args.push(arr);
            }
            // invoke func
            var res = yield * apply(func, func_args, null);
            if(typeof res !== 'undefined') {
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
    function* functionFilter(arr, func) { // eslint-disable-line require-yield
        // undefined inputs always return undefined
        if(typeof arr === 'undefined') {
            return undefined;
        }

        var result = [];

        var predicate = function (value, index, array) {
            var it = apply(func, [value, index, array], null);
            // returns a generator - so iterate over it
            var res = it.next();
            while (!res.done) {
                res = it.next(res.value);
            }
            return res.value;
        };

        for(var i = 0; i < arr.length; i++) {
            var entry = arr[i];
            if(functionBoolean(predicate(entry, i, arr))) {
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
    function functionZip() {
        // this can take a variable number of arguments
        var result = [];
        var args = Array.prototype.slice.call(arguments);
        // length of the shortest array
        var length = Math.min.apply(Math, args.map(function(arg) {
            if(Array.isArray(arg)) {
                return arg.length;
            }
            return 0;
        }));
        for(var i = 0; i < length; i++) {
            var tuple = args.map((arg) => {return arg[i];});
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
        if(typeof sequence === 'undefined') {
            return undefined;
        }

        var result;

        if (!(func.length === 2 || (func._jsonata_function === true && func.implementation.length === 2) || func.arguments.length === 2)) {
            throw {
                stack: (new Error()).stack,
                code: "D3050",
                index: 1
            };
        }

        var index;
        if (typeof init === 'undefined' && sequence.length > 0) {
            result = sequence[0];
            index = 1;
        } else {
            result = init;
            index = 0;
        }

        while (index < sequence.length) {
            result = yield * apply(func, [result, sequence[index]], null);
            index++;
        }

        return result;
    }

    /**
     * Return keys for an object
     * @param {Object} arg - Object
     * @returns {Array} Array of keys
     */
    function functionKeys(arg) {
        var result = [];

        if(Array.isArray(arg)) {
            // merge the keys of all of the items in the array
            var merge = {};
            arg.forEach(function(item) {
                var keys = functionKeys(item);
                if(Array.isArray(keys)) {
                    keys.forEach(function(key) {
                        merge[key] = true;
                    });
                }
            });
            result = functionKeys(merge);
        } else if(arg !== null && typeof arg === 'object' && !(isLambda(arg))) {
            result = Object.keys(arg);
            if(result.length === 0) {
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
    function functionLookup(object, key) {
        var result = evaluateName({value: key}, object);
        return result;
    }

    /**
     * Append second argument to first
     * @param {Array|Object} arg1 - First argument
     * @param {Array|Object} arg2 - Second argument
     * @returns {*} Appended arguments
     */
    function functionAppend(arg1, arg2) {
        // disregard undefined args
        if (typeof arg1 === 'undefined') {
            return arg2;
        }
        if (typeof arg2 === 'undefined') {
            return arg1;
        }
        // if either argument is not an array, make it so
        if (!Array.isArray(arg1)) {
            arg1 = [arg1];
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
    function functionExists(arg){
        if (typeof arg === 'undefined') {
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
    function functionSpread(arg) {
        var result = [];

        if(Array.isArray(arg)) {
            // spread all of the items in the array
            arg.forEach(function(item) {
                result = functionAppend(result, functionSpread(item));
            });
        } else if(arg !== null && typeof arg === 'object' && !isLambda(arg)) {
            for(var key in arg) {
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
     * Reverses the order of items in an array
     * @param {Array} arr - the array to reverse
     * @returns {Array} - the reversed array
     */
    function functionReverse(arr) {
        // undefined inputs always return undefined
        if(typeof arr === 'undefined') {
            return undefined;
        }

        if(arr.length <= 1) {
            return arr;
        }

        var length = arr.length;
        var result = new Array(length);
        for(var i = 0; i < length; i++) {
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
        var result = [];

        for(var key in obj) {
            var func_args = [obj[key], key];
            // invoke func
            result.push(yield * apply(func, func_args, null));
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
    function functionSort(arr, comparator) {
        // undefined inputs always return undefined
        if(typeof arr === 'undefined') {
            return undefined;
        }

        if(arr.length <= 1) {
            return arr;
        }

        var comp;
        if(typeof comparator === 'undefined') {
            // inject a default comparator - only works for numeric or string arrays
            if (!isArrayOfNumbers(arr) && !isArrayOfStrings(arr)) {
                throw {
                    stack: (new Error()).stack,
                    code: "D3070",
                    index: 1
                };
            }

            comp = function (a, b) {
                return a > b;
            };
        } else if(typeof comparator === 'function') {
            // for internal usage of functionSort (i.e. order-by syntax)
            comp = comparator;
        } else {
            comp = function (a, b) {
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
                } else if (comp(left[0], right[0])) { // invoke the comparator function
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
            if(array.length <= 1) {
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
    function functionShuffle(arr) {
        // undefined inputs always return undefined
        if(typeof arr === 'undefined') {
            return undefined;
        }

        if(arr.length <= 1) {
            return arr;
        }

        // shuffle using the 'inside-out' variant of the Fisher-Yates algorithm
        var result = new Array(arr.length);
        for(var i = 0; i < arr.length; i++) {
            var j = Math.floor(Math.random() * (i + 1)); // random integer such that 0 ≤ j ≤ i
            if(i !== j) {
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
    function functionSift(arg, func) {
        var result = {};

        var predicate = function (value, key, object) {
            var it = apply(func, [value, key, object], null);
            // returns a generator - so iterate over it
            var res = it.next();
            while (!res.done) {
                res = it.next(res.value);
            }
            return res.value;
        };

        for(var item in arg) {
            var entry = arg[item];
            if(functionBoolean(predicate(entry, item, arg))) {
                result[item] = entry;
            }
        }

        // empty objects should be changed to undefined
        if(Object.keys(result).length === 0) {
            result = undefined;
        }

        return result;
    }

    /**
     * Create frame
     * @param {Object} enclosingEnvironment - Enclosing environment
     * @returns {{bind: bind, lookup: lookup}} Created frame
     */
    function createFrame(enclosingEnvironment) {
        var bindings = {};
        return {
            bind: function (name, value) {
                bindings[name] = value;
            },
            lookup: function (name) {
                var value;
                if(bindings.hasOwnProperty(name)) {
                    value = bindings[name];
                } else if (enclosingEnvironment) {
                    value = enclosingEnvironment.lookup(name);
                }
                return value;
            }
        };
    }

    // Function registration
    staticFrame.bind('sum', defineFunction(functionSum, '<a<n>:n>'));
    staticFrame.bind('count', defineFunction(functionCount, '<a:n>'));
    staticFrame.bind('max', defineFunction(functionMax, '<a<n>:n>'));
    staticFrame.bind('min', defineFunction(functionMin, '<a<n>:n>'));
    staticFrame.bind('average', defineFunction(functionAverage, '<a<n>:n>'));
    staticFrame.bind('string', defineFunction(functionString, '<x-:s>'));
    staticFrame.bind('substring', defineFunction(functionSubstring, '<s-nn?:s>'));
    staticFrame.bind('substringBefore', defineFunction(functionSubstringBefore, '<s-s:s>'));
    staticFrame.bind('substringAfter', defineFunction(functionSubstringAfter, '<s-s:s>'));
    staticFrame.bind('lowercase', defineFunction(functionLowercase, '<s-:s>'));
    staticFrame.bind('uppercase', defineFunction(functionUppercase, '<s-:s>'));
    staticFrame.bind('length', defineFunction(functionLength, '<s-:n>'));
    staticFrame.bind('trim', defineFunction(functionTrim, '<s-:s>'));
    staticFrame.bind('match', defineFunction(functionMatch, '<s-f<s:o>n?:a<o>>'));
    staticFrame.bind('contains', defineFunction(functionContains, '<s-(sf):b>')); // TODO <s-(sf<s:o>):b>
    staticFrame.bind('replace', defineFunction(functionReplace, '<s-(sf)(sf)n?:s>')); // TODO <s-(sf<s:o>)(sf<o:s>)n?:s>
    staticFrame.bind('split', defineFunction(functionSplit, '<s-(sf)n?:a<s>>')); // TODO <s-(sf<s:o>)n?:a<s>>
    staticFrame.bind('join', defineFunction(functionJoin, '<a<s>s?:s>'));
    staticFrame.bind('number', defineFunction(functionNumber, '<(ns)-:n>'));
    staticFrame.bind('floor', defineFunction(functionFloor, '<n-:n>'));
    staticFrame.bind('ceil', defineFunction(functionCeil, '<n-:n>'));
    staticFrame.bind('round', defineFunction(functionRound, '<n-n?:n>'));
    staticFrame.bind('abs', defineFunction(functionAbs, '<n-:n>'));
    staticFrame.bind('sqrt', defineFunction(functionSqrt, '<n-:n>'));
    staticFrame.bind('power', defineFunction(functionPower, '<n-n:n>'));
    staticFrame.bind('random', defineFunction(functionRandom, '<:n>'));
    staticFrame.bind('boolean', defineFunction(functionBoolean, '<x-:b>'));
    staticFrame.bind('not', defineFunction(functionNot, '<x-:b>'));
    staticFrame.bind('map', defineFunction(functionMap, '<af>'));
    staticFrame.bind('zip', defineFunction(functionZip, '<a+>'));
    staticFrame.bind('filter', defineFunction(functionFilter, '<af>'));
    staticFrame.bind('reduce', defineFunction(functionFoldLeft, '<afj?:j>')); // TODO <f<jj:j>a<j>j?:j>
    staticFrame.bind('sift', defineFunction(functionSift, '<o-f?:o>'));
    staticFrame.bind('keys', defineFunction(functionKeys, '<x-:a<s>>'));
    staticFrame.bind('lookup', defineFunction(functionLookup, '<x-s:x>'));
    staticFrame.bind('append', defineFunction(functionAppend, '<xx:a>'));
    staticFrame.bind('exists', defineFunction(functionExists, '<x:b>'));
    staticFrame.bind('spread', defineFunction(functionSpread, '<x-:a<o>>'));
    staticFrame.bind('reverse', defineFunction(functionReverse, '<a:a>'));
    staticFrame.bind('each', defineFunction(functionEach, '<o-f:a>'));
    staticFrame.bind('sort', defineFunction(functionSort, '<af?:a>'));
    staticFrame.bind('shuffle', defineFunction(functionShuffle, '<a:a>'));
    staticFrame.bind('base64encode', defineFunction(functionBase64encode, '<s-:s>'));
    staticFrame.bind('base64decode', defineFunction(functionBase64decode, '<s-:s>'));

    /**
     * Error codes
     *
     */
    var errorCodes = {
        "S0101": "String literal must be terminated by a matching quote",
        "S0102": "Number out of range: {{token}}",
        "S0103": "Unsupported escape sequence: \\{{token}}",
        "S0104": "The escape sequence \\u must be followed by 4 hex digits",
        "S0203": "Expected {{value}} before end of expression",
        "S0202": "Expected {{value}}, got {{token}}",
        "S0204": "Unknown operator: {{token}}",
        "S0205": "Unexpected token: {{token}}",
        "S0208": "Parameter {{value}} of function definition must be a variable name (start with $)",
        "S0209": "A predicate cannot follow a grouping expression in a step",
        "S0210": "Each step can only have one grouping expression",
        "S0201": "Syntax error: {{token}}",
        "S0206": "Unknown expression type: {{token}}",
        "S0207": "Unexpected end of expression",
        "S0301": "Empty regular expressions are not allowed",
        "S0302": "No terminating / in regular expression",
        "S0402": "Choice groups containing parameterized types are not supported",
        "S0401": "Type parameters can only be applied to functions and arrays",
        "T0410": "Argument {{index}} of function {{token}} does not match function signature",
        "T0411": "Context value is not a compatible type with argument {{index}} of function {{token}}",
        "T0412": "Argument {{index}} of function {{token}} must be an array of {{type}}",
        "D1001": "Number out of range: {{value}}",
        "D1002": "Cannot negate a non-numeric value: {{value}}",
        "T2001": "The left side of the {{token}} operator must evaluate to a number",
        "T2002": "The right side of the {{token}} operator must evaluate to a number",
        "T1003": "Key in object structure must evaluate to a string; got: {{value}}",
        "T2003": "The left side of the range operator (..) must evaluate to an integer",
        "T2004": "The right side of the range operator (..) must evaluate to an integer",
        "D2005": "The left side of := must be a variable name (start with $)",
        "D1004": "Regular expression matches zero length string",
        "T2006": "The right side of the function application operator ~> must be a function",
        "T2007": "Type mismatch when comparing values {{value}} and {{value2}} in order-by clause",
        "T2008": "The expressions within an order-by clause must evaluate to numeric or string values",
        "T2009": "The values {{value}} and {{value2}} either side of operator {{token}} must be of the same data type",
        "T2010": "The expressions either side of operator {{token}} must evaluate to numeric or string values",
        "T1005": "Attempted to invoke a non-function. Did you mean ${{{token}}}?",
        "T1006": "Attempted to invoke a non-function",
        "T1007": "Attempted to partially apply a non-function. Did you mean ${{{token}}}?",
        "T1008": "Attempted to partially apply a non-function",
        "D3001": "Attempting to invoke string function on Infinity or NaN",
        "D3010": "Second argument of replace function cannot be an empty string",
        "D3011": "Fourth argument of replace function must evaluate to a positive number",
        "D3012": "Attempted to replace a matched string with a non-string value",
        "D3020": "Third argument of split function must evaluate to a positive number",
        "D3030": "Unable to cast value to a number: {{value}}",
        "D3040": "Third argument of match function must evaluate to a positive number",
        "D3050": "First argument of reduce function must be a function with two arguments",
        "D3060": "The sqrt function cannot be applied to a negative number: {{value}}",
        "D3061": "The power function has resulted in a value that cannot be represented as a JSON number: base={{value}}, exponent={{exp}}",
        "D3070": "The single argument form of the sort function can only be applied to an array of strings or an array of numbers.  Use the second argument to specify a comparison function"
    };

    /**
     * lookup a message template from the catalog and substitute the inserts
     * @param {string} err - error code to lookup
     * @returns {string} message
     */
    function lookupMessage(err) {
        var message = 'Unknown error';
        if(typeof err.message !== 'undefined') {
            message = err.message;
        }
        var template = errorCodes[err.code];
        if(typeof template !== 'undefined') {
            // if there are any handlebars, replace them with the field references
            // triple braces - replace with value
            // double braces - replace with json stringified value
            message = template.replace(/\{\{\{([^}]+)}}}/g, function() {
                return err[arguments[1]];
            });
            message = message.replace(/\{\{([^}]+)}}/g, function() {
                return JSON.stringify(err[arguments[1]]);
            });
        }
        return message;
    }

    /**
     * JSONata
     * @param {Object} expr - JSONata expression
     * @returns {{evaluate: evaluate, assign: assign}} Evaluated expression
     */
    function jsonata(expr) {
        var ast;
        try {
            ast = parser(expr);
        } catch(err) {
            // insert error message into structure
            err.message = lookupMessage(err);
            throw err;
        }
        var environment = createFrame(staticFrame);
        return {
            evaluate: function (input, bindings, callback) {
                if (typeof bindings !== 'undefined') {
                    var exec_env;
                    // the variable bindings have been passed in - create a frame to hold these
                    exec_env = createFrame(environment);
                    for (var v in bindings) {
                        exec_env.bind(v, bindings[v]);
                    }
                } else {
                    exec_env = environment;
                }
                // put the input document into the environment as the root object
                exec_env.bind('$', input);

                // capture the timestamp and put it in the execution environment
                // the $now() function will return this value - whenever it is called
                var timestamp = (new Date()).toJSON();
                exec_env.bind('now', defineFunction(function() {
                    return timestamp;
                }, '<:s>'));

                var result, it;
                // if a callback function is supplied, then drive the generator in a promise chain
                if(typeof callback === 'function') {
                    exec_env.bind('__jsonata_async', true);
                    var thenHandler = function (response) {
                        //                    console.log('THEN: ', response);
                        result = it.next(response);
                        if (result.done) {
                            callback(null, result.value);
                        } else {
                            result.value.then(thenHandler)
                                .catch(function (err) {
                                    err.message = lookupMessage(err);
                                    callback(err, null);
                                });
                        }
                    };
                    it = evaluate(ast, input, exec_env);
                    result = it.next();
                    result.value.then(thenHandler);
                } else {
                    // no callback function - drive the generator to completion synchronously
                    try {
                        it = evaluate(ast, input, exec_env);
                        result = it.next();
                        while (!result.done) {
                            result = it.next(result.value);
                        }
                        return result.value;
                    } catch (err) {
                        // insert error message into structure
                        err.message = lookupMessage(err);
                        throw err;
                    }
                }
            },
            assign: function (name, value) {
                environment.bind(name, value);
            },
            registerFunction: function(name, implementation, signature) {
                var func = defineFunction(implementation, signature);
                environment.bind(name, func);
            }
        };
    }

    jsonata.parser = parser;

    return jsonata;

})();

// node.js only - export the jsonata and parser functions
// istanbul ignore else
if(typeof module !== 'undefined') {
    module.exports = jsonata;
}
