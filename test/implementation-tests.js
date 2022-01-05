/**
 * © Copyright IBM Corp. 2016 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 *
 * The files in this directory are tests that aren't really portable
 * to other implementations for various reasons but they are included
 * in order to achieve 100% coverage for this implementation.
 */

"use strict";

var jsonata = require("../src/jsonata");
var chai = require("chai");
var expect = chai.expect;

var testdata1 = {
    "foo": {
        "bar": 42,
        "blah": [{"baz": {"fud": "hello"}}, {"baz": {"fud": "world"}}, {"bazz": "gotcha"}],
        "blah.baz": "here"
    }, "bar": 98
};

var testdata2 = {
    Account: {
        "Account Name": "Firefly",
        Order: [
            {
                OrderID: "order103",
                Product: [
                    {
                        "Product Name": "Bowler Hat",
                        ProductID: 858383,
                        SKU: "0406654608",
                        Description: {
                            Colour: "Purple",
                            Width: 300,
                            Height: 200,
                            Depth: 210,
                            Weight: 0.75
                        },
                        Price: 34.45,
                        Quantity: 2
                    },
                    {
                        "Product Name": "Trilby hat",
                        ProductID: 858236,
                        SKU: "0406634348",
                        Description: {
                            Colour: "Orange",
                            Width: 300,
                            Height: 200,
                            Depth: 210,
                            Weight: 0.6
                        },
                        Price: 21.67,
                        Quantity: 1
                    }
                ]
            },
            {
                OrderID: "order104",
                Product: [
                    {
                        "Product Name": "Bowler Hat",
                        ProductID: 858383,
                        SKU: "040657863",
                        Description: {
                            Colour: "Purple",
                            Width: 300,
                            Height: 200,
                            Depth: 210,
                            Weight: 0.75
                        },
                        Price: 34.45,
                        Quantity: 4
                    },
                    {
                        ProductID: 345664,
                        SKU: "0406654603",
                        "Product Name": "Cloak",
                        Description: {
                            Colour: "Black",
                            Width: 30,
                            Height: 20,
                            Depth: 210,
                            Weight: 2.0
                        },
                        Price: 107.99,
                        Quantity: 1
                    }
                ]
            }
        ]
    }
};

describe("Functions with side-effects", () => {
    describe("Evaluator - function: millis", function() {
        describe("$millis() returns milliseconds since the epoch", function() {
            it("should return result object", function() {
                var expr = jsonata("$millis()");
                var result = expr.evaluate(testdata2);
                // number between 1502264152715 and 2000000000000 (18 May 2033)
                var expected = result > 1502264152715 && result < 2000000000000;
                expect(expected).to.deep.equal(true);
            });
        });

        describe("$millis() always returns same value within an expression", function() {
            it("should return result object", function() {
                var expr = jsonata('{"now": $millis(), "delay": $sum([1..10000]), "later": $millis()}.(now = later)');
                var result = expr.evaluate(testdata2);
                var expected = true;
                expect(result).to.deep.equal(expected);
            });
        });

        describe("$millis() returns different timestamp for subsequent evaluate() calls", function() {
            it("should return result object", function() {
                var expr = jsonata("($sum([1..10000]); $millis())");
                var result = expr.evaluate(testdata2);
                var result2 = expr.evaluate(testdata2);
                expect(result).to.not.equal(result2);
            });
        });
    });

    describe("$now() returns timestamp", function() {
        it("should return result object", function() {
            var expr = jsonata("$now()");
            var result = expr.evaluate(testdata2);
            // follows this pattern - "2017-05-09T10:10:16.918Z"
            expect(result).to.match(/^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/);
            // var match = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/.test(result);
            // expect(match).to.deep.equal(true);
        });
    });

    describe("$now() returns timestamp with defined format", function() {
        it("should return result object", function() {
            var expr = jsonata("$now('[h]:[M01][P] [z]')");
            var result = expr.evaluate(testdata2);
            // follows this pattern - "10:23am GMT+00:00"
            expect(result).to.match(/^\d?\d:\d\d[ap]m GMT\+00:00$/);
        });
    });

    describe("$now() returns timestamp with defined format and timezone", function() {
        it("should return result object", function() {
            var expr = jsonata("$now('[h]:[M01][P] [z]', '-0500')");
            var result = expr.evaluate(testdata2);
            // follows this pattern - "10:23am GMT-05:00"
            expect(result).to.match(/^\d?\d:\d\d[ap]m GMT-05:00$/);
        });
    });

    describe("$now() always returns same value within an expression", function() {
        it("should return result object", function() {
            var expr = jsonata('{"now": $now(), "delay": $sum([1..10000]), "later": $now()}.(now = later)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe("$now() returns different timestamp for subsequent evaluate() calls", function() {
        it("should return result object", function() {
            var expr = jsonata("($sum([1..10000]); $now())");
            var result = expr.evaluate(testdata2);
            var result2 = expr.evaluate(testdata2);
            expect(result).to.not.equal(result2);
        });
    });

    describe("$millis() returns milliseconds since the epoch", function() {
        it("should return result object", function() {
            var expr = jsonata("$millis()");
            var result = expr.evaluate(testdata2);
            // number between 1502264152715 and 2000000000000 (18 May 2033)
            var expected = result > 1502264152715 && result < 2000000000000;
            expect(expected).to.deep.equal(true);
        });
    });

    describe("Evaluator - functions: random", function() {
        describe('random number")', function() {
            it("should return result object", function() {
                var expr = jsonata("$random()");
                var result = expr.evaluate();
                var expected = result >= 0 && result < 1;
                expect(true).to.deep.equal(expected);
            });
        });

        describe('consequetive random numbers should be different")', function() {
            it("should return result object", function() {
                var expr = jsonata("$random() = $random()");
                var result = expr.evaluate();
                var expected = false;
                expect(result).to.deep.equal(expected);
            });
        });
    });
});

describe("Tests that rely on JavaScript-style object traversal", () => {
    // A JSON object is an unordered list of key-value pairs.
    // When traversing an object, the entries may be returned
    // in a non-deterministic order (depending on the language).
    // The following tests assume a traversal order which works
    // in JavaScript but may not apply to other languages.
    // See https://github.com/jsonata-js/jsonata/issues/179.
    describe('foo.*[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.*[0]');
            var result = expr.evaluate(testdata1);
            var expected = 42;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('**[2]', function () {
        it('should return result object', function () {
            var expr = jsonata('**[2]');
            var result = expr.evaluate(testdata2);
            var expected = "Firefly";
            expect(result).to.deep.equal(expected);
        });
    });
});

describe("Tests that use the $clone() function", () => {
    // $clone() allows jsonata-js to play nicely with Node-RED.
    // It's not part of the JSONata standard.
    // See https://github.com/jsonata-js/jsonata/issues/207.
    describe('clone undefined', function () {
        it('should return undefined', function () {
            var expr = jsonata('$clone(foo)');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('clone empty object', function () {
        it('should return empty object', function () {
            var expr = jsonata('$clone({})');
            var result = expr.evaluate(testdata2);
            var expected = {};
            expect(result).to.deep.equal(expected);
        });
    });

    describe('clone object', function () {
        it('should return same object', function () {
            var expr = jsonata('$clone({"a": 1})');
            var result = expr.evaluate(testdata2);
            var expected = {"a": 1};
            expect(result).to.deep.equal(expected);
        });
    });

    describe("transform expression with overridden $clone function", function() {
        it("should return result object", function() {
            var expr = jsonata('Account ~> |Order|{"Product":"blah"},nomatch|');
            var count = 0;
            expr.registerFunction("clone", function(arg) {
                count++;
                return JSON.parse(JSON.stringify(arg));
            });
            var result = expr.evaluate(testdata2);
            var expected = {
                "Account Name": "Firefly",
                Order: [
                    {
                        OrderID: "order103",
                        Product: "blah"
                    },
                    {
                        OrderID: "order104",
                        Product: "blah"
                    }
                ]
            };
            expect(result).to.deep.equal(expected);
            expect(count).to.equal(1);
        });
    });

    describe('transform expression with overridden $clone value', function () {
        it('should throw error', function () {
            var expr = jsonata('( $clone := 5; $ ~> |Account.Order.Product|{"blah":"foo"}| )');
            expect(function () {
                expr.evaluate(testdata2);
            })
                .to.throw()
                .to.deep.contain({ code: 'T2013' });
        });
    });
});

describe("Tests that bind Javascript functions", () => {
    // These involve binding of functions
    describe("Override implementation of $now()", function() {
        it("should return result object", function() {
            var expr = jsonata("$now()");
            expr.registerFunction("now", function() {
                return "time for tea";
            });
            var result = expr.evaluate(testdata2);
            expect(result).to.equal("time for tea");
        });
    });

    // Issue #261. Previously we would attempt to assign to the read-only `message` property,
    // causing an unrelated `TypeError` to be thrown instead
    describe("function throws a `DOMException` with a read-only `message` property", function() {
        /**
         * `DOMException` is not available in our testing environment. Additionally, we can't
         * just import the `domexception` module since it doesn't work on Node.js v4, which
         * we still support. So, here's a fake skeleton implementation which has the relevant
         * qualities we need to reproduce the bug, most importantly a read-only `message`
         * property
         * @param {string} message - Error message
         * @constructor
         */
        function DOMException (message) {
            Object.defineProperty(this, "message", {
                get() {
                    return message;
                },
                enumerable: true,
                configurable: true
            });
        }

        Object.setPrototypeOf(DOMException.prototype, Error.prototype);

        it("rethrows correctly", function() {
            var expr = jsonata("$throwDomEx()");
            expr.registerFunction("throwDomEx", function() {
                throw new DOMException('Here is my message');
            });
            expect(function () {
                expr.evaluate({});
            })
                .to.throw(DOMException)
                .to.deep.contain({ message: 'Here is my message', position: 12, token: 'throwDomEx' });
        });
    });

    describe("map a user-defined Javascript function with signature", function() {
        it("should return result object", function() {
            var expr = jsonata("$map([1,4,9,16], $squareroot)");
            expr.registerFunction(
                "squareroot",
                function(num) {
                    return Math.sqrt(num);
                },
                "<n:n>"
            );
            var result = expr.evaluate(testdata2);
            var expected = [1, 2, 3, 4];
            expect(result).to.deep.equal(expected);
        });
    });
    describe("map a user-defined Javascript function with undefined signature", function() {
        it("should return result object", function() {
            var expr = jsonata("$map([1,4,9,16], $squareroot)");
            expr.registerFunction("squareroot", function(num) {
                return Math.sqrt(num);
            });
            var result = expr.evaluate(testdata2);
            var expected = [1, 2, 3, 4];
            expect(result).to.deep.equal(expected);
        });
    });

    describe("map a user-defined Javascript function", function() {
        it("should return result object", function() {
            var expr = jsonata("$map([1,4,9,16], $squareroot)");
            expr.assign("squareroot", function(num) {
                return Math.sqrt(num);
            });
            var result = expr.evaluate(testdata2);
            var expected = [1, 2, 3, 4];
            expect(result).to.deep.equal(expected);
        });
    });

    describe("$filter with a user-defined Javascript function", function() {
        it("should return result object", function() {
            var expr = jsonata("$filter([1,4,9,16], $even)");
            expr.assign("even", function(num) {
                return num % 2 === 0;
            });
            var result = expr.evaluate(testdata2);
            var expected = [4, 16];
            expect(result).to.deep.equal(expected);
        });
    });

    describe("$sift with a user-defined Javascript function", function() {
        it("should return result object", function() {
            var expr = jsonata("$sift({'one': 1, 'four': 4, 'nine': 9, 'sixteen': 16}, $even)");
            expr.assign("even", function(num) {
                return num % 2 === 0;
            });
            var result = expr.evaluate(testdata2);
            var expected = {'four': 4, 'sixteen': 16};
            expect(result).to.deep.equal(expected);
        });
    });

    describe("$each with a user-defined Javascript function", function() {
        it("should return result object", function() {
            var expr = jsonata("$each({'one': 1, 'four': 4, 'nine': 9, 'sixteen': 16}, $squareroot)");
            expr.assign("squareroot", function(num) {
                return Math.sqrt(num);
            });
            var result = expr.evaluate(testdata2);
            var expected = [1, 2, 3, 4];
            expect(result).to.deep.equal(expected);
        });
    });

    describe("Partially apply user-defined Javascript function", function() {
        it("should return result object", function() {
            var expr = jsonata(
                "(" +
                    "  $firstn := $substr(?, 0, ?);" +
                    "  $first5 := $firstn(?, 5);" +
                    '  $first5("Hello World")' +
                    ")"
            );
            expr.assign("substr", function(str, start, len) {
                return str.substr(start, len);
            });
            var result = expr.evaluate(testdata2);
            var expected = "Hello";
            expect(result).to.deep.equal(expected);
        });
    });

    describe("User defined matchers", function() {
        var repeatingLetters = function(char, repeat) {
            // custom matcher to match `repeat` contiguous occurrences of `char`
            var chars = char.repeat(repeat);
            var match = function(str, offset) {
                var pos = str.indexOf(chars, (offset || 0));
                if (pos === -1) {
                    return;
                } else {
                    return {
                        match: chars,
                        start: pos,
                        end: pos + chars.length,
                        groups: [],
                        next: function () {
                            return match(str, pos + chars.length);
                        }
                    };
                }
            };
            return match;
        };

        it("should match using a custom matcher", function() {
            var expr = jsonata("$match('LLANFAIRPWLLGWYNGYLLGOGERYCHWYRNDROBWLLLLANTYSILIOGOGOGOCH', $repeatingLetters('L', 2))");
            expr.registerFunction("repeatingLetters", repeatingLetters);
            var result = expr.evaluate();
            var expected = [
                {"match": "LL", "index": 0, "groups": []},
                {"match": "LL", "index": 10, "groups": []},
                {"match": "LL", "index": 18, "groups": []},
                {"match": "LL", "index": 37, "groups": []},
                {"match": "LL", "index": 39, "groups": []}
            ];
            expect(result).to.deep.equal(expected);
        });

        it("should split using a custom matcher", function() {
            var expr = jsonata("$split('LLANFAIRPWLLGWYNGYLLGOGERYCHWYRNDROBWLLLLANTYSILIOGOGOGOCH', $repeatingLetters('L', 2))");
            expr.registerFunction("repeatingLetters", repeatingLetters);
            var result = expr.evaluate();
            var expected = ["","ANFAIRPW","GWYNGY","GOGERYCHWYRNDROBW","","ANTYSILIOGOGOGOCH"];
            expect(result).to.deep.equal(expected);
        });

        it("should replace using a custom matcher", function() {
            var expr = jsonata("$replace('LLANFAIRPWLLGWYNGYLLGOGERYCHWYRNDROBWLLLLANTYSILIOGOGOGOCH', $repeatingLetters('L', 2), 'Ỻ')");
            expr.registerFunction("repeatingLetters", repeatingLetters);
            var result = expr.evaluate();
            var expected = "ỺANFAIRPWỺGWYNGYỺGOGERYCHWYRNDROBWỺỺANTYSILIOGOGOGOCH";
            expect(result).to.deep.equal(expected);
        });

        it("should test inclusion using a custom matcher", function() {
            var expr = jsonata("$contains('LLANFAIRPWLLGWYNGYLLGOGERYCHWYRNDROBWLLLLANTYSILIOGOGOGOCH', $repeatingLetters('L', 4))");
            expr.registerFunction("repeatingLetters", repeatingLetters);
            var result = expr.evaluate();
            var expected = true;
            expect(result).to.deep.equal(expected);
        });

    });

    describe('User defined higher-order functions', () => {
        var myfunc = function*(arr, fn) {
            const val = yield * fn(arr);
            return 2 * val;
        };

        var startsWith = function(str) {
            // returns a function that returns true if its argument starts with the string `str`
            return (arg) => {
                return arg.startsWith(str);
            };
        };

        it('should be able to invoke a built-in function passed as an argument', () => {
            var expr = jsonata("$myfunc([1,2,3], $sum)");
            expr.registerFunction('myfunc', myfunc);
            var result = expr.evaluate();
            var expected = 12;
            expect(result).to.deep.equal(expected);
        });

        it('should be able to invoke a lambda function passed as an argument', () => {
            var expr = jsonata("$myfunc([1,2,3], λ($arr) { $arr[1] + $arr[2] })");
            expr.registerFunction('myfunc', myfunc);
            var result = expr.evaluate();
            var expected = 10;
            expect(result).to.deep.equal(expected);
        });

        it('should be able to invoke a user-defined function passed as an argument', () => {
            var expr = jsonata("$myfunc([1,2,3], $myfunc2)");
            expr.registerFunction('myfunc', myfunc);
            expr.registerFunction('myfunc2', (arr) => {
                return 2 * arr[1];
            });
            var result = expr.evaluate();
            var expected = 8;
            expect(result).to.deep.equal(expected);
        });

        it('should be able to return a function from a user-defined function', () => {
            var expr = jsonata(`
            (
              $startsWithHello := $startsWith("Hello");
              [$startsWithHello("Hello, Bob"), $startsWithHello("Goodbye, Bill")]
            )`);
            expr.registerFunction('startsWith', startsWith);
            var result = expr.evaluate();
            var expected = [true, false];
            expect(result).to.deep.equal(expected);
        })

    });
});

describe("Tests that are specific to a Javascript runtime", () => {
    // Javascript specific
    describe('/ab/ ("ab")', function() {
        it("should return result object", function() {
            var expr = jsonata('/ab/ ("ab")');
            var result = expr.evaluate();
            var expected = { match: "ab", start: 0, end: 2, groups: [] };
            expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
        });
    });

    describe("/ab/ ()", function() {
        it("should return result object", function() {
            var expr = jsonata("/ab/ ()");
            var result = expr.evaluate();
            var expected = undefined;
            expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
        });
    });

    describe('/ab+/ ("ababbabbcc")', function() {
        it("should return result object", function() {
            var expr = jsonata('/ab+/ ("ababbabbcc")');
            var result = expr.evaluate();
            var expected = { match: "ab", start: 0, end: 2, groups: [] };
            expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
        });
    });

    describe('/a(b+)/ ("ababbabbcc")', function() {
        it("should return result object", function() {
            var expr = jsonata('/a(b+)/ ("ababbabbcc")');
            var result = expr.evaluate();
            var expected = { match: "ab", start: 0, end: 2, groups: ["b"] };
            expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
        });
    });

    describe('/a(b+)/ ("ababbabbcc").next()', function() {
        it("should return result object", function() {
            var expr = jsonata('/a(b+)/ ("ababbabbcc").next()');
            var result = expr.evaluate();
            var expected = { match: "abb", start: 2, end: 5, groups: ["bb"] };
            expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
        });
    });

    describe('/a(b+)/ ("ababbabbcc").next().next()', function() {
        it("should return result object", function() {
            var expr = jsonata('/a(b+)/ ("ababbabbcc").next().next()');
            var result = expr.evaluate();
            var expected = { match: "abb", start: 5, end: 8, groups: ["bb"] };
            expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
        });
    });

    describe('/a(b+)/ ("ababbabbcc").next().next().next()', function() {
        it("should return result object", function() {
            var expr = jsonata('/a(b+)/ ("ababbabbcc").next().next().next()');
            var result = expr.evaluate();
            var expected = undefined;
            expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
        });
    });

    describe('/a(b+)/i ("Ababbabbcc")', function() {
        it("should return result object", function() {
            var expr = jsonata('/a(b+)/i ("Ababbabbcc")');
            var result = expr.evaluate();
            var expected = { match: "Ab", start: 0, end: 2, groups: ["b"] };
            expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
        });
    });

    describe("empty regex", function() {
        it("should throw error", function() {
            expect(function() {
                var expr = jsonata("//");
                expr.evaluate();
            })
                .to.throw()
                .to.deep.contain({ position: 1, code: "S0301" });
        });
    });

    describe("empty regex", function() {
        it("should throw error", function() {
            expect(function() {
                var expr = jsonata("/");
                expr.evaluate();
            })
                .to.throw()
                .to.deep.contain({ position: 1, code: "S0302" });
        });
    });

    describe("Functions - $match", function() {
        describe('$match("ababbabbcc",/ab/)', function() {
            it("should return result object", function() {
                var expr = jsonata('$match("ababbabbcc",/ab/)');
                var result = expr.evaluate();
                var expected = [
                    { match: "ab", index: 0, groups: [] },
                    {
                        match: "ab",
                        index: 2,
                        groups: []
                    },
                    { match: "ab", index: 5, groups: [] }
                ];
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$match("ababbabbcc",/a(b+)/)', function() {
            it("should return result object", function() {
                var expr = jsonata('$match("ababbabbcc",/a(b+)/)');
                var result = expr.evaluate();
                var expected = [
                    { match: "ab", index: 0, groups: ["b"] },
                    {
                        match: "abb",
                        index: 2,
                        groups: ["bb"]
                    },
                    { match: "abb", index: 5, groups: ["bb"] }
                ];
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$match("ababbabbcc",/a(b+)/, 1)', function() {
            it("should return result object", function() {
                var expr = jsonata('$match("ababbabbcc",/a(b+)/, 1)');
                var result = expr.evaluate();
                var expected = { match: "ab", index: 0, groups: ["b"] };
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$match("ababbabbcc",/a(b+)/, 0)', function() {
            it("should return result object", function() {
                var expr = jsonata('$match("ababbabbcc",/a(b+)/, 0)');
                var result = expr.evaluate();
                var expected = undefined;
                expect(result).to.deep.equal(expected);
            });
        });

        describe("$match(nothing,/a(xb+)/)", function() {
            it("should return result object", function() {
                var expr = jsonata("$match(nothing,/a(xb+)/)");
                var result = expr.evaluate();
                var expected = undefined;
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$match("ababbabbcc",/a(xb+)/)', function() {
            it("should return result object", function() {
                var expr = jsonata('$match("ababbabbcc",/a(xb+)/)');
                var result = expr.evaluate();
                var expected = undefined;
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$match("a, b, c, d", /ab/, -3)', function() {
            it("should throw error", function() {
                var expr = jsonata('$match("a, b, c, d", /ab/, -3)');
                expect(function() {
                    expr.evaluate();
                })
                    .to.throw()
                    .to.deep.contain({ position: 7, code: "D3040", token: "match", index: 3, value: -3 });
            });
        });

        describe('$match("a, b, c, d", /ab/, null)', function() {
            it("should throw error", function() {
                var expr = jsonata('$match("a, b, c, d", /ab/, null)');
                expect(function() {
                    expr.evaluate();
                })
                    .to.throw()
                    .to.deep.contain({ position: 7, code: "T0410", token: "match", index: 3, value: null });
            });
        });

        describe('$match("a, b, c, d", /ab/, "2")', function() {
            it("should throw error", function() {
                var expr = jsonata('$match("a, b, c, d", /ab/, "2")');
                expect(function() {
                    expr.evaluate();
                })
                    .to.throw()
                    .to.deep.contain({ position: 7, code: "T0410", token: "match", index: 3, value: "2" });
            });
        });

        describe('$match("a, b, c, d", "ab")', function() {
            it("should throw error", function() {
                var expr = jsonata('$match("a, b, c, d", "ab")');
                expect(function() {
                    expr.evaluate();
                })
                    .to.throw()
                    .to.deep.contain({ position: 7, code: "T0410", token: "match", index: 2, value: "ab" });
            });
        });

        describe('$match("a, b, c, d", true)', function() {
            it("should throw error", function() {
                var expr = jsonata('$match("a, b, c, d", true)');
                expect(function() {
                    expr.evaluate();
                })
                    .to.throw()
                    .to.deep.contain({ position: 7, code: "T0410", token: "match", index: 2, value: true });
            });
        });

        describe("$match(12345, 3)", function() {
            it("should throw error", function() {
                var expr = jsonata("$match(12345, 3)");
                expect(function() {
                    expr.evaluate();
                })
                    .to.throw()
                    .to.deep.contain({ position: 7, code: "T0410", token: "match", index: 1, value: 12345 });
            });
        });

        describe("$match(12345)", function() {
            it("should throw error", function() {
                var expr = jsonata("$match(12345)");
                expect(function() {
                    expr.evaluate();
                })
                    .to.throw()
                    .to.deep.contain({ position: 7, code: "T0410", token: "match", index: 1 });
            });
        });
    });
});

describe("Test that yield platform specific results", () => {
    // Platform specific
    describe("$sqrt(10) * $sqrt(10)", function() {
        it("should return result object", function() {
            var expr = jsonata("$sqrt(10) * $sqrt(10)");
            var result = expr.evaluate();
            var expected = 10;
            expect(result).to.be.closeTo(expected, 1e-13);
        });
    });
});

describe("Tests that include infinite recursion", () => {
    describe("stack overflow - infinite recursive function - non-tail call", function() {
        it("should throw error", function() {
            expect(function() {
                var expr = jsonata("(" + "  $inf := function($n){$n+$inf($n-1)};" + "  $inf(5)" + ")");
                timeboxExpression(expr, 1000, 300);
                expr.evaluate();
            })
                .to.throw()
                .to.deep.contain({ token: "inf", position: 32, code: "U1001" });
        });
    });

    describe("stack overflow - infinite recursive function - tail call", function() {
        this.timeout(5000);
        it("should throw error", function() {
            expect(function() {
                var expr = jsonata("( $inf := function(){$inf()}; $inf())");
                timeboxExpression(expr, 1000, 500);
                expr.evaluate();
            })
                .to.throw()
                .to.deep.contain({ token: "inf", code: "U1001" });
        });
    });
});

/**
 * Protect the process/browser from a runnaway expression
 * i.e. Infinite loop (tail recursion), or excessive stack growth
 *
 * @param {Object} expr - expression to protect
 * @param {Number} timeout - max time in ms
 * @param {Number} maxDepth - max stack depth
 */
function timeboxExpression(expr, timeout, maxDepth) {
    var depth = 0;
    var time = Date.now();

    var checkRunnaway = function() {
        if (depth > maxDepth) {
            // stack too deep
            throw {
                message:
                    "Stack overflow error: Check for non-terminating recursive function.  Consider rewriting as tail-recursive.",
                stack: new Error().stack,
                code: "U1001"
            };
        }
        if (Date.now() - time > timeout) {
            // expression has run for too long
            throw {
                message: "Expression evaluation timeout: Check for infinite loop",
                stack: new Error().stack,
                code: "U1001"
            };
        }
    };

    // register callbacks
    expr.assign("__evaluate_entry", function() {
        depth++;
        checkRunnaway();
    });
    expr.assign("__evaluate_exit", function() {
        depth--;
        checkRunnaway();
    });
}
