/**
 * © Copyright IBM Corp. 2016, 2018 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

var parseSignature = require('./signature');

const parser = (() => {
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
        '@': 80,
        '#': 80,
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

        var scanRegex = function () {
            // the prefix '/' will have been previously scanned. Find the end of the regex.
            // search for closing '/' ignoring any that are escaped, or within brackets
            var start = position;
            var depth = 0;
            var pattern;
            var flags;
            while (position < length) {
                var currentChar = path.charAt(position);
                if (currentChar === '/' && path.charAt(position - 1) !== '\\' && depth === 0) {
                    // end of regex found
                    pattern = path.substring(start, position);
                    if (pattern === '') {
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
                    while (currentChar === 'i' || currentChar === 'm') {
                        position++;
                        currentChar = path.charAt(position);
                    }
                    flags = path.substring(start, position) + 'g';
                    return new RegExp(pattern, flags);
                }
                if ((currentChar === '(' || currentChar === '[' || currentChar === '{') && path.charAt(position - 1) !== '\\') {
                    depth++;
                }
                if ((currentChar === ')' || currentChar === ']' || currentChar === '}') && path.charAt(position - 1) !== '\\') {
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
            // skip comments
            if (currentChar === '/' && path.charAt(position + 1) === '*') {
                var commentStart = position;
                position += 2;
                currentChar = path.charAt(position);
                while (!(currentChar === '*' && path.charAt(position + 1) === '/')) {
                    currentChar = path.charAt(++position);
                    if (position >= length) {
                        // no closing tag
                        throw {
                            code: "S0106",
                            stack: (new Error()).stack,
                            position: commentStart
                        };
                    }
                }
                position += 2;
                currentChar = path.charAt(position);
                return next(prefix); // need this to swallow any following whitespace
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
            if (Object.prototype.hasOwnProperty.call(operators, currentChar)) {
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
                        if (Object.prototype.hasOwnProperty.call(escapes, currentChar)) {
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
            // test for quoted names (backticks)
            var name;
            if (currentChar === '`') {
                // scan for closing quote
                position++;
                var end = path.indexOf('`', position);
                if (end !== -1) {
                    name = path.substring(position, end);
                    position = end + 1;
                    return create('name', name);
                }
                position = length;
                throw {
                    code: "S0105",
                    stack: (new Error()).stack,
                    position: position
                };
            }
            // test for names
            var i = position;
            var ch;
            for (; ;) {
                ch = path.charAt(i);
                if (i === length || ' \t\n\r\v'.indexOf(ch) > -1 || Object.prototype.hasOwnProperty.call(operators, ch)) {
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

    // This parser implements the 'Top down operator precedence' algorithm developed by Vaughan R Pratt; http://dl.acm.org/citation.cfm?id=512931.
    // and builds on the Javascript framework described by Douglas Crockford at http://javascript.crockford.com/tdop/tdop.html
    // and in 'Beautiful Code', edited by Andy Oram and Greg Wilson, Copyright 2007 O'Reilly Media, Inc. 798-0-596-51004-6

    var parser = function (source, recover) {
        var node;
        var lexer;

        var symbol_table = {};
        var errors = [];

        var remainingTokens = function () {
            var remaining = [];
            if (node.id !== '(end)') {
                remaining.push({type: node.type, value: node.value, position: node.position});
            }
            var nxt = lexer();
            while (nxt !== null) {
                remaining.push(nxt);
                nxt = lexer();
            }
            return remaining;
        };

        var base_symbol = {
            nud: function () {
                // error - symbol has been invoked as a unary operator
                var err = {
                    code: 'S0211',
                    token: this.value,
                    position: this.position
                };

                if (recover) {
                    err.remaining = remainingTokens();
                    err.type = 'error';
                    errors.push(err);
                    return err;
                } else {
                    err.stack = (new Error()).stack;
                    throw err;
                }
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

        var handleError = function (err) {
            if (recover) {
                // tokenize the rest of the buffer and add it to an error token
                err.remaining = remainingTokens();
                errors.push(err);
                var symbol = symbol_table["(error)"];
                node = Object.create(symbol);
                node.error = err;
                node.type = "(error)";
                return node;
            } else {
                err.stack = (new Error()).stack;
                throw err;
            }
        };

        var advance = function (id, infix) {
            if (id && node.id !== id) {
                var code;
                if (node.id === '(end)') {
                    // unexpected end of buffer
                    code = "S0203";
                } else {
                    code = "S0202";
                }
                var err = {
                    code: code,
                    position: node.position,
                    token: node.value,
                    value: id
                };
                return handleError(err);
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
                        return handleError({
                            code: "S0204",
                            stack: (new Error()).stack,
                            position: next_token.position,
                            token: value
                        });
                    }
                    break;
                case 'string':
                case 'number':
                case 'value':
                    symbol = symbol_table["(literal)"];
                    break;
                case 'regex':
                    type = "regex";
                    symbol = symbol_table["(regex)"];
                    break;
                /* istanbul ignore next */
                default:
                    return handleError({
                        code: "S0205",
                        stack: (new Error()).stack,
                        position: next_token.position,
                        token: value
                    });
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

        var terminal = function (id) {
            var s = symbol(id, 0);
            s.nud = function () {
                return this;
            };
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
            var s = symbol(id, bp);
            s.led = led;
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

        terminal("(end)");
        terminal("(name)");
        terminal("(literal)");
        terminal("(regex)");
        symbol(":");
        symbol(";");
        symbol(",");
        symbol(")");
        symbol("]");
        symbol("}");
        symbol(".."); // range operator
        infix("."); // map operator
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
        terminal("and"); // the 'keywords' can also be used as terminals (field names)
        terminal("or"); //
        terminal("in"); //
        prefix("-"); // unary numeric negation
        infix("~>"); // function application

        infixr("(error)", 10, function (left) {
            this.lhs = left;

            this.error = node.error;
            this.remaining = remainingTokens();
            this.type = 'error';
            return this;
        });

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

        // parent operator
        prefix('%', function () {
            this.type = "parent";
            return this;
        });

        // function invocation
        infix("(", operators['('], function (left) {
            // left is is what we are trying to invoke
            this.procedure = left;
            this.type = 'function';
            this.arguments = [];
            if (node.id !== ')') {
                for (; ;) {
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
                        return handleError({
                            code: "S0208",
                            stack: (new Error()).stack,
                            position: arg.position,
                            token: arg.value,
                            value: index + 1
                        });
                    }
                });
                this.type = 'lambda';
                // is the next token a '<' - if so, parse the function signature
                if (node.id === '<') {
                    var sigPos = node.position;
                    var depth = 1;
                    var sig = '<';
                    while (depth > 0 && node.id !== '{' && node.id !== '(end)') {
                        var tok = advance();
                        if (tok.id === '>') {
                            depth--;
                        } else if (tok.id === '<') {
                            depth++;
                        }
                        sig += tok.value;
                    }
                    advance('>');
                    try {
                        this.signature = parseSignature(sig);
                    } catch (err) {
                        // insert the position into this error
                        err.position = sigPos + err.offset;
                        return handleError(err);
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
                for (; ;) {
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
            this.expressions = a;
            this.type = "unary";
            return this;
        });

        // filter - predicate or array index
        infix("[", operators['['], function (left) {
            if (node.id === "]") {
                // empty predicate means maintain singleton arrays in the output
                var step = left;
                while (step && step.type === 'binary' && step.value === '[') {
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
            for (; ;) {
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
                if (node.id !== ",") {
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
                for (; ;) {
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
            if (typeof left === 'undefined') {
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

        // bind variable
        infixr(":=", operators[':='], function (left) {
            if (left.type !== 'variable') {
                return handleError({
                    code: "S0212",
                    stack: (new Error()).stack,
                    position: left.position,
                    token: left.value
                });
            }
            this.lhs = left;
            this.rhs = expression(operators[':='] - 1); // subtract 1 from bindingPower for right associative operators
            this.type = "binary";
            return this;
        });

        // focus variable bind
        infix("@", operators['@'], function (left) {
            this.lhs = left;
            this.rhs = expression(operators['@']);
            if(this.rhs.type !== 'variable') {
                return handleError({
                    code: "S0214",
                    stack: (new Error()).stack,
                    position: this.rhs.position,
                    token: "@"
                });
            }
            this.type = "binary";
            return this;
        });

        // index (position) variable bind
        infix("#", operators['#'], function (left) {
            this.lhs = left;
            this.rhs = expression(operators['#']);
            if(this.rhs.type !== 'variable') {
                return handleError({
                    code: "S0214",
                    stack: (new Error()).stack,
                    position: this.rhs.position,
                    token: "#"
                });
            }
            this.type = "binary";
            return this;
        });

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

        // object transformer
        prefix("|", function () {
            this.type = 'transform';
            this.pattern = expression(0);
            advance('|');
            this.update = expression(0);
            if (node.id === ',') {
                advance(',');
                this.delete = expression(0);
            }
            advance('|');
            return this;
        });

        // tail call optimization
        // this is invoked by the post parser to analyse lambda functions to see
        // if they make a tail call.  If so, it is replaced by a thunk which will
        // be invoked by the trampoline loop during function application.
        // This enables tail-recursive functions to be written without growing the stack
        var tailCallOptimize = function (expr) {
            var result;
            if (expr.type === 'function' && !expr.predicate) {
                var thunk = {type: 'lambda', thunk: true, arguments: [], position: expr.position};
                thunk.body = expr;
                result = thunk;
            } else if (expr.type === 'condition') {
                // analyse both branches
                expr.then = tailCallOptimize(expr.then);
                if (typeof expr.else !== 'undefined') {
                    expr.else = tailCallOptimize(expr.else);
                }
                result = expr;
            } else if (expr.type === 'block') {
                // only the last expression in the block
                var length = expr.expressions.length;
                if (length > 0) {
                    expr.expressions[length - 1] = tailCallOptimize(expr.expressions[length - 1]);
                }
                result = expr;
            } else {
                result = expr;
            }
            return result;
        };

        var ancestorLabel = 0;
        var ancestorIndex = 0;
        var ancestry = [];

        var seekParent = function (node, slot) {
            switch (node.type) {
                case 'name':
                case 'wildcard':
                    slot.level--;
                    if(slot.level === 0) {
                        if (typeof node.ancestor === 'undefined') {
                            node.ancestor = slot;
                        } else {
                            // reuse the existing label
                            ancestry[slot.index].slot.label = node.ancestor.label;
                            node.ancestor = slot;
                        }
                        node.tuple = true;
                    }
                    break;
                case 'parent':
                    slot.level++;
                    break;
                case 'block':
                    // look in last expression in the block
                    if(node.expressions.length > 0) {
                        node.tuple = true;
                        slot = seekParent(node.expressions[node.expressions.length - 1], slot);
                    }
                    break;
                case 'path':
                    // last step in path
                    node.tuple = true;
                    var index = node.steps.length - 1;
                    slot = seekParent(node.steps[index--], slot);
                    while (slot.level > 0 && index >= 0) {
                        // check previous steps
                        slot = seekParent(node.steps[index--], slot);
                    }
                    break;
                default:
                    // error - can't derive ancestor
                    throw {
                        code: "S0217",
                        token: node.type,
                        position: node.position
                    };
            }
            return slot;
        };

        var pushAncestry = function(result, value) {
            if(typeof value.seekingParent !== 'undefined' || value.type === 'parent') {
                var slots = (typeof value.seekingParent !== 'undefined') ? value.seekingParent : [];
                if (value.type === 'parent') {
                    slots.push(value.slot);
                }
                if(typeof result.seekingParent === 'undefined') {
                    result.seekingParent = slots;
                } else {
                    Array.prototype.push.apply(result.seekingParent, slots);
                }
            }
        };

        var resolveAncestry = function(path) {
            var index = path.steps.length - 1;
            var laststep = path.steps[index];
            var slots = (typeof laststep.seekingParent !== 'undefined') ? laststep.seekingParent : [];
            if (laststep.type === 'parent') {
                slots.push(laststep.slot);
            }
            for(var is = 0; is < slots.length; is++) {
                var slot = slots[is];
                index = path.steps.length - 2;
                while (slot.level > 0) {
                    if (index < 0) {
                        if(typeof path.seekingParent === 'undefined') {
                            path.seekingParent = [slot];
                        } else {
                            path.seekingParent.push(slot);
                        }
                        break;
                    }
                    // try previous step
                    var step = path.steps[index--];
                    // multiple contiguous steps that bind the focus should be skipped
                    while(index >= 0 && step.focus && path.steps[index].focus) {
                        step = path.steps[index--];
                    }
                    slot = seekParent(step, slot);
                }
            }
        };

        // post-parse stage
        // the purpose of this is to add as much semantic value to the parse tree as possible
        // in order to simplify the work of the evaluator.
        // This includes flattening the parts of the AST representing location paths,
        // converting them to arrays of steps which in turn may contain arrays of predicates.
        // following this, nodes containing '.' and '[' should be eliminated from the AST.
        var processAST = function (expr) {
            var result;
            switch (expr.type) {
                case 'binary':
                    switch (expr.value) {
                        case '.':
                            var lstep = processAST(expr.lhs);

                            if (lstep.type === 'path') {
                                result = lstep;
                            } else {
                                result = {type: 'path', steps: [lstep]};
                            }
                            if(lstep.type === 'parent') {
                                result.seekingParent = [lstep.slot];
                            }
                            var rest = processAST(expr.rhs);
                            if (rest.type === 'function' &&
                                rest.procedure.type === 'path' &&
                                rest.procedure.steps.length === 1 &&
                                rest.procedure.steps[0].type === 'name' &&
                                result.steps[result.steps.length - 1].type === 'function') {
                                // next function in chain of functions - will override a thenable
                                result.steps[result.steps.length - 1].nextFunction = rest.procedure.steps[0].value;
                            }
                            if (rest.type === 'path') {
                                Array.prototype.push.apply(result.steps, rest.steps);
                            } else {
                                if(typeof rest.predicate !== 'undefined') {
                                    rest.stages = rest.predicate;
                                    delete rest.predicate;
                                }
                                result.steps.push(rest);
                            }
                            // any steps within a path that are string literals, should be changed to 'name'
                            result.steps.filter(function (step) {
                                if (step.type === 'number' || step.type === 'value') {
                                    // don't allow steps to be numbers or the values true/false/null
                                    throw {
                                        code: "S0213",
                                        stack: (new Error()).stack,
                                        position: step.position,
                                        value: step.value
                                    };
                                }
                                return step.type === 'string';
                            }).forEach(function (lit) {
                                lit.type = 'name';
                            });
                            // any step that signals keeping a singleton array, should be flagged on the path
                            if (result.steps.filter(function (step) {
                                return step.keepArray === true;
                            }).length > 0) {
                                result.keepSingletonArray = true;
                            }
                            // if first step is a path constructor, flag it for special handling
                            var firststep = result.steps[0];
                            if (firststep.type === 'unary' && firststep.value === '[') {
                                firststep.consarray = true;
                            }
                            // if the last step is an array constructor, flag it so it doesn't flatten
                            var laststep = result.steps[result.steps.length - 1];
                            if (laststep.type === 'unary' && laststep.value === '[') {
                                laststep.consarray = true;
                            }
                            resolveAncestry(result);
                            break;
                        case '[':
                            // predicated step
                            // LHS is a step or a predicated step
                            // RHS is the predicate expr
                            result = processAST(expr.lhs);
                            var step = result;
                            var type = 'predicate';
                            if (result.type === 'path') {
                                step = result.steps[result.steps.length - 1];
                                type = 'stages';
                            }
                            if (typeof step.group !== 'undefined') {
                                throw {
                                    code: "S0209",
                                    stack: (new Error()).stack,
                                    position: expr.position
                                };
                            }
                            if (typeof step[type] === 'undefined') {
                                step[type] = [];
                            }
                            var predicate = processAST(expr.rhs);
                            if(typeof predicate.seekingParent !== 'undefined') {
                                predicate.seekingParent.forEach(slot => {
                                    if(slot.level === 1) {
                                        seekParent(step, slot);
                                    } else {
                                        slot.level--;
                                    }
                                });
                                pushAncestry(step, predicate);
                            }
                            step[type].push({type: 'filter', expr: predicate, position: expr.position});
                            break;
                        case '{':
                            // group-by
                            // LHS is a step or a predicated step
                            // RHS is the object constructor expr
                            result = processAST(expr.lhs);
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
                                    return [processAST(pair[0]), processAST(pair[1])];
                                }),
                                position: expr.position
                            };
                            break;
                        case '^':
                            // order-by
                            // LHS is the array to be ordered
                            // RHS defines the terms
                            result = processAST(expr.lhs);
                            if (result.type !== 'path') {
                                result = {type: 'path', steps: [result]};
                            }
                            var sortStep = {type: 'sort', position: expr.position};
                            sortStep.terms = expr.rhs.map(function (terms) {
                                var expression = processAST(terms.expression);
                                pushAncestry(sortStep, expression);
                                return {
                                    descending: terms.descending,
                                    expression: expression
                                };
                            });
                            result.steps.push(sortStep);
                            resolveAncestry(result);
                            break;
                        case ':=':
                            result = {type: 'bind', value: expr.value, position: expr.position};
                            result.lhs = processAST(expr.lhs);
                            result.rhs = processAST(expr.rhs);
                            pushAncestry(result, result.rhs);
                            break;
                        case '@':
                            result = processAST(expr.lhs);
                            step = result;
                            if (result.type === 'path') {
                                step = result.steps[result.steps.length - 1];
                            }
                            // throw error if there are any predicates defined at this point
                            // at this point the only type of stages can be predicates
                            if(typeof step.stages !== 'undefined' || typeof step.predicate !== 'undefined') {
                                throw {
                                    code: "S0215",
                                    stack: (new Error()).stack,
                                    position: expr.position
                                };
                            }
                            // also throw if this is applied after an 'order-by' clause
                            if(step.type === 'sort') {
                                throw {
                                    code: "S0216",
                                    stack: (new Error()).stack,
                                    position: expr.position
                                };
                            }
                            if(expr.keepArray) {
                                step.keepArray = true;
                            }
                            step.focus = expr.rhs.value;
                            step.tuple = true;
                            break;
                        case '#':
                            result = processAST(expr.lhs);
                            step = result;
                            if (result.type === 'path') {
                                step = result.steps[result.steps.length - 1];
                            } else {
                                result = {type: 'path', steps: [result]};
                                if (typeof step.predicate !== 'undefined') {
                                    step.stages = step.predicate;
                                    delete step.predicate;
                                }
                            }
                            if (typeof step.stages === 'undefined') {
                                step.index = expr.rhs.value;
                            } else {
                                step.stages.push({type: 'index', value: expr.rhs.value, position: expr.position});
                            }
                            step.tuple = true;
                            break;
                        case '~>':
                            result = {type: 'apply', value: expr.value, position: expr.position};
                            result.lhs = processAST(expr.lhs);
                            result.rhs = processAST(expr.rhs);
                            break;
                        default:
                            result = {type: expr.type, value: expr.value, position: expr.position};
                            result.lhs = processAST(expr.lhs);
                            result.rhs = processAST(expr.rhs);
                            pushAncestry(result, result.lhs);
                            pushAncestry(result, result.rhs);
                    }
                    break;
                case 'unary':
                    result = {type: expr.type, value: expr.value, position: expr.position};
                    if (expr.value === '[') {
                        // array constructor - process each item
                        result.expressions = expr.expressions.map(function (item) {
                            var value = processAST(item);
                            pushAncestry(result, value);
                            return value;
                        });
                    } else if (expr.value === '{') {
                        // object constructor - process each pair
                        result.lhs = expr.lhs.map(function (pair) {
                            var key = processAST(pair[0]);
                            pushAncestry(result, key);
                            var value = processAST(pair[1]);
                            pushAncestry(result, value);
                            return [key, value];
                        });
                    } else {
                        // all other unary expressions - just process the expression
                        result.expression = processAST(expr.expression);
                        // if unary minus on a number, then pre-process
                        if (expr.value === '-' && result.expression.type === 'number') {
                            result = result.expression;
                            result.value = -result.value;
                        } else {
                            pushAncestry(result, result.expression);
                        }
                    }
                    break;
                case 'function':
                case 'partial':
                    result = {type: expr.type, name: expr.name, value: expr.value, position: expr.position};
                    result.arguments = expr.arguments.map(function (arg) {
                        var argAST = processAST(arg);
                        pushAncestry(result, argAST);
                        return argAST;
                    });
                    result.procedure = processAST(expr.procedure);
                    break;
                case 'lambda':
                    result = {
                        type: expr.type,
                        arguments: expr.arguments,
                        signature: expr.signature,
                        position: expr.position
                    };
                    var body = processAST(expr.body);
                    result.body = tailCallOptimize(body);
                    break;
                case 'condition':
                    result = {type: expr.type, position: expr.position};
                    result.condition = processAST(expr.condition);
                    pushAncestry(result, result.condition);
                    result.then = processAST(expr.then);
                    pushAncestry(result, result.then);
                    if (typeof expr.else !== 'undefined') {
                        result.else = processAST(expr.else);
                        pushAncestry(result, result.else);
                    }
                    break;
                case 'transform':
                    result = {type: expr.type, position: expr.position};
                    result.pattern = processAST(expr.pattern);
                    result.update = processAST(expr.update);
                    if (typeof expr.delete !== 'undefined') {
                        result.delete = processAST(expr.delete);
                    }
                    break;
                case 'block':
                    result = {type: expr.type, position: expr.position};
                    // array of expressions - process each one
                    result.expressions = expr.expressions.map(function (item) {
                        var part = processAST(item);
                        pushAncestry(result, part);
                        if (part.consarray || (part.type === 'path' && part.steps[0].consarray)) {
                            result.consarray = true;
                        }
                        return part;
                    });
                    // TODO scan the array of expressions to see if any of them assign variables
                    // if so, need to mark the block as one that needs to create a new frame
                    break;
                case 'name':
                    result = {type: 'path', steps: [expr]};
                    if (expr.keepArray) {
                        result.keepSingletonArray = true;
                    }
                    break;
                case 'parent':
                    result = {type: 'parent', slot: { label: '!' + ancestorLabel++, level: 1, index: ancestorIndex++ } };
                    ancestry.push(result);
                    break;
                case 'string':
                case 'number':
                case 'value':
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
                        result = processAST(expr);
                    } else /* istanbul ignore else */ if (expr.value === '?') {
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
                case 'error':
                    result = expr;
                    if (expr.lhs) {
                        result = processAST(expr.lhs);
                    }
                    break;
                default:
                    var code = "S0206";
                    /* istanbul ignore else */
                    if (expr.id === '(end)') {
                        code = "S0207";
                    }
                    var err = {
                        code: code,
                        position: expr.position,
                        token: expr.value
                    };
                    if (recover) {
                        errors.push(err);
                        return {type: 'error', error: err};
                    } else {
                        err.stack = (new Error()).stack;
                        throw err;
                    }
            }
            if (expr.keepArray) {
                result.keepArray = true;
            }
            return result;
        };

        // now invoke the tokenizer and the parser and return the syntax tree
        lexer = tokenizer(source);
        advance();
        // parse the tokens
        var expr = expression(0);
        if (node.id !== '(end)') {
            var err = {
                code: "S0201",
                position: node.position,
                token: node.value
            };
            handleError(err);
        }
        expr = processAST(expr);

        if(expr.type === 'parent' || typeof expr.seekingParent !== 'undefined') {
            // error - trying to derive ancestor at top level
            throw {
                code: "S0217",
                token: expr.type,
                position: expr.position
            };
        }

        if (errors.length > 0) {
            expr.errors = errors;
        }

        return expr;
    };

    return parser;
})();

module.exports = parser;
