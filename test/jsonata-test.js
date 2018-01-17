/**
 * © Copyright IBM Corp. 2016 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

'use strict';

var jsonata = require('../jsonata');
var assert = require('assert');
var chai = require("chai");
var expect = chai.expect;

var testdata1 = {
    "foo": {
        "bar": 42,
        "blah": [{"baz": {"fud": "hello"}}, {"baz": {"fud": "world"}}, {"bazz": "gotcha"}],
        "blah.baz": "here"
    }, "bar": 98
};
var testdata1a = {
    "foo": {
        "bar": 42,
        "blah": [{"baz": {"fud": "hello"}}, {"buz": {"fud": "world"}}, {"bazz": "gotcha"}],
        "blah.baz": "here"
    }, "bar": 98
};

var testdata2 = {
    "Account": {
        "Account Name": "Firefly",
        "Order": [
            {
                "OrderID": "order103",
                "Product": [
                    {
                        "Product Name": "Bowler Hat",
                        "ProductID": 858383,
                        "SKU": "0406654608",
                        "Description": {
                            "Colour": "Purple",
                            "Width": 300,
                            "Height": 200,
                            "Depth": 210,
                            "Weight": 0.75
                        },
                        "Price": 34.45,
                        "Quantity": 2
                    },
                    {
                        "Product Name": "Trilby hat",
                        "ProductID": 858236,
                        "SKU": "0406634348",
                        "Description": {
                            "Colour": "Orange",
                            "Width": 300,
                            "Height": 200,
                            "Depth": 210,
                            "Weight": 0.6
                        },
                        "Price": 21.67,
                        "Quantity": 1
                    }
                ]
            },
            {
                "OrderID": "order104",
                "Product": [
                    {
                        "Product Name": "Bowler Hat",
                        "ProductID": 858383,
                        "SKU": "040657863",
                        "Description": {
                            "Colour": "Purple",
                            "Width": 300,
                            "Height": 200,
                            "Depth": 210,
                            "Weight": 0.75
                        },
                        "Price": 34.45,
                        "Quantity": 4
                    },
                    {
                        "ProductID": 345664,
                        "SKU": "0406654603",
                        "Product Name": "Cloak",
                        "Description": {
                            "Colour": "Black",
                            "Width": 30,
                            "Height": 20,
                            "Depth": 210,
                            "Weight": 2.0
                        },
                        "Price": 107.99,
                        "Quantity": 1
                    }
                ]
            }
        ]
    }
};

var testdata3 = {
    "nest0": [
        {"nest1": [{"nest2": [{"nest3": [1]}, {"nest3": [2]}]}, {"nest2": [{"nest3": [3]}, {"nest3": [4]}]}]},
        {"nest1": [{"nest2": [{"nest3": [5]}, {"nest3": [6]}]}, {"nest2": [{"nest3": [7]}, {"nest3": [8]}]}]}
    ]
};

var testdata3a = [
    {"nest0": [1, 2]},
    {"nest0": [3, 4]}
];

var testdata3b = [
    {"nest0": [{"nest1": [1, 2]}, {"nest1": [3, 4]}]},
    {"nest0": [{"nest1": [5]}, {"nest1": [6]}]}
];

var testdata3c = {
    "nest0": [
        {"nest1": [{"nest2": [{"nest3": 1}, {"nest3": 2}]}, {"nest2": [{"nest3": 3}, {"nest3": 4}]}]},
        {"nest1": [{"nest2": [{"nest3": 5}, {"nest3": 6}]}, {"nest2": [{"nest3": 7}, {"nest3": 8}]}]}
    ]
};


var testdata4 = {
    "FirstName": "Fred",
    "Surname": "Smith",
    "Age": 28,
    "Address": {
        "Street": "Hursley Park",
        "City": "Winchester",
        "Postcode": "SO21 2JN"
    },
    "Phone": [
        {
            "type": "home",
            "number": "0203 544 1234"
        },
        {
            "type": "office",
            "number": "01962 001234"
        },
        {
            "type": "office",
            "number": "01962 001235"
        },
        {
            "type": "mobile",
            "number": "077 7700 1234"
        }
    ],
    "Email": [
        {
            "type": "work",
            "address": ["fred.smith@my-work.com", "fsmith@my-work.com"]
        },
        {
            "type": "home",
            "address": ["freddy@my-social.com", "frederic.smith@very-serious.com"]
        }
    ],
    "Other": {
        "Over 18 ?": true,
        "Misc": null,
        "Alternative.Address": {
            "Street": "Brick Lane",
            "City": "London",
            "Postcode": "E1 6RF"
        }
    }
};

var testdata5 = {
    "library": {
        "books": [
            {
                "title": "Structure and Interpretation of Computer Programs",
                "authors": ["Abelson", "Sussman"],
                "isbn": "9780262510875",
                "price": 38.90,
                "copies": 2
            },
            {
                "title": "The C Programming Language",
                "authors": ["Kernighan", "Richie"],
                "isbn": "9780131103627",
                "price": 33.59,
                "copies": 3
            },
            {
                "title": "The AWK Programming Language",
                "authors": ["Aho", "Kernighan", "Weinberger"],
                "isbn": "9780201079814",
                "copies": 1
            },
            {
                "title": "Compilers: Principles, Techniques, and Tools",
                "authors": ["Aho", "Lam", "Sethi", "Ullman"],
                "isbn": "9780201100884",
                "price": 23.38,
                "copies": 1
            }
        ],
        "loans": [
            {
                "customer": "10001",
                "isbn": "9780262510875",
                "return": "2016-12-05"
            },
            {
                "customer": "10003",
                "isbn": "9780201100884",
                "return": "2016-10-22"
            }
        ],
        "customers": [
            {
                "id": "10001",
                "name": "Joe Doe",
                "address": {
                    "street": "2 Long Road",
                    "city": "Winchester",
                    "postcode": "SO22 5PU"
                }
            },
            {
                "id": "10002",
                "name": "Fred Bloggs",
                "address": {
                    "street": "56 Letsby Avenue",
                    "city": "Winchester",
                    "postcode": "SO22 4WD"
                }
            },
            {
                "id": "10003",
                "name": "Jason Arthur",
                "address": {
                    "street": "1 Preddy Gate",
                    "city": "Southampton",
                    "postcode": "SO14 0MG"
                }
            }
        ]
    }
};

var data1 = {
    doc: 23,
    detail: {
        contents: 'stuff',
        meta: 5
    }
};

var data2 = {
    doc: 89,
    detail: {
        contents: 'some more stuff',
        meta: 'boo'
    }
};

var person = {
    "Salutation": "Mr",
    "Name": "Alexander",
    "MiddleName": "John",
    "Surname": "Smith",
    "Cars": 3,
    "Employment": {"Name": "IBM UK", "ContractType": "permanent", "Role": "Senior Physician", "Years": 12,
        "Executive.Compensation":1.4e6},
    "Qualifications": ["GP", "Consultant Opthalmologist"],
    "Salary": null,
    "NI.Number":"NO10FURBZNESS",
    "敷": "Steve",
    "Español" : "/ˈspænɪʃ/"
};

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
        if(depth > maxDepth) {
            // stack too deep
            throw {
                message: 'Stack overflow error: Check for non-terminating recursive function.  Consider rewriting as tail-recursive.',
                stack: (new Error()).stack,
                code: 'U1001'
            };
        }
        if(Date.now() - time > timeout) {
            // expression has run for too long
            throw {
                message: "Expression evaluation timeout: Check for infinite loop",
                stack: (new Error()).stack,
                code: 'U1001'
            };
        }

    };

    // register callbacks
    expr.assign('__evaluate_entry', function() {
        depth++;
        checkRunnaway();
    });
    expr.assign('__evaluate_exit', function() {
        depth--;
        checkRunnaway();
    });
}


describe('Evaluator - simple literals', function () {
    describe('"hello"', function () {
        it('should return result object', function () {
            var expr = jsonata('"hello"');
            var result = expr.evaluate(testdata1);
            var expected = 'hello';
            expect(result).to.deep.equal(expected);
        });
    });

    describe("'hello'", function () {
        it('should return result object', function () {
            var expr = jsonata("'hello'");
            var result = expr.evaluate(testdata1);
            var expected = 'hello';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('"Wayne\'s World"', function () {
        it('should return result object', function () {
            var expr = jsonata('"Wayne\'s World"');
            var result = expr.evaluate(testdata1);
            var expected = "Wayne's World";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('42', function () {
        it('should return result object', function () {
            var expr = jsonata('42');
            var result = expr.evaluate(testdata1);
            var expected = 42;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('-42', function () {
        it('should return result object', function () {
            var expr = jsonata('-42');
            var result = expr.evaluate(testdata1);
            var expected = -42;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('3.14159', function () {
        it('should return result object', function () {
            var expr = jsonata('3.14159');
            var result = expr.evaluate(testdata1);
            var expected = 3.14159;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('6.022e23', function () {
        it('should return result object', function () {
            var expr = jsonata('6.022e23');
            var result = expr.evaluate(testdata1);
            var expected = 6.022e23;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('1.602E-19', function () {
        it('should return result object', function () {
            var expr = jsonata('1.602E-19');
            var result = expr.evaluate(testdata1);
            var expected = 1.602E-19;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('10e1000', function () {
        it('should throw numeric overflow', function () {
            expect(function () {
                jsonata('10e1000');
            }).to.throw()
                .to.deep.contain({position: 0, code: 'S0102', token: '10e1000'});
        });
    });

});

describe('Evaluator - string literals, escape sequences', function () {
    describe('"hello\\tworld"', function () {
        it('should return result object', function () {
            var expr = jsonata('"hello\\tworld"');
            var result = expr.evaluate(testdata1);
            var expected = 'hello\tworld';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('"hello\\nworld"', function () {
        it('should return result object', function () {
            var expr = jsonata('"hello\\nworld"');
            var result = expr.evaluate(testdata1);
            var expected = 'hello\nworld';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('"hello \\"world\\""', function () {
        it('should return result object', function () {
            var expr = jsonata('"hello \\"world\\""');
            var result = expr.evaluate(testdata1);
            var expected = 'hello "world"';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('"C:\\\\Test\\\\test.txt"', function () {
        it('should return result object', function () {
            var expr = jsonata('"C:\\\\Test\\\\test.txt"');
            var result = expr.evaluate(testdata1);
            var expected = 'C:\\Test\\test.txt';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('"\\u03BB-calculus rocks"', function () {
        it('should return result object', function () {
            var expr = jsonata('"\\u03BB-calculus rocks"');
            var result = expr.evaluate(testdata1);
            var expected = 'λ-calculus rocks';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('treble clef', function () {
        it('should return result object', function () {
            var expr = jsonata('"\uD834\uDD1E"');
            var result = expr.evaluate(testdata1);
            var expected = '𝄞';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('\\y', function () {
        it('should throw error', function () {
            expect(function () {
                jsonata('"\\y"');
            }).to.throw()
                .to.deep.contain({position: 2, code: 'S0103', token: 'y'});
        });
    });

    describe('\\u', function () {
        it('should throw error', function () {
            expect(function () {
                jsonata('"\\u"');
            }).to.throw()
                .to.deep.contain({position: 2, code: 'S0104'});
        });
    });

    describe('\\u123t', function () {
        it('should throw error', function () {
            expect(function () {
                jsonata('"\\u123t"');
            }).to.throw()
                .to.deep.contain({position: 2, code: 'S0104'});
        });
    });

});

describe('Evaluator - simple field syntax', function () {
    describe('foo.bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar');
            var result = expr.evaluate(testdata1);
            var expected = 42;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.blah', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah');
            var result = expr.evaluate(testdata1);
            var expected = [{baz: {fud: 'hello'}},
                {baz: {fud: 'world'}},
                {bazz: 'gotcha'}];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.blah.bazz', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.bazz');
            var result = expr.evaluate(testdata1);
            var expected = "gotcha";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.blah.baz', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.baz');
            var result = expr.evaluate(testdata1);
            var expected = [{fud: 'hello'}, {fud: 'world'}];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.blah.baz.fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.baz.fud');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Other.Misc', function () {
        it('should return result object', function () {
            var expr = jsonata('Other.Misc');
            var result = expr.evaluate(testdata4);
            var expected = null;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('edge case', function () {
        it('should return result object', function () {
            var expr = jsonata('bazz');
            var result = expr.evaluate([
                [
                    {
                        "baz": {
                            "fud": "hello"
                        }
                    },
                    {
                        "baz": {
                            "fud": "world"
                        }
                    },
                    {
                        "bazz": "gotcha"
                    }
                ]
            ]);
            var expected = "gotcha";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('edge case', function () {
        it('should return result object', function () {
            var expr = jsonata('fud');
            var result = expr.evaluate([
                42,
                [
                    {
                        "baz": {
                            "fud": "hello"
                        }
                    },
                    {
                        "baz": {
                            "fud": "world"
                        }
                    },
                    {
                        "bazz": "gotcha"
                    }
                ],
                "here",
                {
                    "fud": "hello"
                },
                "hello",
                {
                    "fud": "world"
                },
                "world",
                "gotcha"
            ]);
            var expected = ["hello", "world"];
            expect(result).to.deep.equal(expected);
        });
    });

});


describe('Evaluator - parenthesis', function () {

    describe('foo.(blah).baz.fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.(blah).baz.fud');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.(blah.baz).fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.(blah.baz).fud');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('(foo.blah.baz).fud', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.blah.baz).fud');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.blah.(baz.fud)', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.(baz.fud)');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('(foo.blah.baz.fud)', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.blah.baz.fud)');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('(foo).(blah).baz.(fud)', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo).(blah).baz.(fud)');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('(foo.(blah).baz.fud)', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.(blah).baz.fud)');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('(4 + 2) / 2', function () {
        it('should return result object', function () {
            var expr = jsonata('(4 + 2) / 2');
            var result = expr.evaluate(testdata1);
            var expected = 3;
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - simple array selectors', function () {

    describe('nest.nest1[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('nest0.nest1[0]');
            var result = expr.evaluate(testdata3b);
            var expected = [1, 3, 5, 6];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.blah[0].baz.fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah[0].baz.fud');
            var result = expr.evaluate(testdata1);
            var expected = 'hello';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.blah[1].baz.fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah[1].baz.fud');
            var result = expr.evaluate(testdata1);
            var expected = 'world';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.blah[-1].bazz', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah[-1].bazz');
            var result = expr.evaluate(testdata1);
            var expected = 'gotcha';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('(foo.blah)[1].baz.fud', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.blah)[1].baz.fud');
            var result = expr.evaluate(testdata1);
            var expected = 'world';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.blah.baz.fud[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.baz.fud[0]');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.blah.baz.fud[-1]', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.baz.fud[-1]');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('(foo.blah.baz.fud)[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.blah.baz.fud)[0]');
            var result = expr.evaluate(testdata1);
            var expected = 'hello';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('(foo.blah.baz.fud)[1]', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.blah.baz.fud)[1]');
            var result = expr.evaluate(testdata1);
            var expected = 'world';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('(foo.blah.baz.fud)[5 * 0.2]', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.blah.baz.fud)[5 * 0.2]');
            var result = expr.evaluate(testdata1);
            var expected = 'world';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('(foo.blah.baz.fud)[-1]', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.blah.baz.fud)[-1]');
            var result = expr.evaluate(testdata1);
            var expected = 'world';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('(foo.blah.baz.fud)[-2]', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.blah.baz.fud)[-2]');
            var result = expr.evaluate(testdata1);
            var expected = 'hello';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('(foo.blah.baz.fud)[2-4]', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.blah.baz.fud)[2-4]');
            var result = expr.evaluate(testdata1);
            var expected = 'hello';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('(foo.blah.baz.fud)[-(4-2)]', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.blah.baz.fud)[-(4-2)]');
            var result = expr.evaluate(testdata1);
            var expected = 'hello';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('(foo.blah.baz.fud)[$$.foo.bar / 30]', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.blah.baz.fud)[$$.foo.bar / 30]');
            var result = expr.evaluate(testdata1);
            var expected = 'world';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.blah[0].baz', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah[0].baz');
            var result = expr.evaluate(testdata1);
            var expected = {fud: 'hello'};
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.blah.baz[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.baz[0]');
            var result = expr.evaluate(testdata1);
            var expected = [{fud: 'hello'}, {fud: 'world'}];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('(foo.blah.baz)[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.blah.baz)[0]');
            var result = expr.evaluate(testdata1);
            var expected = {fud: 'hello'};
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('$[0]');
            var result = expr.evaluate([[1, 2], [3, 4]]);
            var expected = [1, 2];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$[1]', function () {
        it('should return result object', function () {
            var expr = jsonata('$[1]');
            var result = expr.evaluate([[1, 2], [3, 4]]);
            var expected = [3, 4];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$[-1]', function () {
        it('should return result object', function () {
            var expr = jsonata('$[-1]');
            var result = expr.evaluate([[1, 2], [3, 4]]);
            var expected = [3, 4];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$[1][0]', function () {
        it('should return result object', function () {
            var expr = jsonata('$[1][0]');
            var result = expr.evaluate([[1, 2], [3, 4]]);
            var expected = 3;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$[1.1][0.9]', function () {
        it('should return result object', function () {
            var expr = jsonata('$[1.1][0.9]');
            var result = expr.evaluate([[1, 2], [3, 4]]);
            var expected = 3;
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - multiple array selectors', function () {

    describe('[1..10][[1..3,8,-1]]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1..10][[1..3,8,-1]]');
            var result = expr.evaluate();
            var expected = [2, 3, 4, 9, 10];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[1..10][[1..3,8,5]]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1..10][[1..3,8,5]]');
            var result = expr.evaluate();
            var expected = [2, 3, 4, 6, 9];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[1..10][[1..3,8,false]]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1..10][[1..3,8,false]]');
            var result = expr.evaluate();
            var expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - quoted object selectors - deprecate', function () {
    describe('foo."blah"', function () {
        it('should return result object', function () {
            var expr = jsonata('foo."blah"');
            var result = expr.evaluate(testdata1);
            var expected = [{baz: {fud: 'hello'}},
                {baz: {fud: 'world'}},
                {bazz: 'gotcha'}];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo."blah".baz.\'fud\'', function () {
        it('should return result object', function () {
            var expr = jsonata('foo."blah".baz.\'fud\'');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('"foo"."blah"."baz"."fud"', function () {
        it('should return result object', function () {
            var expr = jsonata('"foo"."blah"."baz"."fud"');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo."blah.baz"', function () {
        it('should return result object', function () {
            var expr = jsonata('foo."blah.baz"');
            var result = expr.evaluate(testdata1);
            var expected = 'here';
            expect(result).to.deep.equal(expected);
        });
    });
});

describe('Evaluator - quoted object selectors - backticks', function () {
    describe('foo.`blah`', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.`blah`');
            var result = expr.evaluate(testdata1);
            var expected = [{baz: {fud: 'hello'}},
                {baz: {fud: 'world'}},
                {bazz: 'gotcha'}];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.`blah`.baz.\'fud\'', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.`blah`.baz.\'fud\'');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('`foo`.`blah`.`baz`.`fud`', function () {
        it('should return result object', function () {
            var expr = jsonata('`foo`.`blah`.`baz`.`fud`');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.`blah.baz`', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.`blah.baz`');
            var result = expr.evaluate(testdata1);
            var expected = 'here';
            expect(result).to.deep.equal(expected);
        });
    });
});

describe('Evaluator - numeric operators', function () {
    describe('foo.bar + bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar + bar');
            var result = expr.evaluate(testdata1);
            var expected = 140;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('bar + foo.bar', function () {
        it('should return result object', function () {
            var expr = jsonata('bar + foo.bar');
            var result = expr.evaluate(testdata1);
            var expected = 140;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.bar - bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar - bar');
            var result = expr.evaluate(testdata1);
            var expected = -56;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('bar - foo.bar', function () {
        it('should return result object', function () {
            var expr = jsonata('bar - foo.bar');
            var result = expr.evaluate(testdata1);
            var expected = 56;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.bar * bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar * bar');
            var result = expr.evaluate(testdata1);
            var expected = 4116;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('bar * foo.bar', function () {
        it('should return result object', function () {
            var expr = jsonata('bar * foo.bar');
            var result = expr.evaluate(testdata1);
            var expected = 4116;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.bar / bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar / bar');
            var result = expr.evaluate(testdata1);
            var expected = 0.42857142857142855;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('bar / foo.bar', function () {
        it('should return result object', function () {
            var expr = jsonata('bar / foo.bar');
            var result = expr.evaluate(testdata1);
            var expected = 2.3333333333333335;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.bar % bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar % bar');
            var result = expr.evaluate(testdata1);
            var expected = 42;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('bar % foo.bar', function () {
        it('should return result object', function () {
            var expr = jsonata('bar % foo.bar');
            var result = expr.evaluate(testdata1);
            var expected = 14;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('bar + foo.bar * bar', function () {
        it('should return result object', function () {
            var expr = jsonata('bar + foo.bar * bar');
            var result = expr.evaluate(testdata1);
            var expected = 4214;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.bar * bar + bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar * bar + bar');
            var result = expr.evaluate(testdata1);
            var expected = 4214;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('24 * notexist', function () {
        it('should return undefined', function () {
            var expr = jsonata('24 * notexist');
            var result = expr.evaluate(testdata1);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('notexist + 1', function () {
        it('should return undefined', function () {
            var expr = jsonata('notexist + 1');
            var result = expr.evaluate(testdata1);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('1/(10e300 * 10e100) ', function () {
        it('should throw error', function () {
            var expr = jsonata('1/(10e300 * 10e100) ');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({/*position: 0, */value: Infinity, code: 'D1001'});
        });
    });

    describe('"5" + "5"', function () {
        it('should throw error', function () {
            var expr = jsonata('"5" + "5"');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5, code: 'T2001'});
        });
    });

});

describe('Evaluator - comparison operators', function () {

    describe('3>-3', function () {
        it('should return result object', function () {
            var expr = jsonata('3>-3');
            var result = expr.evaluate();
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('3>3', function () {
        it('should return result object', function () {
            var expr = jsonata('3>3');
            var result = expr.evaluate();
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('3=3', function () {
        it('should return result object', function () {
            var expr = jsonata('3=3');
            var result = expr.evaluate();
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('"3"="3"', function () {
        it('should return result object', function () {
            var expr = jsonata('"3"="3"');
            var result = expr.evaluate();
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('"3"=3', function () {
        it('should return result object', function () {
            var expr = jsonata('"3"=3');
            var result = expr.evaluate();
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('"hello" = "hello"', function () {
        it('should return result object', function () {
            var expr = jsonata('"hello" = "hello"');
            var result = expr.evaluate();
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('"hello" != "world"', function () {
        it('should return result object', function () {
            var expr = jsonata('"hello" != "world"');
            var result = expr.evaluate();
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('"hello" < "world"', function () {
        it('should return result object', function () {
            var expr = jsonata('"hello" < "world"');
            var result = expr.evaluate();
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('"32" < 42', function () {
        it('should return result object', function () {
            expect(function () {
                var expr = jsonata('"32" < 42');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 6, code: 'T2009', value: "32", value2: 42});
        });
    });

    describe('null <= "world"', function () {
        it('should return result object', function () {
            expect(function () {
                var expr = jsonata('null <= "world"');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7, code: 'T2010', value: null});
        });
    });

    describe('3 >= true', function () {
        it('should return result object', function () {
            expect(function () {
                var expr = jsonata('3 >= true');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 4, code: 'T2010', value: true});
        });
    });

    describe('foo.bar > bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar > bar');
            var result = expr.evaluate(testdata1);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.bar >= bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar >= bar');
            var result = expr.evaluate(testdata1);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.bar<bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar<bar');
            var result = expr.evaluate(testdata1);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.bar<=bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar<=bar');
            var result = expr.evaluate(testdata1);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('bar>foo.bar', function () {
        it('should return result object', function () {
            var expr = jsonata('bar>foo.bar');
            var result = expr.evaluate(testdata1);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('bar < foo.bar', function () {
        it('should return result object', function () {
            var expr = jsonata('bar < foo.bar');
            var result = expr.evaluate(testdata1);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.bar = bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar = bar');
            var result = expr.evaluate(testdata1);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.bar!= bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar!= bar');
            var result = expr.evaluate(testdata1);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('bar = foo.bar + 56', function () {
        it('should return result object', function () {
            var expr = jsonata('bar = foo.bar + 56');
            var result = expr.evaluate(testdata1);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('bar !=foo.bar+56', function () {
        it('should return result object', function () {
            var expr = jsonata('bar !=foo.bar + 56');
            var result = expr.evaluate(testdata1);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.blah.baz[fud = "hello"]', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.baz[fud = "hello"]');
            var result = expr.evaluate(testdata1);
            var expected = {fud: 'hello'};
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.blah.baz[fud != "world"]', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.baz[fud != "world"]');
            var result = expr.evaluate(testdata1);
            var expected = {fud: 'hello'};
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.Product[Price > 30].Price', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product[Price > 30].Price');
            var result = expr.evaluate(testdata2);
            var expected = [34.45, 34.45, 107.99];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.Product.Price[$<=35]', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product.Price[$<=35]');
            var result = expr.evaluate(testdata2);
            var expected = [34.45, 21.67, 34.45];
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - inclusion operator', function () {

    describe('1 in [1,2]', function () {
        it('should return result object', function () {
            var expr = jsonata('1 in [1,2]');
            var result = expr.evaluate();
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('3 in [1,2]', function () {
        it('should return result object', function () {
            var expr = jsonata('3 in [1,2]');
            var result = expr.evaluate();
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('"hello" in [1,2]', function () {
        it('should return result object', function () {
            var expr = jsonata('"hello" in [1,2]');
            var result = expr.evaluate();
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('"world" in ["hello", "world"]', function () {
        it('should return result object', function () {
            var expr = jsonata('"world" in ["hello", "world"]');
            var result = expr.evaluate();
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('in in ["hello", "world"]', function () {
        it('should return result object', function () {
            var expr = jsonata('in in ["hello", "world"]');
            var result = expr.evaluate();
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('"world" in in', function () {
        it('should return result object', function () {
            var expr = jsonata('"world" in in');
            var result = expr.evaluate();
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('"hello" in "hello"', function () {
        it('should return result object', function () {
            var expr = jsonata('"hello" in "hello"');
            var result = expr.evaluate();
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('library.books["Aho" in authors].title', function () {
        it('should return result object', function () {
            var expr = jsonata('library.books["Aho" in authors].title');
            var result = expr.evaluate(testdata5);
            var expected = [
                "The AWK Programming Language",
                "Compilers: Principles, Techniques, and Tools"
            ];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('content.integration.$lowercase(name)', function () {
        it('should return result object', function () {
            var expr = jsonata('content.integration.$lowercase(name)');
            var result = expr.evaluate([{"content":{"integration":{"name":"fakeIntegrationName"}}}]);
            var expected = "fakeintegrationname";
            expect(result).to.deep.equal(expected);
        });
    });


});

describe('Evaluator - predicates', function () {

    describe('nothing[x=6][y=3].number', function () {
        it('should return result object', function () {
            var expr = jsonata('nothing[x=6][y=3].number');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('clues[x=6][y=3].number', function () {
        it('should return result object', function () {
            var expr = jsonata('clues[x=6][y=3].number');
            var result = expr.evaluate({clues: [{x: 6, y: 3, number: 7}]});
            var expected = 7;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$[x=6][y=3].number', function () {
        it('should return result object', function () {
            var expr = jsonata('$[x=6][y=3].number');
            var result = expr.evaluate([{x: 6, y: 2, number: 7}]);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.Product[$lowercase(Description.Colour) = "purple"][0].Price', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product[$lowercase(Description.Colour) = "purple"][0].Price');
            var result = expr.evaluate(testdata2);
            var expected = [34.45, 34.45];
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - wildcards', function () {

    describe('foo.*', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.*');
            var result = expr.evaluate(testdata1);
            var expected = [42, {"baz": {"fud": "hello"}}, {"baz": {"fud": "world"}}, {"bazz": "gotcha"}, "here"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.*.baz', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.*.baz');
            var result = expr.evaluate(testdata1);
            var expected = [{fud: 'hello'}, {fud: 'world'}];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.*.bazz', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.*.bazz');
            var result = expr.evaluate(testdata1);
            var expected = 'gotcha';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.*.baz.*', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.*.baz.*');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('*.*.baz.fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.*.baz.*');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('*.*.baz.fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.*.baz.*');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.*[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.*[0]');
            var result = expr.evaluate(testdata1);
            var expected = 42;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('*[type="home"]', function () {
        it('should return result object', function () {
            var expr = jsonata('*[type="home"]');
            var result = expr.evaluate(testdata4);
            var expected = [
                {
                    "type": "home",
                    "number": "0203 544 1234"
                },
                {
                    "type": "home",
                    "address": [
                        "freddy@my-social.com",
                        "frederic.smith@very-serious.com"
                    ]
                }
            ];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account[$$.Account."Account Name" = "Firefly"].*[OrderID="order104"].Product.Price', function () {
        it('should return result object', function () {
            var expr = jsonata('Account[$$.Account."Account Name" = "Firefly"].*[OrderID="order104"].Product.Price');
            var result = expr.evaluate(testdata2);
            var expected = [
                34.45,
                107.99
            ];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account[$$.Account.`Account Name` = "Firefly"].*[OrderID="order104"].Product.Price', function () {
        it('should return result object', function () {
            var expr = jsonata('Account[$$.Account.`Account Name` = "Firefly"].*[OrderID="order104"].Product.Price');
            var result = expr.evaluate(testdata2);
            var expected = [
                34.45,
                107.99
            ];
            expect(result).to.deep.equal(expected);
        });
    });
});

describe('Evaluator - desendant operator', function () {

    describe('foo.**.blah', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.**.blah');
            var result = expr.evaluate(testdata1);
            var expected = [{"baz": {"fud": "hello"}}, {"baz": {"fud": "world"}}, {"bazz": "gotcha"}];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.**.baz', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.**.baz');
            var result = expr.evaluate(testdata1);
            var expected = [{"fud": "hello"}, {"fud": "world"}];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.**.fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.**.fud');
            var result = expr.evaluate(testdata1);
            var expected = ["hello", "world"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('"foo".**.fud', function () {
        it('should return result object', function () {
            var expr = jsonata('"foo".**.fud');
            var result = expr.evaluate(testdata1);
            var expected = ["hello", "world"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.**."fud"', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.**."fud"');
            var result = expr.evaluate(testdata1);
            var expected = ["hello", "world"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('"foo".**."fud"', function () {
        it('should return result object', function () {
            var expr = jsonata('"foo".**."fud"');
            var result = expr.evaluate(testdata1);
            var expected = ["hello", "world"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.*.**.fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.*.**.fud');
            var result = expr.evaluate(testdata1);
            var expected = ["hello", "world"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.**.*.fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.**.*.fud');
            var result = expr.evaluate(testdata1);
            var expected = ["hello", "world"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.**.Colour', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.**.Colour');
            var result = expr.evaluate(testdata2);
            var expected = ["Purple", "Orange", "Purple", "Black"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.**.fud[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.**.fud[0]');
            var result = expr.evaluate(testdata1);
            var expected = ["hello", "world"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('(foo.**.fud)[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.**.fud)[0]');
            var result = expr.evaluate(testdata1);
            var expected = "hello";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('(**.fud)[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('(**.fud)[0]');
            var result = expr.evaluate(testdata1);
            var expected = "hello";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('**.Price', function () {
        it('should return result object', function () {
            var expr = jsonata('**.Price');
            var result = expr.evaluate(testdata2);
            var expected = [
                34.45,
                21.67,
                34.45,
                107.99
            ];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('**.Price[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('**.Price[0]');
            var result = expr.evaluate(testdata2);
            var expected = [
                34.45,
                21.67,
                34.45,
                107.99
            ];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('(**.Price)[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('(**.Price)[0]');
            var result = expr.evaluate(testdata2);
            var expected = 34.45;
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

    describe('Account.Order.blah.**', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.blah.**');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('**', function () {
        it('should return result object', function () {
            var expr = jsonata('**');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - string concat', function () {

    describe('"foo" & "bar"', function () {
        it('should return result object', function () {
            var expr = jsonata('"foo" & "bar"');
            var result = expr.evaluate(testdata1);
            var expected = 'foobar';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('"foo"&"bar"', function () {
        it('should return result object', function () {
            var expr = jsonata('"foo"&"bar"');
            var result = expr.evaluate(testdata1);
            var expected = 'foobar';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.blah[0].baz.fud &foo.blah[1].baz.fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah[0].baz.fud &foo.blah[1].baz.fud');
            var result = expr.evaluate(testdata1);
            var expected = 'helloworld';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.(blah[0].baz.fud & blah[1].baz.fud)', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.(blah[0].baz.fud & blah[1].baz.fud)');
            var result = expr.evaluate(testdata1);
            var expected = 'helloworld';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.(blah[0].baz.fud & none)', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.(blah[0].baz.fud & none)');
            var result = expr.evaluate(testdata1);
            var expected = 'hello';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.(none.here & blah[1].baz.fud)', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.(none.here & blah[1].baz.fud)');
            var result = expr.evaluate(testdata1);
            var expected = 'world';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[1,2]&[3,4]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1,2]&[3,4]');
            var result = expr.evaluate(testdata1);
            var expected = '[1,2][3,4]';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[1,2]&3', function () {
        it('should return result object', function () {
            var expr = jsonata('[1,2]&3');
            var result = expr.evaluate(testdata1);
            var expected = '[1,2]3';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('1&2', function () {
        it('should return result object', function () {
            var expr = jsonata('1&2');
            var result = expr.evaluate(testdata1);
            var expected = '12';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('1&[2]', function () {
        it('should return result object', function () {
            var expr = jsonata('1&[2]');
            var result = expr.evaluate(testdata1);
            var expected = '1[2]';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('"hello"&5', function () {
        it('should return result object', function () {
            var expr = jsonata('"hello"&5');
            var result = expr.evaluate(testdata1);
            var expected = 'hello5';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('"Prices: " & Account.Order.Product.Price', function () {
        it('should return result object', function () {
            var expr = jsonata('"Prices: " & Account.Order.Product.Price');
            var result = expr.evaluate(testdata2);
            var expected = "Prices: [34.45,21.67,34.45,107.99]";
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - array flattening', function () {

    describe('Account.Order.[Product.Price]', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.[Product.Price]'); // Account.Order.[Product.Price]
            var result = expr.evaluate(testdata2);
            var expected = [[34.45, 21.67], [34.45, 107.99]];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$.nest0', function () {
        it('should return result object', function () {
            var expr = jsonata('$.nest0');
            var result = expr.evaluate(testdata3a);
            var expected = [1, 2, 3, 4];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('nest0', function () {
        it('should return result object', function () {
            var expr = jsonata('nest0');
            var result = expr.evaluate(testdata3a);
            var expected = [1, 2, 3, 4];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('$[0]');
            var result = expr.evaluate(testdata3a);
            var expected = {"nest0": [1, 2]};
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$[1]', function () {
        it('should return result object', function () {
            var expr = jsonata('$[1]');
            var result = expr.evaluate(testdata3a);
            var expected = {"nest0": [3, 4]};
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$[-1]', function () {
        it('should return result object', function () {
            var expr = jsonata('$[-1]');
            var result = expr.evaluate(testdata3a);
            var expected = {"nest0": [3, 4]};
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$[0].nest0', function () {
        it('should return result object', function () {
            var expr = jsonata('$[0].nest0');
            var result = expr.evaluate(testdata3a);
            var expected = [1, 2];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$[1].nest0', function () {
        it('should return result object', function () {
            var expr = jsonata('$[1].nest0');
            var result = expr.evaluate(testdata3a);
            var expected = [3, 4];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$[0].nest0[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('$[0].nest0[0]');
            var result = expr.evaluate(testdata3a);
            var expected = 1;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('nested arrays of singleton arrays', function() {
        describe('nest0.[nest1.[nest2.[nest3]]]', function () {
            it('should return result object', function () {
                var expr = jsonata('nest0.[nest1.[nest2.[nest3]]]'); // nest0.[nest1.[nest2.[nest3]]]
                var result = expr.evaluate(testdata3);
                var expected = [[[[1], [2]], [[3], [4]]], [[[5], [6]], [[7], [8]]]];
                expect(result).to.deep.equal(expected);
            });
        });

        describe('nest0.nest1.[nest2.[nest3]]', function () {
            it('should return result object', function () {
                var expr = jsonata('nest0.nest1.[nest2.[nest3]]'); // nest0.nest1.[nest2.[nest3]]
                var result = expr.evaluate(testdata3);
                var expected = [[[1], [2]], [[3], [4]], [[5], [6]], [[7], [8]]];
                expect(result).to.deep.equal(expected);
            });
        });

        describe('nest0.[nest1.nest2.[nest3]]', function () {
            it('should return result object', function () {
                var expr = jsonata('nest0.[nest1.nest2.[nest3]]'); // nest0.[nest1.nest2.[nest3]]
                var result = expr.evaluate(testdata3);
                var expected = [[[1], [2], [3], [4]], [[5], [6], [7], [8]]];
                expect(result).to.deep.equal(expected);
            });
        });

        describe('nest0.[nest1.[nest2.nest3]]', function () {
            it('should return result object', function () {
                var expr = jsonata('nest0.[nest1.[nest2.nest3]]'); // nest0.[nest1.[nest2.nest3]]
                var result = expr.evaluate(testdata3);
                var expected = [[[1, 2], [3, 4]], [[5, 6], [7, 8]]];
                expect(result).to.deep.equal(expected);
            });
        });

        describe('nest0.[nest1.nest2.nest3]', function () {
            it('should return result object', function () {
                var expr = jsonata('nest0.[nest1.nest2.nest3]'); // nest0.[nest1.nest2.nest3]
                var result = expr.evaluate(testdata3);
                var expected = [[1, 2, 3, 4], [5, 6, 7, 8]];
                expect(result).to.deep.equal(expected);
            });
        });

        describe('nest0.nest1.[nest2.nest3]', function () {
            it('should return result object', function () {
                var expr = jsonata('nest0.nest1.[nest2.nest3]'); // nest0.nest1.[nest2.nest3]
                var result = expr.evaluate(testdata3);
                var expected = [[1, 2], [3, 4], [5, 6], [7, 8]];
                expect(result).to.deep.equal(expected);
            });
        });

        describe('nest0.nest1.nest2.[nest3]', function () {
            it('should return result object', function () {
                var expr = jsonata('nest0.nest1.nest2.[nest3]'); // nest0.nest1.nest2.[nest3]
                var result = expr.evaluate(testdata3);
                var expected = [[1], [2], [3], [4], [5], [6], [7], [8]];
                expect(result).to.deep.equal(expected);
            });
        });

        describe('nest0.nest1.nest2.nest3', function () {
            it('should return result object', function () {
                var expr = jsonata('nest0.nest1.nest2.nest3');
                var result = expr.evaluate(testdata3);
                var expected = [1, 2, 3, 4, 5, 6, 7, 8];
                expect(result).to.deep.equal(expected);
            });
        });
    });

    describe('nested arrays of non-arrays', function() {
        describe('nest0.[nest1.[nest2.[nest3]]]', function () {
            it('should return result object', function () {
                var expr = jsonata('nest0.[nest1.[nest2.[nest3]]]'); // nest0.[nest1.[nest2.[nest3]]]
                var result = expr.evaluate(testdata3c);
                var expected = [[[[1], [2]], [[3], [4]]], [[[5], [6]], [[7], [8]]]];
                expect(result).to.deep.equal(expected);
            });
        });

        describe('nest0.nest1.[nest2.[nest3]]', function () {
            it('should return result object', function () {
                var expr = jsonata('nest0.nest1.[nest2.[nest3]]'); // nest0.nest1.[nest2.[nest3]]
                var result = expr.evaluate(testdata3c);
                var expected = [[[1], [2]], [[3], [4]], [[5], [6]], [[7], [8]]];
                expect(result).to.deep.equal(expected);
            });
        });

        describe('nest0.[nest1.nest2.[nest3]]', function () {
            it('should return result object', function () {
                var expr = jsonata('nest0.[nest1.nest2.[nest3]]'); // nest0.[nest1.nest2.[nest3]]
                var result = expr.evaluate(testdata3c);
                var expected = [[[1], [2], [3], [4]], [[5], [6], [7], [8]]];
                expect(result).to.deep.equal(expected);
            });
        });

        describe('nest0.[nest1.[nest2.nest3]]', function () {
            it('should return result object', function () {
                var expr = jsonata('nest0.[nest1.[nest2.nest3]]'); // nest0.[nest1.[nest2.nest3]]
                var result = expr.evaluate(testdata3c);
                var expected = [[[1, 2], [3, 4]], [[5, 6], [7, 8]]];
                expect(result).to.deep.equal(expected);
            });
        });

        describe('nest0.[nest1.nest2.nest3]', function () {
            it('should return result object', function () {
                var expr = jsonata('nest0.[nest1.nest2.nest3]'); // nest0.[nest1.nest2.nest3]
                var result = expr.evaluate(testdata3c);
                var expected = [[1, 2, 3, 4], [5, 6, 7, 8]];
                expect(result).to.deep.equal(expected);
            });
        });

        describe('nest0.nest1.[nest2.nest3]', function () {
            it('should return result object', function () {
                var expr = jsonata('nest0.nest1.[nest2.nest3]'); // nest0.nest1.[nest2.nest3]
                var result = expr.evaluate(testdata3c);
                var expected = [[1, 2], [3, 4], [5, 6], [7, 8]];
                expect(result).to.deep.equal(expected);
            });
        });

        describe('nest0.nest1.nest2.[nest3]', function () {
            it('should return result object', function () {
                var expr = jsonata('nest0.nest1.nest2.[nest3]'); // nest0.nest1.nest2.[nest3]
                var result = expr.evaluate(testdata3c);
                var expected = [[1], [2], [3], [4], [5], [6], [7], [8]];
                expect(result).to.deep.equal(expected);
            });
        });

        describe('nest0.nest1.nest2.nest3', function () {
            it('should return result object', function () {
                var expr = jsonata('nest0.nest1.nest2.nest3');
                var result = expr.evaluate(testdata3c);
                var expected = [1, 2, 3, 4, 5, 6, 7, 8];
                expect(result).to.deep.equal(expected);
            });
        });
    });
});

describe('Evaluator - sequence normalization', function () {

    describe('{"a": 1 }.a', function () {
        it('data in query', function () {
            var expr = jsonata('{"a": 1 }.a');
            var result = expr.evaluate();
            var expected = 1;
            expect(result).to.deep.equal(expected);
        });

        it('data in input', function () {
            var expr = jsonata('a');
            var result = expr.evaluate({"a": 1 });
            var expected = 1;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('{"a": [1] }.a', function () {
        it('data in query', function () {
            var expr = jsonata('{"a": [1] }.a');
            var result = expr.evaluate();
            var expected = [1];
            expect(result).to.deep.equal(expected);
        });

        it('data in input', function () {
            var expr = jsonata('a');
            var result = expr.evaluate({"a": [1] });
            var expected = [1];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('{"a": [[1]] }.a', function () {
        it('data in query', function () {
            var expr = jsonata('{"a": [[1]] }.a');
            var result = expr.evaluate();
            var expected = [[1]];
            expect(result).to.deep.equal(expected);
        });

        it('data in input', function () {
            var expr = jsonata('a');
            var result = expr.evaluate({"a": [[1]] });
            var expected = [[1]];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[{"a":[1,2]}, {"a":[3]}].a', function () {
        it('data in query', function () {
            var expr = jsonata('[{"a":[1,2]}, {"a":[3]}].a');
            var result = expr.evaluate();
            var expected = [1,2,3];
            expect(result).to.deep.equal(expected);
        });

        it('data in input', function () {
            var expr = jsonata('a');
            var result = expr.evaluate([{"a":[1,2]}, {"a":[3]}]);
            var expected = [1,2,3];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[{"a":[{"b":[1]}, {"b":[2]}]}, {"a":[{"b":[3]}, {"b":[4]}]}].a[0].b', function () {
        it('data in query', function () {
            var expr = jsonata('[{"a":[{"b":[1]}, {"b":[2]}]}, {"a":[{"b":[3]}, {"b":[4]}]}].a[0].b');
            var result = expr.evaluate();
            var expected = [1,3];
            expect(result).to.deep.equal(expected);
        });

        it('data in input', function () {
            var expr = jsonata('a[0].b');
            var result = expr.evaluate([{"a":[{"b":[1]}, {"b":[2]}]}, {"a":[{"b":[3]}, {"b":[4]}]}]);
            var expected = [1,3];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[{"a":[{"b":[1]}, {"b":[2]}]}, {"a":[{"b":[3]}, {"b":[4]}]}].a.b[0]', function () {
        it('data in query', function () {
            var expr = jsonata('[{"a":[{"b":[1]}, {"b":[2]}]}, {"a":[{"b":[3]}, {"b":[4]}]}].a.b[0]');
            var result = expr.evaluate();
            var expected = [1,2,3,4];
            expect(result).to.deep.equal(expected);
        });

        it('data in input', function () {
            var expr = jsonata('a.b[0]');
            var result = expr.evaluate([{"a":[{"b":[1]}, {"b":[2]}]}, {"a":[{"b":[3]}, {"b":[4]}]}]);
            var expected = [1,2,3,4];
            expect(result).to.deep.equal(expected);
        });
    });


});

describe('Evaluator - keep singleton arrays', function () {

    describe('Phone[type="mobile"].number', function () {
        it('should return result object', function () {
            var expr = jsonata('Phone[type="mobile"].number');
            var result = expr.evaluate(testdata4);
            var expected = "077 7700 1234";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Phone[type="mobile"][].number', function () {
        it('should return result object', function () {
            var expr = jsonata('Phone[type="mobile"][].number');
            var result = expr.evaluate(testdata4);
            var expected = ["077 7700 1234"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Phone[][type="mobile"].number', function () {
        it('should return result object', function () {
            var expr = jsonata('Phone[][type="mobile"].number');
            var result = expr.evaluate(testdata4);
            var expected = ["077 7700 1234"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Phone[type="office"][].number', function () {
        it('should return result object', function () {
            var expr = jsonata('Phone[type="office"][].number');
            var result = expr.evaluate(testdata4);
            var expected = [
                "01962 001234",
                "01962 001235"
            ];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Phone{type: number}', function () {
        it('should return result object', function () {
            var expr = jsonata('Phone{type: number}');
            var result = expr.evaluate(testdata4);
            var expected = {
                "home": "0203 544 1234",
                "office": [
                    "01962 001234",
                    "01962 001235"
                ],
                "mobile": "077 7700 1234"
            };
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Phone{type: number[]}', function () {
        it('should return result object', function () {
            var expr = jsonata('Phone{type: number[]}');
            var result = expr.evaluate(testdata4);
            var expected = {
                "home": [
                    "0203 544 1234"
                ],
                "office": [
                    "01962 001234",
                    "01962 001235"
                ],
                "mobile": [
                    "077 7700 1234"
                ]
            };
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - variables', function () {

    describe('$price.foo.bar', function () {
        it('should return result object', function () {
            var expr = jsonata('$price.foo.bar');
            expr.assign('price', {foo: {bar: 45}});
            var result = expr.evaluate(testdata2);
            var expected = 45;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$price.foo.bar', function () {
        it('should return result object', function () {
            var expr = jsonata('$price.foo.bar');
            var context = {'price': {foo: {bar: 45}}};
            var result = expr.evaluate(testdata2, context);
            var expected = 45;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$var[1]', function () {
        it('should return result object', function () {
            var expr = jsonata('$var[1]');
            expr.assign('var', [1, 2, 3]);
            var result = expr.evaluate(testdata2);
            var expected = 2;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$.foo.bar', function () {
        it('should return result object', function () {
            var expr = jsonata('$.foo.bar');
            expr.assign('price', {foo: {bar: 45}});
            var result = expr.evaluate(testdata1);
            var expected = 42;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$a := 5', function () {
        it('should return result object', function () {
            var expr = jsonata('$a := 5');
            var result = expr.evaluate();
            var expected = 5;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$a := $b := 5', function () {
        it('should return result object', function () {
            var expr = jsonata('$a := $b := 5');
            var result = expr.evaluate();
            var expected = 5;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('($a := $b := 5; $a)', function () {
        it('should return result object', function () {
            var expr = jsonata('($a := $b := 5; $a)');
            var result = expr.evaluate();
            var expected = 5;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('($a := $b := 5; $b)', function () {
        it('should return result object', function () {
            var expr = jsonata('($a := $b := 5; $b)');
            var result = expr.evaluate();
            var expected = 5;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('( $a := 5; $a := $a + 2; $a )', function () {
        it('should return result object', function () {
            var expr = jsonata('( $a := 5; $a := $a + 2; $a )');
            var result = expr.evaluate();
            var expected = 7;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[1,2,3].$v', function () {
        it('should return result object', function () {
            var expr = jsonata('[1,2,3].$v');
            expr.assign('v', undefined);
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

});


describe('Evaluator - variable scope', function () {

    describe('( $foo := "defined"; ( $foo := nothing ); $foo )', function () {
        it('should return result object', function () {
            var expr = jsonata('( $foo := "defined"; ( $foo := nothing ); $foo )');
            var result = expr.evaluate();
            var expected = "defined";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('( $foo := "defined"; ( $foo := nothing; $foo ) )', function () {
        it('should return result object', function () {
            var expr = jsonata('( $foo := "defined"; ( $foo := nothing; $foo ) )');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

});


describe('Evaluator - functions: sum', function () {

    describe('$sum(Account.Order.Product.(Price * Quantity))', function () {
        it('should return result object', function () {
            var expr = jsonata('$sum(Account.Order.Product.(Price * Quantity))');
            var result = expr.evaluate(testdata2);
            var expected = 336.36;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.$sum(Product.(Price * Quantity))', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.$sum(Product.(Price * Quantity))');
            var result = expr.evaluate(testdata2);
            var expected = [90.57000000000001, 245.79000000000002];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.(OrderID & ": " & $sum(Product.(Price*Quantity)))', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.(OrderID & ": " & $sum(Product.(Price*Quantity)))');
            var result = expr.evaluate(testdata2);
            var expected = ["order103: 90.57", "order104: 245.79"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$sum()', function () {
        it('should return result object', function () {
            var expr = jsonata('$sum()');
            expect(function () {
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 5, code: 'T0410', token: 'sum', index: 1});
        });
    });

    describe('$sum(1)', function () {
        it('should return result object', function () {
            var expr = jsonata('$sum(1)');
            var result = expr.evaluate();
            var expected = 1;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$sum(Account.Order)', function () {
        it('should return result object', function () {
            var expr = jsonata('$sum(Account.Order)');
            expect(function () {
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 5, code: 'T0412', token: 'sum', index: 1, type: 'n'});
        });
    });

    describe('$sum(undefined)', function () {
        it('should throw an error', function () {
            var expr = jsonata('$sum(undefined)');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });
});

describe('Evaluator - functions: count', function () {

    describe('$count(Account.Order.Product.(Price * Quantity))', function () {
        it('should return result object', function () {
            var expr = jsonata('$count(Account.Order.Product.(Price * Quantity))');
            var result = expr.evaluate(testdata2);
            var expected = 4;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.$count(Product.(Price * Quantity))', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.$count(Product.(Price * Quantity))');
            var result = expr.evaluate(testdata2);
            var expected = [2, 2];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.(OrderID & ": " & $count(Product.(Price*Quantity)))', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.(OrderID & ": " & $count(Product.(Price*Quantity)))');
            var result = expr.evaluate(testdata2);
            var expected = ["order103: 2","order104: 2"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$count([])', function () {
        it('should return result object', function () {
            var expr = jsonata('$count([])');
            var result = expr.evaluate();
            var expected = 0;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$count([1,2,3])', function () {
        it('should return result object', function () {
            var expr = jsonata('$count([1,2,3])');
            var result = expr.evaluate();
            var expected = 3;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$count(["1","2","3"])', function () {
        it('should return result object', function () {
            var expr = jsonata('$count(["1","2","3"])');
            var result = expr.evaluate();
            var expected = 3;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$count(["1","2",3])', function () {
        it('should return result object', function () {
            var expr = jsonata('$count(["1","2",3])');
            var result = expr.evaluate();
            var expected = 3;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$count(1)', function () {
        it('should return result object', function () {
            var expr = jsonata('$count(1)');
            var result = expr.evaluate();
            var expected = 1;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$count([],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$count([],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7, code: 'T0410', token: 'count', index: 2});
        });
    });

    describe('$count([1,2,3],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$count([1,2,3],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7, code: 'T0410', token: 'count', index: 2});
        });
    });

    describe('$count([],[],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$count([],[],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7, code: 'T0410', token: 'count', index: 2});
        });
    });

    describe('$count([1,2],[],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$count([1,2],[],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7, code: 'T0410', token: 'count', index: 2});
        });
    });

    describe('$count(undefined)', function () {
        it('should throw an error', function () {
            var expr = jsonata('$count(undefined)');
            var result = expr.evaluate();
            var expected = 0;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$count([1,2,3,4]) / 2', function () {
        it('should throw an error', function () {
            var expr = jsonata('$count([1,2,3,4]) / 2');
            var result = expr.evaluate();
            var expected = 2;
            expect(result).to.deep.equal(expected);
        });
    });
});

describe('Evaluator - functions: max', function () {

    describe('$max(Account.Order.Product.(Price * Quantity))', function () {
        it('should return result object', function () {
            var expr = jsonata('$max(Account.Order.Product.(Price * Quantity))');
            var result = expr.evaluate(testdata2);
            var expected = 137.8;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.$max(Product.(Price * Quantity))', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.$max(Product.(Price * Quantity))');
            var result = expr.evaluate(testdata2);
            var expected = [68.9,137.8];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.(OrderID & ": " & $count(Product.(Price*Quantity)))', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.(OrderID & ": " & $count(Product.(Price*Quantity)))');
            var result = expr.evaluate(testdata2);
            var expected = ["order103: 2","order104: 2"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$max([])', function () {
        it('should return result object', function () {
            var expr = jsonata('$max([])');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.equal(expected);
        });
    });

    describe('$max([1,2,3])', function () {
        it('should return result object', function () {
            var expr = jsonata('$max([1,2,3])');
            var result = expr.evaluate();
            var expected = 3;
            expect(result).to.deep.equal(expected);
        });
    });


    describe('$max(["1","2","3"])', function () {
        it('should return result object', function () {
            var expr = jsonata('$max(["1","2","3"])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5, code: 'T0412', token: 'max', index: 1, type: 'n'});
        });
    });

    describe('$max(["1","2",3])', function () {
        it('should return result object', function () {
            var expr = jsonata('$max(["1","2",3])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5, code: 'T0412', token: 'max', index: 1, type: 'n'});
        });
    });

    describe('$max(1)', function () {
        it('should return result object', function () {
            var expr = jsonata('$max(1)');
            var result = expr.evaluate();
            var expected = 1;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$max([-1,-5])', function () {
        it('should return result object', function () {
            var expr = jsonata('$max([-1,-5])');
            var result = expr.evaluate();
            var expected = -1;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$max([],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$max([],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5, code: 'T0410', token: 'max', index: 2});
        });
    });

    describe('$max([1,2,3],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$max([1,2,3],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5, code: 'T0410', token: 'max', index: 2});
        });
    });

    describe('$max([],[],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$max([],[],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5, code: 'T0410', token: 'max', index: 2});
        });
    });

    describe('$max([1,2],[],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$max([1,2],[],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5, code: 'T0410', token: 'max', index: 2});
        });
    });

    describe('$max(undefined)', function () {
        it('should throw an error', function () {
            var expr = jsonata('$max(undefined)');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });
});

describe('Evaluator - functions: min', function () {

    describe('$min(Account.Order.Product.(Price * Quantity))', function () {
        it('should return result object', function () {
            var expr = jsonata('$min(Account.Order.Product.(Price * Quantity))');
            var result = expr.evaluate(testdata2);
            var expected = 21.67;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.$min(Product.(Price * Quantity))', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.$min(Product.(Price * Quantity))');
            var result = expr.evaluate(testdata2);
            var expected = [21.67,107.99];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.(OrderID & ": " & $min(Product.(Price*Quantity)))', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.(OrderID & ": " & $min(Product.(Price*Quantity)))');
            var result = expr.evaluate(testdata2);
            var expected = ["order103: 21.67","order104: 107.99"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$min([])', function () {
        it('should return result object', function () {
            var expr = jsonata('$min([])');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.equal(expected);
        });
    });

    describe('$min([1,2,3])', function () {
        it('should return result object', function () {
            var expr = jsonata('$min([1,2,3])');
            var result = expr.evaluate();
            var expected = 1;
            expect(result).to.deep.equal(expected);
        });
    });


    describe('$min(["1","2","3"])', function () {
        it('should return result object', function () {
            var expr = jsonata('$min(["1","2","3"])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5, code: 'T0412', token: 'min', index: 1, type: 'n'});
        });
    });

    describe('$min(["1","2",3])', function () {
        it('should return result object', function () {
            var expr = jsonata('$min(["1","2",3])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5, code: 'T0412', token: 'min', index: 1, type: 'n'});
        });
    });

    describe('$min(1)', function () {
        it('should return result object', function () {
            var expr = jsonata('$min(1)');
            var result = expr.evaluate();
            var expected = 1;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$min([],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$min([],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5, code: 'T0410', token: 'min', index: 2});
        });
    });

    describe('$min([1,2,3],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$min([1,2,3],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5, code: 'T0410', token: 'min', index: 2});
        });
    });

    describe('$min([],[],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$min([],[],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5, code: 'T0410', token: 'min', index: 2});
        });
    });

    describe('$min([1,2],[],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$min([1,2],[],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5, code: 'T0410', token: 'min', index: 2});
        });
    });

    describe('$min(undefined)', function () {
        it('should throw an error', function () {
            var expr = jsonata('$min(undefined)');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });
});

describe('Evaluator - functions: average', function () {

    describe('$average(Account.Order.Product.(Price * Quantity))', function () {
        it('should return result object', function () {
            var expr = jsonata('$average(Account.Order.Product.(Price * Quantity))');
            var result = expr.evaluate(testdata2);
            var expected = 84.09;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.$average(Product.(Price * Quantity))', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.$average(Product.(Price * Quantity))');
            var result = expr.evaluate(testdata2);
            var expected = [45.285000000000004,122.89500000000001];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.(OrderID & ": " & $average(Product.(Price*Quantity)))', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.(OrderID & ": " & $average(Product.(Price*Quantity)))');
            var result = expr.evaluate(testdata2);
            var expected = ["order103: 45.285","order104: 122.895"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$average([])', function () {
        it('should return result object', function () {
            var expr = jsonata('$average([])');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$average([1,2,3])', function () {
        it('should return result object', function () {
            var expr = jsonata('$average([1,2,3])');
            var result = expr.evaluate();
            var expected = 2;
            expect(result).to.deep.equal(expected);
        });
    });


    describe('$average(["1","2","3"])', function () {
        it('should return result object', function () {
            var expr = jsonata('$average(["1","2","3"])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 9, code: 'T0412', token: 'average', index: 1, type: 'n'});
        });
    });

    describe('$average(["1","2",3])', function () {
        it('should return result object', function () {
            var expr = jsonata('$average(["1","2",3])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 9, code: 'T0412', token: 'average', index: 1, type: 'n'});
        });
    });

    describe('$average(1)', function () {
        it('should return result object', function () {
            var expr = jsonata('$average(1)');
            var result = expr.evaluate();
            var expected = 1;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$average([],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$average([],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 9, code: 'T0410', token: 'average', index: 2});
        });
    });

    describe('$average([1,2,3],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$average([1,2,3],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 9, code: 'T0410', token: 'average', index: 2});
        });
    });

    describe('$average([],[],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$average([],[],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 9, code: 'T0410', token: 'average', index: 2});
        });
    });

    describe('$average([1,2],[],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$average([1,2],[],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 9, code: 'T0410', token: 'average', index: 2});
        });
    });

    describe('$average(undefined)', function () {
        it('should throw an error', function () {
            var expr = jsonata('$average(undefined)');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });
});

describe('Evaluator - functions: exists', function () {

    describe('$exists("Hello World")', function () {
        it('should return true', function () {
            var expr = jsonata('$exists("Hello World")');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$exists("")', function () {
        it('should return true', function () {
            var expr = jsonata('$exists("")');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$exists(true)', function () {
        it('should return true', function () {
            var expr = jsonata('$exists(true)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$exists(false)', function () {
        it('should return true', function () {
            var expr = jsonata('$exists(false)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$exists(0)', function () {
        it('should return true', function () {
            var expr = jsonata('$exists(0)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$exists(-0.5)', function () {
        it('should return true', function () {
            var expr = jsonata('$exists(-0.5)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$exists(null)', function () {
        it('should return true', function () {
            var expr = jsonata('$exists(null)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$exists([])', function () {
        it('should return true', function () {
            var expr = jsonata('$exists([])');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$exists([0])', function () {
        it('should return true', function () {
            var expr = jsonata('$exists([0])');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$exists([1,2,3])', function () {
        it('should return true', function () {
            var expr = jsonata('$exists([1,2,3])');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$exists([[]])', function () {
        it('should return true', function () {
            var expr = jsonata('$exists([[]])');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$exists([[null]])', function () {
        it('should return true', function () {
            var expr = jsonata('$exists([[null]])');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$exists([[[true]]])', function () {
        it('should return true', function () {
            var expr = jsonata('$exists([[[true]]])');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$exists({})', function () {
        it('should return true', function () {
            var expr = jsonata('$exists({})');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$exists({"hello":"world"})', function () {
        it('should return true', function () {
            var expr = jsonata('$exists({"hello":"world"})');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$exists(Account)', function () {
        it('should return true', function () {
            var expr = jsonata('$exists(Account)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$exists(Account.Order.Product.Price)', function () {
        it('should return true', function () {
            var expr = jsonata('$exists(Account.Order.Product.Price)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$exists($exists)', function () {
        it('should return true', function () {
            var expr = jsonata('$exists($exists)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$exists(function(){true})', function () {
        it('should return true', function () {
            var expr = jsonata('$exists(function(){true})');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$exists(blah)', function () {
        it('should return false', function () {
            var expr = jsonata('$exists(blah)');
            var result = expr.evaluate(testdata2);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$exists(Account.blah)', function () {
        it('should return false', function () {
            var expr = jsonata('$exists(Account.blah)');
            var result = expr.evaluate(testdata2);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$exists(Account.Order[2])', function () {
        it('should return false', function () {
            var expr = jsonata('$exists(Account.Order[2])');
            var result = expr.evaluate(testdata2);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$exists(Account.Order[0].blah)', function () {
        it('should return false', function () {
            var expr = jsonata('$exists(Account.Order[0].blah)');
            var result = expr.evaluate(testdata2);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$exists(2,3)', function () {
        it('should throw error', function () {
            var expr = jsonata('$exists(2,3)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'T0410', token: 'exists', index: 2});
        });
    });

    describe('$exists()', function () {
        it('should throw error', function () {
            var expr = jsonata('$exists()');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'T0410', token: 'exists', index: 1});
        });
    });

});

describe('Evaluator - functions: spread', function () {

    describe('$spread("Hello World")', function () {
        it('should return itself', function () {
            var expr = jsonata('$spread("Hello World")');
            var result = expr.evaluate(testdata2);
            var expected = "Hello World";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$spread((Account.Order.Product.Description))', function () {
        it('should return itself', function () {
            var expr = jsonata('$spread((Account.Order.Product.Description))');
            var result = expr.evaluate(testdata2);
            var expected = [
                {"Colour": "Purple"},
                {"Width": 300},
                {"Height": 200},
                {"Depth": 210},
                {"Weight": 0.75},
                {"Colour": "Orange"},
                {"Width": 300},
                {"Height": 200},
                {"Depth": 210},
                {"Weight": 0.6},
                {"Colour": "Purple"},
                {"Width": 300},
                {"Height": 200},
                {"Depth": 210},
                {"Weight": 0.75},
                {"Colour": "Black"},
                {"Width": 30},
                {"Height": 20},
                {"Depth": 210},
                {"Weight": 2}
            ];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$spread(blah)', function () {
        it('should return itself', function () {
            var expr = jsonata('$spread(blah)');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$string($spread(function($x){$x*$x}))', function () {
        it('should return itself', function () {
            var expr = jsonata('$string($spread(function($x){$x*$x}))');
            var result = expr.evaluate(testdata2);
            var expected = '';
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - functions: string', function () {

    describe('$string(5)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(5)');
            var result = expr.evaluate(testdata2);
            var expected = '5';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$string(22/7)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(22/7)');
            var result = expr.evaluate(testdata2);
            var expected = '3.142857142857';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$string(1e100)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(1e100)');
            var result = expr.evaluate(testdata2);
            var expected = '1e+100';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$string(1e-100)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(1e-100)');
            var result = expr.evaluate();
            var expected = '1e-100';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$string(1e-6)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(1e-6)');
            var result = expr.evaluate();
            var expected = '0.000001';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$string(1e-7)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(1e-7)');
            var result = expr.evaluate();
            var expected = '1e-7';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$string(1e+20)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(1e20)');
            var result = expr.evaluate();
            var expected = '100000000000000000000';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$string(1e+21)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(1e21)');
            var result = expr.evaluate();
            var expected = '1e+21';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.$string($sum(Product.(Price* Quantity)))', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.$string($sum(Product.(Price* Quantity)))');
            var result = expr.evaluate(testdata2);
            var expected = [
                "90.57",
                "245.79"
            ];
            //expect(result).to.deep.equal(expected);
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$string(true)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(true)');
            var result = expr.evaluate(testdata2);
            var expected = 'true';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$string(false)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(false)');
            var result = expr.evaluate(testdata2);
            var expected = 'false';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$string(null)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(null)');
            var result = expr.evaluate(testdata2);
            var expected = 'null';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$string(blah)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(blah)');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$string($string)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string($string)');
            var result = expr.evaluate(testdata2);
            var expected = '';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$string(function(){true})', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(function(){true})');
            var result = expr.evaluate(testdata2);
            var expected = '';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$string(function(){1})', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(function(){1})');
            var result = expr.evaluate(testdata2);
            var expected = '';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$string({"string": "hello"})', function () {
        it('should return result object', function () {
            var expr = jsonata('$string({"string": "hello"})');
            var result = expr.evaluate();
            var expected = '{"string":"hello"}';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$string(["string", 5])', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(["string", 5])');
            var result = expr.evaluate();
            var expected = '["string",5]';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$string() of JSON objects', function () {
        it('should return result object', function () {
            var expr = jsonata('$string({' +
              '  "string": "hello",' +
              '  "number": 78.8 / 2,' +
              '  "null":null,' +
              '  "boolean": false,' +
              '  "function": $sum,' +
              '  "lambda": function(){true},' +
              '  "object": {' +
              '    "str": "another",' +
              '    "lambda2": function($n){$n}' +
              '  },' +
              '  "array": []' +
              '})');
            var result = expr.evaluate();
            var expected = '{"string":"hello","number":39.4,"null":null,"boolean":false,"function":"","lambda":"","object":{"str":"another","lambda2":""},"array":[]}';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$string(1/0)', function () {
        it('should throw error', function () {
            var expr = jsonata('$string(1/0)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'D3001', value: Infinity});
        });
    });

    describe('$string({"inf": 1/0})', function () {
        it('should throw error', function () {
            var expr = jsonata('$string({"inf": 1/0})');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'D1001', value: Infinity});
        });
    });

    describe('$string(2,3)', function () {
        it('should throw error', function () {
            var expr = jsonata('$string(2,3)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'T0410', token: 'string', index: 2});
        });
    });

    describe('$string()', function () {
        it('should throw error', function () {
            var expr = jsonata('$string()');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });


});

describe('Evaluator - functions: substring', function () {

    describe('$substring("hello world", 0, 5)', function () {
        it('should return result object', function () {
            var expr = jsonata('$substring("hello world", 0, 5)');
            var result = expr.evaluate(testdata2);
            var expected = 'hello';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$substring("hello world", -5, 5)', function () {
        it('should return result object', function () {
            var expr = jsonata('$substring("hello world", -5, 5)');
            var result = expr.evaluate(testdata2);
            var expected = 'world';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$substring("hello world", 6)', function () {
        it('should return result object', function () {
            var expr = jsonata('$substring("hello world", 6)');
            var result = expr.evaluate(testdata2);
            var expected = 'world';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$substring(blah, 6)', function () {
        it('should return result object', function () {
            var expr = jsonata('$substring(blah, 6)');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - functions: substringBefore', function () {

    describe('$substringBefore("Hello World", " ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$substringBefore("Hello World", " ")');
            var result = expr.evaluate(testdata2);
            var expected = 'Hello';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$substringBefore("Hello World", "l")', function () {
        it('should return result object', function () {
            var expr = jsonata('$substringBefore("Hello World", "l")');
            var result = expr.evaluate(testdata2);
            var expected = 'He';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$substringBefore("Hello World", "f")', function () {
        it('should return result object', function () {
            var expr = jsonata('$substringBefore("Hello World", "f")');
            var result = expr.evaluate(testdata2);
            var expected = 'Hello World';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$substringBefore("Hello World", "He")', function () {
        it('should return result object', function () {
            var expr = jsonata('$substringBefore("Hello World", "He")');
            var result = expr.evaluate(testdata2);
            var expected = '';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$substringBefore(blah, "He")', function () {
        it('should return result object', function () {
            var expr = jsonata('$substringBefore(blah, "He")');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - functions: substringAfter', function () {

    describe('$substringAfter("Hello World", " ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$substringAfter("Hello World", " ")');
            var result = expr.evaluate(testdata2);
            var expected = 'World';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$substringAfter("Hello World", "l")', function () {
        it('should return result object', function () {
            var expr = jsonata('$substringAfter("Hello World", "l")');
            var result = expr.evaluate(testdata2);
            var expected = 'lo World';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$substringAfter("Hello World", "f")', function () {
        it('should return result object', function () {
            var expr = jsonata('$substringAfter("Hello World", "f")');
            var result = expr.evaluate(testdata2);
            var expected = 'Hello World';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$substringAfter("Hello World", "ld")', function () {
        it('should return result object', function () {
            var expr = jsonata('$substringAfter("Hello World", "ld")');
            var result = expr.evaluate(testdata2);
            var expected = '';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$substringAfter(blah, "ld")', function () {
        it('should return result object', function () {
            var expr = jsonata('$substringAfter(blah, "ld")');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - functions: lowercase', function () {

    describe('$lowercase("Hello World")', function () {
        it('should return result object', function () {
            var expr = jsonata('$lowercase("Hello World")');
            var result = expr.evaluate(testdata2);
            var expected = 'hello world';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$lowercase(blah)', function () {
        it('should return result object', function () {
            var expr = jsonata('$lowercase(blah)');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - functions: uppercase', function () {

    describe('$uppercase("Hello World")', function () {
        it('should return result object', function () {
            var expr = jsonata('$uppercase("Hello World")');
            var result = expr.evaluate(testdata2);
            var expected = 'HELLO WORLD';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$uppercase(blah)', function () {
        it('should return result object', function () {
            var expr = jsonata('$uppercase(blah)');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - functions: length', function () {

    describe('$length("")', function () {
        it('should return result object', function () {
            var expr = jsonata('$length("")');
            var result = expr.evaluate();
            var expected = 0;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$length("hello")', function () {
        it('should return result object', function () {
            var expr = jsonata('$length("hello")');
            var result = expr.evaluate();
            var expected = 5;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$length(missing)', function () {
        it('should return result object', function () {
            var expr = jsonata('$length(missing)');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$length("\\u03BB-calculus")', function () {
        it('should return result object', function () {
            var expr = jsonata('$length("\\u03BB-calculus")');
            var result = expr.evaluate();
            var expected = 10;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$length("\\uD834\\uDD1E")', function () {
        it('should return result object', function () {
            var expr = jsonata('$length("\\uD834\\uDD1E")');
            var result = expr.evaluate();
            var expected = 2;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$length("𝄞")', function () {
        it('should return result object', function () {
            var expr = jsonata('$length("𝄞")');
            var result = expr.evaluate();
            var expected = 2;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$length("超明體繁")', function () {
        it('should return result object', function () {
            var expr = jsonata('$length("超明體繁")');
            var result = expr.evaluate();
            var expected = 4;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$length("\\t")', function () {
        it('should return result object', function () {
            var expr = jsonata('$length("\\t")');
            var result = expr.evaluate();
            var expected = 1;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$length("\\n")', function () {
        it('should return result object', function () {
            var expr = jsonata('$length("\\n")');
            var result = expr.evaluate();
            var expected = 1;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$length(1234)', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('$length(1234)');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'T0410', index: 1, value: 1234, token: 'length'});
        });
    });

    describe('$length(null)', function () {
        it('should throw error', function () {
            var expr = jsonata('$length(null)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'T0410', index: 1, value: null, token: 'length'});
        });
    });

    describe('$length(true)', function () {
        it('should throw error', function () {
            var expr = jsonata('$length(true)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'T0410', index: 1, value: true, token: 'length'});
        });
    });

    describe('$length(["str"])', function () {
        it('should throw error', function () {
            var expr = jsonata('$length(["str"])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'T0410', index: 1, token: 'length'});
        });
    });

    describe('$length()', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('$length()');
                expr.evaluate(23);
            }).to.throw()
                .to.deep.contain({position: 8, code: 'T0411', index: 1, token: 'length', value: 23});
        });
    });

    describe('$length()', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('$length()');
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 8, code: 'T0411', index: 1, token: 'length'});
        });
    });

    describe('$length("Hello", "World")', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('$length("Hello", "World")');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'T0410', index: 2, token: 'length'});
        });
    });

});

describe('Evaluator - functions: trim', function () {

    describe('$trim("Hello World")', function () {
        it('should return result object', function () {
            var expr = jsonata('$trim("Hello World")');
            var result = expr.evaluate();
            var expected = "Hello World";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$trim("   Hello  \n  \t World  \t ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$trim("   Hello  \n  \t World  \t ")');
            var result = expr.evaluate();
            var expected = "Hello World";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$trim()', function () {
        it('should return result object', function () {
            var expr = jsonata('$trim()');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });
});

describe('Evaluator - functions: pad', function () {

    describe('$pad("foo", 5)', function () {
        it('should return result object', function () {
            var expr = jsonata('$pad("foo", 5)');
            var result = expr.evaluate();
            expect(result).to.deep.equal('foo  ');
        });
    });

    describe('$pad("foo", -5)', function () {
        it('should return result object', function () {
            var expr = jsonata('$pad("foo", -5)');
            var result = expr.evaluate();
            expect(result).to.deep.equal('  foo');
        });
    });

    describe('$pad("foo", -5, "#")', function () {
        it('should return result object', function () {
            var expr = jsonata('$pad("foo", -5, "#")');
            var result = expr.evaluate();
            expect(result).to.deep.equal('##foo');
        });
    });

    describe('$pad("foo", 5, "")', function () {
        it('should return result object', function () {
            var expr = jsonata('$pad("foo", 5, "")');
            var result = expr.evaluate();
            expect(result).to.deep.equal('foo  ');
        });
    });

    describe('$pad("foo", 1)', function () {
        it('should return result object', function () {
            var expr = jsonata('$pad("foo", 1)');
            var result = expr.evaluate();
            expect(result).to.deep.equal('foo');
        });
    });

    describe('$pad("foo", 8, "-+")', function () {
        it('should return result object', function () {
            var expr = jsonata('$pad("foo", 8, "-+")');
            var result = expr.evaluate();
            expect(result).to.deep.equal('foo-+-+-');
        });
    });

    describe('$pad(nothing, 1)', function () {
        it('should return result object', function () {
            var expr = jsonata('$pad(nothing, 1)');
            var result = expr.evaluate();
            expect(result).to.deep.equal(undefined);
        });
    });

});

describe('Evaluator - functions: contains', function () {

    describe('$contains("Hello World", "lo")', function () {
        it('should return result object', function () {
            var expr = jsonata('$contains("Hello World", "lo")');
            var result = expr.evaluate();
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$contains("Hello World", "World")', function () {
        it('should return result object', function () {
            var expr = jsonata('$contains("Hello World", "World")');
            var result = expr.evaluate();
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$contains("Hello World", "world")', function () {
        it('should return result object', function () {
            var expr = jsonata('$contains("Hello World", "world")');
            var result = expr.evaluate();
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$contains("Hello World", "Word")', function () {
        it('should return result object', function () {
            var expr = jsonata('$contains("Hello World", "Word")');
            var result = expr.evaluate();
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$contains(nothing, "World")', function () {
        it('should return result object', function () {
            var expr = jsonata('$contains(nothing, "World")');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$contains(23, 3)', function () {
        it('should throw error', function () {
            var expr = jsonata('$contains(23, 3)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 10, code: 'T0410', token: 'contains', index: 1});
        });
    });

    describe('$contains("23", 3)', function () {
        it('should throw error', function () {
            var expr = jsonata('$contains("23", 3)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 10, code: 'T0410', token: 'contains', index: 2});
        });
    });

});

describe('Evaluator - functions: replace', function () {

    describe('$replace("Hello World", "World", "Everyone")', function () {
        it('should return result object', function () {
            var expr = jsonata('$replace("Hello World", "World", "Everyone")');
            var result = expr.evaluate();
            var expected = "Hello Everyone";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$replace("the cat sat on the mat", "at", "it")', function () {
        it('should return result object', function () {
            var expr = jsonata('$replace("the cat sat on the mat", "at", "it")');
            var result = expr.evaluate();
            var expected = "the cit sit on the mit";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$replace("the cat sat on the mat", "at", "it", 0)', function () {
        it('should return result object', function () {
            var expr = jsonata('$replace("the cat sat on the mat", "at", "it", 0)');
            var result = expr.evaluate();
            var expected = "the cat sat on the mat";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$replace("the cat sat on the mat", "at", "it", 2)', function () {
        it('should return result object', function () {
            var expr = jsonata('$replace("the cat sat on the mat", "at", "it", 2)');
            var result = expr.evaluate();
            var expected = "the cit sit on the mat";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$replace(nothing, "at", "it", 2)', function () {
        it('should return result object', function () {
            var expr = jsonata('$replace(nothing, "at", "it", 2)');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$replace("hello")', function () {
        it('should throw error', function () {
            var expr = jsonata('$replace("hello")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 9, code: 'T0410', token: 'replace', index: 2});
        });
    });

    describe('$replace("hello", "l", "1", null)', function () {
        it('should throw error', function () {
            var expr = jsonata('$replace("hello", "l", "1", null)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 9, code: 'T0410', token: 'replace', index: 4, value: null});
        });
    });

    describe('$replace("hello", "l", "1", -2)', function () {
        it('should throw error', function () {
            var expr = jsonata('$replace("hello", "l", "1", -2)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 9, code: 'D3011', token: 'replace', index: 4, value: -2});
        });
    });

    describe('$replace("hello", l)', function () {
        it('should throw error', function () {
            var expr = jsonata('$replace("hello", 1)');
            expect(function () {
                expr.evaluate('hello');
            }).to.throw()
                .to.deep.contain({position: 9, code: 'T0410', token: 'replace', index: 2, value: 1});
        });
    });

    describe('$replace("hello", "", "bye")', function () {
        it('should throw error', function () {
            var expr = jsonata('$replace("hello", "", "bye")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 9, code: 'D3010', index: 2, token: 'replace', value: ""});
        });
    });

    describe('$replace("hello", 2, 1)', function () {
        it('should throw error', function () {
            var expr = jsonata('$replace("hello", 2, 1)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 9, code: 'T0410', token: 'replace', index: 2, value: 2});
        });
    });

    describe('$replace(123, 2, 1)', function () {
        it('should throw error', function () {
            var expr = jsonata('$replace(123, 2, 1)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 9,  code: 'T0410', token: 'replace', index: 1, value: 123});
        });
    });

});

describe('Evaluator - functions: split', function () {

    describe('$split("Hello World", " ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("Hello World", " ")');
            var result = expr.evaluate();
            var expected = ["Hello", "World"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$split("Hello", " ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("Hello", " ")');
            var result = expr.evaluate();
            var expected = ["Hello"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$split("Hello  World", " ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("Hello  World", " ")');
            var result = expr.evaluate();
            var expected = ["Hello", "", "World"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$split("Hello", "")', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("Hello", "")');
            var result = expr.evaluate();
            var expected = ["H", "e", "l", "l", "o"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$sum($split("12345", "").$number($))', function () {
        it('should return result object', function () {
            var expr = jsonata('$sum($split("12345", "").$number($))');
            var result = expr.evaluate();
            var expected = 15;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$split("a, b, c, d", ", ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("a, b, c, d", ", ")');
            var result = expr.evaluate();
            var expected = ["a", "b", "c", "d"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$split("a, b, c, d", ", ", 2)', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("a, b, c, d", ", ", 2)');
            var result = expr.evaluate();
            var expected = ["a", "b"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$split("a, b, c, d", ", ", 2.5)', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("a, b, c, d", ", ", 2.5)');
            var result = expr.evaluate();
            var expected = ["a", "b"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$split("a, b, c, d", ", ", 10)', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("a, b, c, d", ", ", 10)');
            var result = expr.evaluate();
            var expected = ["a", "b", "c", "d"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$split("a, b, c, d", ", ", 0)', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("a, b, c, d", ", ", 0)');
            var result = expr.evaluate();
            var expected = [];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$split(nothing, " ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$split(nothing, " ")');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$split("a, b, c, d", ", ", -3)', function () {
        it('should throw error', function () {
            var expr = jsonata('$split("a, b, c, d", ", ", -3)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7, code: 'D3020', index: 3, value: -3});
        });
    });

    describe('$split("a, b, c, d", ", ", null)', function () {
        it('should throw error', function () {
            var expr = jsonata('$split("a, b, c, d", ", ", null)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7,  code: 'T0410', token: 'split', index: 3, value: null});
        });
    });

    describe('$split("a, b, c, d", ", ", -5)', function () {
        it('should throw error', function () {
            var expr = jsonata('$split("a, b, c, d", ", ", -5)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7, code: 'D3020', token: 'split', index: 3, value: -5});
        });
    });

    describe('$split("a, b, c, d", ", ", "2")', function () {
        it('should throw error', function () {
            var expr = jsonata('$split("a, b, c, d", ", ", "2")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7, code: 'T0410', token: 'split', index: 3, value: "2"});
        });
    });

    describe('$split("a, b, c, d", true)', function () {
        it('should throw error', function () {
            var expr = jsonata('$split("a, b, c, d", true)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7, code: 'T0410', token: 'split', index: 2, value: true});
        });
    });

    describe('$split(12345, 3)', function () {
        it('should throw error', function () {
            var expr = jsonata('$split(12345, 3)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7, code: 'T0410', token: 'split', index: 1, value: 12345});
        });
    });

    describe('$split(12345)', function () {
        it('should throw error', function () {
            var expr = jsonata('$split(12345)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7, code: 'T0410', token: 'split', index: 1 });
        });
    });


});

describe('Evaluator - functions: join', function () {

    describe('$join("hello")', function () {
        it('should return result object', function () {
            var expr = jsonata('$join("hello")');
            var result = expr.evaluate();
            var expected = "hello";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$join(["hello"])', function () {
        it('should return result object', function () {
            var expr = jsonata('$join(["hello"])');
            var result = expr.evaluate();
            var expected = "hello";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$join(["hello", "world"])', function () {
        it('should return result object', function () {
            var expr = jsonata('$join(["hello", "world"])');
            var result = expr.evaluate();
            var expected = "helloworld";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$join(["hello", "world"], ", ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$join(["hello", "world"], ", ")');
            var result = expr.evaluate();
            var expected = "hello, world";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$join([], ", ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$join([], ", ")');
            var result = expr.evaluate();
            var expected = "";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$join(Account.Order.Product.Description.Colour, ", ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$join(Account.Order.Product.Description.Colour, ", ")');
            var result = expr.evaluate(testdata2);
            var expected = "Purple, Orange, Purple, Black";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$join(Account.Order.Product.Description.Colour, no.sep)', function () {
        it('should return result object', function () {
            var expr = jsonata('$join(Account.Order.Product.Description.Colour, no.sep)');
            var result = expr.evaluate(testdata2);
            var expected = "PurpleOrangePurpleBlack";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$join(Account.blah.Product.Description.Colour, ", ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$join(Account.blah.Product.Description.Colour, ", ")');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$join(true, ", ")', function () {
        it('should throw error', function () {
            var expr = jsonata('$join(true, ", ")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 6, code: 'T0412', token: 'join', index: 1, value: true});
        });
    });

    describe('$join([1,2,3], ", ")', function () {
        it('should throw error', function () {
            var expr = jsonata('$join([1,2,3], ", ")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 6, code: 'T0412', token: 'join', index: 1});
        });
    });

    describe('$join(["hello"], 3)', function () {
        it('should throw error', function () {
            var expr = jsonata('$join(["hello"], 3)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 6, code: 'T0410', token: 'join', index: 2, value: 3});
        });
    });

    describe('$join()', function () {
        it('should throw error', function () {
            var expr = jsonata('$join()');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 6, code: 'T0410', token: 'join', index: 1});
        });
    });

});

describe('Evaluator - functions: formatNumber', function () {

    describe('$formatNumber(12345.6, "#,###.00")', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatNumber(12345.6, "#,###.00")');
            var result = expr.evaluate();
            var expected = "12,345.60";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$formatNumber(12345678.9, "9,999.99")', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatNumber(12345678.9, "9,999.99")');
            var result = expr.evaluate();
            var expected = "12,345,678.90";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$formatNumber(123412345678.9, "9,999.99")', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatNumber(123412345678.9, "9,9,99.99")');
            var result = expr.evaluate();
            var expected = "123412345,6,78.90";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$formatNumber(1234.56789, "9,999.999,99")', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatNumber(1234.56789, "9,999.999,999")');
            var result = expr.evaluate();
            var expected = "1,234.567,890";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$formatNumber(123.9, "9999")', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatNumber(123.9, "9999")');
            var result = expr.evaluate();
            var expected = "0124";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$formatNumber(0.14, "01%")', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatNumber(0.14, "01%")');
            var result = expr.evaluate();
            var expected = "14%";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$formatNumber(0.4857,"###.###‰")', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatNumber(0.4857,"###.###‰")');
            var result = expr.evaluate();
            var expected = "485.7‰";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$formatNumber(0.14, "001pm", {"per-mille": "pm"})', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatNumber(0.14, "###pm", {"per-mille": "pm"})');
            var result = expr.evaluate();
            var expected = "140pm";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$formatNumber(-6, "000")', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatNumber(-6, "000")');
            var result = expr.evaluate();
            var expected = "-006";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$formatNumber(1234.5678, "00.000e0")', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatNumber(1234.5678, "00.000e0")');
            var result = expr.evaluate();
            var expected = "12.346e2";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$formatNumber(1234.5678, "00.000e000")', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatNumber(1234.5678, "00.000e000")');
            var result = expr.evaluate();
            var expected = "12.346e002";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$formatNumber(1234.5678, "①①.①①①e①")', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatNumber(1234.5678, "①①.①①①e①", {"zero-digit": "\u245f"})');
            var result = expr.evaluate();
            var expected = "①②.③④⑥e②";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$formatNumber(0.234, "0.0e0")', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatNumber(0.234, "0.0e0")');
            var result = expr.evaluate();
            var expected = "2.3e-1";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$formatNumber(0.234, "#.00e0")', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatNumber(0.234, "#.00e0")');
            var result = expr.evaluate();
            var expected = "0.23e0";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$formatNumber(0.123, "#.e9")', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatNumber(0.123, "#.e9")');
            var result = expr.evaluate();
            var expected = "0.1e0";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$formatNumber(0.234, ".00e0")', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatNumber(0.234, ".00e0")');
            var result = expr.evaluate();
            var expected = ".23e0";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$formatNumber(2392.14*(-36.58), "000,000.000###;###,###.000###")', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatNumber(2392.14*(-36.58), "000,000.000###;###,###.000###")');
            var result = expr.evaluate();
            var expected = "87,504.4812";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$formatNumber(2.14*86.58,"PREFIX##00.000###SUFFIX")', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatNumber(2.14*86.58,"PREFIX##00.000###SUFFIX")');
            var result = expr.evaluate();
            var expected = "PREFIX185.2812SUFFIX";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$formatNumber(1E20,"#,######")', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatNumber(1E20,"#,######")');
            var result = expr.evaluate();
            var expected = "100,000000,000000,000000";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Picture format errors', function () {
        it('D3080', function () {
            expect(function () {
                jsonata('$formatNumber(20,"#;#;#")').evaluate();
            }).to.throw()
                .to.deep.contain({position: 14, code: 'D3080'});
        });

        it('D3081', function () {
            expect(function () {
                jsonata('$formatNumber(20,"#.0.0")').evaluate();
            }).to.throw()
                .to.deep.contain({position: 14, code: 'D3081'});
        });

        it('D3082', function () {
            expect(function () {
                jsonata('$formatNumber(20,"#0%%")').evaluate();
            }).to.throw()
                .to.deep.contain({position: 14, code: 'D3082'});
        });

        it('D3083', function () {
            expect(function () {
                jsonata('$formatNumber(20,"#0‰‰")').evaluate();
            }).to.throw()
                .to.deep.contain({position: 14, code: 'D3083'});
        });

        it('D3084', function () {
            expect(function () {
                jsonata('$formatNumber(20,"#0%‰")').evaluate();
            }).to.throw()
                .to.deep.contain({position: 14, code: 'D3084'});
        });

        it('D3085', function () {
            expect(function () {
                jsonata('$formatNumber(20,".e0")').evaluate();
            }).to.throw()
                .to.deep.contain({position: 14, code: 'D3085'});
        });

        it('D3086', function () {
            expect(function () {
                jsonata('$formatNumber(20,"0+.e0")').evaluate();
            }).to.throw()
                .to.deep.contain({position: 14, code: 'D3086'});
        });

        it('D3087', function () {
            expect(function () {
                jsonata('$formatNumber(20,"0,.e0")').evaluate();
            }).to.throw()
                .to.deep.contain({position: 14, code: 'D3087'});
        });

        it('D3088', function () {
            expect(function () {
                jsonata('$formatNumber(20,"0,")').evaluate();
            }).to.throw()
                .to.deep.contain({position: 14, code: 'D3088'});
        });

        it('D3089', function () {
            expect(function () {
                jsonata('$formatNumber(20,"0,,0")').evaluate();
            }).to.throw()
                .to.deep.contain({position: 14, code: 'D3089'});
        });

        it('D3090', function () {
            expect(function () {
                jsonata('$formatNumber(20,"0#.e0")').evaluate();
            }).to.throw()
                .to.deep.contain({position: 14, code: 'D3090'});
        });

        it('D3091', function () {
            expect(function () {
                jsonata('$formatNumber(20,"#0.#0e0")').evaluate();
            }).to.throw()
                .to.deep.contain({position: 14, code: 'D3091'});
        });

        it('D3092', function () {
            expect(function () {
                jsonata('$formatNumber(20,"#0.0e0%")').evaluate();
            }).to.throw()
                .to.deep.contain({position: 14, code: 'D3092'});
        });

        it('D3093', function () {
            expect(function () {
                jsonata('$formatNumber(20,"#0.0e0,0")').evaluate();
            }).to.throw()
                .to.deep.contain({position: 14, code: 'D3093'});
        });

    });
});

describe('Evaluator - functions: formatBase', function () {

    describe('$formatBase(100)', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatBase(100)');
            var result = expr.evaluate();
            var expected = '100';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$formatBase(nothing)', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatBase(nothing)');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$formatBase(100, 2)', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatBase(100, 2)');
            var result = expr.evaluate();
            var expected = '1100100';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$formatBase(-100, 2)', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatBase(-100, 2)');
            var result = expr.evaluate();
            var expected = '-1100100';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$formatBase(100, 36)', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatBase(100, 36)');
            var result = expr.evaluate();
            var expected = '2s';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$formatBase(99.5, 2.5)', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatBase(99.5, 2.5)');
            var result = expr.evaluate();
            var expected = '1100100';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$formatBase(100, 1)', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatBase(100, 1)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 12, code: 'D3100'});
        });
    });

    describe('$formatBase(100, 37)', function () {
        it('should return result object', function () {
            var expr = jsonata('$formatBase(100, 37)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 12, code: 'D3100'});
        });
    });

});

describe('Evaluator - functions: number', function () {

    describe('$number(0)', function () {
        it('should return result object', function () {
            var expr = jsonata('$number(0)');
            var result = expr.evaluate();
            var expected = 0;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$number(10)', function () {
        it('should return result object', function () {
            var expr = jsonata('$number(10)');
            var result = expr.evaluate();
            var expected = 10;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$number(-0.05)', function () {
        it('should return result object', function () {
            var expr = jsonata('$number(-0.05)');
            var result = expr.evaluate();
            var expected = -0.05;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$number("0")', function () {
        it('should return result object', function () {
            var expr = jsonata('$number("0")');
            var result = expr.evaluate();
            var expected = 0;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$number("-0.05")', function () {
        it('should return result object', function () {
            var expr = jsonata('$number("-0.05")');
            var result = expr.evaluate();
            var expected = -0.05;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$number("1e2")', function () {
        it('should return result object', function () {
            var expr = jsonata('$number("1e2")');
            var result = expr.evaluate();
            var expected = 100;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$number("1.0e-2")', function () {
        it('should return result object', function () {
            var expr = jsonata('$number("1.0e-2")');
            var result = expr.evaluate();
            var expected = 0.01;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$number("1e0")', function () {
        it('should return result object', function () {
            var expr = jsonata('$number("1e0")');
            var result = expr.evaluate();
            var expected = 1;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$number("10e500")', function () {
        it('should throw error', function () {
            var expr = jsonata('$number("10e500")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'D3030', token: 'number', index: 1, value: "10e500"});
        });
    });

    describe('$number("Hello world")', function () {
        it('should throw error', function () {
            var expr = jsonata('$number("Hello world")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'D3030', token: 'number', index: 1, value: "Hello world"});
        });
    });

    describe('$number("1/2")', function () {
        it('should throw error', function () {
            var expr = jsonata('$number("1/2")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'D3030', token: 'number', index: 1, value: "1/2"});
        });
    });

    describe('$number("1234 hello")', function () {
        it('should throw error', function () {
            var expr = jsonata('$number("1234 hello")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'D3030', token: 'number', index: 1, value: "1234 hello"});
        });
    });

    describe('$number("")', function () {
        it('should throw error', function () {
            var expr = jsonata('$number("")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'D3030', token: 'number', index: 1, value: ""});
        });
    });

    describe('$number(true)', function () {
        it('should throw error', function () {
            var expr = jsonata('$number(true)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'T0410', token: 'number', index: 1, value: true});
        });
    });

    describe('$number(false)', function () {
        it('should throw error', function () {
            var expr = jsonata('$number(false)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'T0410', token: 'number', index: 1, value: false});
        });
    });

    describe('$number(Account.blah)', function () {
        it('should return result object', function () {
            var expr = jsonata('$number(Account.blah)');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$number(null)', function () {
        it('should throw error', function () {
            var expr = jsonata('$number(null)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'T0410', token: 'number', index: 1, value: null});
        });
    });

    describe('$number([])', function () {
        it('should throw error', function () {
            var expr = jsonata('$number([])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'T0410', token: 'number', index: 1});
        });
    });

    describe('$number("[1]")', function () {
        it('should throw error', function () {
            var expr = jsonata('$number("[1]")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'D3030', token: 'number', index: 1});
        });
    });

    describe('$number([1,2])', function () {
        it('should throw error', function () {
            var expr = jsonata('$number([1,2])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'T0410', token: 'number', index: 1});
        });
    });

    describe('$number(["hello"])', function () {
        it('should throw error', function () {
            var expr = jsonata('$number(["hello"])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'T0410', token: 'number', index: 1});
        });
    });

    describe('$number(["2"])', function () {
        it('should throw error', function () {
            var expr = jsonata('$number(["2"])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'T0410', token: 'number', index: 1});
        });
    });

    describe('$number({})', function () {
        it('should throw error', function () {
            var expr = jsonata('$number({})');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'T0410', token: 'number', index: 1});
        });
    });

    describe('$number({"hello":"world"})', function () {
        it('should throw error', function () {
            var expr = jsonata('$number({"hello":"world"})');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'T0410', token: 'number', index: 1});
        });
    });

    describe('$number($number)', function () {
        it('should throw error', function () {
            var expr = jsonata('$number($number)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'T0410', token: 'number', index: 1});
        });
    });

    describe('$number(function(){5})', function () {
        it('should throw error', function () {
            var expr = jsonata('$number(function(){5})');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'T0410', token: 'number', index: 1});
        });
    });

    describe('$number(1,2)', function () {
        it('should throw error', function () {
            var expr = jsonata('$number(1,2)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, code: 'T0410', token: 'number', index: 2, value: 2});
        });
    });

});

describe('Evaluator - functions: abs', function () {

    describe('$abs(3.7)', function () {
        it('should return result object', function () {
            var expr = jsonata('$abs(3.7)');
            var result = expr.evaluate();
            var expected = 3.7;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$abs(-3.7)', function () {
        it('should return result object', function () {
            var expr = jsonata('$abs(-3.7)');
            var result = expr.evaluate();
            var expected = 3.7;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$abs(0)', function () {
        it('should return result object', function () {
            var expr = jsonata('$abs(0)');
            var result = expr.evaluate();
            var expected = 0;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$abs(nothing)', function () {
        it('should return result object', function () {
            var expr = jsonata('$abs(nothing)');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - functions: floor', function () {

    describe('$floor(3.7)', function () {
        it('should return result object', function () {
            var expr = jsonata('$floor(3.7)');
            var result = expr.evaluate();
            var expected = 3;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$floor(-3.7)', function () {
        it('should return result object', function () {
            var expr = jsonata('$floor(-3.7)');
            var result = expr.evaluate();
            var expected = -4;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$floor(0)', function () {
        it('should return result object', function () {
            var expr = jsonata('$floor(0)');
            var result = expr.evaluate();
            var expected = 0;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$floor(nothing)', function () {
        it('should return result object', function () {
            var expr = jsonata('$floor(nothing)');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - functions: ceil', function () {

    describe('$ceil(3.7)', function () {
        it('should return result object', function () {
            var expr = jsonata('$ceil(3.7)');
            var result = expr.evaluate();
            var expected = 4;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$ceil(-3.7)', function () {
        it('should return result object', function () {
            var expr = jsonata('$ceil(-3.7)');
            var result = expr.evaluate();
            var expected = -3;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$ceil(0)', function () {
        it('should return result object', function () {
            var expr = jsonata('$ceil(0)');
            var result = expr.evaluate();
            var expected = 0;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$ceil(nothing)', function () {
        it('should return result object', function () {
            var expr = jsonata('$ceil(nothing)');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - functions: round', function () {

    describe('$round(4)', function () {
        it('should return result object', function () {
            var expr = jsonata('$round(4)');
            var result = expr.evaluate();
            var expected = 4;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$round(2.3)', function () {
        it('should return result object', function () {
            var expr = jsonata('$round(2.3)');
            var result = expr.evaluate();
            var expected = 2;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$round(2.7)', function () {
        it('should return result object', function () {
            var expr = jsonata('$round(2.7)');
            var result = expr.evaluate();
            var expected = 3;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$round(2.5)', function () {
        it('should return result object', function () {
            var expr = jsonata('$round(2.5)');
            var result = expr.evaluate();
            var expected = 2;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$round(3.5)', function () {
        it('should return result object', function () {
            var expr = jsonata('$round(3.5)');
            var result = expr.evaluate();
            var expected = 4;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$round(-0.5)', function () {
        it('should return result object', function () {
            var expr = jsonata('$round(-0.5)');
            var result = expr.evaluate();
            var expected = 0;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$round(-0.3)', function () {
        it('should return result object', function () {
            var expr = jsonata('$round(-0.3)');
            var result = expr.evaluate();
            var expected = 0;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$round(0.5)', function () {
        it('should return result object', function () {
            var expr = jsonata('$round(0.5)');
            var result = expr.evaluate();
            var expected = 0;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$round(-7.5)', function () {
        it('should return result object', function () {
            var expr = jsonata('$round(-7.5)');
            var result = expr.evaluate();
            var expected = -8;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$round(-8.5)', function () {
        it('should return result object', function () {
            var expr = jsonata('$round(-8.5)');
            var result = expr.evaluate();
            var expected = -8;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$round(4.49, 1)', function () {
        it('should return result object', function () {
            var expr = jsonata('$round(4.49, 1)');
            var result = expr.evaluate();
            var expected = 4.5;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$round(4.525, 2)', function () {
        it('should return result object', function () {
            var expr = jsonata('$round(4.525, 2)');
            var result = expr.evaluate();
            var expected = 4.52;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$round(4.515, 2)', function () {
        it('should return result object', function () {
            var expr = jsonata('$round(4.515, 2)');
            var result = expr.evaluate();
            var expected = 4.52;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$round(12345, -2)', function () {
        it('should return result object', function () {
            var expr = jsonata('$round(12345, -2)');
            var result = expr.evaluate();
            var expected = 12300;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$round(12450, -2)', function () {
        it('should return result object', function () {
            var expr = jsonata('$round(12450, -2)');
            var result = expr.evaluate();
            var expected = 12400;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$round(12350, -2)', function () {
        it('should return result object', function () {
            var expr = jsonata('$round(12350, -2)');
            var result = expr.evaluate();
            var expected = 12400;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$round(6.022e-23, 24)', function () {
        it('should return result object', function () {
            var expr = jsonata('$round(6.022e-23, 24)');
            var result = expr.evaluate();
            var expected = 6.0e-23;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$round(unknown)', function () {
        it('should return result object', function () {
            var expr = jsonata('$round(unknown)');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - functions: sqrt', function () {

    describe('$sqrt(4)', function () {
        it('should return result object', function () {
            var expr = jsonata('$sqrt(4)');
            var result = expr.evaluate();
            var expected = 2;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$sqrt(2)', function () {
        it('should return result object', function () {
            var expr = jsonata('$sqrt(2)');
            var result = expr.evaluate();
            var expected = Math.sqrt(2);
            expect(result).to.be.closeTo(expected, 1e-13);
        });
    });

    describe('$sqrt(10) * $sqrt(10)', function () {
        it('should return result object', function () {
            var expr = jsonata('$sqrt(10) * $sqrt(10)');
            var result = expr.evaluate();
            var expected = 10;
            expect(result).to.be.closeTo(expected, 1e-13);
        });
    });

    describe('$sqrt(nothing)', function () {
        it('should return result object', function () {
            var expr = jsonata('$sqrt(nothing)');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$sqrt(-2)', function () {
        it('should return result object', function () {
            var expr = jsonata('$sqrt(-2)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 6, code: 'D3060', token: 'sqrt', index: 1, value: -2});
        });
    });

});

describe('Evaluator - functions: power', function () {

    describe('$power(4, 2)', function () {
        it('should return result object', function () {
            var expr = jsonata('$power(4, 2)');
            var result = expr.evaluate();
            var expected = 16;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$power(4, 0.5)', function () {
        it('should return result object', function () {
            var expr = jsonata('$power(4, 0.5)');
            var result = expr.evaluate();
            var expected = 2;
            expect(result).to.be.closeTo(expected, 1e-13);
        });
    });

    describe('$power(10, -2)', function () {
        it('should return result object', function () {
            var expr = jsonata('$power(10, -2)');
            var result = expr.evaluate();
            var expected = 0.01;
            expect(result).to.be.closeTo(expected, 1e-13);
        });
    });

    describe('$power(-2, 3)', function () {
        it('should return result object', function () {
            var expr = jsonata('$power(-2, 3)');
            var result = expr.evaluate();
            var expected = -8;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$power(nothing, 3)', function () {
        it('should return result object', function () {
            var expr = jsonata('$power(nothing, 3)');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$power(-2, 1/3)', function () {
        it('should return result object', function () {
            var expr = jsonata('$power(-2, 1/3)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7, code: 'D3061', token: 'power', index: 1, value: -2, exp: 1/3});
        });
    });

    describe('$power(100, 1000)', function () {
        it('should return result object', function () {
            var expr = jsonata('$power(100, 1000)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7, code: 'D3061', token: 'power', index: 1, value: 100, exp: 1000});
        });
    });

});

describe('Evaluator - functions: random', function () {

    describe('random number")', function () {
        it('should return result object', function () {
            var expr = jsonata('$random()');
            var result = expr.evaluate();
            var expected = result >= 0 && result < 1;
            expect(true).to.deep.equal(expected);
        });
    });

    describe('consequetive random numbers should be different")', function () {
        it('should return result object', function () {
            var expr = jsonata('$random() = $random()');
            var result = expr.evaluate();
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - functions: boolean', function () {

    describe('$boolean("Hello World")', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean("Hello World")');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$boolean("")', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean("")');
            var result = expr.evaluate(testdata2);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$boolean(true)', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean(true)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$boolean(false)', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean(false)');
            var result = expr.evaluate(testdata2);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$boolean(0)', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean(0)');
            var result = expr.evaluate(testdata2);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$boolean(10)', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean(10)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$boolean(-0.5)', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean(-0.5)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$boolean(null)', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean(null)');
            var result = expr.evaluate(testdata2);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$boolean([])', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean([])');
            var result = expr.evaluate(testdata2);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$boolean([0])', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean([0])');
            var result = expr.evaluate(testdata2);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$boolean([1])', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean([1])');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$boolean([1,2,3])', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean([1,2,3])');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$boolean([0,0])', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean([0,0])');
            var result = expr.evaluate(testdata2);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$boolean([[]])', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean([[]])');
            var result = expr.evaluate(testdata2);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$boolean([[null]])', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean([[null]])');
            var result = expr.evaluate(testdata2);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$boolean([[[true]]])', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean([[[true]]])');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$boolean({})', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean({})');
            var result = expr.evaluate(testdata2);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$boolean({"hello":"world"})', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean({"hello":"world"})');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$boolean(Account)', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean(Account)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$boolean(Account.Order.Product.Price)', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean(Account.Order.Product.Price)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$boolean(Account.blah)', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean(Account.blah)');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$boolean($boolean)', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean($boolean)');
            var result = expr.evaluate(testdata2);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$boolean(function(){true})', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean(function(){true})');
            var result = expr.evaluate(testdata2);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$boolean(2,3)', function () {
        it('should throw error', function () {
            var expr = jsonata('$boolean(2,3)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 9, code: 'T0410', token: 'boolean', index: 2, value: 3});
        });
    });

});

describe('Evaluator - functions: keys', function () {

    describe('$keys(Account)', function () {
        it('should return result object', function () {
            var expr = jsonata('$keys(Account)');
            var result = expr.evaluate(testdata2);
            var expected = [
                "Account Name",
                "Order"
            ];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$keys(Account.Order.Product)', function () {
        it('should return result object', function () {
            var expr = jsonata('$keys(Account.Order.Product)');
            var result = expr.evaluate(testdata2);
            var expected = [
                "Product Name",
                "ProductID",
                "SKU",
                "Description",
                "Price",
                "Quantity"
            ];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$keys({})', function () {
        it('should return result object', function () {
            var expr = jsonata('$keys({})');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$keys({"foo":{}})', function () {
        it('should return result object', function () {
            var expr = jsonata('$keys({"foo":{}})');
            var result = expr.evaluate();
            var expected = ["foo"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$keys("foo")', function () {
        it('should return result object', function () {
            var expr = jsonata('$keys("foo")');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$keys(function(){1})', function () {
        it('should return result object', function () {
            var expr = jsonata('$keys(function(){1})');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$keys(["foo", "bar"])', function () {
        it('should return result object', function () {
            var expr = jsonata('$keys(["foo", "bar"])');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - functions: lookup', function () {

    describe('$lookup(Account, "Account Name")', function () {
        it('should return result object', function () {
            var expr = jsonata('$lookup(Account, "Account Name")');
            var result = expr.evaluate(testdata2);
            var expected = "Firefly";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$lookup(Account.Order.Product, "Product Name"))', function () {
        it('should return result object', function () {
            var expr = jsonata('$lookup(Account.Order.Product, "Product Name")');
            var result = expr.evaluate(testdata2);
            var expected = [
                "Bowler Hat",
                "Trilby hat",
                "Bowler Hat",
                "Cloak"
            ];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$lookup(Account.Order.Product.ProductID, "Product Name"))', function () {
        it('should return result object', function () {
            var expr = jsonata('$lookup(Account.Order.Product.ProductID, "Product Name")');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('lookup a null value', function () {
        it('should return null', function () {
            var data = {
                "temp": 22.7,
                "wind": 7,
                "gust": null,
                "timestamp": 1508971317377
            };
            var expr = jsonata('$lookup($$, "gust")');
            var result = expr.evaluate(data);
            var expected = null;
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - functions: append', function () {

    describe('$append([1,2], [3,4])', function () {
        it('should return result object', function () {
            var expr = jsonata('$append([1,2], [3,4])');
            var result = expr.evaluate(testdata2);
            var expected = [1, 2, 3, 4];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$append(1, [3,4])', function () {
        it('should return result object', function () {
            var expr = jsonata('$append(1, [3,4])');
            var result = expr.evaluate(testdata2);
            var expected = [1, 3, 4];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$append(1, 2)', function () {
        it('should return result object', function () {
            var expr = jsonata('$append(1,2)');
            var result = expr.evaluate(testdata2);
            var expected = [1, 2];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$append(1, notexist)', function () {
        it('should return result object', function () {
            var expr = jsonata('$append(1,notexist)');
            var result = expr.evaluate(testdata2);
            var expected = 1;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$append(notexist, [2,3,4])', function () {
        it('should return result object', function () {
            var expr = jsonata('$append(notexist, [2,3,4])');
            var result = expr.evaluate(testdata2);
            var expected = [2, 3, 4];
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - function: each', function () {

    describe('$each(Address, λ($v, $k) {$k & ": " & $v})', function () {
        it('should return result object', function () {
            var expr = jsonata('$each(Address, λ($v, $k) {$k & ": " & $v})');
            var result = expr.evaluate(testdata4);
            var expected = [
                "Street: Hursley Park",
                "City: Winchester",
                "Postcode: SO21 2JN"
            ];
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - function: reverse', function () {

    describe('$reverse([1..5])', function () {
        it('should return result object', function () {
            var expr = jsonata('$reverse([1..5])');
            var result = expr.evaluate(testdata4);
            var expected = [5,4,3,2,1];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$reverse must not change the input', function () {
        it('should return result object', function () {
            var expr = jsonata('[[$], [$reverse($)], [$]]');
            var result = expr.evaluate([1,2,3]);
            var expected = [[1,2,3], [3,2,1], [1,2,3]];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$reverse(nothing)', function () {
        it('should return result object', function () {
            var expr = jsonata('$reverse(nothing)');
            var result = expr.evaluate(testdata4);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$reverse([1])', function () {
        it('should return result object', function () {
            var expr = jsonata('$reverse([1])');
            var result = expr.evaluate(testdata4);
            var expected = [1];
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - function: zip', function () {

    describe('zip two arrays', function () {
        it('should return result object', function () {
            var expr = jsonata('$zip([1,2,3],[4,5,6])');
            var result = expr.evaluate();
            var expected = [[1,4],[2,5],[3,6]];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('zip three arrays', function () {
        it('should return result object', function () {
            var expr = jsonata('$zip([1,2,3],[4,5,6],[7,8,9])');
            var result = expr.evaluate();
            var expected = [[1,4,7],[2,5,8],[3,6,9]];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('zip three arrays - unequal length', function () {
        it('should return result object', function () {
            var expr = jsonata('$zip([1,2,3],[4,5],[7,8,9])');
            var result = expr.evaluate();
            var expected = [[1,4,7],[2,5,8]];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('zip single array', function () {
        it('should return result object', function () {
            var expr = jsonata('$zip([1,2,3])');
            var result = expr.evaluate();
            var expected = [[1],[2],[3]];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('zip non-array values', function () {
        it('should return result object', function () {
            var expr = jsonata('$zip(1,2,3)');
            var result = expr.evaluate();
            var expected = [[1,2,3]];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('zip non-array values', function () {
        it('should return result object', function () {
            var expr = jsonata('$zip([1,2,3], [4,5,6], nothing)');
            var result = expr.evaluate();
            var expected = [];
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - function: shuffle', function () {

    describe('$count($shuffle([1..10]))', function () {
        it('should return result object', function () {
            var expr = jsonata('$count($shuffle([1..10]))');
            var result = expr.evaluate(testdata4);
            var expected = 10;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$sort($shuffle([1..10]))', function () {
        it('should return result object', function () {
            var expr = jsonata('$sort($shuffle([1..10]))');
            var result = expr.evaluate(testdata4);
            var expected = [1,2,3,4,5,6,7,8,9,10];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$shuffle(nothing)', function () {
        it('should return result object', function () {
            var expr = jsonata('$shuffle(nothing)');
            var result = expr.evaluate(testdata4);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$shuffle([1])', function () {
        it('should return result object', function () {
            var expr = jsonata('$shuffle([1])');
            var result = expr.evaluate(testdata4);
            var expected = [1];
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - function: merge', function () {

    describe('$merge(nothing)', function () {
        it('should return result object', function () {
            var expr = jsonata('$merge(nothing)');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$merge({"a":1})', function () {
        it('should return result object', function () {
            var expr = jsonata('$merge({"a":1})');
            var result = expr.evaluate(testdata2);
            var expected = {"a": 1};
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$merge([{"a":1}, {"b":2}])', function () {
        it('should return result object', function () {
            var expr = jsonata('$merge([{"a":1}, {"b":2}])');
            var result = expr.evaluate(testdata2);
            var expected = {"a": 1, "b": 2};
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$merge([{"a": 1}, {"b": 2, "c": 3}])', function () {
        it('should return result object', function () {
            var expr = jsonata('$merge([{"a": 1}, {"b": 2, "c": 3}])');
            var result = expr.evaluate(testdata2);
            var expected = {"a": 1, "b": 2, "c": 3};
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$merge([{"a": 1}, {"b": 2, "a": 3}])', function () {
        it('should return result object', function () {
            var expr = jsonata('$merge([{"a": 1}, {"b": 2, "a": 3}])');
            var result = expr.evaluate(testdata2);
            var expected = {"a": 3, "b": 2};
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - function: sort', function () {

    describe('$sort(nothing)', function () {
        it('should return result object', function () {
            var expr = jsonata('$sort(nothing)');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$sort(1)', function () {
        it('should return result object', function () {
            var expr = jsonata('$sort(1)');
            var result = expr.evaluate(testdata2);
            var expected = [1];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$sort([1,3,2])', function () {
        it('should return result object', function () {
            var expr = jsonata('$sort([1,3,2])');
            var result = expr.evaluate(testdata2);
            var expected = [1,2,3];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$sort([1,3,22,11])', function () {
        it('should return result object', function () {
            var expr = jsonata('$sort([1,3,22,11])');
            var result = expr.evaluate(testdata2);
            var expected = [1,3,11,22];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[[$], [$sort($)], [$]]', function () {
        it('should return result object', function () {
            var expr = jsonata('[[$], [$sort($)], [$]]');
            var result = expr.evaluate([1,3,2]);
            var expected = [
                [1, 3, 2],
                [1, 2, 3],
                [1, 3, 2]
            ];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$sort(Account.Order.Product.Price)', function () {
        it('should return result object', function () {
            var expr = jsonata('$sort(Account.Order.Product.Price)');
            var result = expr.evaluate(testdata2);
            var expected = [21.67, 34.45, 34.45, 107.99];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$sort(Account.Order.Product."Product Name")', function () {
        it('should return result object', function () {
            var expr = jsonata('$sort(Account.Order.Product."Product Name")');
            var result = expr.evaluate(testdata2);
            var expected = ["Bowler Hat", "Bowler Hat", "Cloak", "Trilby hat"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$sort(Account.Order.Product)', function () {
        it('should return result object', function () {
            var expr = jsonata('$sort(Account.Order.Product)');
            expect(function () {
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 6, code: 'D3070', token: 'sort', index: 1});
        });
    });

    describe('$sort(Account.Order.Product, function($a, $b) { $a.(Price * Quantity) > $b.(Price * Quantity) }).(Price & " x " & Quantity)', function () {
        it('should return result object', function () {
            var expr = jsonata('$sort(Account.Order.Product, function($a, $b) { $a.(Price * Quantity) > $b.(Price * Quantity) }).(Price & " x " & Quantity)');
            var result = expr.evaluate(testdata2);
            var expected = [
                "21.67 x 1",
                "34.45 x 2",
                "107.99 x 1",
                "34.45 x 4"
            ];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$sort must be stable', function () {
        it('should return result object', function () {
            var expr = jsonata('$sort(Account.Order.Product, function($a, $b) { $a.Price > $b.Price }).SKU');
            var result = expr.evaluate(testdata2);
            var expected = [
                "0406634348",
                "0406654608",
                "040657863",
                "0406654603"
            ];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$sort must be stable - with secondary sort', function () {
        it('should return result object', function () {
            var expr = jsonata(`
                (Account.Order.Product
                  ~> $sort(λ($a,$b){$a.Quantity < $b.Quantity})
                  ~> $sort(λ($a,$b){$a.Price > $b.Price})
                ).SKU
            `);
            var result = expr.evaluate(testdata2);
            var expected = [
                "0406634348",
                "040657863",
                "0406654608",
                "0406654603"
            ];
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - function: sift', function () {

    describe('$sift(λ($v){$v.**.Postcode})', function () {
        it('should return result object', function () {
            var expr = jsonata('$sift(λ($v){$v.**.Postcode})');
            var result = expr.evaluate(testdata4);
            // follows this pattern - "2017-05-09T10:10:16.918Z"
            var expected = {
                "Address": {
                    "Street": "Hursley Park",
                    "City": "Winchester",
                    "Postcode": "SO21 2JN"
                },
                "Other": {
                    "Over 18 ?": true,
                    "Misc": null,
                    "Alternative.Address": {
                        "Street": "Brick Lane",
                        "City": "London",
                        "Postcode": "E1 6RF"
                    }
                }
            };
            expect(result).to.deep.equal(expected);
        });
    });

    describe('**[*].$sift(λ($v){$v.Postcode})', function () {
        it('should return result object', function () {
            var expr = jsonata('**[*].$sift(λ($v){$v.Postcode})');
            var result = expr.evaluate(testdata4);
            // follows this pattern - "2017-05-09T10:10:16.918Z"
            var expected = [
                {
                    "Address": {
                        "Street": "Hursley Park",
                        "City": "Winchester",
                        "Postcode": "SO21 2JN"
                    }
                },
                {
                    "Alternative.Address": {
                        "Street": "Brick Lane",
                        "City": "London",
                        "Postcode": "E1 6RF"
                    }
                }
            ];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$sift(λ($v, $k){$k ~> /^A/})', function () {
        it('should return result object', function () {
            var expr = jsonata('$sift(λ($v, $k){$k ~> /^A/})');
            var result = expr.evaluate(testdata4);
            // follows this pattern - "2017-05-09T10:10:16.918Z"
            var expected = {
                "Age": 28,
                "Address": {
                    "Street": "Hursley Park",
                    "City": "Winchester",
                    "Postcode": "SO21 2JN"
                }
            };
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - function: now', function () {

    describe('$now() returns timestamp', function () {
        it('should return result object', function () {
            var expr = jsonata('$now()');
            var result = expr.evaluate(testdata2);
            // follows this pattern - "2017-05-09T10:10:16.918Z"
            var match = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/.test(result);
            expect(match).to.deep.equal(true);
        });
    });

    describe('$now() always returns same value within an expression', function () {
        it('should return result object', function () {
            var expr = jsonata('{"now": $now(), "delay": $sum([1..10000]), "later": $now()}.(now = later)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$now() returns different timestamp for subsequent evaluate() calls', function () {
        it('should return result object', function () {
            var expr = jsonata('($sum([1..10000]); $now())');
            var result = expr.evaluate(testdata2);
            var result2 = expr.evaluate(testdata2);
            expect(result).to.not.equal(result2);
        });
    });

    describe('Override implementation of $now()', function () {
        it('should return result object', function () {
            var expr = jsonata('$now()');
            expr.registerFunction('now', function() {
                return 'time for tea';
            });
            var result = expr.evaluate(testdata2);
            expect(result).to.equal('time for tea');
        });
    });

});

describe('Evaluator - function: millis', function () {

    describe('$millis() returns milliseconds since the epoch', function () {
        it('should return result object', function () {
            var expr = jsonata('$millis()');
            var result = expr.evaluate(testdata2);
            // number between 1502264152715 and 2000000000000 (18 May 2033)
            var bounded = result > 1502264152715 && result < 2000000000000;
            expect(bounded).to.deep.equal(true);
        });
    });

    describe('$millis() always returns same value within an expression', function () {
        it('should return result object', function () {
            var expr = jsonata('{"now": $millis(), "delay": $sum([1..10000]), "later": $millis()}.(now = later)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$millis() returns different timestamp for subsequent evaluate() calls', function () {
        it('should return result object', function () {
            var expr = jsonata('($sum([1..10000]); $millis())');
            var result = expr.evaluate(testdata2);
            var result2 = expr.evaluate(testdata2);
            expect(result).to.not.equal(result2);
        });
    });

});

describe('Evaluator - function: toMillis', function () {

    describe('toMillis() returns 1 millisecond since the epoch when provided with an ISO 8601 timestamp', function () {
        it('should return result object', function () {
            var expr = jsonata('$toMillis("1970-01-01T00:00:00.001Z")');
            var result = expr.evaluate(testdata2);
            var expected = 1;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('toMillis() returns many milliseconds since the epoch when provided with an ISO 8601 timestamp', function () {
        it('should return result object', function () {
            var expr = jsonata('$toMillis("2017-10-30T16:25:32.935Z")');
            var result = expr.evaluate(testdata2);
            var expected = 1509380732935;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('toMillis() returns undefined when given undefined', function () {
        it('should return result object', function () {
            var expr = jsonata('$toMillis(foo)');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('when toMillis() is not given an ISO 8601 timestamp', function () {
        it('should return an error', function () {
            var expr = jsonata('$toMillis("foo")');
            expect(function () {
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 10, code: 'D3110', value: 'foo'});
        });
    });

});

describe('Evaluator - function: fromMillis', function () {

    describe('fromMillis() returns an ISO 8601 timestamp when given 1 millisecond since the epoch', function () {
        it('should return result object', function () {
            var expr = jsonata('$fromMillis(1)');
            var result = expr.evaluate(testdata2);
            var expected = '1970-01-01T00:00:00.001Z';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('fromMillis() returns an ISO 8601 timestamp when given many milliseconds since the epoch ', function () {
        it('should return result object', function () {
            var expr = jsonata('$fromMillis(1509380732935)');
            var result = expr.evaluate(testdata2);
            var expected = "2017-10-30T16:25:32.935Z";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('fromMillis() returns undefined when given undefined', function () {
        it('should return result object', function () {
            var expr = jsonata('$fromMillis(foo)');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });
});

describe('Evaluator - functions: clone', function () {

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
});

describe('Evaluator - errors', function () {

    describe('"s" - 1', function () {
        it('should throw error', function () {
            var expr = jsonata('"s" - 1');
            expect(function () {
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 5, code: 'T2001', token: '-', value: 's'});
        });
    });

    describe('1 + null', function () {
        it('should throw error', function () {
            var expr = jsonata('1 + null');
            expect(function () {
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 3, code: 'T2002', token: '+', value: null});

        });
    });

    describe('"no closing quote', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('"no closing quote');
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 17, code: 'S0101'});
        });
    });

    describe('`no closing backtick', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('`no closing backtick');
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 20, code: 'S0105'});
        });
    });

    describe('- "s"', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('- "s"');
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 1, code: 'D1002', token: '-', value: 's'});
        });
    });

    describe('unknown(function)', function () {
        it('should throw error', function () {
            var expr = jsonata('unknown(function)');
            expect(function () {
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 8, code: 'T1006'});
        });
    });

    describe('sum(Account.Order.OrderID)', function () {
        it('should throw error', function () {
            var expr = jsonata('sum(Account.Order.OrderID)');
            expect(function () {
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 4, code: 'T1005', token: 'sum'});
        });
    });

    describe('[1,2)', function () {
        it('should throw error', function () {
            expect(function () {
                jsonata('[1,2)');
            }).to.throw()
                .to.deep.contain({position: 5, code: 'S0202', token: ')', value: ']'});
        });
    });

    describe('[1:2]', function () {
        it('should throw error', function () {
            expect(function () {
                jsonata('[1:2]');
            }).to.throw()
                .to.deep.contain({position: 3, code: 'S0202', token: ':', value: ']'});
        });
    });

    describe('$replace("foo", "o, "rr")', function () {
        it('should throw error', function () {
            expect(function () {
                jsonata('$replace("foo", "o, "rr")');
            }).to.throw()
                .to.deep.contain({position: 24, code: 'S0202', token: 'rr"', value: ')'});
        });
    });

    describe('[1!2]', function () {
        it('should throw error', function () {
            expect(function () {
                jsonata('[1!2]');
            }).to.throw()
                .to.deep.contain({position: 3, code: 'S0204', token: '!'});
        });
    });

    describe('@ bar', function () {
        it('should throw error', function () {
            expect(function () {
                jsonata('@ bar');
            }).to.throw()
                .to.deep.contain({position: 1, code: 'S0204', token: '@'});
        });
    });

    describe('2(blah)', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('2(blah)');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 2, code: 'T1006', token: 2});
        });
    });

    describe('2()', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('2()');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 2, code: 'T1006', token: 2});
        });
    });

    describe('3(?)', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('3(?)');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position:2, code: 'T1008', token: 3});
        });
    });

    describe('1=', function () {
        it('should throw error', function () {
            expect(function () {
                jsonata('1=');
            }).to.throw()
                .to.deep.contain({position: 2, code: 'S0207'});
        });
    });

    describe('function(x){$x}(3)', function () {
        it('should throw error', function () {
            expect(function () {
                jsonata('function(x){$x}(3)');
            }).to.throw()
                .to.deep.contain({position: 10, code: 'S0208', token: 'x'});
        });
    });

    describe('x:=1', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('x:=1');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 3, code: 'D2005', token: ':=', value: 'x'});
        });
    });

    describe('2:=1', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('2:=1');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 3, code: 'D2005', token: ':=', value: 2});
        });
    });

    describe('$foo()', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('$foo()');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5, code: 'T1006'});
        });
    });

    describe('55=>5', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('55=>5');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 4, code: 'S0211', token: '>'});
        });
    });

    describe('Ssum(:)', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('Ssum(:)');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 6, code: 'S0211', token: ':'});
        });
    });

    describe('[1,2,3]{"num": $}[true]', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('[1,2,3]{"num": $}[true]');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 18, code: 'S0209'});
        });
    });

    describe('[1,2,3]{"num": $}{"num": $}', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('[1,2,3]{"num": $}{"num": $}');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 18, code: 'S0210'});
        });
    });

    describe('Account.Order[0].Product;', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('Account.Order[0].Product;');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 25, code: 'S0201'});
        });
    });


});


describe('Evaluator - array constructor', function () {

    describe('[]', function () {
        it('should return result object', function () {
            var expr = jsonata('[]');
            var result = expr.evaluate(testdata2);
            var expected = [];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[1]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1]');
            var result = expr.evaluate(testdata2);
            var expected = [1];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[1, 2]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1, 2]');
            var result = expr.evaluate(testdata2);
            var expected = [1, 2];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[1, 2,3]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1, 2,3]');
            var result = expr.evaluate(testdata2);
            var expected = [1, 2, 3];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[1, 2, [3, 4]]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1, 2, [3, 4]]');
            var result = expr.evaluate(testdata2);
            var expected = [1, 2, [3, 4]];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[1, "two", ["three", 4]]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1, "two", ["three", 4]]');
            var result = expr.evaluate(testdata2);
            var expected = [1, "two", ["three", 4]];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[1, $two, ["three", $four]]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1, $two, ["three", $four]]');
            expr.assign('two', 2);
            expr.assign('four', "four");
            var result = expr.evaluate(testdata2);
            var expected = [1, 2, ["three", "four"]];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('["foo.bar", foo.bar, ["foo.baz", foo.blah.baz]]', function () {
        it('should return result object', function () {
            var expr = jsonata('["foo.bar", foo.bar, ["foo.baz", foo.blah.baz]]');
            var result = expr.evaluate(testdata1);
            var expected = ["foo.bar", 42, ["foo.baz", {"fud": "hello"}, {"fud": "world"}]];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[1, 2, 3][0]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1, 2, 3][0]');
            var result = expr.evaluate(testdata2);
            var expected = 1;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[1, 2, [3, 4]][-1]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1, 2, [3, 4]][-1]');
            var result = expr.evaluate(testdata2);
            var expected = [3, 4];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[1, 2, [3, 4]][-1][-1]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1, 2, [3, 4]][-1][-1]');
            var result = expr.evaluate(testdata2);
            var expected = 4;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.blah.baz.[fud, fud]', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.baz.[fud, fud]');
            var result = expr.evaluate(testdata1);
            var expected = [["hello","hello"],["world","world"]];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.blah.baz.[[fud, fud]]', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.baz.[[fud, fud]]');
            var result = expr.evaluate(testdata1);
            var expected = [[["hello","hello"]],[["world","world"]]];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.blah.[baz].fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.[baz].fud');
            var result = expr.evaluate(testdata1a);
            var expected = "hello";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo.blah.[baz, buz].fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.[baz, buz].fud');
            var result = expr.evaluate(testdata1a);
            var expected = ["hello", "world"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[Address, Other."Alternative.Address"].City', function () {
        it('should return result object', function () {
            var expr = jsonata('[Address, Other."Alternative.Address"].City');
            var result = expr.evaluate(testdata4);
            var expected = ["Winchester", "London"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[Address, Other.`Alternative.Address`].City', function () {
        it('should return result object', function () {
            var expr = jsonata('[Address, Other.`Alternative.Address`].City');
            var result = expr.evaluate(testdata4);
            var expected = ["Winchester", "London"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[0,1,2,3,4,5,6,7,8,9][$ % 2 = 0]', function () {
        it('should return result object', function () {
            var expr = jsonata('[0,1,2,3,4,5,6,7,8,9][$ % 2 = 0]');
            var result = expr.evaluate(null);
            var expected = [0, 2, 4, 6, 8];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[1, 2, 3].$', function () {
        it('should return result object', function () {
            var expr = jsonata('[1, 2, 3].$');
            var result = expr.evaluate();
            var expected = [1,2,3];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[1, 2, 3].$', function () {
        it('should return result object', function () {
            var expr = jsonata('[1, 2, 3].$');
            var result = expr.evaluate([]);
            var expected = [1,2,3];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[1, 2, 3].$', function () {
        it('should return result object', function () {
            var expr = jsonata('[1, 2, 3].$');
            var result = expr.evaluate([4,5,6]);
            var expected = [1,2,3];
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - range operator', function () {
    describe('[0..9]', function () {
        it('should return result object', function () {
            var expr = jsonata('[0..9]');
            var result = expr.evaluate(testdata1);
            var expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[0..9][$ % 2 = 0]', function () {
        it('should return result object', function () {
            var expr = jsonata('[0..9][$ % 2 = 0]');
            var result = expr.evaluate(testdata1);
            var expected = [0, 2, 4, 6, 8];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[0, 4..9, 20, 22]', function () {
        it('should return result object', function () {
            var expr = jsonata('[0, 4..9, 20, 22]');
            var result = expr.evaluate(testdata1);
            var expected = [0, 4, 5, 6, 7, 8, 9, 20, 22];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[5..2]', function () {
        it('should return result object', function () {
            var expr = jsonata('[5..2]');
            var result = expr.evaluate(testdata1);
            var expected = [];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[5..2, 2..5]', function () {
        it('should return result object', function () {
            var expr = jsonata('[5..2, 2..5]');
            var result = expr.evaluate(testdata1);
            var expected = [2, 3, 4, 5];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[-2..2]', function () {
        it('should return result object', function () {
            var expr = jsonata('[-2..2]');
            var result = expr.evaluate(testdata1);
            var expected = [-2, -1, 0, 1, 2];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[-2..2].($*$)', function () {
        it('should return result object', function () {
            var expr = jsonata('[-2..2].($*$)');
            var result = expr.evaluate(testdata1);
            var expected = [4, 1, 0, 1, 4];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[-2..blah]', function () {
        it('should return result object', function () {
            var expr = jsonata('[-2..blah]');
            var result = expr.evaluate();
            var expected = [];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[blah..5, 3, -2..blah]', function () {
        it('should return result object', function () {
            var expr = jsonata('[blah..5, 3, -2..blah]');
            var result = expr.evaluate();
            var expected = [3];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[1.1 .. 5]', function () {
        it('should throw error', function () {
            var expr = jsonata('[1.1 .. 5]');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7, code: 'T2003', token: '..', value: 1.1});
        });
    });

    describe('[1 .. 5.5]', function () {
        it('should throw error', function () {
            var expr = jsonata('[1 .. 5.5]');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5, code: 'T2004', token: '..', value: 5.5});
        });
    });

});

describe('Evaluator - object constructor', function () {
    describe('{}', function () {
        it('should return result object', function () {
            var expr = jsonata('{}');
            var result = expr.evaluate(testdata1);
            var expected = {};
            expect(result).to.deep.equal(expected);
        });
    });

    describe('{"key": "value"}', function () {
        it('should return result object', function () {
            var expr = jsonata('{"key": "value"}');
            var result = expr.evaluate(testdata1);
            var expected = {"key": "value"};
            expect(result).to.deep.equal(expected);
        });
    });

    describe('{"one": 1, "two": 2}', function () {
        it('should return result object', function () {
            var expr = jsonata('{"one": 1, "two": 2}');
            var result = expr.evaluate(testdata1);
            var expected = {"one": 1, "two": 2};
            expect(result).to.deep.equal(expected);
        });
    });

    describe('{"one": 1, "two": 2}.two', function () {
        it('should return result object', function () {
            var expr = jsonata('{"one": 1, "two": 2}.two');
            var result = expr.evaluate(testdata1);
            var expected = 2;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('{"one": 1, "two": {"three": 3, "four": "4"}}', function () {
        it('should return result object', function () {
            var expr = jsonata('{"one": 1, "two": {"three": 3, "four": "4"}}');
            var result = expr.evaluate(testdata1);
            var expected = {"one": 1, "two": {"three": 3, "four": "4"}};
            expect(result).to.deep.equal(expected);
        });
    });

    describe('{"one": 1, "two": [3, "four"]}', function () {
        it('should return result object', function () {
            var expr = jsonata('{"one": 1, "two": [3, "four"]}');
            var result = expr.evaluate(testdata1);
            var expected = {"one": 1, "two": [3, "four"]};
            expect(result).to.deep.equal(expected);
        });
    });

    describe('{"test": ()}', function () {
        it('should return result object', function () {
            var expr = jsonata('{"test": ()}');
            var result = expr.evaluate(null);
            var expected = {};
            expect(result).to.deep.equal(expected);
        });
    });

    describe('blah.{}', function () {
        it('should return result object', function () {
            var expr = jsonata('blah.{}');
            var result = expr.evaluate(testdata1);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order{OrderID: Product."Product Name"}', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order{OrderID: Product."Product Name"}');
            var result = expr.evaluate(testdata2);
            var expected = {"order103": ["Bowler Hat", "Trilby hat"], "order104": ["Bowler Hat", "Cloak"]};
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.{OrderID: Product."Product Name"}', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.{OrderID: Product."Product Name"}');
            var result = expr.evaluate(testdata2);
            var expected = [{"order103": ["Bowler Hat", "Trilby hat"]}, {"order104": ["Bowler Hat", "Cloak"]}];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.Product{$string(ProductID): Price}', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product{$string(ProductID): Price}');
            var result = expr.evaluate(testdata2);
            var expected = {"345664": 107.99, "858236": 21.67, "858383": [34.45, 34.45]};
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.Product{$string(ProductID): (Price)[0]}', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product{$string(ProductID): (Price)[0]}');
            var result = expr.evaluate(testdata2);
            var expected = {"345664": 107.99, "858236": 21.67, "858383": 34.45};
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.Product.{$string(ProductID): Price}', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product.{$string(ProductID): Price}');
            var result = expr.evaluate(testdata2);
            var expected = [{"858383": 34.45}, {"858236": 21.67}, {"858383": 34.45}, {"345664": 107.99}];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.Product{ProductID: "Product Name"}', function () {
        it('should throw error', function () {
            var expr = jsonata('Account.Order.Product{ProductID: "Product Name"}');
            expect(function () {
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 22, code: 'T1003', value: 858383});
        });
    });

    describe('Account.Order.Product.{ProductID: "Product Name"}', function () {
        it('should throw error', function () {
            var expr = jsonata('Account.Order.Product.{ProductID: "Product Name"}');
            expect(function () {
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 23, code: 'T1003', value: 858383});
        });
    });

    describe('Account.Order{OrderID: $sum(Product.(Price*Quantity))}', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order{OrderID: $sum(Product.(Price*Quantity))}');
            var result = expr.evaluate(testdata2);
            var expected = {"order103": 90.57000000000001, "order104": 245.79000000000002};
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.{OrderID: $sum(Product.(Price*Quantity))}', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.{OrderID: $sum(Product.(Price*Quantity))}');
            var result = expr.evaluate(testdata2);
            var expected = [{"order103": 90.57000000000001}, {"order104": 245.79000000000002}];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.Product{$."Product Name": Price, $."Product Name": Price}', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product{$."Product Name": Price, $."Product Name": Price}');
            var result = expr.evaluate(testdata2);
            var expected = {
                "Bowler Hat": [
                    34.45,
                    34.45,
                    34.45,
                    34.45
                ],
                "Trilby hat": [
                    21.67,
                    21.67
                ],
                "Cloak": [
                    107.99,
                    107.99
                ]
            };
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.Product{`Product Name`: Price, `Product Name`: Price}', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product{`Product Name`: Price, `Product Name`: Price}');
            var result = expr.evaluate(testdata2);
            var expected = {
                "Bowler Hat": [
                    34.45,
                    34.45,
                    34.45,
                    34.45
                ],
                "Trilby hat": [
                    21.67,
                    21.67
                ],
                "Cloak": [
                    107.99,
                    107.99
                ]
            };
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Object & array transform', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order{' +
              '  OrderID: {' +
              '    "TotalPrice":$sum(Product.(Price * Quantity)),' +
              '    "Items": Product."Product Name"' +
              '  }' +
              '}');
            var result = expr.evaluate(testdata2);
            var expected = {
                "order103": {
                    "TotalPrice": 90.57000000000001,
                    "Items": [
                        "Bowler Hat",
                        "Trilby hat"
                    ]
                },
                "order104": {
                    "TotalPrice": 245.79000000000002,
                    "Items": [
                        "Bowler Hat",
                        "Cloak"
                    ]
                }
            };
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Invoice transformation', function () {
        it('should return result object', function () {
            var expr = jsonata('{' +
              '  "Order": Account.Order.{' +
              '      "ID": OrderID,' +
              '      "Product": Product.{' +
              '          "Name": $."Product Name",' +
              '          "SKU": ProductID,' +
              '          "Details": {' +
              '            "Weight": Description.Weight,' +
              '            "Dimensions": Description.(Width & " x " & Height & " x " & Depth)' +
              '          }' +
              '        },' +
              '      "Total Price": $sum(Product.(Price * Quantity))' +
              '    }' +
              '}');
            var result = expr.evaluate(testdata2);
            var expected = {
                "Order": [
                    {
                        "ID": "order103",
                        "Product": [
                            {
                                "Name": "Bowler Hat",
                                "SKU": 858383,
                                "Details": {
                                    "Weight": 0.75,
                                    "Dimensions": "300 x 200 x 210"
                                }
                            },
                            {
                                "Name": "Trilby hat",
                                "SKU": 858236,
                                "Details": {
                                    "Weight": 0.6,
                                    "Dimensions": "300 x 200 x 210"
                                }
                            }
                        ],
                        "Total Price": 90.57000000000001
                    },
                    {
                        "ID": "order104",
                        "Product": [
                            {
                                "Name": "Bowler Hat",
                                "SKU": 858383,
                                "Details": {
                                    "Weight": 0.75,
                                    "Dimensions": "300 x 200 x 210"
                                }
                            },
                            {
                                "Name": "Cloak",
                                "SKU": 345664,
                                "Details": {
                                    "Weight": 2,
                                    "Dimensions": "30 x 20 x 210"
                                }
                            }
                        ],
                        "Total Price": 245.79000000000002
                    }
                ]
            };
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Invoice transformation - backticks', function () {
        it('should return result object', function () {
            var expr = jsonata('{' +
              '  "Order": Account.Order.{' +
              '      "ID": OrderID,' +
              '      "Product": Product.{' +
              '          "Name": `Product Name`,' +
              '          "SKU": ProductID,' +
              '          "Details": {' +
              '            "Weight": Description.Weight,' +
              '            "Dimensions": Description.(Width & " x " & Height & " x " & Depth)' +
              '          }' +
              '        },' +
              '      "Total Price": $sum(Product.(Price * Quantity))' +
              '    }' +
              '}');
            var result = expr.evaluate(testdata2);
            var expected = {
                "Order": [
                    {
                        "ID": "order103",
                        "Product": [
                            {
                                "Name": "Bowler Hat",
                                "SKU": 858383,
                                "Details": {
                                    "Weight": 0.75,
                                    "Dimensions": "300 x 200 x 210"
                                }
                            },
                            {
                                "Name": "Trilby hat",
                                "SKU": 858236,
                                "Details": {
                                    "Weight": 0.6,
                                    "Dimensions": "300 x 200 x 210"
                                }
                            }
                        ],
                        "Total Price": 90.57000000000001
                    },
                    {
                        "ID": "order104",
                        "Product": [
                            {
                                "Name": "Bowler Hat",
                                "SKU": 858383,
                                "Details": {
                                    "Weight": 0.75,
                                    "Dimensions": "300 x 200 x 210"
                                }
                            },
                            {
                                "Name": "Cloak",
                                "SKU": 345664,
                                "Details": {
                                    "Weight": 2,
                                    "Dimensions": "30 x 20 x 210"
                                }
                            }
                        ],
                        "Total Price": 245.79000000000002
                    }
                ]
            };
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Phone{type: $join(number, ", "), "phone":number}', function () {
        it('should return result object', function () {
            var expr = jsonata('Phone{type: $join(number, ", "), "phone":number}');
            var result = expr.evaluate(testdata4);
            var expected = {
                "home": "0203 544 1234",
                "phone": [
                    "0203 544 1234",
                    "01962 001234",
                    "01962 001235",
                    "077 7700 1234"
                ],
                "office": "01962 001234, 01962 001235",
                "mobile": "077 7700 1234"
            };
            expect(result).to.be.deep.equal(expected);
        });
    });

});

describe('Evaluator - random non-existent paths', function () {
    describe('fdf', function () {
        it('should return result object', function () {
            var expr = jsonata('fdf');
            var result = expr.evaluate(testdata1);
            assert.equal(result, undefined);
        });
    });

    describe('fdf.ett', function () {
        it('should return result object', function () {
            var expr = jsonata('fdf.ett');
            var result = expr.evaluate(testdata1);
            assert.equal(result, undefined);
        });
    });

    describe('fdf.ett[10]', function () {
        it('should return result object', function () {
            var expr = jsonata('fdf.ett[10]');
            var result = expr.evaluate(testdata1);
            assert.equal(result, undefined);
        });
    });

    describe('fdf.ett[vc > 10]', function () {
        it('should return result object', function () {
            var expr = jsonata('fdf.ett[vc > 10]');
            var result = expr.evaluate(testdata1);
            assert.equal(result, undefined);
        });
    });

    describe('fdf.ett + 27', function () {
        it('should return result object', function () {
            var expr = jsonata('fdf.ett + 27');
            var result = expr.evaluate(testdata1);
            assert.equal(result, undefined);
        });
    });

    describe('$fdsd', function () {
        it('should return result object', function () {
            var expr = jsonata('$fdsd');
            var result = expr.evaluate(testdata1);
            assert.equal(result, undefined);
        });
    });

});

describe('Evaluator - Boolean expressions', function () {
    describe('true', function () {
        it('should return result object', function () {
            var expr = jsonata('true');
            var result = expr.evaluate(testdata1);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('false', function () {
        it('should return result object', function () {
            var expr = jsonata('false');
            var result = expr.evaluate(testdata1);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('false or false', function () {
        it('should return result object', function () {
            var expr = jsonata('false or false');
            var result = expr.evaluate(testdata1);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('false or true', function () {
        it('should return result object', function () {
            var expr = jsonata('false or true');
            var result = expr.evaluate(testdata1);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('true or false', function () {
        it('should return result object', function () {
            var expr = jsonata('true or false');
            var result = expr.evaluate(testdata1);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('true or true', function () {
        it('should return result object', function () {
            var expr = jsonata('true or true');
            var result = expr.evaluate(testdata1);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('false and false', function () {
        it('should return result object', function () {
            var expr = jsonata('false and false');
            var result = expr.evaluate(testdata1);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('false and true', function () {
        it('should return result object', function () {
            var expr = jsonata('false and true');
            var result = expr.evaluate(testdata1);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('true and false', function () {
        it('should return result object', function () {
            var expr = jsonata('true and false');
            var result = expr.evaluate(testdata1);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('true and true', function () {
        it('should return result object', function () {
            var expr = jsonata('true and true');
            var result = expr.evaluate(testdata1);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$not(false)', function () {
        it('should return result object', function () {
            var expr = jsonata('$not(false)');
            var result = expr.evaluate(testdata1);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$not(true)', function () {
        it('should return result object', function () {
            var expr = jsonata('$not(true)');
            var result = expr.evaluate(testdata1);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('and=1 and or=2', function () {
        it('should return result object', function () {
            var expr = jsonata('and=1 and or=2');
            var result = expr.evaluate({"and": 1, "or": 2});
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('and>1 or or<=2', function () {
        it('should return result object', function () {
            var expr = jsonata('and>1 or or<=2');
            var result = expr.evaluate({"and": 1, "or": 2});
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('and>1 or or!=2', function () {
        it('should return result object', function () {
            var expr = jsonata('and>1 or or!=2');
            var result = expr.evaluate({"and": 1, "or": 2});
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('and and and', function () {
        it('should return result object', function () {
            var expr = jsonata('and and and');
            var result = expr.evaluate({"and": 1, "or": 2});
            var expected = true;
            expect(result).to.deep.equal(expected);
        });

        describe('$[].content.origin.$lowercase(name)', function () {
            it('should return result object', function () {
                var expr = jsonata('$[].content.origin.$lowercase(name)');
                var result = expr.evaluate([{"content":{"origin":{"name":"fakeIntegrationName"}}}]);
                var expected = ["fakeintegrationname"];
                expect(result).to.deep.equal(expected);
            });
        });

    });
});

describe('Evaluator - null', function () {
    describe('null', function () {
        it('should return result object', function () {
            var expr = jsonata('null');
            var result = expr.evaluate(testdata1);
            var expected = null;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[null]', function () {
        it('should return result object', function () {
            var expr = jsonata('[null]');
            var result = expr.evaluate(testdata1);
            var expected = [null];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[null, null]', function () {
        it('should return result object', function () {
            var expr = jsonata('[null, null]');
            var result = expr.evaluate(testdata1);
            var expected = [null, null];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$not(null)', function () {
        it('should return result object', function () {
            var expr = jsonata('$not(null)');
            var result = expr.evaluate(testdata1);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('null = null', function () {
        it('should return result object', function () {
            var expr = jsonata('null = null');
            var result = expr.evaluate(testdata1);
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('null != null', function () {
        it('should return result object', function () {
            var expr = jsonata('null != null');
            var result = expr.evaluate(testdata1);
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('{"true": true, "false":false, "null": null}', function () {
        it('should return result object', function () {
            var expr = jsonata('{"true": true, "false":false, "null": null}');
            var result = expr.evaluate(testdata1);
            var expected = {"true": true, "false": false, "null": null};
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - Order-by', function () {
    describe('Account.Order.Product.Price^($)', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product.Price^($)');
            var result = expr.evaluate(testdata2);
            var expected = [21.67, 34.45, 34.45, 107.99];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.Product.Price^(<$)', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product.Price^(<$)');
            var result = expr.evaluate(testdata2);
            var expected = [21.67, 34.45, 34.45, 107.99];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.Product.Price^(>$)', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product.Price^(>$)');
            var result = expr.evaluate(testdata2);
            var expected = [107.99, 34.45, 34.45, 21.67];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.Product^(Price).Description.Colour', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product^(Price).Description.Colour');
            var result = expr.evaluate(testdata2);
            var expected = ["Orange", "Purple", "Purple", "Black"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.Product^(Price).SKU', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product^(Price).SKU');
            var result = expr.evaluate(testdata2);
            var expected = ["0406634348", "0406654608", "040657863", "0406654603"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.Product^(Price * Quantity).Description.Colour', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product^(Price * Quantity).Description.Colour');
            var result = expr.evaluate(testdata2);
            var expected = ["Orange", "Purple", "Black", "Purple"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.Product^(Quantity, Description.Colour).Description.Colour', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product^(Quantity, Description.Colour).Description.Colour');
            var result = expr.evaluate(testdata2);
            var expected = ["Black", "Orange", "Purple", "Purple"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.Product^(Quantity, >Description.Colour).Description.Colour', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product^(Quantity, >Description.Colour).Description.Colour');
            var result = expr.evaluate(testdata2);
            var expected = ["Orange", "Black", "Purple", "Purple"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Order-by term that matches undefined should send it to the end', function () {
        it('should return result object', function () {
            var clone = JSON.parse(JSON.stringify(testdata2));
            delete clone.Account.Order[0].Product[0].Price;
            var expr = jsonata('Account.Order.Product^(Price).SKU');
            var result = expr.evaluate(clone);
            var expected = ["0406634348", "040657863", "0406654603", "0406654608"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Order-by term that matches undefined should send it to the end', function () {
        it('should return result object', function () {
            var clone = JSON.parse(JSON.stringify(testdata2));
            delete clone.Account.Order[0].Product[1].Price;
            var expr = jsonata('Account.Order.Product^(Price).SKU');
            var result = expr.evaluate(clone);
            var expected = ["0406654608", "040657863", "0406654603", "0406634348"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Order-by term that matches undefined should send it to the end', function () {
        it('should return result object', function () {
            var clone = JSON.parse(JSON.stringify(testdata2));
            delete clone.Account.Order[0].Product[0].Price;
            delete clone.Account.Order[0].Product[1].Price;
            var expr = jsonata('Account.Order.Product^(Price).SKU');
            var result = expr.evaluate(clone);
            var expected = ["040657863", "0406654603", "0406654608", "0406634348"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('type mis-match in order-by term', function () {
        it('should return result object', function () {
            var clone = JSON.parse(JSON.stringify(testdata2));
            clone.Account.Order[0].Product[0].Price = "foo";
            expect(function () {
                var expr = jsonata('Account.Order.Product^(Price).SKU');
                expr.evaluate(clone);
            }).to.throw()
                .to.deep.contain({position: 22, code: 'T2007', value: "foo", value2: 21.67});
        });
    });

    describe('invalid types in order-by term', function () {
        it('should return result object', function () {
            var clone = JSON.parse(JSON.stringify(testdata2));
            clone.Account.Order[0].Product[0].Price = true;
            expect(function () {
                var expr = jsonata('Account.Order.Product^(Price).SKU');
                expr.evaluate(clone);
            }).to.throw()
                .to.deep.contain({position: 22, code: 'T2008', value: true});
        });
    });

    describe('invalid types in order-by term', function () {
        it('should return result object', function () {
            var clone = JSON.parse(JSON.stringify(testdata2));
            clone.Account.Order[0].Product[1].Price = null;
            expect(function () {
                var expr = jsonata('Account.Order.Product^(Price).SKU');
                expr.evaluate(clone);
            }).to.throw()
                .to.deep.contain({position: 22, code: 'T2008', value: null});
        });
    });
});

describe('Evaluator - Transform expressions', function () {
    describe('$ ~> |Account.Order.Product|{"Total":Price*Quantity},["Description", "SKU"]|', function () {
        it('should return result object', function () {
            var expr = jsonata('$ ~> |Account.Order.Product|{"Total":Price*Quantity},["Description", "SKU"]|');
            var result = expr.evaluate(testdata2);
            var expected = {
                "Account": {
                    "Account Name": "Firefly",
                    "Order": [
                        {
                            "OrderID": "order103",
                            "Product": [
                                {
                                    "Product Name": "Bowler Hat",
                                    "ProductID": 858383,
                                    "Price": 34.45,
                                    "Quantity": 2,
                                    "Total": 68.9
                                },
                                {
                                    "Product Name": "Trilby hat",
                                    "ProductID": 858236,
                                    "Price": 21.67,
                                    "Quantity": 1,
                                    "Total": 21.67
                                }
                            ]
                        },
                        {
                            "OrderID": "order104",
                            "Product": [
                                {
                                    "Product Name": "Bowler Hat",
                                    "ProductID": 858383,
                                    "Price": 34.45,
                                    "Quantity": 4,
                                    "Total": 137.8
                                },
                                {
                                    "ProductID": 345664,
                                    "Product Name": "Cloak",
                                    "Price": 107.99,
                                    "Quantity": 1,
                                    "Total": 107.99
                                }
                            ]
                        }
                    ]
                }
            };
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order ~> |Product|{"Total":Price*Quantity},["Description", "SKU"]|', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order ~> |Product|{"Total":Price*Quantity},["Description", "SKU"]|');
            var result = expr.evaluate(testdata2);
            var expected = [
                {
                    "OrderID": "order103",
                    "Product": [
                        {
                            "Product Name": "Bowler Hat",
                            "ProductID": 858383,
                            "Price": 34.45,
                            "Quantity": 2,
                            "Total": 68.9
                        },
                        {
                            "Product Name": "Trilby hat",
                            "ProductID": 858236,
                            "Price": 21.67,
                            "Quantity": 1,
                            "Total": 21.67
                        }
                    ]
                },
                {
                    "OrderID": "order104",
                    "Product": [
                        {
                            "Product Name": "Bowler Hat",
                            "ProductID": 858383,
                            "Price": 34.45,
                            "Quantity": 4,
                            "Total": 137.8
                        },
                        {
                            "ProductID": 345664,
                            "Product Name": "Cloak",
                            "Price": 107.99,
                            "Quantity": 1,
                            "Total": 107.99
                        }
                    ]
                }
            ];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$ ~> |Account.Order.Product|{"Total":Price*Quantity, "Price": Price * 1.2}|', function () {
        it('should return result object', function () {
            var expr = jsonata('$ ~> |Account.Order.Product|{"Total":Price*Quantity, "Price": Price * 1.2}|');
            var result = expr.evaluate(testdata2);
            var expected = {
                "Account": {
                    "Account Name": "Firefly",
                    "Order": [
                        {
                            "OrderID": "order103",
                            "Product": [
                                {
                                    "Product Name": "Bowler Hat",
                                    "ProductID": 858383,
                                    "SKU": "0406654608",
                                    "Description": {
                                        "Colour": "Purple",
                                        "Width": 300,
                                        "Height": 200,
                                        "Depth": 210,
                                        "Weight": 0.75
                                    },
                                    "Price": 41.34,
                                    "Quantity": 2,
                                    "Total": 68.9
                                },
                                {
                                    "Product Name": "Trilby hat",
                                    "ProductID": 858236,
                                    "SKU": "0406634348",
                                    "Description": {
                                        "Colour": "Orange",
                                        "Width": 300,
                                        "Height": 200,
                                        "Depth": 210,
                                        "Weight": 0.6
                                    },
                                    "Price": 26.004,
                                    "Quantity": 1,
                                    "Total": 21.67
                                }
                            ]
                        },
                        {
                            "OrderID": "order104",
                            "Product": [
                                {
                                    "Product Name": "Bowler Hat",
                                    "ProductID": 858383,
                                    "SKU": "040657863",
                                    "Description": {
                                        "Colour": "Purple",
                                        "Width": 300,
                                        "Height": 200,
                                        "Depth": 210,
                                        "Weight": 0.75
                                    },
                                    "Price": 41.34,
                                    "Quantity": 4,
                                    "Total": 137.8
                                },
                                {
                                    "ProductID": 345664,
                                    "SKU": "0406654603",
                                    "Product Name": "Cloak",
                                    "Description": {
                                        "Colour": "Black",
                                        "Width": 30,
                                        "Height": 20,
                                        "Depth": 210,
                                        "Weight": 2
                                    },
                                    "Price": 129.588,
                                    "Quantity": 1,
                                    "Total": 107.99
                                }
                            ]
                        }
                    ]
                }
            };
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$ ~> |Account.Order.Product|{},"Description"|', function () {
        it('should return result object', function () {
            var expr = jsonata('$ ~> |Account.Order.Product|{},"Description"|');
            var result = expr.evaluate(testdata2);
            var expected = {
                "Account": {
                    "Account Name": "Firefly",
                    "Order": [
                        {
                            "OrderID": "order103",
                            "Product": [
                                {
                                    "Product Name": "Bowler Hat",
                                    "ProductID": 858383,
                                    "SKU": "0406654608",
                                    "Price": 34.45,
                                    "Quantity": 2
                                },
                                {
                                    "Product Name": "Trilby hat",
                                    "ProductID": 858236,
                                    "SKU": "0406634348",
                                    "Price": 21.67,
                                    "Quantity": 1
                                }
                            ]
                        },
                        {
                            "OrderID": "order104",
                            "Product": [
                                {
                                    "Product Name": "Bowler Hat",
                                    "ProductID": 858383,
                                    "SKU": "040657863",
                                    "Price": 34.45,
                                    "Quantity": 4
                                },
                                {
                                    "ProductID": 345664,
                                    "SKU": "0406654603",
                                    "Product Name": "Cloak",
                                    "Price": 107.99,
                                    "Quantity": 1
                                }
                            ]
                        }
                    ]
                }
            };
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$ ~> |Account.Order.Product|nomatch,"Description"|', function () {
        it('should return result object', function () {
            var expr = jsonata('$ ~> |Account.Order.Product|nomatch,"Description"|');
            var result = expr.evaluate(testdata2);
            var expected = {
                "Account": {
                    "Account Name": "Firefly",
                    "Order": [
                        {
                            "OrderID": "order103",
                            "Product": [
                                {
                                    "Product Name": "Bowler Hat",
                                    "ProductID": 858383,
                                    "SKU": "0406654608",
                                    "Price": 34.45,
                                    "Quantity": 2
                                },
                                {
                                    "Product Name": "Trilby hat",
                                    "ProductID": 858236,
                                    "SKU": "0406634348",
                                    "Price": 21.67,
                                    "Quantity": 1
                                }
                            ]
                        },
                        {
                            "OrderID": "order104",
                            "Product": [
                                {
                                    "Product Name": "Bowler Hat",
                                    "ProductID": 858383,
                                    "SKU": "040657863",
                                    "Price": 34.45,
                                    "Quantity": 4
                                },
                                {
                                    "ProductID": 345664,
                                    "SKU": "0406654603",
                                    "Product Name": "Cloak",
                                    "Price": 107.99,
                                    "Quantity": 1
                                }
                            ]
                        }
                    ]
                }
            };
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$ ~> |(Account.Order.Product)[0]|{"Description":"blah"}|', function () {
        it('should return result object', function () {
            var expr = jsonata('$ ~> |(Account.Order.Product)[0]|{"Description":"blah"}|');
            var result = expr.evaluate(testdata2);
            var expected = {
                "Account": {
                    "Account Name": "Firefly",
                    "Order": [
                        {
                            "OrderID": "order103",
                            "Product": [
                                {
                                    "Product Name": "Bowler Hat",
                                    "ProductID": 858383,
                                    "SKU": "0406654608",
                                    "Description": "blah",
                                    "Price": 34.45,
                                    "Quantity": 2
                                },
                                {
                                    "Product Name": "Trilby hat",
                                    "ProductID": 858236,
                                    "SKU": "0406634348",
                                    "Description": {
                                        "Colour": "Orange",
                                        "Width": 300,
                                        "Height": 200,
                                        "Depth": 210,
                                        "Weight": 0.6
                                    },
                                    "Price": 21.67,
                                    "Quantity": 1
                                }
                            ]
                        },
                        {
                            "OrderID": "order104",
                            "Product": [
                                {
                                    "Product Name": "Bowler Hat",
                                    "ProductID": 858383,
                                    "SKU": "040657863",
                                    "Description": {
                                        "Colour": "Purple",
                                        "Width": 300,
                                        "Height": 200,
                                        "Depth": 210,
                                        "Weight": 0.75
                                    },
                                    "Price": 34.45,
                                    "Quantity": 4
                                },
                                {
                                    "ProductID": 345664,
                                    "SKU": "0406654603",
                                    "Product Name": "Cloak",
                                    "Description": {
                                        "Colour": "Black",
                                        "Width": 30,
                                        "Height": 20,
                                        "Depth": 210,
                                        "Weight": 2
                                    },
                                    "Price": 107.99,
                                    "Quantity": 1
                                }
                            ]
                        }
                    ]
                }
            };
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$ ~> |foo.bar|{"Description":"blah"}|', function () {
        it('should return result object', function () {
            var expr = jsonata('$ ~> |foo.bar|{"Description":"blah"}|');
            var result = expr.evaluate(testdata2);
            var expected = testdata2;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account ~> |Order|{"Product":"blah"},nomatch|', function () {
        it('should return result object', function () {
            var expr = jsonata('Account ~> |Order|{"Product":"blah"},nomatch|');
            var result = expr.evaluate(testdata2);
            var expected = {
                "Account Name": "Firefly",
                "Order": [
                    {
                        "OrderID": "order103",
                        "Product": "blah"
                    },
                    {
                        "OrderID": "order104",
                        "Product": "blah"
                    }
                ]
            };
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo ~> |foo.bar|{"Description":"blah"}|', function () {
        it('should return result object', function () {
            var expr = jsonata('foo ~> |foo.bar|{"Description":"blah"}|');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('transform expression with wrong insert/update type', function () {
        it('should throw error', function () {
            var expr = jsonata('Account ~> |Order|5|');
            expect(function () {
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 19, code: 'T2011', value: 5});
        });
    });

    describe('transform expression with wrong delete type', function () {
        it('should throw error', function () {
            var expr = jsonata('Account ~> |Order|{},5|');
            expect(function () {
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 22, code: 'T2012', value: 5});
        });
    });

    describe('transform expression with overridden $clone function', function () {
        it('should return result object', function () {
            var expr = jsonata('Account ~> |Order|{"Product":"blah"},nomatch|');
            var count = 0;
            expr.registerFunction('clone', function(arg) {
                count++;
                return JSON.parse(JSON.stringify(arg));
            });
            var result = expr.evaluate(testdata2);
            var expected = {
                "Account Name": "Firefly",
                "Order": [
                    {
                        "OrderID": "order103",
                        "Product": "blah"
                    },
                    {
                        "OrderID": "order104",
                        "Product": "blah"
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
            }).to.throw()
                .to.deep.contain({position: 21, code: 'T2013'});
        });
    });

});

describe('Evaluator - Conditional expressions', function () {
    describe('["Red"[$$="Bus"], "White"[$$="Police Car"]][0]', function () {
        it('should return result object', function () {
            var expr = jsonata('["Red"[$$="Bus"], "White"[$$="Police Car"]][0]');
            var result = expr.evaluate("Bus");
            var expected = "Red";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('["Red"[$$="Bus"], "White"[$$="Police Car"]][0]', function () {
        it('should return result object', function () {
            var expr = jsonata('["Red"[$$="Bus"], "White"[$$="Police Car"]][0]');
            var result = expr.evaluate("Police Car");
            var expected = "White";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('["Red"[$$="Bus"], "White"[$$="Police Car"]][0]', function () {
        it('should return result object', function () {
            var expr = jsonata('["Red"[$$="Bus"], "White"[$$="Police Car"]][0]');
            var result = expr.evaluate("Tuk tuk");
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$lookup({"Bus": "Red", "Police Car": "White"}, $$)', function () {
        it('should return result object', function () {
            var expr = jsonata('$lookup({"Bus": "Red", "Police Car": "White"}, $$)');
            var result = expr.evaluate("Bus");
            var expected = "Red";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$lookup({"Bus": "Red", "Police Car": "White"}, $$)', function () {
        it('should return result object', function () {
            var expr = jsonata('$lookup({"Bus": "Red", "Police Car": "White"}, $$)');
            var result = expr.evaluate("Police Car");
            var expected = "White";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$lookup({"Bus": "Red", "Police Car": "White"}, $$)', function () {
        it('should return result object', function () {
            var expr = jsonata('$lookup({"Bus": "Red", "Police Car": "White"}, $$)');
            var result = expr.evaluate("Tuk tuk");
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.Product.(Price < 30 ? "Cheap"', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product.(Price < 30 ? "Cheap")');
            var result = expr.evaluate(testdata2);
            var expected = "Cheap";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.Product.(Price < 30 ? "Cheap" : "Expensive")', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product.(Price < 30 ? "Cheap" : "Expensive")');
            var result = expr.evaluate(testdata2);
            var expected = ["Expensive", "Cheap", "Expensive", "Expensive"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.Product.(Price < 30 ? "Cheap" : Price < 100 ? "Expensive" : "Rip off")', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product.(Price < 30 ? "Cheap" : Price < 100 ? "Expensive" : "Rip off")');
            var result = expr.evaluate(testdata2);
            var expected = ["Expensive", "Cheap", "Expensive", "Rip off"];
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - Lambda functions', function () {
    describe('function($x){$x*$x}(5)', function () {
        it('should return result object', function () {
            var expr = jsonata('function($x){$x*$x}(5)');
            var result = expr.evaluate(null);
            var expected = 25;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('function($x){$x>5 ? "foo"}(6)', function () {
        it('should return result object', function () {
            var expr = jsonata('function($x){$x>5 ? "foo"}(6)');
            var result = expr.evaluate(null);
            var expected = 'foo';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('function($x){$x>5 ? "foo"}(3)', function () {
        it('should return result object', function () {
            var expr = jsonata('function($x){$x>5 ? "foo"}(3)');
            var result = expr.evaluate(null);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('($factorial:= function($x){$x <= 1 ? 1 : $x * $factorial($x-1)}; $factorial(4))', function () {
        it('should return result object', function () {
            var expr = jsonata('($factorial:= function($x){$x <= 1 ? 1 : $x * $factorial($x-1)}; $factorial(4))');
            var result = expr.evaluate(null);
            var expected = 24;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('($fibonacci := function($x){$x <= 1 ? $x : $fibonacci($x-1) + $fibonacci($x-2)}; [1,2,3,4,5,6,7,8,9].$fibonacci($))', function () {
        it('should return result object', function () {
            var expr = jsonata('($fibonacci := function($x){$x <= 1 ? $x : $fibonacci($x-1) + $fibonacci($x-2)}; [1,2,3,4,5,6,7,8,9].$fibonacci($))');
            var result = expr.evaluate(null);
            var expected = [1, 1, 2, 3, 5, 8, 13, 21, 34];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('($nth_price := function($n) { (Account.Order.Product.Price)[$n] }; $nth_price(1) )', function () {
        it('should return result object', function () {
            var expr = jsonata('($nth_price := function($n) { (Account.Order.Product.Price)[$n] }; $nth_price(1) )');
            var result = expr.evaluate(testdata2);
            var expected = 21.67;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('mutually recursive - odd/even', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '            (' +
              '              $even := function($n) { $n = 0 ? true : $odd($n-1) };' +
              '              $odd := function($n) { $n = 0 ? false : $even($n-1) };' +
              '              $even(82)' +
              '            )');
            var result = expr.evaluate();
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('mutually recursive - odd/even', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '            (' +
              '              $even := function($n) { $n = 0 ? true : $odd($n-1) }; ' +
              '              $odd := function($n) { $n = 0 ? false : $even($n-1) }; ' +
              '              $even(65) )');
            var result = expr.evaluate();
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('mutually recursive - odd/even', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '        (' +
                '          $even := function($n) { $n = 0 ? true : $odd($n-1) }; ' +
                '          $odd := function($n) { $n = 0 ? false : $even($n-1) }; ' +
                '          $odd(65) ' +
                '        )' );
            var result = expr.evaluate();
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('recursive - gcd', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '(' +
              '  $gcd := λ($a, $b){$b = 0 ? $a : $gcd($b, $a%$b) };' +
              '  [$gcd(8,12), $gcd(9,12)]' +
              ')' );
            var result = expr.evaluate();
            var expected = [4,3];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('range', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '(' +
                '  $range := function($start, $end, $step) { (' +
                '    $step:=($step?$step:1);' +
                '    $start+$step > $end ? $start : $append($start, $range($start+$step, $end, $step)) ' +
                '  )};' +
                '  $range(0,15)' +
                ')' +
                '        '
            );
            var result = expr.evaluate();
            var expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('range', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '(' +
                '  $range := function($start, $end, $step) { (' +
                '      $step:=($step?$step:1);  ' +
                '      $start+$step > $end ? $start : $append($start, $range($start+$step, $end, $step)) ' +
                '  )};' +
                '  $range(0,15,2)' +
                ')' +
                '        '
            );
            var result = expr.evaluate();
            var expected = [0, 2, 4, 6, 8, 10, 12, 14];
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - Tail recursion', function () {
    describe('empty function body', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '            (' +
              '              $f := function($n){()};' +
              '              $f(1)' +
              '            ) ' );
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('factorial non-tail call', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '(' +
              '  $factorial := function($n){$n = 0 ? 1 : $n * $factorial($n - 1)};' +
              '  $factorial(99)' +
              ')             ');
            timeboxExpression(expr, 1000, 302);
            var result = expr.evaluate();
            var expected = 9.33262154439441e+155;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('factorial non-tail - stack overflow', function () {
        it('should return result object', function () {
            expect(function () {
                var expr = jsonata(
                    '(' +
                  '  $factorial := function($n){$n = 0 ? 1 : $n * $factorial($n - 1)};' +
                  '  $factorial(100)' +
                  ')             ');
                timeboxExpression(expr, 1000, 302);
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 81, code: 'U1001'});
        });
    });

    describe('factorial tail recursive', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '(' +
              '  $factorial := function($n){(' +
              '    $iter := function($n, $acc) {' +
              '      $n = 0 ? $acc : $iter($n - 1, $n * $acc)' +
              '    };' +
              '    $iter($n, 1)' +
              '  )};' +
              '  $factorial(5)' +
              ') ' +
              '');
            var result = expr.evaluate();
            var expected = 120;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('factorial tail recursive', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '(' +
              '  $factorial := function($n){(' +
              '    $iter := function($n, $acc) {' +
              '      $n = 0 ? $acc : $iter($n - 1, $n * $acc)' +
              '    };' +
              '    $iter($n, 1)' +
              '  )};' +
              '  $factorial(150)' +
              ') ' +
              '');
            var result = expr.evaluate();
            var expected = 5.7133839564458575e+262;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('stack overflow - infinite recursive function - non-tail call', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata(
                    '(' +
                  '  $inf := function($n){$n+$inf($n-1)};' +
                  '  $inf(5)' +
                  ')' );
                timeboxExpression(expr, 1000, 300);
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 46, code: 'U1001'});
        });
    });

    describe('stack overflow - infinite recursive function - tail call', function () {
        this.timeout(5000);
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata(
                    '(' +
                  '  $inf := function(){$inf()};' +
                  '  $inf()' +
                  ')' );
                timeboxExpression(expr, 1000, 500);
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 37, code: 'U1001'});
        });
    });

    describe('mutually recursive - odd/even, tail calls', function () {
        this.timeout(10000);
        it('should return result object', function () {
            var expr = jsonata(
                '        (' +
                '          $even := function($n) { $n = 0 ? true : $odd($n-1) }; ' +
                '          $odd := function($n) { $n = 0 ? false : $even($n-1) }; ' +
                '          $odd(6555) ' +
                '        )' );
            timeboxExpression(expr, 9000, 500);
            var result = expr.evaluate();
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - Higher order functions', function () {
    describe('($twice:=function($f){function($x){$f($f($x))}}; $add3:=function($y){$y+3}; $add6:=$twice($add3); $add6(7))', function () {
        it('should return result object', function () {
            var expr = jsonata('($twice:=function($f){function($x){$f($f($x))}}; $add3:=function($y){$y+3}; $add6:=$twice($add3); $add6(7))');
            var result = expr.evaluate(null);
            var expected = 13;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Y-combinator: factorial(6)', function () {
        it('should return result object', function () {
            var expr = jsonata('λ($f) { λ($x) { $x($x) }( λ($g) { $f( (λ($a) {$g($g)($a)}))})}(λ($f) { λ($n) { $n < 2 ? 1 : $n * $f($n - 1) } })(6)');
            var result = expr.evaluate(null);
            var expected = 720;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Y-combinator: fibonacci(6)', function () {
        it('should return result object', function () {
            var expr = jsonata('λ($f) { λ($x) { $x($x) }( λ($g) { $f( (λ($a) {$g($g)($a)}))})}(λ($f) { λ($n) { $n <= 1 ? $n : $f($n-1) + $f($n-2) } })(6) ');
            var result = expr.evaluate(null);
            var expected = 8;
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - Block expressions', function () {
    describe('()', function () {
        it('should return result object', function () {
            var expr = jsonata('()');
            var result = expr.evaluate(null);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('(1; 2; 3)', function () {
        it('should return result object', function () {
            var expr = jsonata('(1; 2; 3)');
            var result = expr.evaluate(null);
            var expected = 3;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('(1; 2; 3;)', function () {
        it('should return result object', function () {
            var expr = jsonata('(1; 2; 3;)');
            var result = expr.evaluate(null);
            var expected = 3;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('($a:=1; $b:=2; $c:=($a:=4; $a+$b); $a+$c)', function () {
        it('should return result object', function () {
            var expr = jsonata('($a:=1; $b:=2; $c:=($a:=4; $a+$b); $a+$c)');
            var result = expr.evaluate(null);
            var expected = 7;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.Product.($var1 := Price ; $var2:=Quantity; $var1 * $var2)', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product.($var1 := Price ; $var2:=Quantity; $var1 * $var2)');
            var result = expr.evaluate(testdata2);
            var expected = [68.9, 21.67, 137.8, 107.99];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Function returning object', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '(' +
              '  $func := function($arg) {$arg.Account.Order[0].OrderID};' +
              '  $func($)' +
              ')');
            var result = expr.evaluate(testdata2);
            var expected = 'order103';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Function returning object', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '(' +
              '  $func := function($arg) {$arg.Account.Order[0]};' +
              '  $func($).OrderID' +
              ')' );
            var result = expr.evaluate(testdata2);
            var expected = 'order103';
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - Closures', function () {
    describe('Close input data', function () {
        it('should return result object', function () {
            var expr = jsonata(
                'Account.(' +
                '  $AccName := function() { $."Account Name" };' +
                '  Order[OrderID = "order104"].Product{' +
                '    "Account": $AccName(),' +
                '    "SKU-" & $string(ProductID): $."Product Name"' +
                '  } ' +
                ')' +
                ''
            );
            var result = expr.evaluate(testdata2);
            var expected = {
                "Account": "Firefly",
                "SKU-858383": "Bowler Hat",
                "SKU-345664": "Cloak"
            };
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Close input data - backticks', function () {
        it('should return result object', function () {
            var expr = jsonata(
                'Account.(' +
                '  $AccName := function() { `Account Name` };' +
                '  Order[OrderID = "order104"].Product{' +
                '    "Account": $AccName(),' +
                '    "SKU-" & $string(ProductID): `Product Name`' +
                '  } ' +
                ')' +
                ''
            );
            var result = expr.evaluate(testdata2);
            var expected = {
                "Account": "Firefly",
                "SKU-858383": "Bowler Hat",
                "SKU-345664": "Cloak"
            };
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Evaluator - Partial function application', function () {
    describe('Single arg PFA - currying', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '(' +
                '  $add := function($x, $y){$x+$y};' +
                '  $add2 := $add(?, 2);' +
                '  $add2(3)' +
                ')' +
                ''
            );
            var result = expr.evaluate(testdata2);
            var expected = 5;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Single arg PFA - currying', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '(' +
                '  $add := function($x, $y){$x+$y};' +
                '  $add2 := $add(2, ?);' +
                '  $add2(4)' +
                ')' +
                ''
            );
            var result = expr.evaluate(testdata2);
            var expected = 6;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('PFA - native functions', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '(' +
                '  $firstn := $substring(?, 0, ?);' +
                '  $first5 := $firstn(?, 5);' +
                '  $first5("Hello World")' +
                ')'
            );
            var result = expr.evaluate(testdata2);
            var expected = 'Hello';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('PFA - on a non-function', function () {
        it('should throw error', function () {
            var expr = jsonata('substring(?, 0, ?)');
            expect(function () {
                expr.evaluate(expr);
            }).to.throw()
                .to.deep.contain({position: 10, code: 'T1007', token: 'substring'});
        });
    });

    describe('PFA - on a non-function', function () {
        it('should throw error', function () {
            var expr = jsonata('unknown(?)');
            expect(function () {
                expr.evaluate(expr);
            }).to.throw()
                .to.deep.contain({position: 8, code: 'T1008', token: 'unknown'});
        });
    });

    describe('Partially apply user-defined Javascript function', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '(' +
              '  $firstn := $substr(?, 0, ?);' +
              '  $first5 := $firstn(?, 5);' +
              '  $first5("Hello World")' +
              ')'
            );
            expr.assign('substr', function(str, start, len) {
                return str.substr(start, len);
            });
            var result = expr.evaluate(testdata2);
            var expected = 'Hello';
            expect(result).to.deep.equal(expected);
        });
    });


});


describe('HOF - map', function () {
    describe('square all numbers in an array', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '(' +
              '  $data := {' +
              '    "one": [1,2,3,4,5],' +
              '    "two": [5,4,3,2,1]' +
              '  };' +
              '  $add := function($x){$x*$x};' +
              '  $map($data.one, $add) ' +
              ')  ');
            var result = expr.evaluate(null);
            var expected = [1, 4, 9, 16, 25];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('map with only function arg', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '(' +
              '  $data := {' +
              '    "one": [1,2,3,4,5],' +
              '    "two": [5,4,3,2,1]' +
              '  };' +
              '  $add := function($x){$x*$x};' +
              '  $map($add) ' +
              ')  ');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 99, code: 'T0410', token: 'map', index: 2});
        });
    });

    describe('map string function', function () {
        it('should return result object', function () {
            var expr = jsonata('$map([1,2,3], $string)');
            var result = expr.evaluate(null);
            var expected = ['1','2','3'];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('map a function with index parameter', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product ~> $map(λ($prod, $index) { $index+1 & ": " & $prod."Product Name" })');
            var result = expr.evaluate(testdata2);
            var expected = [
                "1: Bowler Hat",
                "2: Trilby hat",
                "3: Bowler Hat",
                "4: Cloak"
            ];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('map a function with index and array parameters', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product ~> $map(λ($prod, $index, $arr) { $index+1 & "/" & $count($arr) & ": " & $prod."Product Name" })');
            var result = expr.evaluate(testdata2);
            var expected = [
                "1/4: Bowler Hat",
                "2/4: Trilby hat",
                "3/4: Bowler Hat",
                "4/4: Cloak"
            ];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('map a user-defined Javascript function', function () {
        it('should return result object', function () {
            var expr = jsonata('$map([1,4,9,16], $squareroot)');
            expr.assign('squareroot', function(num) {
                return Math.sqrt(num);
            });
            var result = expr.evaluate(testdata2);
            var expected = [1,2,3,4];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('map a user-defined Javascript function with signature', function () {
        it('should return result object', function () {
            var expr = jsonata('$map([1,4,9,16], $squareroot)');
            expr.registerFunction('squareroot', function(num) {
                return Math.sqrt(num);
            }, '<n:n>');
            var result = expr.evaluate(testdata2);
            var expected = [1,2,3,4];
            expect(result).to.deep.equal(expected);
        });
    });
    describe('map a user-defined Javascript function with undefined signature', function () {
        it('should return result object', function () {
            var expr = jsonata('$map([1,4,9,16], $squareroot)');
            expr.registerFunction('squareroot', function(num) {
                return Math.sqrt(num);
            });
            var result = expr.evaluate(testdata2);
            var expected = [1,2,3,4];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('map function with predicate - remove undefined', function () {
        it('should return result object', function () {
            var expr = jsonata('$map(Phone, function($v, $i) {$i[$v.type="office"]})');
            var result = expr.evaluate(testdata4);
            var expected = [1,2];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('map function with condition - remove undefined', function () {
        it('should return result object', function () {
            var expr = jsonata('$map(Phone, function($v, $i) {$v.type="office" ? $i})');
            var result = expr.evaluate(testdata4);
            var expected = [1,2];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('map function with condition', function () {
        it('should return result object', function () {
            var expr = jsonata('$map(Phone, function($v, $i) {$v.type="office" ? $i: null})');
            var result = expr.evaluate(testdata4);
            var expected = [null, 1, 2, null];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('map function with undefined input', function () {
        it('should return result object', function () {
            var expr = jsonata('$map(Phone, function($v, $i) {$v.type="office" ? $i: null})');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('HOF - filter', function () {
    describe('find most expensive book', function () {
        it('should return result object', function () {
            var expr = jsonata('(library.books~>$filter(λ($v, $i, $a) {$v.price = $max($a.price)})).isbn');
            var result = expr.evaluate(testdata5);
            var expected = "9780262510875";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('filter nothing', function () {
        it('should return result object', function () {
            var expr = jsonata('nothing~>$filter(λ($v, $i, $a) {$v.price = $max($a.price)})');
            var result = expr.evaluate(testdata5);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('HOF - zip/map', function () {
    describe('zip combining two arrays', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '(' +
              '  $data := {' +
              '    "one": [1,2,3,4,5],' +
              '    "two": [5,4,3,2,1]' +
              '  };' +
              '  $map($zip($data.one, $data.two), $sum)' +
              ') ');
            var result = expr.evaluate(null);
            var expected = [6, 6, 6, 6, 6];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('zip combining two arrays', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '(' +
              '  $data := {' +
              '    "one": [1,2,3,4,5],' +
              '    "two": [5,4,3,2,1]' +
              '  };' +
              '  $data.$zip(one, two) ~> $map($sum)' +
              ') ');
            var result = expr.evaluate(null);
            var expected = [6, 6, 6, 6, 6];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('zip combining two arrays', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '(' +
              '  $data := {' +
              '    "one": [1],' +
              '    "two": [5]' +
              '  };' +
              '  $data[].$zip(one, two) ~> $map($sum)' +
              ') ');
            var result = expr.evaluate(null);
            var expected = 6;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('zip combining two arrays', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '(' +
              '  $data := {' +
              '    "one": 1,' +
              '    "two": 5' +
              '  };' +
              '  $data[].$zip(one, two) ~> $map($sum)' +
              ') ');
            var result = expr.evaluate(null);
            var expected = 6;
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('HOF - reduce', function () {
    describe('sum numbers in an array', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '(' +
              '  $seq := [1,2,3,4,5];' +
              '  $reduce($seq, function($x, $y){$x+$y})' +
              ') ');
            var result = expr.evaluate(null);
            var expected = 15;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('join numbers in an array as a string', function () {
        it('should return result object', function () {
            var expr = jsonata("" +
              "(" +
              "  $concat := function($s){function($a, $b){$string($a) & $s & $string($b)}};" +
              "  $comma_join := $concat(' ... ');" +
              "  $reduce([1,2,3,4,5], $comma_join)" +
              ")" +
              "      ");
            var result = expr.evaluate(null);
            var expected = "1 ... 2 ... 3 ... 4 ... 5";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('sum numbers in an array, with init', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '(' +
              '  $seq := [1,2,3,4,5];' +
              '  $reduce($seq, function($x, $y){$x+$y}, 2)' +
              ')' );
            var result = expr.evaluate(null);
            var expected = 17;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('sum numbers in an array, with init', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '(' +
              '  $seq := 1;' +
              '  $reduce($seq, function($x, $y){$x+$y})' +
              ')' );
            var result = expr.evaluate(null);
            var expected = 1;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('sum numbers in an array - singleton', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '(' +
              '  $seq := 1;' +
              '  $reduce($seq, function($x, $y){$x+$y})' +
              ')' );
            var result = expr.evaluate(null);
            var expected = 1;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('reduce with built-in function', function () {
        it('should return result object', function () {
            var expr = jsonata('$reduce(Account.Order.Product.Quantity, $append)');
            var result = expr.evaluate(testdata2);
            var expected = [2, 1, 4, 1];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('reduce with undefined input', function () {
        it('should return result object', function () {
            var expr = jsonata('$reduce(Account.Order.Product.Quantity, $append)');
            var result = expr.evaluate(testdata4);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('power function using reduce', function () {
        it('should return result object', function () {
            var expr = jsonata('($product := function($a, $b) { $a * $b };' +
              '$power := function($x, $n) { $n = 0 ? 1 : $reduce([1..$n].($x), $product) };' +
              '[0..5].$power(2, $)' +
              ')');
            var result = expr.evaluate();
            var expected = [1, 2, 4, 8, 16, 32];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('reduce function with one argument', function () {
        it('should throw error', function () {
            var expr = jsonata(
                '(' +
              '  $seq := 1;' +
              '  $reduce($seq, function($x){$x})' +
              ')' );
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 23, code: 'D3050', index: 1});
        });
    });

});

describe('Regex', function () {
    describe('Construction', function () {
        describe('/ab/ ("ab")', function () {
            it('should return result object', function () {
                var expr = jsonata('/ab/ ("ab")');
                var result = expr.evaluate();
                var expected = {"match": "ab", "start": 0, "end": 2, "groups": []};
                expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
            });
        });

        describe('/ab/ ()', function () {
            it('should return result object', function () {
                var expr = jsonata('/ab/ ()');
                var result = expr.evaluate();
                var expected = undefined;
                expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
            });
        });

        describe('/ab+/ ("ababbabbcc")', function () {
            it('should return result object', function () {
                var expr = jsonata('/ab+/ ("ababbabbcc")');
                var result = expr.evaluate();
                var expected = {"match": "ab", "start": 0, "end": 2, "groups": []};
                expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
            });
        });

        describe('/a(b+)/ ("ababbabbcc")', function () {
            it('should return result object', function () {
                var expr = jsonata('/a(b+)/ ("ababbabbcc")');
                var result = expr.evaluate();
                var expected = {"match": "ab", "start": 0, "end": 2, "groups": ["b"]};
                expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
            });
        });

        describe('/a(b+)/ ("ababbabbcc").next()', function () {
            it('should return result object', function () {
                var expr = jsonata('/a(b+)/ ("ababbabbcc").next()');
                var result = expr.evaluate();
                var expected = {"match": "abb", "start": 2, "end": 5, "groups": ["bb"]};
                expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
            });
        });

        describe('/a(b+)/ ("ababbabbcc").next().next()', function () {
            it('should return result object', function () {
                var expr = jsonata('/a(b+)/ ("ababbabbcc").next().next()');
                var result = expr.evaluate();
                var expected = {"match": "abb", "start": 5, "end": 8, "groups": ["bb"]};
                expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
            });
        });

        describe('/a(b+)/ ("ababbabbcc").next().next().next()', function () {
            it('should return result object', function () {
                var expr = jsonata('/a(b+)/ ("ababbabbcc").next().next().next()');
                var result = expr.evaluate();
                var expected = undefined;
                expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
            });
        });

        describe('/a(b+)/i ("Ababbabbcc")', function () {
            it('should return result object', function () {
                var expr = jsonata('/a(b+)/i ("Ababbabbcc")');
                var result = expr.evaluate();
                var expected = {"match": "Ab", "start": 0, "end": 2, "groups": ["b"]};
                expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
            });
        });

        describe('empty regex', function () {
            it('should throw error', function () {
                expect(function () {
                    var expr = jsonata('//');
                    expr.evaluate();
                }).to.throw()
                    .to.deep.contain({position: 1, code: 'S0301'});
            });
        });

        describe('empty regex', function () {
            it('should throw error', function () {
                expect(function () {
                    var expr = jsonata('/');
                    expr.evaluate();
                }).to.throw()
                    .to.deep.contain({position: 1, code: 'S0302'});
            });
        });

    });

    describe('Functions - $match', function () {
        describe('$match("ababbabbcc",/ab/)', function () {
            it('should return result object', function () {
                var expr = jsonata('$match("ababbabbcc",/ab/)');
                var result = expr.evaluate();
                var expected = [{"match": "ab", "index": 0, "groups": []}, {
                    "match": "ab",
                    "index": 2,
                    "groups": []
                }, {"match": "ab", "index": 5, "groups": []}];
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$match("ababbabbcc",/a(b+)/)', function () {
            it('should return result object', function () {
                var expr = jsonata('$match("ababbabbcc",/a(b+)/)');
                var result = expr.evaluate();
                var expected = [{"match": "ab", "index": 0, "groups": ["b"]}, {
                    "match": "abb",
                    "index": 2,
                    "groups": ["bb"]
                }, {"match": "abb", "index": 5, "groups": ["bb"]}];
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$match("ababbabbcc",/a(b+)/, 1)', function () {
            it('should return result object', function () {
                var expr = jsonata('$match("ababbabbcc",/a(b+)/, 1)');
                var result = expr.evaluate();
                var expected = {"match": "ab", "index": 0, "groups": ["b"]};
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$match("ababbabbcc",/a(b+)/, 0)', function () {
            it('should return result object', function () {
                var expr = jsonata('$match("ababbabbcc",/a(b+)/, 0)');
                var result = expr.evaluate();
                var expected = undefined;
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$match(nothing,/a(xb+)/)', function () {
            it('should return result object', function () {
                var expr = jsonata('$match(nothing,/a(xb+)/)');
                var result = expr.evaluate();
                var expected = undefined;
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$match("ababbabbcc",/a(xb+)/)', function () {
            it('should return result object', function () {
                var expr = jsonata('$match("ababbabbcc",/a(xb+)/)');
                var result = expr.evaluate();
                var expected = undefined;
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$match("a, b, c, d", /ab/, -3)', function () {
            it('should throw error', function () {
                var expr = jsonata('$match("a, b, c, d", /ab/, -3)');
                expect(function () {
                    expr.evaluate();
                }).to.throw()
                    .to.deep.contain({position: 7, code: 'D3040', token: 'match', index: 3, value: -3});
            });
        });

        describe('$match("a, b, c, d", /ab/, null)', function () {
            it('should throw error', function () {
                var expr = jsonata('$match("a, b, c, d", /ab/, null)');
                expect(function () {
                    expr.evaluate();
                }).to.throw()
                    .to.deep.contain({position: 7, code: 'T0410', token: 'match', index: 3, value: null});
            });
        });

        describe('$match("a, b, c, d", /ab/, "2")', function () {
            it('should throw error', function () {
                var expr = jsonata('$match("a, b, c, d", /ab/, "2")');
                expect(function () {
                    expr.evaluate();
                }).to.throw()
                    .to.deep.contain({position: 7, code: 'T0410', token: 'match', index: 3, value: "2"});
            });
        });

        describe('$match("a, b, c, d", "ab")', function () {
            it('should throw error', function () {
                var expr = jsonata('$match("a, b, c, d", "ab")');
                expect(function () {
                    expr.evaluate();
                }).to.throw()
                    .to.deep.contain({position: 7, code: 'T0410', token: 'match', index: 2, value: "ab"});
            });
        });

        describe('$match("a, b, c, d", true)', function () {
            it('should throw error', function () {
                var expr = jsonata('$match("a, b, c, d", true)');
                expect(function () {
                    expr.evaluate();
                }).to.throw()
                    .to.deep.contain({position: 7, code: 'T0410', token: 'match', index: 2, value: true});
            });
        });

        describe('$match(12345, 3)', function () {
            it('should throw error', function () {
                var expr = jsonata('$match(12345, 3)');
                expect(function () {
                    expr.evaluate();
                }).to.throw()
                    .to.deep.contain({position: 7, code: 'T0410', token: 'match', index: 1, value: 12345});
            });
        });

        describe('$match(12345)', function () {
            it('should throw error', function () {
                var expr = jsonata('$match(12345)');
                expect(function () {
                    expr.evaluate();
                }).to.throw()
                    .to.deep.contain({position: 7, code: 'T0410', token: 'match', index: 1 });
            });
        });
    });

    describe('Functions - $split', function () {
        describe('$split("ababbxabbcc",/b+/)', function () {
            it('should return result object', function () {
                var expr = jsonata('$split("ababbxabbcc",/b+/)');
                var result = expr.evaluate();
                var expected = ["a", "a", "xa", "cc"];
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$split("ababbxabbcc",/b+/, 2)', function () {
            it('should return result object', function () {
                var expr = jsonata('$split("ababbxabbcc",/b+/, 2)');
                var result = expr.evaluate();
                var expected = ["a", "a"];
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$split("ababbxabbcc",/d+/)', function () {
            it('should return result object', function () {
                var expr = jsonata('$split("ababbxabbcc",/d+/)');
                var result = expr.evaluate();
                var expected = ["ababbxabbcc"];
                expect(result).to.deep.equal(expected);
            });
        });

    });

    describe('Functions - $contains', function () {
        describe('$contains("ababbxabbcc",/ab+/)', function () {
            it('should return result object', function () {
                var expr = jsonata('$contains("ababbxabbcc",/ab+/)');
                var result = expr.evaluate();
                var expected = true;
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$contains("ababbxabbcc",/ax+/)', function () {
            it('should return result object', function () {
                var expr = jsonata('$contains("ababbxabbcc",/ax+/)');
                var result = expr.evaluate();
                var expected = false;
                expect(result).to.deep.equal(expected);
            });
        });

        describe('Account.Order.Product[$contains($."Product Name", /hat/)].ProductID', function () {
            it('should return result object', function () {
                var expr = jsonata('Account.Order.Product[$contains($."Product Name", /hat/)].ProductID');
                var result = expr.evaluate(testdata2);
                var expected = 858236;
                expect(result).to.deep.equal(expected);
            });
        });

        describe('Account.Order.Product[$contains($."Product Name", /hat/i)].ProductID', function () {
            it('should return result object', function () {
                var expr = jsonata('Account.Order.Product[$contains($."Product Name", /hat/i)].ProductID');
                var result = expr.evaluate(testdata2);
                var expected = [858383, 858236, 858383];
                expect(result).to.deep.equal(expected);
            });
        });

    });

    describe('Functions - $replace', function () {
        describe('$replace("ababbxabbcc",/b+/, "yy")', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("ababbxabbcc",/b+/, "yy")');
                var result = expr.evaluate();
                var expected = "ayyayyxayycc";
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$replace("ababbxabbcc",/b+/, "yy", 2)', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("ababbxabbcc",/b+/, "yy", 2)');
                var result = expr.evaluate();
                var expected = "ayyayyxabbcc";
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$replace("ababbxabbcc",/b+/, "yy", 0)', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("ababbxabbcc",/b+/, "yy", 0)');
                var result = expr.evaluate();
                var expected = "ababbxabbcc";
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$replace("ababbxabbcc",/d+/, "yy")', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("ababbxabbcc",/d+/, "yy")');
                var result = expr.evaluate();
                var expected = "ababbxabbcc";
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$replace("John Smith", /(\\w+)\\s(\\w+)/, "$2, $1")', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("John Smith", /(\\w+)\\s(\\w+)/, "$2, $1")');
                var result = expr.evaluate();
                var expected = "Smith, John";
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$replace("265USD", /([0-9]+)USD/, "$$$1")', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("265USD", /([0-9]+)USD/, "$$$1")');
                var result = expr.evaluate();
                var expected = "$265";
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$replace("265USD", /([0-9]+)USD/, "$w")', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("265USD", /([0-9]+)USD/, "$w")');
                var result = expr.evaluate();
                var expected = "$w";
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$replace("265USD", /([0-9]+)USD/, "$0 -> $$$1")', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("265USD", /([0-9]+)USD/, "$0 -> $$$1")');
                var result = expr.evaluate();
                var expected = "265USD -> $265";
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$replace("265USD", /([0-9]+)USD/, "$0$1$2")', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("265USD", /([0-9]+)USD/, "$0$1$2")');
                var result = expr.evaluate();
                var expected = "265USD265";
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$replace("abcd", /(ab)|(a)/, "[1=$1][2=$2]")', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("abcd", /(ab)|(a)/, "[1=$1][2=$2]")');
                var result = expr.evaluate();
                var expected = "[1=ab][2=]cd";
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$replace("abracadabra", /bra/, "*")', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("abracadabra", /bra/, "*")');
                var result = expr.evaluate();
                var expected = "a*cada*";
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$replace("abracadabra", /a.*a/, "*")', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("abracadabra", /a.*a/, "*")');
                var result = expr.evaluate();
                var expected = "*";
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$replace("abracadabra", /a.*?a/, "*")', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("abracadabra", /a.*?a/, "*")');
                var result = expr.evaluate();
                var expected = "*c*bra";
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$replace("abracadabra", /a/, "")', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("abracadabra", /a/, "")');
                var result = expr.evaluate();
                var expected = "brcdbr";
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$replace("abracadabra", /a(.)/, "a$1$1")', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("abracadabra", /a(.)/, "a$1$1")');
                var result = expr.evaluate();
                var expected = "abbraccaddabbra";
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$replace("abracadabra", /.*?/, "$1")', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("abracadabra", /.*?/, "$1")');
                expect(function () {
                    expr.evaluate();
                }).to.throw()
                    .to.deep.contain({position: 9, code: 'D1004', token: "replace", value: ".*?"});
            });
        });

        describe('$replace("AAAA", /A+/, "b")', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("AAAA", /A+/, "b")');
                var result = expr.evaluate();
                var expected = "b";
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$replace("AAAA", /A+?/, "b")', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("AAAA", /A+?/, "b")');
                var result = expr.evaluate();
                var expected = "bbbb";
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$replace("darted", /^(.*?)d(.*)$/, "$1c$2")', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("darted", /^(.*?)d(.*)$/, "$1c$2")');
                var result = expr.evaluate();
                var expected = "carted";
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$replace("abcdefghijklmno", /(a)(b)(c)(d)(e)(f)(g)(h)(i)(j)(k)(l)(m)/, "$8$5$12$12$18$123")', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("abcdefghijklmno", /(a)(b)(c)(d)(e)(f)(g)(h)(i)(j)(k)(l)(m)/, "$8$5$12$12$18$123")');
                var result = expr.evaluate();
                var expected = "hella8l3no";
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$replace("abcdefghijklmno", /xyz/, "$8$5$12$12$18$123")', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("abcdefghijklmno", /xyz/, "$8$5$12$12$18$123")');
                var result = expr.evaluate();
                var expected = "abcdefghijklmno";
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$replace("abcdefghijklmno", /ijk/, "$8$5$12$12$18$123")', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("abcdefghijklmno", /ijk/, "$8$5$12$12$18$123")');
                var result = expr.evaluate();
                var expected = "abcdefgh22823lmno";
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$replace("abcdefghijklmno", /(ijk)/, "$8$5$12$12$18$123")', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("abcdefghijklmno", /(ijk)/, "$8$5$12$12$18$123")');
                var result = expr.evaluate();
                var expected = "abcdefghijk2ijk2ijk8ijk23lmno";
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$replace("abcdefghijklmno", /ijk/, "$x")', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("abcdefghijklmno", /ijk/, "$x")');
                var result = expr.evaluate();
                var expected = "abcdefgh$xlmno";
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$replace("abcdefghijklmno", /(ijk)/, "$x$")', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("abcdefghijklmno", /(ijk)/, "$x$")');
                var result = expr.evaluate();
                var expected = "abcdefgh$x$lmno";
                expect(result).to.deep.equal(expected);
            });
        });

        describe('Account.Order.Product.$replace($."Product Name", /hat/i, function($match) { "foo" })', function () {
            it('should return result object', function () {
                var expr = jsonata('Account.Order.Product.$replace($."Product Name", /hat/i, function($match) { "foo" })');
                var result = expr.evaluate(testdata2);
                var expected = ["Bowler foo", "Trilby foo", "Bowler foo", "Cloak"];
                expect(result).to.deep.equal(expected);
            });
        });

        describe('Account.Order.Product.$replace($."Product Name", /(h)(at)/i, function($match) { $uppercase($match.match) })', function () {
            it('should return result object', function () {
                var expr = jsonata('Account.Order.Product.$replace($."Product Name", /(h)(at)/i, function($match) { $uppercase($match.match) })');
                var result = expr.evaluate(testdata2);
                var expected = ["Bowler HAT", "Trilby HAT", "Bowler HAT", "Cloak"];
                expect(result).to.deep.equal(expected);
            });
        });

        describe('$replace("temperature = 68F today", /(-?\\d+(?:\\.\\d*)?)F\\b/, function($m) { ($number($m.groups[0]) - 32) * 5/9 & "C" })', function () {
            it('should return result object', function () {
                var expr = jsonata('$replace("temperature = 68F today", /(-?\\d+(?:\\.\\d*)?)F\\b/, function($m) { ($number($m.groups[0]) - 32) * 5/9 & "C" })');
                var result = expr.evaluate();
                var expected = "temperature = 20C today";
                expect(result).to.deep.equal(expected);
            });
        });

        describe('Account.Order.Product.$replace($."Product Name", /hat/i, function($match) { true })', function () {
            it('should return result object', function () {
                var expr = jsonata('Account.Order.Product.$replace($."Product Name", /hat/i, function($match) { true })');
                expect(function () {
                    expr.evaluate(testdata2);
                }).to.throw()
                    .to.deep.contain({position: 31, code: 'D3012', token: "replace", value: true});
            });
        });

        describe('Account.Order.Product.$replace($."Product Name", /hat/i, function($match) { 42 })', function () {
            it('should return result object', function () {
                var expr = jsonata('Account.Order.Product.$replace($."Product Name", /hat/i, function($match) { 42 })');
                expect(function () {
                    expr.evaluate(testdata2);
                }).to.throw()
                    .to.deep.contain({position: 31, code: 'D3012', token: "replace", value: 42});
            });
        });

    });

    describe('Functions - $base64encode', function () {
        describe('$base64encode("hello:world")', function () {
            it('should return result object', function () {
                var expr = jsonata('$base64encode("hello:world")');
                var result = expr.evaluate();
                var expected = "aGVsbG86d29ybGQ=";
                expect(result).to.deep.equal(expected);
            });
        });
        describe('$base64encode(undefined)', function () {
            it('should return result object', function () {
                var expr = jsonata('$base64encode()');
                var result = expr.evaluate();
                var expected = undefined;
                expect(result).to.deep.equal(expected);
            });
        });
    });

    describe('Functions - $base64decode', function () {
        describe('$base64decode("aGVsbG86d29ybGQ=")', function () {
            it('should return result object', function () {
                var expr = jsonata('$base64decode("aGVsbG86d29ybGQ=")');
                var result = expr.evaluate();
                var expected = "hello:world";
                expect(result).to.deep.equal(expected);
            });
        });
        describe('$base64decode(undefined)', function () {
            it('should return result object', function () {
                var expr = jsonata('$base64decode()');
                var result = expr.evaluate();
                var expected = undefined;
                expect(result).to.deep.equal(expected);
            });
        });
    });

});

describe('Evaluator - function application operator', function () {
    describe('Account.Order[0].OrderID ~> $uppercase()', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order[0].OrderID ~> $uppercase()');
            var result = expr.evaluate(testdata2);
            var expected = "ORDER103";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order[0].OrderID ~> $uppercase() ~> $lowercase()', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order[0].OrderID ~> $uppercase() ~> $lowercase()');
            var result = expr.evaluate(testdata2);
            var expected = "order103";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.OrderID ~> $join()', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.OrderID ~> $join()');
            var result = expr.evaluate(testdata2);
            var expected = "order103order104";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.OrderID ~> $join(", ")', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.OrderID ~> $join(", ")');
            var result = expr.evaluate(testdata2);
            var expected = "order103, order104";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.Product.(Price * Quantity) ~> $sum()', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product.(Price * Quantity) ~> $sum()');
            var result = expr.evaluate(testdata2);
            var expected = 336.36;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('( $uppertrim := $trim ~> $uppercase;  $uppertrim("   Hello    World   ") )', function () {
        it('should return result object', function () {
            var expr = jsonata('( $uppertrim := $trim ~> $uppercase;  $uppertrim("   Hello    World   ") )');
            var result = expr.evaluate();
            var expected = "HELLO WORLD";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('"john@example.com" ~> $substringAfter("@") ~> $substringBefore(".") ', function () {
        it('should return result object', function () {
            var expr = jsonata('"john@example.com" ~> $substringAfter("@") ~> $substringBefore(".") ');
            var result = expr.evaluate();
            var expected = "example";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('"" ~> $substringAfter("@") ~> $substringBefore(".") ', function () {
        it('should return result object', function () {
            var expr = jsonata('"" ~> $substringAfter("@") ~> $substringBefore(".") ');
            var result = expr.evaluate("test");
            var expected = "";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo ~> $substringAfter("@") ~> $substringBefore(".") ', function () {
        it('should return result object', function () {
            var expr = jsonata('foo ~> $substringAfter("@") ~> $substringBefore(".") ');
            var result = expr.evaluate("test");
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('( $domain := $substringAfter(?,"@") ~> $substringBefore(?,"."); $domain("john@example.com") )', function () {
        it('should return result object', function () {
            var expr = jsonata('( $domain := $substringAfter(?,"@") ~> $substringBefore(?,"."); $domain("john@example.com") )');
            var result = expr.evaluate();
            var expected = "example";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('( $square := function($x){$x*$x}; [1..5] ~> $map($square) ) ', function () {
        it('should return result object', function () {
            var expr = jsonata('( $square := function($x){$x*$x}; [1..5] ~> $map($square) ) ');
            var result = expr.evaluate();
            var expected = [1, 4, 9, 16, 25];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('( $square := function($x){$x*$x}; [1..5] ~> $map($square) ~> $sum() ) ', function () {
        it('should return result object', function () {
            var expr = jsonata('( $square := function($x){$x*$x}; [1..5] ~> $map($square) ~> $sum() ) ');
            var result = expr.evaluate();
            var expected = 55;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Chaining 2 partially applied functions', function () {
        it('should return result object', function () {
            var expr = jsonata('(' +
              '$betweenBackets := $substringAfter(?, "(") ~> $substringBefore(?, ")");' +
              '$betweenBackets("test(foo)bar")' +
              ') ');
            var result = expr.evaluate();
            var expected = 'foo';
            expect(result).to.deep.equal(expected);
        });
    });

    describe('op chaining - reduce array of 2 functions', function () {
        it('should return result object', function () {
            var expr = jsonata('(' +
              '$square := function($x){$x*$x};' +
              '$chain := λ($f, $g){λ($x){$g($f($x))}};' +
              '$instructions := [$sum, $square];' +
              '$sumsq := $instructions ~> $reduce($chain);' +
              '[1..5] ~> $sumsq()' +
              ') ');
            var result = expr.evaluate();
            var expected = 225;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('op chaining - reduce array of 3 functions', function () {
        it('should return result object', function () {
            var expr = jsonata('(' +
              '$square := function($x){$x*$x};' +
              '$chain := λ($f, $g){λ($x){ $x ~> $f ~> $g }};' +
              '$instructions := [$sum, $square, $string];' +
              '$sumsq := $instructions ~> $reduce($chain);' +
              '[1..5] ~> $sumsq()' +
              ') ');
            var result = expr.evaluate();
            var expected = "225";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('op chaining - square the sum', function () {
        it('should return result object', function () {
            var expr = jsonata('(' +
              '$square := function($x){$x*$x};' +
              '$instructions := $sum ~> $square;' +
              '[1..5] ~> $instructions()' +
              ')  ');
            var result = expr.evaluate();
            var expected = 225;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('op chaining - sum of squares', function () {
        it('should return result object', function () {
            var expr = jsonata('(' +
              '$square := function($x){$x*$x};' +
              '$sum_of_squares := $map(?, $square) ~> $sum;' +
              '[1..5] ~> $sum_of_squares()' +
              ')  ');
            var result = expr.evaluate();
            var expected = 55;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('op chaining - map/reduce 2', function () {
        it('should return result object', function () {
            var expr = jsonata('(' +
              '$times := λ($x, $y) { $x * $y };' +
              '$product := $reduce(?, $times);' +
              '$square := function($x){$x*$x};' +
              '$product_of_squares := $map(?, $square) ~> $product;' +
              '[1..5] ~> $product_of_squares()' +
              ')');
            var result = expr.evaluate();
            var expected = 14400;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('op chaining - map/reduce 3', function () {
        it('should return result object', function () {
            var expr = jsonata('(' +
              '$square := function($x){$x*$x};' +
              '[1..5] ~> $map($square) ~> $reduce(λ($x, $y) { $x * $y });' +
              ')');
            var result = expr.evaluate();
            var expected = 14400;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('op chaining - 3 arg map', function () {
        it('should return result object', function () {
            var expr = jsonata('(' +
              '$prices := Account.Order.Product.Price;' +
              '$quantities := Account.Order.Product.Quantity;' +
              '$product := λ($arr) { $arr[0] * $arr[1] };' +
              '$zip($prices, $quantities) ~> $map($product) ~> $sum()' +
              ')');
            var result = expr.evaluate(testdata2);
            var expected = 336.36;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('42 ~> "hello"', function () {
        it('should return result object', function () {
            var expr = jsonata('42 ~> "hello"');
            expect(function () {
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 5, code: 'T2006', value: "hello"});
        });
    });
});

describe('~> /regex/', function () {
    describe('Account.Order.Product[$."Product Name" ~> /hat/i].ProductID', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product[$."Product Name" ~> /hat/i].ProductID');
            var result = expr.evaluate(testdata2);
            var expected = [858383,858236,858383];
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Function signatures', function () {
    describe('λ($arg)<b:b>{$not($arg)}(true)', function () {
        it('should return result object', function () {
            var expr = jsonata('λ($arg)<b:b>{$not($arg)}(true)');
            var result = expr.evaluate();
            var expected = false;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('λ($arg)<b:b>{$not($arg)}(foo)', function () {
        it('should return result object', function () {
            var expr = jsonata('λ($arg)<b:b>{$not($arg)}(foo)');
            var result = expr.evaluate();
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('λ($arg)<x:b>{$not($arg)}(null)', function () {
        it('should return result object', function () {
            var expr = jsonata('λ($arg)<x:b>{$not($arg)}(null)');
            var result = expr.evaluate();
            var expected = true;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('function($x,$y)<n-n:n>{$x+$y}(2, 6)', function () {
        it('should return result object', function () {
            var expr = jsonata('function($x,$y)<n-n:n>{$x+$y}(2, 6)');
            var result = expr.evaluate();
            var expected = 8;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[1..5].function($x,$y)<n-n:n>{$x+$y}(6)', function () {
        it('should return result object', function () {
            var expr = jsonata('[1..5].function($x,$y)<n-n:n>{$x+$y}(6)');
            var result = expr.evaluate();
            var expected = [7,8,9,10,11];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[1..5].function($x,$y)<n-n:n>{$x+$y}(2, 6)', function () {
        it('should return result object', function () {
            var expr = jsonata('[1..5].function($x,$y)<n-n:n>{$x+$y}(2, 6)');
            var result = expr.evaluate();
            var expected = [8,8,8,8,8];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Age.function($x,$y)<n-n:n>{$x+$y}(6)', function () {
        it('should return result object', function () {
            var expr = jsonata('Age.function($x,$y)<n-n:n>{$x+$y}(6)');
            var result = expr.evaluate(testdata4);
            var expected = 34;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('λ($str)<s->{$uppercase($str)}("hello")', function () {
        it('should return result object', function () {
            var expr = jsonata('λ($str)<s->{$uppercase($str)}("hello")');
            var result = expr.evaluate();
            var expected = "HELLO";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.Product.Description.Colour.λ($str)<s->{$uppercase($str)}()', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product.Description.Colour.λ($str)<s->{$uppercase($str)}()');
            var result = expr.evaluate(testdata2);
            var expected = ["PURPLE", "ORANGE", "PURPLE", "BLACK"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('λ($str, $prefix)<s-s>{$prefix & $str}("World", "Hello ")', function () {
        it('should return result object', function () {
            var expr = jsonata('λ($str, $prefix)<s-s>{$prefix & $str}("World", "Hello ")');
            var result = expr.evaluate();
            var expected = "Hello World";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('FirstName.λ($str, $prefix)<s-s>{$prefix & $str}("Hello ")', function () {
        it('should return result object', function () {
            var expr = jsonata('FirstName.λ($str, $prefix)<s-s>{$prefix & $str}("Hello ")');
            var result = expr.evaluate(testdata4);
            var expected = "Hello Fred";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('λ($arr, $sep)<a<s>s?:s>{$join($arr, $sep)}("a")', function () {
        it('should return result object', function () {
            var expr = jsonata('λ($arr, $sep)<a<s>s?:s>{$join($arr, $sep)}("a")');
            var result = expr.evaluate();
            var expected = "a";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('λ($arr, $sep)<a<s>s?:s>{$join($arr, $sep)}(["a"])', function () {
        it('should return result object', function () {
            var expr = jsonata('λ($arr, $sep)<a<s>s?:s>{$join($arr, $sep)}(["a"])');
            var result = expr.evaluate(testdata4);
            var expected = "a";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('λ($arr, $sep)<a<s>s?:s>{$join($arr, $sep)}("a", "-")', function () {
        it('should return result object', function () {
            var expr = jsonata('λ($arr, $sep)<a<s>s?:s>{$join($arr, $sep)}("a", "-")');
            var result = expr.evaluate();
            var expected = "a";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('λ($arr, $sep)<a<s>s?:s>{$join($arr, $sep)}(["a"], "-")', function () {
        it('should return result object', function () {
            var expr = jsonata('λ($arr, $sep)<a<s>s?:s>{$join($arr, $sep)}(["a"], "-")');
            var result = expr.evaluate();
            var expected = "a";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('λ($arr, $sep)<a<s>s?:s>{$join($arr, $sep)}(["a", "b"], "-")', function () {
        it('should return result object', function () {
            var expr = jsonata('λ($arr, $sep)<a<s>s?:s>{$join($arr, $sep)}(["a", "b"], "-")');
            var result = expr.evaluate();
            var expected = "a-b";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('λ($arr, $sep)<as?:s>{$join($arr, $sep)}(["a", "b"], "-")', function () {
        it('should return result object', function () {
            var expr = jsonata('λ($arr, $sep)<as?:s>{$join($arr, $sep)}(["a", "b"], "-")');
            var result = expr.evaluate();
            var expected = "a-b";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('λ($arr, $sep)<a<s>s?:s>{$join($arr, $sep)}([], "-")', function () {
        it('should return result object', function () {
            var expr = jsonata('λ($arr, $sep)<a<s>s?:s>{$join($arr, $sep)}([], "-")');
            var result = expr.evaluate();
            var expected = "";
            expect(result).to.deep.equal(expected);
        });
    });

    describe('λ($arr, $sep)<a<s>s?:s>{$join($arr, $sep)}(foo, "-")', function () {
        it('should return result object', function () {
            var expr = jsonata('λ($arr, $sep)<a<s>s?:s>{$join($arr, $sep)}(foo, "-")');
            var result = expr.evaluate();
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('λ($obj)<o>{$obj}({"hello": "world"})', function () {
        it('should return result object', function () {
            var expr = jsonata('λ($obj)<o>{$obj}({"hello": "world"})');
            var result = expr.evaluate();
            var expected = {"hello": "world"};
            expect(result).to.deep.equal(expected);
        });
    });

    describe('λ($arr)<a<a<n>>>{$arr}([[1]])', function () {
        it('should return result object', function () {
            var expr = jsonata('λ($arr)<a<a<n>>>{$arr}([[1]])');
            var result = expr.evaluate();
            var expected = [[1]];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('λ($num)<(ns)-:n>{$number($num)}(5)', function () {
        it('should return result object', function () {
            var expr = jsonata('λ($num)<(ns)-:n>{$number($num)}(5)');
            var result = expr.evaluate();
            var expected = 5;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('λ($num)<(ns)-:n>{$number($num)}("5")', function () {
        it('should return result object', function () {
            var expr = jsonata('λ($num)<(ns)-:n>{$number($num)}("5")');
            var result = expr.evaluate();
            var expected = 5;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[1..5].λ($num)<(ns)-:n>{$number($num)}()', function () {
        it('should return result object', function () {
            var expr = jsonata('[1..5].λ($num)<(ns)-:n>{$number($num)}()');
            var result = expr.evaluate();
            var expected = [1,2,3,4,5];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Higher order function signature', function () {
        it('should return result object', function () {
            var expr = jsonata('(' +
              '$twice := function($f)<f:f>{function($x)<n:n>{$f($f($x))}};' +
              '$add2 := function($x)<n:n>{$x+2};' +
              '$add4 := $twice($add2);' +
              '$add4(5)' +
              ')');
            var result = expr.evaluate();
            var expected = 9;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Higher order function signature with param', function () {
        it('should return result object', function () {
            var expr = jsonata('(' +
              '$twice := function($f)<f<n:n>:f<n:n>>{function($x)<n:n>{$f($f($x))}};' +
              '$add2 := function($x)<n:n>{$x+2};' +
              '$add4 := $twice($add2);' +
              '$add4(5)' +
              ')');
            var result = expr.evaluate();
            var expected = 9;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('λ($arg)<n<n>>{$arg}(5)', function () {
        it('should throw meaningful type error', function () {
            expect(function () {
                var expr = jsonata('λ($arg)<n<n>>{$arg}(5)');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 10, code: 'S0401', value: "n"});
        });
    });

});

describe('Function signature violations', function () {
    describe('λ($arg1, $arg2)<nn:a>{[$arg1, $arg2]}(1,"2")', function () {
        it('should throw meaningful type error', function () {
            var expr = jsonata('λ($arg1, $arg2)<nn:a>{[$arg1, $arg2]}(1,"2")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 38, code: 'T0410', index: 2, value: "2"});
        });
    });

    describe('λ($arg1, $arg2)<nn:a>{[$arg1, $arg2]}(1,3,"2")', function () {
        it('should throw meaningful type error', function () {
            var expr = jsonata('λ($arg1, $arg2)<nn:a>{[$arg1, $arg2]}(1,3,"2")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 38, code: 'T0410', index: 3, value: "2"});
        });
    });

    describe('λ($arg1, $arg2)<nn+:a>{[$arg1, $arg2]}(1,3, 2,"g")', function () {
        it('should throw meaningful type error', function () {
            var expr = jsonata('λ($arg1, $arg2)<nn+:a>{[$arg1, $arg2]}(1,3, 2,"g")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 39, code: 'T0410', index: 4, value: "g"});
        });
    });

    describe('λ($arr)<a<n>>{$arr}(["3"]) ', function () {
        it('should throw meaningful type error', function () {
            var expr = jsonata('λ($arr)<a<n>>{$arr}(["3"]) ');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 20, code: 'T0412', index: 1, type: 'n'});
        });
    });

    describe('λ($arr)<a<n>>{$arr}([1, 2, "3"]) ', function () {
        it('should throw meaningful type error', function () {
            var expr = jsonata('λ($arr)<a<n>>{$arr}([1, 2, "3"]) ');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 20, code: 'T0412', index: 1, type: 'n'});
        });
    });

    describe('λ($arr)<a<n>>{$arr}("f")', function () {
        it('should throw meaningful type error', function () {
            var expr = jsonata('λ($arr)<a<n>>{$arr}("f")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 20, code: 'T0412', index: 1, type: 'n', value: "f"});
        });
    });

    describe('Error with function name', function () {
        it('should throw meaningful type error', function () {
            var expr = jsonata('(' +
              '$fun := λ($arr)<a<n>>{$arr};' +
              '$fun("f")' +
              ')');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 34, code: 'T0412', index: 1, type: 'n', value: "f", token: "fun"});
        });
    });

    describe('λ($arr)<(sa<n>)>>{$arr}([[1]])', function () {
        it('should throw meaningful type error', function () {
            expect(function () {
                var expr = jsonata('λ($arr)<(sa<n>)>>{$arr}([[1]])');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 9, code: 'S0402'});
        });
    });
});

describe('Default context arguments', function () {
    describe('$number()', function () {
        it('cast context to number', function () {
            var expr = jsonata('$number()');
            var context = "5";
            var result = expr.evaluate(context);
            expect(result).to.equal(5);
        });
    });

    describe('[1..5].$string()', function () {
        it('cast context to string', function () {
            var expr = jsonata('[1..5].$string()');
            var result = expr.evaluate();
            var expected = ['1', '2', '3', '4', '5'];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('[1..5].("Item " & $string())', function () {
        it('cast context to string', function () {
            var expr = jsonata('[1..5].("Item " & $string())');
            var result = expr.evaluate();
            var expected = ["Item 1","Item 2","Item 3","Item 4","Item 5"];
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account.Order.Product."Product Name".$uppercase().$substringBefore(" ")', function () {
        it('chain functions', function () {
            var expr = jsonata('Account.Order.Product."Product Name".$uppercase().$substringBefore(" ")');
            var result = expr.evaluate(testdata2);
            var expected = ["BOWLER", "TRILBY", "BOWLER", "CLOAK"];
            expect(result).to.deep.equal(expected);
        });
    });
});

describe('Transform', function () {
    describe('Invoice transformation', function () {
        it('should return result object', function () {
            var expr = jsonata("" +
              "{'Order': Account.Order.{" +
              "  'ID': OrderID," +
              "  'Product': Product.{" +
              "    'SKU': ProductID," +
              "    'Details': {" +
              "      'Weight': Description.Weight," +
              "      'Dimensions': Description.(Width & ' x ' & Height & ' x ' & Depth)" +
              "    }" +
              "  }," +
              "  'Total Price': $sum(Product.(Price * Quantity))" +
              "}" +
              "}" +
              "");
            var result = expr.evaluate(testdata2);
            var expected = {
                "Order": [
                    {
                        "ID": "order103",
                        "Product": [
                            {
                                "SKU": 858383,
                                "Details": {
                                    "Weight": 0.75,
                                    "Dimensions": "300 x 200 x 210"
                                }
                            },
                            {
                                "SKU": 858236,
                                "Details": {
                                    "Weight": 0.6,
                                    "Dimensions": "300 x 200 x 210"
                                }
                            }
                        ],
                        "Total Price": 90.57000000000001
                    },
                    {
                        "ID": "order104",
                        "Product": [
                            {
                                "SKU": 858383,
                                "Details": {
                                    "Weight": 0.75,
                                    "Dimensions": "300 x 200 x 210"
                                }
                            },
                            {
                                "SKU": 345664,
                                "Details": {
                                    "Weight": 2,
                                    "Dimensions": "30 x 20 x 210"
                                }
                            }
                        ],
                        "Total Price": 245.79000000000002
                    }
                ]
            };
            expect(result).to.deep.equal(expected);
        });
    });

});

describe('Event processing', function () {
    var input = {
        "state": {
            "tempReadings": [
                27.2,
                28.9,
                28,
                28.2,
                28.4
            ],
            "readingsCount": 5,
            "sumTemperatures": 140.7,
            "avgTemperature": 28.14,
            "maxTemperature": 28.9,
            "minTemperature": 27.2
        },
        "event": {
            "t": 28.4
        }
    };

    it('consume event and output aggregated sliding window', function () {
        var expression = `
        (
          $tempReadings := $count(state.tempReadings) = 5 ?
              [state.tempReadings[[1..4]], event.t] :
              [state.tempReadings, event.t];
        
          {
            "tempReadings": $tempReadings,
            "sumTemperatures": $sum($tempReadings),
            "avgTemperature": $average($tempReadings) ~> $round(2),
            "maxTemperature": $max($tempReadings),
            "minTemperature": $min($tempReadings)
          }
        )`;
        var expectedResult = {
            "tempReadings": [
                28.9,
                28,
                28.2,
                28.4,
                28.4
            ],
            "sumTemperatures": 141.9,
            "avgTemperature": 28.38,
            "maxTemperature": 28.9,
            "minTemperature": 28
        };
        expect(jsonata(expression).evaluate(input)).to.deep.equal(expectedResult);
    });
});

describe('#evaluate', function () {
    describe('evaluation of single tokens', function () {
        it('empty expression', function () {
            var expected = {output: {is: {same: {as: "input"}}}};
            expect(jsonata('$').evaluate(expected)).to.deep.equal(expected);
        });

        it('basic navigation', function () {
            var expected = {bar: 42};
            var input = {foo: expected};
            expect(jsonata('foo').evaluate(input)).to.deep.equal(expected);
        });

        it('navigation down right path', function () {
            var expected = {gar: 50};
            var input = {foo: {bar: 42}, baz: expected};
            expect(jsonata('baz').evaluate(input)).to.deep.equal(expected);
        });

        it('differentiation of case', function () {
            var expected = {mama: 45};
            var input = {foo: {lala: 42}, Foo: expected};
            expect(jsonata('Foo').evaluate(input)).to.deep.equal(expected);
        });

        it('differentiation of substrings', function () {
            var expected = {wa: 'hume'};
            var input = {foo: {food: 2}, food: expected};
            expect(jsonata('food').evaluate(input)).to.deep.equal(expected);
        });
    });

    describe('use of period operator', function () {
        it('single period', function () {
            var expected = 42;
            var input = {maz: {rar: expected}};
            expect(jsonata('maz.rar').evaluate(input)).to.deep.equal(expected);
        });

        it('two periods', function () {
            var expected = {bar: 87};
            var input = {moo: 4, jee: {par: {waa: expected}}};
            expect(jsonata('jee.par.waa').evaluate(input)).to.deep.equal(expected);
        });
    });

    describe('inability to find data', function () {
        it('key does not exist', function () {
            var input = {stuff: 4};
            expect(jsonata('foo').evaluate(input)).to.equal(undefined);
        });

        it('navigation path does not exist', function () {
            var input = {stuff: 4};
            expect(jsonata('foo.bar').evaluate(input)).to.equal(undefined);
        });
    });

    describe('correct types', function () {
        it('string type', function () {
            expect(jsonata('$').evaluate('foo')).to.equal('foo');
            expect(jsonata('bar').evaluate({bar: 'foo'})).to.equal('foo');
        });

        it('number type', function () {
            expect(jsonata('$').evaluate(6754322)).to.equal(6754322);
            expect(jsonata('$').evaluate(0)).to.equal(0);
            expect(jsonata('$').evaluate(-24)).to.equal(-24);
            expect(jsonata('bar').evaluate({bar: 6.54})).to.equal(6.54);
        });

        it('boolean type', function () {
            expect(jsonata('$').evaluate(true)).to.equal(true);
            expect(jsonata('bar').evaluate({bar: false})).to.equal(false);
        });

        it('null value', function () {
            expect(jsonata('$').evaluate(null)).to.equal(null);
            expect(jsonata('bar').evaluate({bar: null})).to.equal(null);
        });

        it('undefined value', function () {
            expect(jsonata('$').evaluate(undefined)).to.equal(undefined);
            expect(jsonata('bar').evaluate({bar: undefined})).to.equal(undefined);
        });

        it('double quoted string "Hello"', function () {
            expect(jsonata('$').evaluate('"Hello"')).to.equal('"Hello"');
            expect(jsonata('bar').evaluate({bar: '"Hello"'})).to.equal('"Hello"');
        });

        it("single quoted string 'Hello'", function () {
            expect(jsonata('$').evaluate("'Hello'")).to.equal("'Hello'");
            expect(jsonata('bar').evaluate({bar: "'Hello'"})).to.equal("'Hello'");
        });
    });

    describe('evaluation of Cassie Functions', function () {
        it('$lowercase(Salutation)', function () {
            var expr = '$lowercase(Salutation)';
            var e = jsonata(expr).evaluate(person);

            expect(e).to.equal("mr");
        });

        it('$lowercase(敷)', function () {
            var expr = '$lowercase(敷)';
            var e = jsonata(expr).evaluate(person);

            expect(e).to.equal("steve");
        });

        it('$lowercase(Español)', function () {
            var expr = '$lowercase(Español)';
            var e = jsonata(expr).evaluate(person);

            expect(e).to.equal("/ˈspænɪʃ/");
        });


        it('$lowercase("NI.Number")', function () {
            var expr = '$lowercase($."NI.Number")';
            var e = jsonata(expr).evaluate(person);

            expect(e).to.equal("no10furbzness");
        });

        it('$lowercase("COMPENSATION IS : " & Employment."Executive.Compensation")', function () {
            var expr = '$lowercase("COMPENSATION IS : " & Employment."Executive.Compensation")';
            var e = jsonata(expr).evaluate(person);

            expect(e).to.equal("compensation is : 1400000");
        });

        it('string literal "Hello"', function () {
            var expr = '"Hello"';
            var e = jsonata(expr).evaluate(person);

            expect(e).to.equal("Hello");
        });

        it('$uppercase(Salutation)', function () {
            var expr = '$uppercase(Salutation)';
            var e = jsonata(expr).evaluate(person);

            expect(e).to.equal("MR");
        });

        it('$uppercase("Hello World")', function () {
            var expr = '$uppercase("Hello World")';
            var e = jsonata(expr).evaluate(person);

            expect(e).to.equal("HELLO WORLD");
        });

        it('$uppercase("鯵噂ソ竹")', function () {
            var expr = '$uppercase("鯵噂ソ竹")';
            var e = jsonata(expr).evaluate(person);

            expect(e).to.equal("鯵噂ソ竹");
        });

        it('Employment.Name & " is happy', function () {
            var expr = 'Employment.Name & " is happy"';
            var p = jsonata(expr);

            var e = p.evaluate(person);
            expect(e).to.equal("IBM UK is happy");
        });

        it('Employment.Name & " is pleased to employ " & Salutation & " " & Surname', function () {
            var expr = 'Employment.Name & " is pleased to employ " & Salutation & " " & Surname';

            var p = jsonata(expr);
            //            expect(p._tree).to.deep.equal([{"path": ["Employment", "Name"]}, "\" is pleased to employ \"", "Salutation", "\" \"", "Surname"]);

            var e = p.evaluate(person);
            expect(e).to.equal("IBM UK is pleased to employ Mr Smith");
        });

        it('$uppercase("Hello " & Salutation & " " & Surname)', function () {
            var expr = '$uppercase("Hello " & Salutation & " " & Surname)';
            var p = jsonata(expr);
            var e = p.evaluate(person);

            expect(e).to.equal("HELLO MR SMITH");
        });

        it('$uppercase(Salutation & " " & Surname & " - has " & Cars & " registered cars")', function () {
            var expr = '$uppercase(Salutation & " " & Surname & " - has " & Cars & " registered cars")';
            var e = jsonata(expr).evaluate(person);

            expect(e).to.equal("MR SMITH - HAS 3 REGISTERED CARS");
        });

        it('$uppercase(Employment.ContractType)', function () {
            var expr = '$uppercase(Employment.ContractType)';
            var e = jsonata(expr).evaluate(person);

            expect(e).to.equal("PERMANENT");
        });

        it('$substringBefore("Hola", "l")', function () {
            var expr = '$substringBefore("Hola", "l")';
            var e = jsonata(expr).evaluate(person);

            expect(e).to.equal("Ho");
        });

        it('$substringBefore("Hola", \'l\')', function () {
            var expr = '$substringBefore("Hola", \'l\')';
            var e = jsonata(expr).evaluate(person);

            expect(e).to.equal("Ho");
        });

        it('$substringBefore("Hola", "Q")', function () {
            var expr = '$substringBefore("Hola", "Q")';
            var e = jsonata(expr).evaluate(person);

            expect(e).to.equal("Hola");
        });

        it('$substringBefore("Hola", "")', function () {
            var expr = '$substringBefore("Hola", "")';
            var e = jsonata(expr).evaluate(person);

            expect(e).to.equal("");
        });

        it('$substringBefore("鯵噂ソ竹", "ソ")', function () {
            var expr = '$substringBefore("鯵噂ソ竹", "ソ")';
            var e = jsonata(expr).evaluate(person);

            expect(e).to.equal("鯵噂");
        });

        it('$substringAfter("Coca"&"Cola", "ca")', function () {
            var expr = '$substringAfter("Coca" & "Cola", "ca")';
            var p = jsonata(expr);
            var e = p.evaluate(person);

            expect(e).to.equal("Cola");
        });

        it('$substringAfter(Salutation & " " & MiddleName &" " & Surname, MiddleName)', function () {
            var e = jsonata('$substringAfter(Salutation & " " & MiddleName &" " & Surname, MiddleName)').evaluate(person);

            expect(e).to.equal(" Smith");
        });

        it('$substringAfter(Salutation & " " & Employment.Role, Salutation)', function () {
            var e = jsonata('$substringAfter(Salutation & " " & Employment.Role, Salutation)').evaluate(person);

            expect(e).to.equal(" Senior Physician");
        });

        it('$substringAfter("Hola", \'l\')', function () {
            var expr = '$substringAfter("Hola", \'l\')';
            var e = jsonata(expr).evaluate(person);

            expect(e).to.equal("a");
        });

        it('$substringAfter("Hola", "Q")', function () {
            var expr = '$substringAfter("Hola", "Q")';
            var e = jsonata(expr).evaluate(person);

            expect(e).to.equal("Hola");
        });

        it('Correctly assigns arguments to functions eg : $lowercase(Employment.Role) & " (" & Employment.Role & ") "', function () {
            // When wrongly handled, the second instance of Employment.Role can be lowercase'd as well!

            var expr = '$lowercase(Employment.Role) & " (" & Employment.Role & ")"';

            var e = jsonata(expr).evaluate(person);

            expect(e).to.equal("senior physician (Senior Physician)");
        });

        it('Employment.Years & " years of employment', function () {
            var expr = 'Employment.Years & " years of employment"'; // 'Employment.Years & " years of employment"';
            var p = jsonata(expr);
            var e = p.evaluate(person);

            expect(e).to.equal("12 years of employment");
        });

        it('$uppercase(Salutation & " " & Surname & " - has " & Employment.Years & " years of employment")', function () {
            var expr = '$uppercase(Salutation & " " & Surname & " - has " & Employment.Years & " years of employment")';
            var p = jsonata(expr);
            var e = p.evaluate(person);

            expect(e).to.equal("MR SMITH - HAS 12 YEARS OF EMPLOYMENT");
        });

        it('$substring(Employment.Role, 7, 4)', function () {
            var p = jsonata('$substring(Employment.Role, 7,4)');
            var e = p.evaluate(person);

            expect(e).to.equal("Phys");
        });

        it('$substring(Employment.Role, -4, 4)', function () {
            var p = jsonata('$substring(Employment.Role, -4,4)');
            var e = p.evaluate(person);

            expect(e).to.equal("cian");
        });

        it('$substring("Hello World", Cars, 5)', function () {
            var p = jsonata('$substring("Hello World",Cars,5)');
            var e = p.evaluate(person);

            expect(e).to.equal("lo Wo");
        });
    });

    describe('Error cases - (Evaluate)', function () {
        describe('General', function () {
            it('Closing brackets are mandatory', function () {
                expect(function () {
                    jsonata('$lowercase("Missing close brackets"').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 35, code: 'S0203', token: '(end)', value: ')'});
            });

            it('unsupported function, e.g. $unknown()', function () {
                var expr = '$unknown(Salutation)';

                var evaluate = function () {
                    jsonata(expr).evaluate(person);
                };

                expect(evaluate).to.throw()
                    .to.deep.contain({position: 9, code: 'T1006', token: 'unknown'});
            });

            it('unsupported function, e.g. $decrypt()', function () {
                var expr = '$decrypt(Salutation)';

                // Alter tree to force an unsupported type
                var prep = jsonata(expr);

                var evaluate = function () {
                    prep.evaluate(person);
                };

                expect(evaluate).to.throw()
                    .to.deep.contain({position: 9, code: 'T1006', token: 'decrypt'});
            });

            it('unsupported function, e.g. Employment.authentication()', function () {
                var expr = 'Employment.authentication(Salutation)';

                var evaluate = function () {
                    jsonata(expr).evaluate(person);
                };

                expect(evaluate).to.throw()
                    .to.deep.contain({position: 26, code: 'T1006', token: 'authentication'});
            });

            it('field in function does not exist', function () {
                var expr = '$uppercase(Invalid)';

                var evaluate = function () {
                    jsonata(expr).evaluate(person);
                };

                expect(evaluate()).to.equal(undefined);
            });

            it('path in a function, where field in path does not exist', function () {
                var expr = '$uppercase(Employment.Invalid)';

                var evaluate = function () {
                    jsonata(expr).evaluate(person);
                };

                expect(evaluate()).to.equal(undefined);
            });
        });

        describe('lowercase', function () {
            it('$lowercase() - Only expects a single argument', function () {
                expect(function () {
                    jsonata('$lowercase("Coca", "Cola")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, code: 'T0410', index: 2, token: 'lowercase'});
            });

            it('$lowercase(Salary) - Field <NAME> is null', function () {
                expect(function () {
                    jsonata('$lowercase(Salary)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, code: 'T0410', index: 1, token: 'lowercase', value: null});
            });

            it('$lowercase(20) - Function lowercase expects a string argument', function () {
                expect(function () {
                    jsonata('$lowercase(20)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, code: 'T0410', index: 1, token: 'lowercase', value: 20});
            });

            it('$lowercase(20.55) - Function lowercase expects a string argument', function () {
                expect(function () {
                    jsonata('$lowercase(20.55)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, code: 'T0410', index: 1, token: 'lowercase', value: 20.55});
            });


            it('$lowercase(Employment) - Does not expect an object', function () {
                expect(function () {
                    jsonata('$lowercase(Employment)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, code: 'T0410', index: 1, token: 'lowercase'});
            });

            it('$lowercase(Qualifications) - Does not expect an array', function () {
                expect(function () {
                    jsonata('$lowercase(Qualifications)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, code: 'T0410', index: 1, token: 'lowercase'});
            });
        });

        describe('uppercase', function () {
            it('$uppercase("Coca","Cola") - Only expects a single argument', function () {
                expect(function () {
                    jsonata('$uppercase("Coca", "Cola")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, code: 'T0410', index: 2, token: 'uppercase'});
            });

            it('$uppercase(Salary) - Field <NAME> is null', function () {
                expect(function () {
                    jsonata('$uppercase(Salary)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, code: 'T0410', index: 1, token: 'uppercase', value: null});
            });

            it('$uppercase(20) - Function uppercase expects a string argument', function () {
                expect(function () {
                    jsonata('$uppercase(28)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, code: 'T0410', index: 1, token: 'uppercase', value: 28});
            });

            it('$uppercase(20.55) - Function uppercase expects a string argument', function () {
                expect(function () {
                    jsonata('$uppercase(20.55)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, code: 'T0410', index: 1, token: 'uppercase', value: 20.55});
            });

            it('$uppercase(Cars) - Function uppercase expects a string argument', function () {
                expect(function () {
                    jsonata('$uppercase(Cars)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, code: 'T0410', index: 1, token: 'uppercase', value: 3});
            });

            it('$uppercase(Employment) - Does not expect an object', function () {
                expect(function () {
                    jsonata('$uppercase(Employment)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, code: 'T0410', index: 1, token: 'uppercase'});
            });

            it('$uppercase(Qualifications) - Does not expect an array', function () {
                expect(function () {
                    jsonata('$uppercase(Qualifications)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, code: 'T0410', index: 1, token: 'uppercase'});
            });
        });

        describe('substringBefore', function () {
            it('$substringBefore() - Expects 2 arguments', function () {
                expect(function () {
                    jsonata('$substringBefore("Coca" & "ca")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 17, code: 'T0411', index: 1, token: 'substringBefore'});
            });

            it('$substringBefore(Salary,"xx") - Field <NAME> is null', function () {
                expect(function () {
                    jsonata('$substringBefore(Salary,"xx")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 17, code: 'T0410', index: 1, token: 'substringBefore', value: null});
            });

            it('$substringBefore(22,"xx") - Function substringBefore expects 2 string arguments', function () {
                expect(function () {
                    jsonata('$substringBefore(22,"xx")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 17, code: 'T0410', index: 1, token: 'substringBefore', value: 22});
            });

            it('$substringBefore(22.55,"xx") - Function substringBefore expects 2 string arguments', function () {
                expect(function () {
                    jsonata('$substringBefore(22.55,"xx")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 17, code: 'T0410', index: 1, token: 'substringBefore', value: 22.55});
            });

            it('$substringBefore("22",0) - Function substringBefore expects 2 string arguments', function () {
                expect(function () {
                    jsonata('$substringBefore("22",2)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 17, code: 'T0410', index: 2, token: 'substringBefore', value: 2});
            });

            it('$substringBefore("22.55",5) - Function substringBefore expects 2 string arguments', function () {
                expect(function () {
                    jsonata('$substringBefore("22.55",5)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 17, code: 'T0410', index: 2, token: 'substringBefore', value: 5});
            });

            it('$substringBefore(Employment,"xx") - Does not expect an object', function () {
                expect(function () {
                    jsonata('$substringBefore(Employment,"xx")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 17, code: 'T0410', index: 1, token: 'substringBefore'});
            });

            it('$substringBefore(Qualifications,"xx") - Does not expect an array', function () {
                expect(function () {
                    jsonata('$substringBefore(Qualifications,"xx")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 17, code: 'T0410', index: 1, token: 'substringBefore'});
            });
        });

        describe('substringAfter', function () {
            it('$substringAfter() - Expects 2 arguments', function () {
                expect(function () {
                    jsonata('$substringAfter("Coca" & "ca")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 16, code: 'T0411', index: 1, token: 'substringAfter'});
            });

            it('$substringAfter(Salary,"xx") - Field <NAME> is null', function () {
                expect(function () {
                    jsonata('$substringAfter(Salary,"xx")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 16, code: 'T0410', index: 1, token: 'substringAfter', value: null});
            });

            it('$substringAfter(22,"xx") - Function substringAfter expects 2 string arguments', function () {
                expect(function () {
                    jsonata('$substringAfter(22,"xx")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 16, code: 'T0410', index: 1, token: 'substringAfter', value: 22});
            });

            it('$substringAfter(22.55,"xx") - Function substringAfter expects 2 string arguments', function () {
                expect(function () {
                    jsonata('$substringAfter(22.55,"xx")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 16, code: 'T0410', index: 1, token: 'substringAfter', value: 22.55});
            });

            it('$substringAfter("22",0) - Function substringAfter expects 2 string arguments', function () {
                expect(function () {
                    jsonata('$substringAfter("22",2)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 16, code: 'T0410', index: 2, token: 'substringAfter', value: 2});
            });

            it('$substringAfter("22.55",5) - Function substringAfter expects 2 string arguments', function () {
                expect(function () {
                    jsonata('$substringAfter("22.55",5)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 16, code: 'T0410', index: 2, token: 'substringAfter', value: 5});
            });

            it('$substringAfter(Employment,"xx") - Does not expect an object', function () {
                expect(function () {
                    jsonata('$substringAfter(Employment,"xx")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 16, code: 'T0410', index: 1, token: 'substringAfter'});
            });

            it('$substringAfter(Qualifications,"xx") - Does not expect an array', function () {
                expect(function () {
                    jsonata('$substringAfter(Qualifications,"xx")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 16, code: 'T0410', index: 1, token: 'substringAfter'});
            });
        });

        describe('substring', function () {
            it('$substring() - Expects 2 or 3 arguments', function () {
                expect(function () {
                    jsonata('$substring("Coca" & "ca", 2, 4, 5)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, code: 'T0410', index: 4, token: 'substring'});
            });

            it('$substring() with non-numeric second argument', function () {
                expect(function () {
                    jsonata('$substring("Coca", "Mr", 4)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, code: 'T0410', index: 2, token: 'substring', value: "Mr"});
            });

            it('$substring() with non-numeric third argument', function () {
                expect(function () {
                    jsonata('$substring("Coca", 3, "Whoops")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, code: 'T0410', index: 3, token: 'substring', value: "Whoops"});
            });

            it('$substring(Salary,2,4) - Field <NAME> is null', function () {
                expect(function () {
                    jsonata('$substring(Salary,2,4)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, code: 'T0410', index: 1, token: 'substring', value: null});
            });

            it('$substring() - last two arguments to be integers', function () {
                expect(function () {
                    jsonata('$substring("Hello","World",5)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, code: 'T0410', index: 2, token: 'substring', value: "World"});

                expect(function () {
                    jsonata('$substring("Hello",5,"World")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, code: 'T0410', index: 3, token: 'substring', value: "World"});

                var result = jsonata('$substring("Hello World",5.5,5)').evaluate(person);
                expect(result).to.equal(" Worl");
            });

            it('$substring(Employment,6,5) - Does not expect an object', function () {
                expect(function () {
                    jsonata('$substring(Employment,"xx")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, code: 'T0410', index: 1, token: 'substring'});
            });

            it('$substring(Qualifications,6,5) - Does not expect an array', function () {
                expect(function () {
                    jsonata('$substring(Qualifications,6,5)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, code: 'T0410', index: 1, token: 'substring'});
            });
        });
    });
});

describe('end to end scenarios', function () {
    it('single step usage', function () {
        var expected = 'stuff';
        expect(jsonata('detail.contents').evaluate(data1)).to.deep.equal(expected);
    });

    it('cache jsonatad exception', function () {
        var pe = jsonata('detail.meta');
        expect(pe.evaluate(data1)).to.deep.equal(5);
        expect(pe.evaluate(data2)).to.deep.equal('boo');
    });
});
