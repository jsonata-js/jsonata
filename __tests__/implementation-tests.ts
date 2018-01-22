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

var jsonata = require('../src').jsonata;
import { timeboxExpression } from '../src/utils';

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
                expect(expected).toEqual(true);
            });
        });

        describe("$millis() always returns same value within an expression", function() {
            it("should return result object", function() {
                var expr = jsonata('{"now": $millis(), "delay": $sum([1..10000]), "later": $millis()}.(now = later)');
                var result = expr.evaluate(testdata2);
                var expected = true;
                expect(result).toEqual(expected);
            });
        });

        describe("$millis() returns different timestamp for subsequent evaluate() calls", function() {
            it("should return result object", function() {
                var expr = jsonata("($sum([1..10000]); $millis())");
                var result = expr.evaluate(testdata2);
                var result2 = expr.evaluate(testdata2);
                expect(result).not.toEqual(result2);
            });
        });
    });

    describe("$now() returns timestamp", function() {
        it("should return result object", function() {
            var expr = jsonata("$now()");
            var result = expr.evaluate(testdata2);
            // follows this pattern - "2017-05-09T10:10:16.918Z"
            expect(result).toMatch(/^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/);
            // var match = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/.test(result);
            // expect(match).toEqual(true);
        });
    });

    describe("$now() always returns same value within an expression", function() {
        it("should return result object", function() {
            var expr = jsonata('{"now": $now(), "delay": $sum([1..10000]), "later": $now()}.(now = later)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).toEqual(expected);
        });
    });

    describe("$now() returns different timestamp for subsequent evaluate() calls", function() {
        it("should return result object", function() {
            var expr = jsonata("($sum([1..10000]); $now())");
            var result = expr.evaluate(testdata2);
            var result2 = expr.evaluate(testdata2);
            expect(result).not.toEqual(result2);
        });
    });

    describe("$millis() returns milliseconds since the epoch", function() {
        it("should return result object", function() {
            var expr = jsonata("$millis()");
            var result = expr.evaluate(testdata2);
            // number between 1502264152715 and 2000000000000 (18 May 2033)
            var expected = result > 1502264152715 && result < 2000000000000;
            expect(expected).toEqual(true);
        });
    });

    describe("Evaluator - functions: random", function() {
        describe('random number")', function() {
            it("should return result object", function() {
                var expr = jsonata("$random()");
                var result = expr.evaluate();
                var expected = result >= 0 && result < 1;
                expect(true).toEqual(expected);
            });
        });

        describe('consequetive random numbers should be different")', function() {
            it("should return result object", function() {
                var expr = jsonata("$random() = $random()");
                var result = expr.evaluate();
                var expected = false;
                expect(result).toEqual(expected);
            });
        });
    });
});

describe("Tests that bind Javascript functions", () => {
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
            expect(result).toEqual(expected);
            expect(count).toEqual(1);
        });
    });

    // These involve binding of functions
    describe("Override implementation of $now()", function() {
        it("should return result object", function() {
            var expr = jsonata("$now()");
            expr.registerFunction("now", function() {
                return "time for tea";
            });
            var result = expr.evaluate(testdata2);
            expect(result).toEqual("time for tea");
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
            expect(result).toEqual(expected);
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
            expect(result).toEqual(expected);
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
            expect(result).toEqual(expected);
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
            expect(result).toEqual(expected);
        });
    });
});

describe("Tests that are specific to a Javascript runtime", () => {
    // Javascript specific
    describe('/ab/ ("ab")', function() {
        it("should return result object", function() {
            var expr = jsonata('/ab/ ("ab")');
            var result = expr.evaluate();
            var expected = { match: "ab", start: 0, end: 2, groups: [] };
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
    });

    describe("/ab/ ()", function() {
        it("should return result object", function() {
            var expr = jsonata("/ab/ ()");
            var result = expr.evaluate();
            var expected = undefined;
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
    });

    describe('/ab+/ ("ababbabbcc")', function() {
        it("should return result object", function() {
            var expr = jsonata('/ab+/ ("ababbabbcc")');
            var result = expr.evaluate();
            var expected = { match: "ab", start: 0, end: 2, groups: [] };
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
    });

    describe('/a(b+)/ ("ababbabbcc")', function() {
        it("should return result object", function() {
            var expr = jsonata('/a(b+)/ ("ababbabbcc")');
            var result = expr.evaluate();
            var expected = { match: "ab", start: 0, end: 2, groups: ["b"] };
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
    });

    describe('/a(b+)/ ("ababbabbcc").next()', function() {
        it("should return result object", function() {
            var expr = jsonata('/a(b+)/ ("ababbabbcc").next()');
            var result = expr.evaluate();
            var expected = { match: "abb", start: 2, end: 5, groups: ["bb"] };
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
    });

    describe('/a(b+)/ ("ababbabbcc").next().next()', function() {
        it("should return result object", function() {
            var expr = jsonata('/a(b+)/ ("ababbabbcc").next().next()');
            var result = expr.evaluate();
            var expected = { match: "abb", start: 5, end: 8, groups: ["bb"] };
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
    });

    describe('/a(b+)/ ("ababbabbcc").next().next().next()', function() {
        it("should return result object", function() {
            var expr = jsonata('/a(b+)/ ("ababbabbcc").next().next().next()');
            var result = expr.evaluate();
            var expected = undefined;
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
    });

    describe('/a(b+)/i ("Ababbabbcc")', function() {
        it("should return result object", function() {
            var expr = jsonata('/a(b+)/i ("Ababbabbcc")');
            var result = expr.evaluate();
            var expected = { match: "Ab", start: 0, end: 2, groups: ["b"] };
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
        });
    });

    describe("empty regex", function() {
        it("should throw error", function() {
            expectError(() => {
                var expr = jsonata("//");
                expr.evaluate();                
            }, {position: 1, code: "S0301"});
        });
    });

    describe("incomplete regex", function() {
        it("should throw error", function() {
            expectError(() => {
                var expr = jsonata("/");
                expr.evaluate();
            }, {position: 1, code: "S0302"});
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
                expect(result).toEqual(expected);
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
                expect(result).toEqual(expected);
            });
        });

        describe('$match("ababbabbcc",/a(b+)/, 1)', function() {
            it("should return result object", function() {
                var expr = jsonata('$match("ababbabbcc",/a(b+)/, 1)');
                var result = expr.evaluate();
                var expected = { match: "ab", index: 0, groups: ["b"] };
                expect(result).toEqual(expected);
            });
        });

        describe('$match("ababbabbcc",/a(b+)/, 0)', function() {
            it("should return result object", function() {
                var expr = jsonata('$match("ababbabbcc",/a(b+)/, 0)');
                var result = expr.evaluate();
                var expected = undefined;
                expect(result).toEqual(expected);
            });
        });

        describe("$match(nothing,/a(xb+)/)", function() {
            it("should return result object", function() {
                var expr = jsonata("$match(nothing,/a(xb+)/)");
                var result = expr.evaluate();
                var expected = undefined;
                expect(result).toEqual(expected);
            });
        });

        describe('$match("ababbabbcc",/a(xb+)/)', function() {
            it("should return result object", function() {
                var expr = jsonata('$match("ababbabbcc",/a(xb+)/)');
                var result = expr.evaluate();
                var expected = undefined;
                expect(result).toEqual(expected);
            });
        });

        describe('$match("a, b, c, d", /ab/, -3)', function() {
            it("should throw error", function() {
                var expr = jsonata('$match("a, b, c, d", /ab/, -3)');
                expectError(() => {
                    expr.evaluate();
                }, { position: 7, code: "D3040", token: "match", index: 3, value: -3 });
            });
        });

        describe('$match("a, b, c, d", /ab/, null)', function() {
            it("should throw error", function() {
                var expr = jsonata('$match("a, b, c, d", /ab/, null)');
                expectError(() => {
                    expr.evaluate();
                }, { position: 7, code: "T0410", token: "match", index: 3, value: null });
            });
        });

        describe('$match("a, b, c, d", /ab/, "2")', function() {
            it("should throw error", function() {
                var expr = jsonata('$match("a, b, c, d", /ab/, "2")');
                expectError(() => {
                    expr.evaluate();
                }, { position: 7, code: "T0410", token: "match", index: 3, value: "2" });
            });
        });

        describe('$match("a, b, c, d", "ab")', function() {
            it("should throw error", function() {
                var expr = jsonata('$match("a, b, c, d", "ab")');
                expectError(() => {
                    expr.evaluate();
                }, { position: 7, code: "T0410", token: "match", index: 2, value: "ab" });
            });
        });

        describe('$match("a, b, c, d", true)', function() {
            it("should throw error", function() {
                var expr = jsonata('$match("a, b, c, d", true)');
                expectError(() => {
                    expr.evaluate();
                }, { position: 7, code: "T0410", token: "match", index: 2, value: true });
            });
        });

        describe("$match(12345, 3)", function() {
            it("should throw error", function() {
                var expr = jsonata("$match(12345, 3)");
                expectError(() => {
                    expr.evaluate();
                }, { position: 7, code: "T0410", token: "match", index: 1, value: 12345 });
            });
        });

        describe("$match(12345)", function() {
            it("should throw error", function() {
                var expr = jsonata("$match(12345)");
                expectError(() => {
                    expr.evaluate();
                }, { position: 7, code: "T0410", token: "match", index: 1 });
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
            expect(result).toBeCloseTo(expected);
        });
    });
});

describe("Tests that include infinite recursion", () => {
    describe("stack overflow - infinite recursive function - non-tail call", function() {
        it("should throw error", function() {
            expectError(() => {
                var expr = jsonata("(" + "  $inf := function($n){$n+$inf($n-1)};" + "  $inf(5)" + ")");
                timeboxExpression(expr, 1000, 300);
                expr.evaluate();
            }, { position: 46, code: "U1001" });
        });
    });

    describe("stack overflow - infinite recursive function - tail call", function() {
        jest.setTimeout(5000);
        it("should throw error", function() {
            expectError(() => {
                var expr = jsonata("(" + "  $inf := function(){$inf()};" + "  $inf()" + ")");
                timeboxExpression(expr, 1000, 500);
                expr.evaluate();
            }, { position: 37, code: "U1001" });
        });
    });
});


function expectError(f: () => any, fields) {
    let error = false;
    try {
        f();
    } catch(e) {
        Object.keys(fields).forEach((key) => {
            expect(e[key]).toEqual(fields[key]);
        });
        error = true;
    }
    expect(error).toBeTruthy();                        
}
