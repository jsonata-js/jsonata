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
                stack: (new Error()).stack
            };
        }
        if(Date.now() - time > timeout) {
            // expression has run for too long
            throw {
                message: "Expression evaluation timeout: Check for infinite loop",
                stack: (new Error()).stack
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe("'hello'", function () {
        it('should return result object', function () {
            var expr = jsonata("'hello'");
            var result = expr.evaluate(testdata1);
            var expected = 'hello';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('"Wayne\'s World"', function () {
        it('should return result object', function () {
            var expr = jsonata('"Wayne\'s World"');
            var result = expr.evaluate(testdata1);
            var expected = "Wayne's World";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('42', function () {
        it('should return result object', function () {
            var expr = jsonata('42');
            var result = expr.evaluate(testdata1);
            var expected = 42;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('-42', function () {
        it('should return result object', function () {
            var expr = jsonata('-42');
            var result = expr.evaluate(testdata1);
            var expected = -42;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('3.14159', function () {
        it('should return result object', function () {
            var expr = jsonata('3.14159');
            var result = expr.evaluate(testdata1);
            var expected = 3.14159;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('6.022e23', function () {
        it('should return result object', function () {
            var expr = jsonata('6.022e23');
            var result = expr.evaluate(testdata1);
            var expected = 6.022e23;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('1.602E-19', function () {
        it('should return result object', function () {
            var expr = jsonata('1.602E-19');
            var result = expr.evaluate(testdata1);
            var expected = 1.602E-19;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('10e1000', function () {
        it('should throw numeric overflow', function () {
            expect(function () {
                jsonata('10e1000');
            }).to.throw()
                .to.deep.contain({position: 0, token: '10e1000'})
                .to.have.property('message').to.match(/Number out of range:/);
        });
    });

});

describe('Evaluator - string literals, escape sequences', function () {
    describe('"hello\\tworld"', function () {
        it('should return result object', function () {
            var expr = jsonata('"hello\\tworld"');
            var result = expr.evaluate(testdata1);
            var expected = 'hello\tworld';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('"hello\\nworld"', function () {
        it('should return result object', function () {
            var expr = jsonata('"hello\\nworld"');
            var result = expr.evaluate(testdata1);
            var expected = 'hello\nworld';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('"hello \\"world\\""', function () {
        it('should return result object', function () {
            var expr = jsonata('"hello \\"world\\""');
            var result = expr.evaluate(testdata1);
            var expected = 'hello "world"';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('"\\u03BB-calculus rocks"', function () {
        it('should return result object', function () {
            var expr = jsonata('"\\u03BB-calculus rocks"');
            var result = expr.evaluate(testdata1);
            var expected = 'λ-calculus rocks';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('treble clef', function () {
        it('should return result object', function () {
            var expr = jsonata('"\uD834\uDD1E"');
            var result = expr.evaluate(testdata1);
            var expected = '𝄞';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('\\y', function () {
        it('should throw error', function () {
            expect(function () {
                jsonata('"\\y"');
            }).to.throw()
                .to.deep.contain({position: 2, token: 'y'})
                .to.have.property('message').to.match(/unsupported escape sequence:/);
        });
    });

    describe('\\u', function () {
        it('should throw error', function () {
            expect(function () {
                jsonata('"\\u"');
            }).to.throw()
                .to.deep.contain({position: 2})
                .to.have.property('message').to.match(/The escape sequence \\u must be followed by 4 hex digits/);
        });
    });

    describe('\\u123t', function () {
        it('should throw error', function () {
            expect(function () {
                jsonata('"\\u123t"');
            }).to.throw()
                .to.deep.contain({position: 2})
                .to.have.property('message').to.match(/The escape sequence \\u must be followed by 4 hex digits/);
        });
    });

});

describe('Evaluator - simple field syntax', function () {
    describe('foo.bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar');
            var result = expr.evaluate(testdata1);
            var expected = 42;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.blah', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah');
            var result = expr.evaluate(testdata1);
            var expected = [{baz: {fud: 'hello'}},
                {baz: {fud: 'world'}},
                {bazz: 'gotcha'}];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.blah.bazz', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.bazz');
            var result = expr.evaluate(testdata1);
            var expected = "gotcha";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.blah.baz', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.baz');
            var result = expr.evaluate(testdata1);
            var expected = [{fud: 'hello'}, {fud: 'world'}];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.blah.baz.fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.baz.fud');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Other.Misc', function () {
        it('should return result object', function () {
            var expr = jsonata('Other.Misc');
            var result = expr.evaluate(testdata4);
            var expected = null;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

});


describe('Evaluator - parenthesis', function () {

    describe('foo.(blah).baz.fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.(blah).baz.fud');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.(blah.baz).fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.(blah.baz).fud');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('(foo.blah.baz).fud', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.blah.baz).fud');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.blah.(baz.fud)', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.(baz.fud)');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('(foo.blah.baz.fud)', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.blah.baz.fud)');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('(foo).(blah).baz.(fud)', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo).(blah).baz.(fud)');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('(foo.(blah).baz.fud)', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.(blah).baz.fud)');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

});

describe('Evaluator - simple array selectors', function () {

    describe('nest.nest1[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('nest0.nest1[0]');
            var result = expr.evaluate(testdata3b);
            var expected = [1, 3, 5, 6];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.blah[0].baz.fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah[0].baz.fud');
            var result = expr.evaluate(testdata1);
            var expected = 'hello';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.blah[1].baz.fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah[1].baz.fud');
            var result = expr.evaluate(testdata1);
            var expected = 'world';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.blah[-1].bazz', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah[-1].bazz');
            var result = expr.evaluate(testdata1);
            var expected = 'gotcha';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('(foo.blah)[1].baz.fud', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.blah)[1].baz.fud');
            var result = expr.evaluate(testdata1);
            var expected = 'world';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.blah.baz.fud[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.baz.fud[0]');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.blah.baz.fud[-1]', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.baz.fud[-1]');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('(foo.blah.baz.fud)[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.blah.baz.fud)[0]');
            var result = expr.evaluate(testdata1);
            var expected = 'hello';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('(foo.blah.baz.fud)[1]', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.blah.baz.fud)[1]');
            var result = expr.evaluate(testdata1);
            var expected = 'world';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('(foo.blah.baz.fud)[5 * 0.2]', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.blah.baz.fud)[5 * 0.2]');
            var result = expr.evaluate(testdata1);
            var expected = 'world';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('(foo.blah.baz.fud)[-1]', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.blah.baz.fud)[-1]');
            var result = expr.evaluate(testdata1);
            var expected = 'world';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('(foo.blah.baz.fud)[-2]', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.blah.baz.fud)[-2]');
            var result = expr.evaluate(testdata1);
            var expected = 'hello';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('(foo.blah.baz.fud)[2-4]', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.blah.baz.fud)[2-4]');
            var result = expr.evaluate(testdata1);
            var expected = 'hello';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('(foo.blah.baz.fud)[-(4-2)]', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.blah.baz.fud)[-(4-2)]');
            var result = expr.evaluate(testdata1);
            var expected = 'hello';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('(foo.blah.baz.fud)[$$.foo.bar / 30]', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.blah.baz.fud)[$$.foo.bar / 30]');
            var result = expr.evaluate(testdata1);
            var expected = 'world';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.blah[0].baz', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah[0].baz');
            var result = expr.evaluate(testdata1);
            var expected = {fud: 'hello'};
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.blah.baz[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.baz[0]');
            var result = expr.evaluate(testdata1);
            var expected = [{fud: 'hello'}, {fud: 'world'}];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('(foo.blah.baz)[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.blah.baz)[0]');
            var result = expr.evaluate(testdata1);
            var expected = {fud: 'hello'};
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('$[0]');
            var result = expr.evaluate([[1, 2], [3, 4]]);
            var expected = [1, 2];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$[1]', function () {
        it('should return result object', function () {
            var expr = jsonata('$[1]');
            var result = expr.evaluate([[1, 2], [3, 4]]);
            var expected = [3, 4];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$[-1]', function () {
        it('should return result object', function () {
            var expr = jsonata('$[-1]');
            var result = expr.evaluate([[1, 2], [3, 4]]);
            var expected = [3, 4];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$[1][0]', function () {
        it('should return result object', function () {
            var expr = jsonata('$[1][0]');
            var result = expr.evaluate([[1, 2], [3, 4]]);
            var expected = 3;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$[1.1][0.9]', function () {
        it('should return result object', function () {
            var expr = jsonata('$[1.1][0.9]');
            var result = expr.evaluate([[1, 2], [3, 4]]);
            var expected = 3;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

});

describe('Evaluator - multiple array selectors', function () {

    describe('[1..10][[1..3,8,-1]]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1..10][[1..3,8,-1]]');
            var result = expr.evaluate();
            var expected = [2, 3, 4, 9, 10];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[1..10][[1..3,8,5]]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1..10][[1..3,8,5]]');
            var result = expr.evaluate();
            var expected = [2, 3, 4, 6, 9];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[1..10][[1..3,8,false]]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1..10][[1..3,8,false]]');
            var result = expr.evaluate();
            var expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

});

describe('Evaluator - quoted object selectors', function () {
    describe('foo."blah"', function () {
        it('should return result object', function () {
            var expr = jsonata('foo."blah"');
            var result = expr.evaluate(testdata1);
            var expected = [{baz: {fud: 'hello'}},
                {baz: {fud: 'world'}},
                {bazz: 'gotcha'}];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo."blah".baz.\'fud\'', function () {
        it('should return result object', function () {
            var expr = jsonata('foo."blah".baz.\'fud\'');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('"foo"."blah"."baz"."fud"', function () {
        it('should return result object', function () {
            var expr = jsonata('"foo"."blah"."baz"."fud"');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo."blah.baz"', function () {
        it('should return result object', function () {
            var expr = jsonata('foo."blah.baz"');
            var result = expr.evaluate(testdata1);
            var expected = 'here';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });
});

describe('Evaluator - numeric operators', function () {
    describe('foo.bar + bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar + bar');
            var result = expr.evaluate(testdata1);
            var expected = 140;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('bar + foo.bar', function () {
        it('should return result object', function () {
            var expr = jsonata('bar + foo.bar');
            var result = expr.evaluate(testdata1);
            var expected = 140;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.bar - bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar - bar');
            var result = expr.evaluate(testdata1);
            var expected = -56;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('bar - foo.bar', function () {
        it('should return result object', function () {
            var expr = jsonata('bar - foo.bar');
            var result = expr.evaluate(testdata1);
            var expected = 56;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.bar * bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar * bar');
            var result = expr.evaluate(testdata1);
            var expected = 4116;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('bar * foo.bar', function () {
        it('should return result object', function () {
            var expr = jsonata('bar * foo.bar');
            var result = expr.evaluate(testdata1);
            var expected = 4116;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.bar / bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar / bar');
            var result = expr.evaluate(testdata1);
            var expected = 0.42857142857142855;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('bar / foo.bar', function () {
        it('should return result object', function () {
            var expr = jsonata('bar / foo.bar');
            var result = expr.evaluate(testdata1);
            var expected = 2.3333333333333335;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.bar % bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar % bar');
            var result = expr.evaluate(testdata1);
            var expected = 42;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('bar % foo.bar', function () {
        it('should return result object', function () {
            var expr = jsonata('bar % foo.bar');
            var result = expr.evaluate(testdata1);
            var expected = 14;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('bar + foo.bar * bar', function () {
        it('should return result object', function () {
            var expr = jsonata('bar + foo.bar * bar');
            var result = expr.evaluate(testdata1);
            var expected = 4214;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.bar * bar + bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar * bar + bar');
            var result = expr.evaluate(testdata1);
            var expected = 4214;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('24 * notexist', function () {
        it('should return undefined', function () {
            var expr = jsonata('24 * notexist');
            var result = expr.evaluate(testdata1);
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('notexist + 1', function () {
        it('should return undefined', function () {
            var expr = jsonata('notexist + 1');
            var result = expr.evaluate(testdata1);
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('1/(10e300 * 10e100) ', function () {
        it('should throw error', function () {
            var expr = jsonata('1/(10e300 * 10e100) ');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({value: Infinity})
                .to.have.property('message').to.match(/Number out of range/);
        });
    });

    describe('"5" + "5"', function () {
        it('should throw error', function () {
            var expr = jsonata('"5" + "5"');
            expect(function () {
                expr.evaluate();
            }).to.throw()
              .to.deep.contain({position: 5})
              .to.have.property('message').to.match(/LHS of \+ operator must evaluate to a number/);
        });
    });

});

describe('Evaluator - comparison operators', function () {

    describe('foo.bar > bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar > bar');
            var result = expr.evaluate(testdata1);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.bar >= bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar >= bar');
            var result = expr.evaluate(testdata1);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.bar<bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar<bar');
            var result = expr.evaluate(testdata1);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.bar<=bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar<=bar');
            var result = expr.evaluate(testdata1);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('bar>foo.bar', function () {
        it('should return result object', function () {
            var expr = jsonata('bar>foo.bar');
            var result = expr.evaluate(testdata1);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('bar < foo.bar', function () {
        it('should return result object', function () {
            var expr = jsonata('bar < foo.bar');
            var result = expr.evaluate(testdata1);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.bar = bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar = bar');
            var result = expr.evaluate(testdata1);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.bar!= bar', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.bar!= bar');
            var result = expr.evaluate(testdata1);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('bar = foo.bar + 56', function () {
        it('should return result object', function () {
            var expr = jsonata('bar = foo.bar + 56');
            var result = expr.evaluate(testdata1);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('bar !=foo.bar+56', function () {
        it('should return result object', function () {
            var expr = jsonata('bar !=foo.bar + 56');
            var result = expr.evaluate(testdata1);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.blah.baz[fud = "hello"]', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.baz[fud = "hello"]');
            var result = expr.evaluate(testdata1);
            var expected = {fud: 'hello'};
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.blah.baz[fud != "world"]', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.baz[fud != "world"]');
            var result = expr.evaluate(testdata1);
            var expected = {fud: 'hello'};
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order.Product[Price > 30].Price', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product[Price > 30].Price');
            var result = expr.evaluate(testdata2);
            var expected = [34.45, 34.45, 107.99];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order.Product.Price[$<=35]', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product.Price[$<=35]');
            var result = expr.evaluate(testdata2);
            var expected = [34.45, 21.67, 34.45];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

});

describe('Evaluator - inclusion operator', function () {

    describe('1 in [1,2]', function () {
        it('should return result object', function () {
            var expr = jsonata('1 in [1,2]');
            var result = expr.evaluate();
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('3 in [1,2]', function () {
        it('should return result object', function () {
            var expr = jsonata('3 in [1,2]');
            var result = expr.evaluate();
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('"hello" in [1,2]', function () {
        it('should return result object', function () {
            var expr = jsonata('"hello" in [1,2]');
            var result = expr.evaluate();
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('"world" in ["hello", "world"]', function () {
        it('should return result object', function () {
            var expr = jsonata('"world" in ["hello", "world"]');
            var result = expr.evaluate();
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('in in ["hello", "world"]', function () {
        it('should return result object', function () {
            var expr = jsonata('in in ["hello", "world"]');
            var result = expr.evaluate();
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('"world" in in', function () {
        it('should return result object', function () {
            var expr = jsonata('"world" in in');
            var result = expr.evaluate();
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('"hello" in "hello"', function () {
        it('should return result object', function () {
            var expr = jsonata('"hello" in "hello"');
            var result = expr.evaluate();
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });


});

describe('Evaluator - predicates', function () {

    describe('nothing[x=6][y=3].number', function () {
        it('should return result object', function () {
            var expr = jsonata('nothing[x=6][y=3].number');
            var result = expr.evaluate();
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('clues[x=6][y=3].number', function () {
        it('should return result object', function () {
            var expr = jsonata('clues[x=6][y=3].number');
            var result = expr.evaluate({clues: [{x: 6, y: 3, number: 7}]});
            var expected = 7;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$[x=6][y=3].number', function () {
        it('should return result object', function () {
            var expr = jsonata('$[x=6][y=3].number');
            var result = expr.evaluate([{x: 6, y: 2, number: 7}]);
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order.Product[$lowercase(Description.Colour) = "purple"][0].Price', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product[$lowercase(Description.Colour) = "purple"][0].Price');
            var result = expr.evaluate(testdata2);
            var expected = [34.45, 34.45];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

});

describe('Evaluator - wildcards', function () {

    describe('foo.*', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.*');
            var result = expr.evaluate(testdata1);
            var expected = [42, {"baz": {"fud": "hello"}}, {"baz": {"fud": "world"}}, {"bazz": "gotcha"}, "here"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.*.baz', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.*.baz');
            var result = expr.evaluate(testdata1);
            var expected = [{fud: 'hello'}, {fud: 'world'}];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.*.bazz', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.*.bazz');
            var result = expr.evaluate(testdata1);
            var expected = 'gotcha';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.*.baz.*', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.*.baz.*');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('*.*.baz.fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.*.baz.*');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('*.*.baz.fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.*.baz.*');
            var result = expr.evaluate(testdata1);
            var expected = ['hello', 'world'];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.*[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.*[0]');
            var result = expr.evaluate(testdata1);
            var expected = 42;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });
});

describe('Evaluator - desendant operator', function () {

    describe('foo.**.blah', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.**.blah');
            var result = expr.evaluate(testdata1);
            var expected = [{"baz": {"fud": "hello"}}, {"baz": {"fud": "world"}}, {"bazz": "gotcha"}];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.**.baz', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.**.baz');
            var result = expr.evaluate(testdata1);
            var expected = [{"fud": "hello"}, {"fud": "world"}];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.**.fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.**.fud');
            var result = expr.evaluate(testdata1);
            var expected = ["hello", "world"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('"foo".**.fud', function () {
        it('should return result object', function () {
            var expr = jsonata('"foo".**.fud');
            var result = expr.evaluate(testdata1);
            var expected = ["hello", "world"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.**."fud"', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.**."fud"');
            var result = expr.evaluate(testdata1);
            var expected = ["hello", "world"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('"foo".**."fud"', function () {
        it('should return result object', function () {
            var expr = jsonata('"foo".**."fud"');
            var result = expr.evaluate(testdata1);
            var expected = ["hello", "world"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.*.**.fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.*.**.fud');
            var result = expr.evaluate(testdata1);
            var expected = ["hello", "world"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.**.*.fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.**.*.fud');
            var result = expr.evaluate(testdata1);
            var expected = ["hello", "world"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order.**.Colour', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.**.Colour');
            var result = expr.evaluate(testdata2);
            var expected = ["Purple", "Orange", "Purple", "Black"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.**.fud[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.**.fud[0]');
            var result = expr.evaluate(testdata1);
            var expected = ["hello", "world"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('(foo.**.fud)[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('(foo.**.fud)[0]');
            var result = expr.evaluate(testdata1);
            var expected = "hello";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('(**.fud)[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('(**.fud)[0]');
            var result = expr.evaluate(testdata1);
            var expected = "hello";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('(**.Price)[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('(**.Price)[0]');
            var result = expr.evaluate(testdata2);
            var expected = 34.45;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('**[2]', function () {
        it('should return result object', function () {
            var expr = jsonata('**[2]');
            var result = expr.evaluate(testdata2);
            var expected = "Firefly";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order.blah.**', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.blah.**');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('**', function () {
        it('should return result object', function () {
            var expr = jsonata('**');
            var result = expr.evaluate();
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

});

describe('Evaluator - string concat', function () {

    describe('"foo" & "bar"', function () {
        it('should return result object', function () {
            var expr = jsonata('"foo" & "bar"');
            var result = expr.evaluate(testdata1);
            var expected = 'foobar';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('"foo"&"bar"', function () {
        it('should return result object', function () {
            var expr = jsonata('"foo"&"bar"');
            var result = expr.evaluate(testdata1);
            var expected = 'foobar';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.blah[0].baz.fud &foo.blah[1].baz.fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah[0].baz.fud &foo.blah[1].baz.fud');
            var result = expr.evaluate(testdata1);
            var expected = 'helloworld';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.(blah[0].baz.fud & blah[1].baz.fud)', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.(blah[0].baz.fud & blah[1].baz.fud)');
            var result = expr.evaluate(testdata1);
            var expected = 'helloworld';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.(blah[0].baz.fud & none)', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.(blah[0].baz.fud & none)');
            var result = expr.evaluate(testdata1);
            var expected = 'hello';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.(none.here & blah[1].baz.fud)', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.(none.here & blah[1].baz.fud)');
            var result = expr.evaluate(testdata1);
            var expected = 'world';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[1,2]&[3,4]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1,2]&[3,4]');
            var result = expr.evaluate(testdata1);
            var expected = '[1,2][3,4]';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[1,2]&3', function () {
        it('should return result object', function () {
            var expr = jsonata('[1,2]&3');
            var result = expr.evaluate(testdata1);
            var expected = '[1,2]3';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('1&2', function () {
        it('should return result object', function () {
            var expr = jsonata('1&2');
            var result = expr.evaluate(testdata1);
            var expected = '12';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('1&[2]', function () {
        it('should return result object', function () {
            var expr = jsonata('1&[2]');
            var result = expr.evaluate(testdata1);
            var expected = '1[2]';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('"hello"&5', function () {
        it('should return result object', function () {
            var expr = jsonata('"hello"&5');
            var result = expr.evaluate(testdata1);
            var expected = 'hello5';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('"Prices: " & Account.Order.Product.Price', function () {
        it('should return result object', function () {
            var expr = jsonata('"Prices: " & Account.Order.Product.Price');
            var result = expr.evaluate(testdata2);
            var expected = "Prices: [34.45,21.67,34.45,107.99]";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

});

describe('Evaluator - array flattening', function () {

    describe('Account.Order.[Product.Price]', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.[Product.Price]'); // Account.Order.[Product.Price]
            var result = expr.evaluate(testdata2);
            var expected = [[34.45, 21.67], [34.45, 107.99]];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$.nest0', function () {
        it('should return result object', function () {
            var expr = jsonata('$.nest0');
            var result = expr.evaluate(testdata3a);
            var expected = [1, 2, 3, 4];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('nest0', function () {
        it('should return result object', function () {
            var expr = jsonata('nest0');
            var result = expr.evaluate(testdata3a);
            var expected = [1, 2, 3, 4];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('$[0]');
            var result = expr.evaluate(testdata3a);
            var expected = {"nest0": [1, 2]};
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$[1]', function () {
        it('should return result object', function () {
            var expr = jsonata('$[1]');
            var result = expr.evaluate(testdata3a);
            var expected = {"nest0": [3, 4]};
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$[-1]', function () {
        it('should return result object', function () {
            var expr = jsonata('$[-1]');
            var result = expr.evaluate(testdata3a);
            var expected = {"nest0": [3, 4]};
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$[0].nest0', function () {
        it('should return result object', function () {
            var expr = jsonata('$[0].nest0');
            var result = expr.evaluate(testdata3a);
            var expected = [1, 2];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$[1].nest0', function () {
        it('should return result object', function () {
            var expr = jsonata('$[1].nest0');
            var result = expr.evaluate(testdata3a);
            var expected = [3, 4];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$[0].nest0[0]', function () {
        it('should return result object', function () {
            var expr = jsonata('$[0].nest0[0]');
            var result = expr.evaluate(testdata3a);
            var expected = 1;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('nest0.[nest1.[nest2.[nest3]]]', function () {
        it('should return result object', function () {
            var expr = jsonata('nest0.[nest1.[nest2.[nest3]]]'); // nest0.[nest1.[nest2.[nest3]]]
            var result = expr.evaluate(testdata3);
            var expected = [[[[1], [2]], [[3], [4]]], [[[5], [6]], [[7], [8]]]];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('nest0.nest1.[nest2.[nest3]]', function () {
        it('should return result object', function () {
            var expr = jsonata('nest0.nest1.[nest2.[nest3]]'); // nest0.nest1.[nest2.[nest3]]
            var result = expr.evaluate(testdata3);
            var expected = [[[1], [2]], [[3], [4]], [[5], [6]], [[7], [8]]];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('nest0.[nest1.nest2.[nest3]]', function () {
        it('should return result object', function () {
            var expr = jsonata('nest0.[nest1.nest2.[nest3]]'); // nest0.[nest1.nest2.[nest3]]
            var result = expr.evaluate(testdata3);
            var expected = [[[1], [2], [3], [4]], [[5], [6], [7], [8]]];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('nest0.[nest1.[nest2.nest3]]', function () {
        it('should return result object', function () {
            var expr = jsonata('nest0.[nest1.[nest2.nest3]]'); // nest0.[nest1.[nest2.nest3]]
            var result = expr.evaluate(testdata3);
            var expected = [[[1, 2], [3, 4]], [[5, 6], [7, 8]]];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('nest0.[nest1.nest2.nest3]', function () {
        it('should return result object', function () {
            var expr = jsonata('nest0.[nest1.nest2.nest3]'); // nest0.[nest1.nest2.nest3]
            var result = expr.evaluate(testdata3);
            var expected = [[1, 2, 3, 4], [5, 6, 7, 8]];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('nest0.nest1.[nest2.nest3]', function () {
        it('should return result object', function () {
            var expr = jsonata('nest0.nest1.[nest2.nest3]'); // nest0.nest1.[nest2.nest3]
            var result = expr.evaluate(testdata3);
            var expected = [[1, 2], [3, 4], [5, 6], [7, 8]];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('nest0.nest1.nest2.[nest3]', function () {
        it('should return result object', function () {
            var expr = jsonata('nest0.nest1.nest2.[nest3]'); // nest0.nest1.nest2.[nest3]
            var result = expr.evaluate(testdata3);
            var expected = [[1], [2], [3], [4], [5], [6], [7], [8]];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('nest0.nest1.nest2.nest3', function () {
        it('should return result object', function () {
            var expr = jsonata('nest0.nest1.nest2.nest3');
            var result = expr.evaluate(testdata3);
            var expected = [1, 2, 3, 4, 5, 6, 7, 8];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

});

describe('Evaluator - keep singleton arrays', function () {

    describe('Phone[type="mobile"].number', function () {
        it('should return result object', function () {
            var expr = jsonata('Phone[type="mobile"].number');
            var result = expr.evaluate(testdata4);
            var expected = "077 7700 1234";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Phone[type="mobile"][].number', function () {
        it('should return result object', function () {
            var expr = jsonata('Phone[type="mobile"][].number');
            var result = expr.evaluate(testdata4);
            var expected = ["077 7700 1234"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Phone[][type="mobile"].number', function () {
        it('should return result object', function () {
            var expr = jsonata('Phone[][type="mobile"].number');
            var result = expr.evaluate(testdata4);
            var expected = ["077 7700 1234"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$price.foo.bar', function () {
        it('should return result object', function () {
            var expr = jsonata('$price.foo.bar');
            var context = {'price': {foo: {bar: 45}}};
            var result = expr.evaluate(testdata2, context);
            var expected = 45;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$var[1]', function () {
        it('should return result object', function () {
            var expr = jsonata('$var[1]');
            expr.assign('var', [1, 2, 3]);
            var result = expr.evaluate(testdata2);
            var expected = 2;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$.foo.bar', function () {
        it('should return result object', function () {
            var expr = jsonata('$.foo.bar');
            expr.assign('price', {foo: {bar: 45}});
            var result = expr.evaluate(testdata1);
            var expected = 42;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$a := 5', function () {
        it('should return result object', function () {
            var expr = jsonata('$a := 5');
            var result = expr.evaluate();
            var expected = 5;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$a := $b := 5', function () {
        it('should return result object', function () {
            var expr = jsonata('$a := $b := 5');
            var result = expr.evaluate();
            var expected = 5;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('($a := $b := 5; $a)', function () {
        it('should return result object', function () {
            var expr = jsonata('($a := $b := 5; $a)');
            var result = expr.evaluate();
            var expected = 5;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('($a := $b := 5; $b)', function () {
        it('should return result object', function () {
            var expr = jsonata('($a := $b := 5; $b)');
            var result = expr.evaluate();
            var expected = 5;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('( $a := 5; $a := $a + 2; $a )', function () {
        it('should return result object', function () {
            var expr = jsonata('( $a := 5; $a := $a + 2; $a )');
            var result = expr.evaluate();
            var expected = 7;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[1,2,3].$v', function () {
        it('should return result object', function () {
            var expr = jsonata('[1,2,3].$v');
            expr.assign('v', [undefined]);
            var result = expr.evaluate();
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

});


describe('Evaluator - functions: sum', function () {

    describe('$sum(Account.Order.Product.(Price * Quantity))', function () {
        it('should return result object', function () {
            var expr = jsonata('$sum(Account.Order.Product.(Price * Quantity))');
            var result = expr.evaluate(testdata2);
            var expected = 336.36;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order.$sum(Product.(Price * Quantity))', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.$sum(Product.(Price * Quantity))');
            var result = expr.evaluate(testdata2);
            var expected = [90.57000000000001, 245.79000000000002];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order.(OrderID & ": " & $sum(Product.(Price*Quantity)))', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.(OrderID & ": " & $sum(Product.(Price*Quantity)))');
            var result = expr.evaluate(testdata2);
            var expected = ["order103: 90.57", "order104: 245.79"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$sum()', function () {
        it('should return result object', function () {
            var expr = jsonata('$sum()');
            expect(function () {
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 5})
                .to.have.property('message').to.match(/The sum function expects one argument/);
        });
    });

    describe('$sum(1)', function () {
        it('should return result object', function () {
            var expr = jsonata('$sum(1)');
            var result = expr.evaluate();
            var expected = 1;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$sum(Account.Order)', function () {
        it('should return result object', function () {
            var expr = jsonata('$sum(Account.Order)');
            expect(function () {
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 5})
                .to.have.property('message').to.match(/Type error: argument of sum function must be an array of numbers/);
        });
    });

    describe('$sum(undefined)', function () {
        it('should throw an error', function () {
            var expr = jsonata('$sum(undefined)');
            var result = expr.evaluate();
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });
});

describe('Evaluator - functions: count', function () {

    describe('$count(Account.Order.Product.(Price * Quantity))', function () {
        it('should return result object', function () {
            var expr = jsonata('$count(Account.Order.Product.(Price * Quantity))');
            var result = expr.evaluate(testdata2);
            var expected = 4;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order.$count(Product.(Price * Quantity))', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.$count(Product.(Price * Quantity))');
            var result = expr.evaluate(testdata2);
            var expected = [2, 2];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order.(OrderID & ": " & $count(Product.(Price*Quantity)))', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.(OrderID & ": " & $count(Product.(Price*Quantity)))');
            var result = expr.evaluate(testdata2);
            var expected = ["order103: 2","order104: 2"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$count([])', function () {
        it('should return result object', function () {
            var expr = jsonata('$count([])');
            var result = expr.evaluate();
            var expected = 0;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$count([1,2,3])', function () {
        it('should return result object', function () {
            var expr = jsonata('$count([1,2,3])');
            var result = expr.evaluate();
            var expected = 3;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$count(["1","2","3"])', function () {
        it('should return result object', function () {
            var expr = jsonata('$count(["1","2","3"])');
            var result = expr.evaluate();
            var expected = 3;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$count(["1","2",3])', function () {
        it('should return result object', function () {
            var expr = jsonata('$count(["1","2",3])');
            var result = expr.evaluate();
            var expected = 3;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$count(1)', function () {
        it('should return result object', function () {
            var expr = jsonata('$count(1)');
            var result = expr.evaluate();
            var expected = 1;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$count([],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$count([],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7})
                .to.have.property('message').to.match(/The count function expects one argument/);
        });
    });

    describe('$count([1,2,3],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$count([1,2,3],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7})
                .to.have.property('message').to.match(/The count function expects one argument/);
        });
    });

    describe('$count([],[],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$count([],[],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7})
                .to.have.property('message').to.match(/The count function expects one argument/);
        });
    });

    describe('$count([1,2],[],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$count([1,2],[],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7})
                .to.have.property('message').to.match(/The count function expects one argument/);
        });
    });

    describe('$count(undefined)', function () {
        it('should throw an error', function () {
            var expr = jsonata('$count(undefined)');
            var result = expr.evaluate();
            var expected = 0;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });
});

describe('Evaluator - functions: max', function () {

    describe('$max(Account.Order.Product.(Price * Quantity))', function () {
        it('should return result object', function () {
            var expr = jsonata('$max(Account.Order.Product.(Price * Quantity))');
            var result = expr.evaluate(testdata2);
            var expected = 137.8;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order.$max(Product.(Price * Quantity))', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.$max(Product.(Price * Quantity))');
            var result = expr.evaluate(testdata2);
            var expected = [68.9,137.8];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order.(OrderID & ": " & $count(Product.(Price*Quantity)))', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.(OrderID & ": " & $count(Product.(Price*Quantity)))');
            var result = expr.evaluate(testdata2);
            var expected = ["order103: 2","order104: 2"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$max([])', function () {
        it('should return result object', function () {
            var expr = jsonata('$max([])');
            var result = expr.evaluate();
            var expected = null;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$max([1,2,3])', function () {
        it('should return result object', function () {
            var expr = jsonata('$max([1,2,3])');
            var result = expr.evaluate();
            var expected = 3;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });


    describe('$max(["1","2","3"])', function () {
        it('should return result object', function () {
            var expr = jsonata('$max(["1","2","3"])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5})
                .to.have.property('message').to.match(/Type error: argument of max function must be an array of numbers/);
        });
    });

    describe('$max(["1","2",3])', function () {
        it('should return result object', function () {
            var expr = jsonata('$max(["1","2",3])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5})
                .to.have.property('message').to.match(/Type error: argument of max function must be an array of numbers/);
        });
    });

    describe('$max(1)', function () {
        it('should return result object', function () {
            var expr = jsonata('$max(1)');
            var result = expr.evaluate();
            var expected = 1;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$max([-1,-5])', function () {
        it('should return result object', function () {
            var expr = jsonata('$max([-1,-5])');
            var result = expr.evaluate();
            var expected = -1;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$max([],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$max([],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5})
                .to.have.property('message').to.match(/The max function expects one argument/);
        });
    });

    describe('$max([1,2,3],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$max([1,2,3],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5})
                .to.have.property('message').to.match(/The max function expects one argument/);
        });
    });

    describe('$max([],[],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$max([],[],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5})
                .to.have.property('message').to.match(/The max function expects one argument/);
        });
    });

    describe('$max([1,2],[],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$max([1,2],[],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5})
                .to.have.property('message').to.match(/The max function expects one argument/);
        });
    });

    describe('$max(undefined)', function () {
        it('should throw an error', function () {
            var expr = jsonata('$max(undefined)');
            var result = expr.evaluate();
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });
});

describe('Evaluator - functions: min', function () {

    describe('$min(Account.Order.Product.(Price * Quantity))', function () {
        it('should return result object', function () {
            var expr = jsonata('$min(Account.Order.Product.(Price * Quantity))');
            var result = expr.evaluate(testdata2);
            var expected = 21.67;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order.$min(Product.(Price * Quantity))', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.$min(Product.(Price * Quantity))');
            var result = expr.evaluate(testdata2);
            var expected = [21.67,107.99];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order.(OrderID & ": " & $min(Product.(Price*Quantity)))', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.(OrderID & ": " & $min(Product.(Price*Quantity)))');
            var result = expr.evaluate(testdata2);
            var expected = ["order103: 21.67","order104: 107.99"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$min([])', function () {
        it('should return result object', function () {
            var expr = jsonata('$min([])');
            var result = expr.evaluate();
            var expected = null;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$min([1,2,3])', function () {
        it('should return result object', function () {
            var expr = jsonata('$min([1,2,3])');
            var result = expr.evaluate();
            var expected = 1;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });


    describe('$min(["1","2","3"])', function () {
        it('should return result object', function () {
            var expr = jsonata('$min(["1","2","3"])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5})
                .to.have.property('message').to.match(/Type error: argument of min function must be an array of numbers/);
        });
    });

    describe('$min(["1","2",3])', function () {
        it('should return result object', function () {
            var expr = jsonata('$min(["1","2",3])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5})
                .to.have.property('message').to.match(/Type error: argument of min function must be an array of numbers/);
        });
    });

    describe('$min(1)', function () {
        it('should return result object', function () {
            var expr = jsonata('$min(1)');
            var result = expr.evaluate();
            var expected = 1;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$min([],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$min([],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5})
                .to.have.property('message').to.match(/The min function expects one argument/);
        });
    });

    describe('$min([1,2,3],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$min([1,2,3],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5})
                .to.have.property('message').to.match(/The min function expects one argument/);
        });
    });

    describe('$min([],[],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$min([],[],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5})
                .to.have.property('message').to.match(/The min function expects one argument/);
        });
    });

    describe('$min([1,2],[],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$min([1,2],[],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5})
                .to.have.property('message').to.match(/The min function expects one argument/);
        });
    });

    describe('$min(undefined)', function () {
        it('should throw an error', function () {
            var expr = jsonata('$min(undefined)');
            var result = expr.evaluate();
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });
});

describe('Evaluator - functions: average', function () {

    describe('$average(Account.Order.Product.(Price * Quantity))', function () {
        it('should return result object', function () {
            var expr = jsonata('$average(Account.Order.Product.(Price * Quantity))');
            var result = expr.evaluate(testdata2);
            var expected = 84.09;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order.$average(Product.(Price * Quantity))', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.$average(Product.(Price * Quantity))');
            var result = expr.evaluate(testdata2);
            var expected = [45.285000000000004,122.89500000000001];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order.(OrderID & ": " & $average(Product.(Price*Quantity)))', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.(OrderID & ": " & $average(Product.(Price*Quantity)))');
            var result = expr.evaluate(testdata2);
            var expected = ["order103: 45.285","order104: 122.895"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$average([])', function () {
        it('should return result object', function () {
            var expr = jsonata('$average([])');
            var result = expr.evaluate();
            var expected = null;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$average([1,2,3])', function () {
        it('should return result object', function () {
            var expr = jsonata('$average([1,2,3])');
            var result = expr.evaluate();
            var expected = 2;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });


    describe('$average(["1","2","3"])', function () {
        it('should return result object', function () {
            var expr = jsonata('$average(["1","2","3"])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 9})
                .to.have.property('message').to.match(/Type error: argument of average function must be an array of numbers/);
        });
    });

    describe('$average(["1","2",3])', function () {
        it('should return result object', function () {
            var expr = jsonata('$average(["1","2",3])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 9})
                .to.have.property('message').to.match(/Type error: argument of average function must be an array of numbers/);
        });
    });

    describe('$average(1)', function () {
        it('should return result object', function () {
            var expr = jsonata('$average(1)');
            var result = expr.evaluate();
            var expected = 1;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$average([],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$average([],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 9})
                .to.have.property('message').to.match(/The average function expects one argument/);
        });
    });

    describe('$average([1,2,3],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$average([1,2,3],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 9})
                .to.have.property('message').to.match(/The average function expects one argument/);
        });
    });

    describe('$average([],[],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$average([],[],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 9})
                .to.have.property('message').to.match(/The average function expects one argument/);
        });
    });

    describe('$average([1,2],[],[])', function () {
        it('should throw an error', function () {
            var expr = jsonata('$average([1,2],[],[])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 9})
                .to.have.property('message').to.match(/The average function expects one argument/);
        });
    });

    describe('$average(undefined)', function () {
        it('should throw an error', function () {
            var expr = jsonata('$average(undefined)');
            var result = expr.evaluate();
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });
});

describe('Evaluator - functions: exists', function () {

    describe('$exists("Hello World")', function () {
        it('should return true', function () {
            var expr = jsonata('$exists("Hello World")');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists("")', function () {
        it('should return true', function () {
            var expr = jsonata('$exists("")');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(true)', function () {
        it('should return true', function () {
            var expr = jsonata('$exists(true)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(false)', function () {
        it('should return true', function () {
            var expr = jsonata('$exists(false)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(0)', function () {
        it('should return true', function () {
            var expr = jsonata('$exists(0)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(-0.5)', function () {
        it('should return true', function () {
            var expr = jsonata('$exists(-0.5)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(null)', function () {
        it('should return true', function () {
            var expr = jsonata('$exists(null)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists([])', function () {
        it('should return true', function () {
            var expr = jsonata('$exists([])');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists([0])', function () {
        it('should return true', function () {
            var expr = jsonata('$exists([0])');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists([1,2,3])', function () {
        it('should return true', function () {
            var expr = jsonata('$exists([1,2,3])');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists([[]])', function () {
        it('should return true', function () {
            var expr = jsonata('$exists([[]])');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists([[null]])', function () {
        it('should return true', function () {
            var expr = jsonata('$exists([[null]])');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists([[[true]]])', function () {
        it('should return true', function () {
            var expr = jsonata('$exists([[[true]]])');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists({})', function () {
        it('should return true', function () {
            var expr = jsonata('$exists({})');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists({"hello":"world"})', function () {
        it('should return true', function () {
            var expr = jsonata('$exists({"hello":"world"})');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(Account)', function () {
        it('should return true', function () {
            var expr = jsonata('$exists(Account)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(Account.Order.Product.Price)', function () {
        it('should return true', function () {
            var expr = jsonata('$exists(Account.Order.Product.Price)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists($exists)', function () {
        it('should return true', function () {
            var expr = jsonata('$exists($exists)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(function(){true})', function () {
        it('should return true', function () {
            var expr = jsonata('$exists(function(){true})');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(blah)', function () {
        it('should return false', function () {
            var expr = jsonata('$exists(blah)');
            var result = expr.evaluate(testdata2);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(Account.blah)', function () {
        it('should return false', function () {
            var expr = jsonata('$exists(Account.blah)');
            var result = expr.evaluate(testdata2);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(Account.Order[2])', function () {
        it('should return false', function () {
            var expr = jsonata('$exists(Account.Order[2])');
            var result = expr.evaluate(testdata2);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(Account.Order[0].blah)', function () {
        it('should return false', function () {
            var expr = jsonata('$exists(Account.Order[0].blah)');
            var result = expr.evaluate(testdata2);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(2,3)', function () {
        it('should throw error', function () {
            var expr = jsonata('$exists(2,3)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/The exists function expects one argument/);
        });
    });

    describe('$exists()', function () {
        it('should throw error', function () {
            var expr = jsonata('$exists()');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/The exists function expects one argument/);
        });
    });

});

describe('Evaluator - functions: spread', function () {

    describe('$spread("Hello World")', function () {
        it('should return itself', function () {
            var expr = jsonata('$spread("Hello World")');
            var result = expr.evaluate(testdata2);
            var expected = "Hello World";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$spread(blah)', function () {
        it('should return itself', function () {
            var expr = jsonata('$spread(blah)');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$string($spread(function($x){$x*$x}))', function () {
        it('should return itself', function () {
            var expr = jsonata('$string($spread(function($x){$x*$x}))');
            var result = expr.evaluate(testdata2);
            var expected = '';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

});

describe('Evaluator - functions: string', function () {

    describe('$string(5)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(5)');
            var result = expr.evaluate(testdata2);
            var expected = '5';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$string(22/7)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(22/7)');
            var result = expr.evaluate(testdata2);
            var expected = '3.142857142857';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$string(1e100)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(1e100)');
            var result = expr.evaluate(testdata2);
            var expected = '1e+100';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$string(1e-100)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(1e-100)');
            var result = expr.evaluate();
            var expected = '1e-100';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$string(1e-6)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(1e-6)');
            var result = expr.evaluate();
            var expected = '0.000001';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$string(1e-7)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(1e-7)');
            var result = expr.evaluate();
            var expected = '1e-7';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$string(1e+20)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(1e20)');
            var result = expr.evaluate();
            var expected = '100000000000000000000';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$string(1e+21)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(1e21)');
            var result = expr.evaluate();
            var expected = '1e+21';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            //assert.equal(JSON.stringify(result), JSON.stringify(expected));
            expect(result).to.deep.equal(expected);
        });
    });

    describe('$string(true)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(true)');
            var result = expr.evaluate(testdata2);
            var expected = 'true';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$string(false)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(false)');
            var result = expr.evaluate(testdata2);
            var expected = 'false';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$string(null)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(null)');
            var result = expr.evaluate(testdata2);
            var expected = 'null';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$string(blah)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(blah)');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$string($string)', function () {
        it('should return result object', function () {
            var expr = jsonata('$string($string)');
            var result = expr.evaluate(testdata2);
            var expected = '';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$string(function(){true})', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(function(){true})');
            var result = expr.evaluate(testdata2);
            var expected = '';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$string(function(){1})', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(function(){1})');
            var result = expr.evaluate(testdata2);
            var expected = '';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$string({"string": "hello"})', function () {
        it('should return result object', function () {
            var expr = jsonata('$string({"string": "hello"})');
            var result = expr.evaluate();
            var expected = '{"string":"hello"}';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$string(["string", 5])', function () {
        it('should return result object', function () {
            var expr = jsonata('$string(["string", 5])');
            var result = expr.evaluate();
            var expected = '["string",5]';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$string(1/0)', function () {
        it('should throw error', function () {
            var expr = jsonata('$string(1/0)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, value: Infinity})
                .to.have.property('message').to.match(/Attempting to invoke string function on Infinity or NaN/);
        });
    });

    describe('$string({"inf": 1/0})', function () {
        it('should throw error', function () {
            var expr = jsonata('$string({"inf": 1/0})');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, value: Infinity})
                .to.have.property('message').to.match(/Number out of range/);
        });
    });

    describe('$string(2,3)', function () {
        it('should throw error', function () {
            var expr = jsonata('$string(2,3)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/The string function expects one argument/);
        });
    });

    describe('$string()', function () {
        it('should throw error', function () {
            var expr = jsonata('$string()');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/The string function expects one argument/);
        });
    });


});

describe('Evaluator - functions: substring', function () {

    describe('$substring("hello world", 0, 5)', function () {
        it('should return result object', function () {
            var expr = jsonata('$substring("hello world", 0, 5)');
            var result = expr.evaluate(testdata2);
            var expected = 'hello';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$substring("hello world", -5, 5)', function () {
        it('should return result object', function () {
            var expr = jsonata('$substring("hello world", -5, 5)');
            var result = expr.evaluate(testdata2);
            var expected = 'world';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$substring("hello world", 6)', function () {
        it('should return result object', function () {
            var expr = jsonata('$substring("hello world", 6)');
            var result = expr.evaluate(testdata2);
            var expected = 'world';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$substring(blah, 6)', function () {
        it('should return result object', function () {
            var expr = jsonata('$substring(blah, 6)');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

});

describe('Evaluator - functions: substringBefore', function () {

    describe('$substringBefore("Hello World", " ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$substringBefore("Hello World", " ")');
            var result = expr.evaluate(testdata2);
            var expected = 'Hello';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$substringBefore("Hello World", "l")', function () {
        it('should return result object', function () {
            var expr = jsonata('$substringBefore("Hello World", "l")');
            var result = expr.evaluate(testdata2);
            var expected = 'He';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$substringBefore("Hello World", "f")', function () {
        it('should return result object', function () {
            var expr = jsonata('$substringBefore("Hello World", "f")');
            var result = expr.evaluate(testdata2);
            var expected = 'Hello World';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$substringBefore("Hello World", "He")', function () {
        it('should return result object', function () {
            var expr = jsonata('$substringBefore("Hello World", "He")');
            var result = expr.evaluate(testdata2);
            var expected = '';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$substringBefore(blah, "He")', function () {
        it('should return result object', function () {
            var expr = jsonata('$substringBefore(blah, "He")');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

});

describe('Evaluator - functions: substringAfter', function () {

    describe('$substringAfter("Hello World", " ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$substringAfter("Hello World", " ")');
            var result = expr.evaluate(testdata2);
            var expected = 'World';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$substringAfter("Hello World", "l")', function () {
        it('should return result object', function () {
            var expr = jsonata('$substringAfter("Hello World", "l")');
            var result = expr.evaluate(testdata2);
            var expected = 'lo World';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$substringAfter("Hello World", "f")', function () {
        it('should return result object', function () {
            var expr = jsonata('$substringAfter("Hello World", "f")');
            var result = expr.evaluate(testdata2);
            var expected = 'Hello World';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$substringAfter("Hello World", "ld")', function () {
        it('should return result object', function () {
            var expr = jsonata('$substringAfter("Hello World", "ld")');
            var result = expr.evaluate(testdata2);
            var expected = '';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$substringAfter(blah, "ld")', function () {
        it('should return result object', function () {
            var expr = jsonata('$substringAfter(blah, "ld")');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

});

describe('Evaluator - functions: lowercase', function () {

    describe('$lowercase("Hello World")', function () {
        it('should return result object', function () {
            var expr = jsonata('$lowercase("Hello World")');
            var result = expr.evaluate(testdata2);
            var expected = 'hello world';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$lowercase(blah)', function () {
        it('should return result object', function () {
            var expr = jsonata('$lowercase(blah)');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

});

describe('Evaluator - functions: uppercase', function () {

    describe('$uppercase("Hello World")', function () {
        it('should return result object', function () {
            var expr = jsonata('$uppercase("Hello World")');
            var result = expr.evaluate(testdata2);
            var expected = 'HELLO WORLD';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$uppercase(blah)', function () {
        it('should return result object', function () {
            var expr = jsonata('$uppercase(blah)');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

});

describe('Evaluator - functions: length', function () {

    describe('$length("")', function () {
        it('should return result object', function () {
            var expr = jsonata('$length("")');
            var result = expr.evaluate();
            var expected = 0;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$length("hello")', function () {
        it('should return result object', function () {
            var expr = jsonata('$length("hello")');
            var result = expr.evaluate();
            var expected = 5;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$length(missing)', function () {
        it('should return result object', function () {
            var expr = jsonata('$length(missing)');
            var result = expr.evaluate();
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$length("\\u03BB-calculus")', function () {
        it('should return result object', function () {
            var expr = jsonata('$length("\\u03BB-calculus")');
            var result = expr.evaluate();
            var expected = 10;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$length("\\uD834\\uDD1E")', function () {
        it('should return result object', function () {
            var expr = jsonata('$length("\\uD834\\uDD1E")');
            var result = expr.evaluate();
            var expected = 2;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$length("𝄞")', function () {
        it('should return result object', function () {
            var expr = jsonata('$length("𝄞")');
            var result = expr.evaluate();
            var expected = 2;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$length("超明體繁")', function () {
        it('should return result object', function () {
            var expr = jsonata('$length("超明體繁")');
            var result = expr.evaluate();
            var expected = 4;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$length("\\t")', function () {
        it('should return result object', function () {
            var expr = jsonata('$length("\\t")');
            var result = expr.evaluate();
            var expected = 1;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$length("\\n")', function () {
        it('should return result object', function () {
            var expr = jsonata('$length("\\n")');
            var result = expr.evaluate();
            var expected = 1;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$length(1234)', function () {
        it('should throw error', function () {
            var expr = jsonata('$length(1234)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, value: 1234})
                .to.have.property('message').to.match(/Type error: argument of length function must evaluate to a string/);
        });
    });

    describe('$length(null)', function () {
        it('should throw error', function () {
            var expr = jsonata('$length(null)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, value: null})
                .to.have.property('message').to.match(/Type error: argument of length function must evaluate to a string/);
        });
    });

    describe('$length(true)', function () {
        it('should throw error', function () {
            var expr = jsonata('$length(true)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8, value: true})
                .to.have.property('message').to.match(/Type error: argument of length function must evaluate to a string/);
        });
    });

    describe('$length(["str"])', function () {
        it('should throw error', function () {
            var expr = jsonata('$length(["str"])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/Type error: argument of length function must evaluate to a string/);
        });
    });

    describe('$length()', function () {
        it('should throw error', function () {
            var expr = jsonata('$length()');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/The length function expects one argument/);
        });
    });

    describe('$length("Hello", "World")', function () {
        it('should throw error', function () {
            var expr = jsonata('$length()');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/The length function expects one argument/);
        });
    });

});

describe('Evaluator - functions: split', function () {

    describe('$split("Hello World", " ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("Hello World", " ")');
            var result = expr.evaluate();
            var expected = ["Hello", "World"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$split("Hello", " ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("Hello", " ")');
            var result = expr.evaluate();
            var expected = ["Hello"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$split("Hello  World", " ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("Hello  World", " ")');
            var result = expr.evaluate();
            var expected = ["Hello", "", "World"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$split("Hello", "")', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("Hello", "")');
            var result = expr.evaluate();
            var expected = ["H", "e", "l", "l", "o"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$sum($split("12345", "").$number($))', function () {
        it('should return result object', function () {
            var expr = jsonata('$sum($split("12345", "").$number($))');
            var result = expr.evaluate();
            var expected = 15;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$split("a, b, c, d", ", ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("a, b, c, d", ", ")');
            var result = expr.evaluate();
            var expected = ["a", "b", "c", "d"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$split("a, b, c, d", ", ", 2)', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("a, b, c, d", ", ", 2)');
            var result = expr.evaluate();
            var expected = ["a", "b"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$split("a, b, c, d", ", ", 2.5)', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("a, b, c, d", ", ", 2.5)');
            var result = expr.evaluate();
            var expected = ["a", "b"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$split("a, b, c, d", ", ", 10)', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("a, b, c, d", ", ", 10)');
            var result = expr.evaluate();
            var expected = ["a", "b", "c", "d"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$split("a, b, c, d", ", ", 0)', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("a, b, c, d", ", ", 0)');
            var result = expr.evaluate();
            var expected = [];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$split(nothing, " ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$split(nothing, " ")');
            var result = expr.evaluate();
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$split("a, b, c, d", ", ", -3)', function () {
        it('should throw error', function () {
            var expr = jsonata('$split("a, b, c, d", ", ", -3)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7, value: -3})
                .to.have.property('message').to.match(/Type error: third argument of split function must evaluate to a positive number/);
        });
    });

    describe('$split("a, b, c, d", ", ", null)', function () {
        it('should throw error', function () {
            var expr = jsonata('$split("a, b, c, d", ", ", null)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7, value: null})
                .to.have.property('message').to.match(/Type error: third argument of split function must evaluate to a positive number/);
        });
    });

    describe('$split("a, b, c, d", ", ", "2")', function () {
        it('should throw error', function () {
            var expr = jsonata('$split("a, b, c, d", ", ", "2")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7, value: "2"})
                .to.have.property('message').to.match(/Type error: third argument of split function must evaluate to a positive number/);
        });
    });

    describe('$split("a, b, c, d", true)', function () {
        it('should throw error', function () {
            var expr = jsonata('$split("a, b, c, d", true)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7, value: true})
                .to.have.property('message').to.match(/Type error: second argument of split function must evaluate to a string/);
        });
    });

    describe('$split(12345, 3)', function () {
        it('should throw error', function () {
            var expr = jsonata('$split(12345, 3)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7, value: 12345})
                .to.have.property('message').to.match(/Type error: first argument of split function must evaluate to a string/);
        });
    });

    describe('$split(12345)', function () {
        it('should throw error', function () {
            var expr = jsonata('$split(12345)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7})
                .to.have.property('message').to.match(/The split function expects two or three arguments/);
        });
    });


});

describe('Evaluator - functions: join', function () {

    describe('$join("hello")', function () {
        it('should return result object', function () {
            var expr = jsonata('$join("hello")');
            var result = expr.evaluate();
            var expected = "hello";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$join(["hello"])', function () {
        it('should return result object', function () {
            var expr = jsonata('$join(["hello"])');
            var result = expr.evaluate();
            var expected = "hello";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$join(["hello", "world"])', function () {
        it('should return result object', function () {
            var expr = jsonata('$join(["hello", "world"])');
            var result = expr.evaluate();
            var expected = "helloworld";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$join(["hello", "world"], ", ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$join(["hello", "world"], ", ")');
            var result = expr.evaluate();
            var expected = "hello, world";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$join([], ", ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$join([], ", ")');
            var result = expr.evaluate();
            var expected = "";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$join(Account.Order.Product.Description.Colour, ", ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$join(Account.Order.Product.Description.Colour, ", ")');
            var result = expr.evaluate(testdata2);
            var expected = "Purple, Orange, Purple, Black";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$join(Account.Order.Product.Description.Colour, no.sep)', function () {
        it('should return result object', function () {
            var expr = jsonata('$join(Account.Order.Product.Description.Colour, no.sep)');
            var result = expr.evaluate(testdata2);
            var expected = "PurpleOrangePurpleBlack";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$join(Account.blah.Product.Description.Colour, ", ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$join(Account.blah.Product.Description.Colour, ", ")');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$join(true, ", ")', function () {
        it('should throw error', function () {
            var expr = jsonata('$join(true, ", ")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 6})
                .to.have.property('message').to.match(/Type error: first argument of join function must be an array of strings/);
        });
    });

    describe('$join([1,2,3], ", ")', function () {
        it('should throw error', function () {
            var expr = jsonata('$join([1,2,3], ", ")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 6})
                .to.have.property('message').to.match(/Type error: first argument of join function must be an array of strings/);
        });
    });

    describe('$join(["hello"], 3)', function () {
        it('should throw error', function () {
            var expr = jsonata('$join(["hello"], 3)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 6})
                .to.have.property('message').to.match(/Type error: second argument of split function must evaluate to a string/);
        });
    });

    describe('$join()', function () {
        it('should throw error', function () {
            var expr = jsonata('$join()');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 6})
                .to.have.property('message').to.match(/The join function expects one or two arguments/);
        });
    });

});

describe('Evaluator - functions: length', function () {

    describe('$length("")', function () {
        it('should return result object', function () {
            var expr = jsonata('$length("")');
            var result = expr.evaluate();
            var expected = 0;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$length("hello")', function () {
        it('should return result object', function () {
            var expr = jsonata('$length("hello")');
            var result = expr.evaluate();
            var expected = 5;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$length(missing)', function () {
        it('should return result object', function () {
            var expr = jsonata('$length(missing)');
            var result = expr.evaluate();
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$length("\\u03BB-calculus")', function () {
        it('should return result object', function () {
            var expr = jsonata('$length("\\u03BB-calculus")');
            var result = expr.evaluate();
            var expected = 10;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$length("\\uD834\\uDD1E")', function () {
        it('should return result object', function () {
            var expr = jsonata('$length("\\uD834\\uDD1E")');
            var result = expr.evaluate();
            var expected = 2;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$length("𝄞")', function () {
        it('should return result object', function () {
            var expr = jsonata('$length("𝄞")');
            var result = expr.evaluate();
            var expected = 2;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$length("超明體繁")', function () {
        it('should return result object', function () {
            var expr = jsonata('$length("超明體繁")');
            var result = expr.evaluate();
            var expected = 4;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$length("\\t")', function () {
        it('should return result object', function () {
            var expr = jsonata('$length("\\t")');
            var result = expr.evaluate();
            var expected = 1;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$length("\\n")', function () {
        it('should return result object', function () {
            var expr = jsonata('$length("\\n")');
            var result = expr.evaluate();
            var expected = 1;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$length(1234)', function () {
        it('should throw error', function () {
            var expr = jsonata('$length(1234)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
              .to.deep.contain({position: 8, value: 1234})
              .to.have.property('message').to.match(/Type error: argument of length function must evaluate to a string/);
        });
    });

    describe('$length(null)', function () {
        it('should throw error', function () {
            var expr = jsonata('$length(null)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
              .to.deep.contain({position: 8, value: null})
              .to.have.property('message').to.match(/Type error: argument of length function must evaluate to a string/);
        });
    });

    describe('$length(true)', function () {
        it('should throw error', function () {
            var expr = jsonata('$length(true)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
              .to.deep.contain({position: 8, value: true})
              .to.have.property('message').to.match(/Type error: argument of length function must evaluate to a string/);
        });
    });

    describe('$length(["str"])', function () {
        it('should throw error', function () {
            var expr = jsonata('$length(["str"])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
              .to.deep.contain({position: 8})
              .to.have.property('message').to.match(/Type error: argument of length function must evaluate to a string/);
        });
    });

    describe('$length()', function () {
        it('should throw error', function () {
            var expr = jsonata('$length()');
            expect(function () {
                expr.evaluate();
            }).to.throw()
              .to.deep.contain({position: 8})
              .to.have.property('message').to.match(/The length function expects one argument/);
        });
    });

    describe('$length("Hello", "World")', function () {
        it('should throw error', function () {
            var expr = jsonata('$length()');
            expect(function () {
                expr.evaluate();
            }).to.throw()
              .to.deep.contain({position: 8})
              .to.have.property('message').to.match(/The length function expects one argument/);
        });
    });

});

describe('Evaluator - functions: split', function () {

    describe('$split("Hello World", " ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("Hello World", " ")');
            var result = expr.evaluate();
            var expected = ["Hello", "World"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$split("Hello", " ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("Hello", " ")');
            var result = expr.evaluate();
            var expected = ["Hello"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$split("Hello  World", " ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("Hello  World", " ")');
            var result = expr.evaluate();
            var expected = ["Hello", "", "World"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$split("Hello", "")', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("Hello", "")');
            var result = expr.evaluate();
            var expected = ["H", "e", "l", "l", "o"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$sum($split("12345", "").$number($))', function () {
        it('should return result object', function () {
            var expr = jsonata('$sum($split("12345", "").$number($))');
            var result = expr.evaluate();
            var expected = 15;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$split("a, b, c, d", ", ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("a, b, c, d", ", ")');
            var result = expr.evaluate();
            var expected = ["a", "b", "c", "d"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$split("a, b, c, d", ", ", 2)', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("a, b, c, d", ", ", 2)');
            var result = expr.evaluate();
            var expected = ["a", "b"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$split("a, b, c, d", ", ", 2.5)', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("a, b, c, d", ", ", 2.5)');
            var result = expr.evaluate();
            var expected = ["a", "b"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$split("a, b, c, d", ", ", 10)', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("a, b, c, d", ", ", 10)');
            var result = expr.evaluate();
            var expected = ["a", "b", "c", "d"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$split("a, b, c, d", ", ", 0)', function () {
        it('should return result object', function () {
            var expr = jsonata('$split("a, b, c, d", ", ", 0)');
            var result = expr.evaluate();
            var expected = [];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$split(nothing, " ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$split(nothing, " ")');
            var result = expr.evaluate();
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$split("a, b, c, d", ", ", -3)', function () {
        it('should throw error', function () {
            var expr = jsonata('$split("a, b, c, d", ", ", -3)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
              .to.deep.contain({position: 7, value: -3})
              .to.have.property('message').to.match(/Type error: third argument of split function must evaluate to a positive number/);
        });
    });

    describe('$split("a, b, c, d", ", ", null)', function () {
        it('should throw error', function () {
            var expr = jsonata('$split("a, b, c, d", ", ", null)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
              .to.deep.contain({position: 7, value: null})
              .to.have.property('message').to.match(/Type error: third argument of split function must evaluate to a positive number/);
        });
    });

    describe('$split("a, b, c, d", ", ", "2")', function () {
        it('should throw error', function () {
            var expr = jsonata('$split("a, b, c, d", ", ", "2")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
              .to.deep.contain({position: 7, value: "2"})
              .to.have.property('message').to.match(/Type error: third argument of split function must evaluate to a positive number/);
        });
    });

    describe('$split("a, b, c, d", true)', function () {
        it('should throw error', function () {
            var expr = jsonata('$split("a, b, c, d", true)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
              .to.deep.contain({position: 7, value: true})
              .to.have.property('message').to.match(/Type error: second argument of split function must evaluate to a string/);
        });
    });

    describe('$split(12345, 3)', function () {
        it('should throw error', function () {
            var expr = jsonata('$split(12345, 3)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
              .to.deep.contain({position: 7, value: 12345})
              .to.have.property('message').to.match(/Type error: first argument of split function must evaluate to a string/);
        });
    });

    describe('$split(12345)', function () {
        it('should throw error', function () {
            var expr = jsonata('$split(12345)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
              .to.deep.contain({position: 7})
              .to.have.property('message').to.match(/The split function expects two or three arguments/);
        });
    });


});

describe('Evaluator - functions: join', function () {

    describe('$join("hello")', function () {
        it('should return result object', function () {
            var expr = jsonata('$join("hello")');
            var result = expr.evaluate();
            var expected = "hello";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$join(["hello"])', function () {
        it('should return result object', function () {
            var expr = jsonata('$join(["hello"])');
            var result = expr.evaluate();
            var expected = "hello";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$join(["hello", "world"])', function () {
        it('should return result object', function () {
            var expr = jsonata('$join(["hello", "world"])');
            var result = expr.evaluate();
            var expected = "helloworld";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$join(["hello", "world"], ", ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$join(["hello", "world"], ", ")');
            var result = expr.evaluate();
            var expected = "hello, world";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$join([], ", ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$join([], ", ")');
            var result = expr.evaluate();
            var expected = "";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$join(Account.Order.Product.Description.Colour, ", ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$join(Account.Order.Product.Description.Colour, ", ")');
            var result = expr.evaluate(testdata2);
            var expected = "Purple, Orange, Purple, Black";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$join(Account.Order.Product.Description.Colour, no.sep)', function () {
        it('should return result object', function () {
            var expr = jsonata('$join(Account.Order.Product.Description.Colour, no.sep)');
            var result = expr.evaluate(testdata2);
            var expected = "PurpleOrangePurpleBlack";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$join(Account.blah.Product.Description.Colour, ", ")', function () {
        it('should return result object', function () {
            var expr = jsonata('$join(Account.blah.Product.Description.Colour, ", ")');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$join(true, ", ")', function () {
        it('should throw error', function () {
            var expr = jsonata('$join(true, ", ")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
              .to.deep.contain({position: 6})
              .to.have.property('message').to.match(/Type error: first argument of join function must be an array of strings/);
        });
    });

    describe('$join([1,2,3], ", ")', function () {
        it('should throw error', function () {
            var expr = jsonata('$join([1,2,3], ", ")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
              .to.deep.contain({position: 6})
              .to.have.property('message').to.match(/Type error: first argument of join function must be an array of strings/);
        });
    });

    describe('$join(["hello"], 3)', function () {
        it('should throw error', function () {
            var expr = jsonata('$join(["hello"], 3)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
              .to.deep.contain({position: 6})
              .to.have.property('message').to.match(/Type error: second argument of split function must evaluate to a string/);
        });
    });

    describe('$join()', function () {
        it('should throw error', function () {
            var expr = jsonata('$join()');
            expect(function () {
                expr.evaluate();
            }).to.throw()
              .to.deep.contain({position: 6})
              .to.have.property('message').to.match(/The join function expects one or two arguments/);
        });
    });

});

describe('Evaluator - functions: number', function () {

    describe('$number(0)', function () {
        it('should return result object', function () {
            var expr = jsonata('$number(0)');
            var result = expr.evaluate();
            var expected = 0;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$number(10)', function () {
        it('should return result object', function () {
            var expr = jsonata('$number(10)');
            var result = expr.evaluate();
            var expected = 10;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$number(-0.05)', function () {
        it('should return result object', function () {
            var expr = jsonata('$number(-0.05)');
            var result = expr.evaluate();
            var expected = -0.05;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$number("0")', function () {
        it('should return result object', function () {
            var expr = jsonata('$number("0")');
            var result = expr.evaluate();
            var expected = 0;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$number("-0.05")', function () {
        it('should return result object', function () {
            var expr = jsonata('$number("-0.05")');
            var result = expr.evaluate();
            var expected = -0.05;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$number("1e2")', function () {
        it('should return result object', function () {
            var expr = jsonata('$number("1e2")');
            var result = expr.evaluate();
            var expected = 100;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$number("1.0e-2")', function () {
        it('should return result object', function () {
            var expr = jsonata('$number("1.0e-2")');
            var result = expr.evaluate();
            var expected = 0.01;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$number("1e0")', function () {
        it('should return result object', function () {
            var expr = jsonata('$number("1e0")');
            var result = expr.evaluate();
            var expected = 1;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$number("10e500")', function () {
        it('should throw error', function () {
            var expr = jsonata('$number("10e500")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/Unable to cast value to a number/);
        });
    });

    describe('$number("Hello world")', function () {
        it('should throw error', function () {
            var expr = jsonata('$number("Hello world")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/Unable to cast value to a number/);
        });
    });

    describe('$number("1/2")', function () {
        it('should throw error', function () {
            var expr = jsonata('$number("1/2")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/Unable to cast value to a number/);
        });
    });

    describe('$number("1234 hello")', function () {
        it('should throw error', function () {
            var expr = jsonata('$number("1234 hello")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/Unable to cast value to a number/);
        });
    });

    describe('$number("")', function () {
        it('should throw error', function () {
            var expr = jsonata('$number("")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/Unable to cast value to a number/);
        });
    });

    describe('$number(true)', function () {
        it('should throw error', function () {
            var expr = jsonata('$number(true)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/Unable to cast value to a number/);
        });
    });

    describe('$number(false)', function () {
        it('should throw error', function () {
            var expr = jsonata('$number(false)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/Unable to cast value to a number/);
        });
    });

    describe('$number(Account.blah)', function () {
        it('should return result object', function () {
            var expr = jsonata('$number(Account.blah)');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$number(null)', function () {
        it('should throw error', function () {
            var expr = jsonata('$number(null)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/Unable to cast value to a number/);
        });
    });

    describe('$number([])', function () {
        it('should throw error', function () {
            var expr = jsonata('$number([])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/Unable to cast value to a number/);
        });
    });

    describe('$number("[1]")', function () {
        it('should throw error', function () {
            var expr = jsonata('$number("[1]")');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/Unable to cast value to a number/);
        });
    });

    describe('$number([1,2])', function () {
        it('should throw error', function () {
            var expr = jsonata('$number([1,2])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/Unable to cast value to a number/);
        });
    });

    describe('$number(["hello"])', function () {
        it('should throw error', function () {
            var expr = jsonata('$number(["hello"])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/Unable to cast value to a number/);
        });
    });

    describe('$number(["2"])', function () {
        it('should throw error', function () {
            var expr = jsonata('$number(["2"])');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/Unable to cast value to a number/);
        });
    });

    describe('$number({})', function () {
        it('should throw error', function () {
            var expr = jsonata('$number({})');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/Unable to cast value to a number/);
        });
    });

    describe('$number({"hello":"world"})', function () {
        it('should throw error', function () {
            var expr = jsonata('$number({"hello":"world"})');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/Unable to cast value to a number/);
        });
    });

    describe('$number($number)', function () {
        it('should throw error', function () {
            var expr = jsonata('$number($number)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/Unable to cast value to a number/);
        });
    });

    describe('$number(function(){5})', function () {
        it('should throw error', function () {
            var expr = jsonata('$number(function(){5})');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/Unable to cast value to a number/);
        });
    });

    describe('$number()', function () {
        it('should throw error', function () {
            var expr = jsonata('$number()');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/The number function expects one argument/);
        });
    });

    describe('$number(1,2)', function () {
        it('should throw error', function () {
            var expr = jsonata('$number(1,2)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/The number function expects one argument/);
        });
    });

});

describe('Evaluator - functions: boolean', function () {

    describe('$boolean("Hello World")', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean("Hello World")');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$boolean("")', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean("")');
            var result = expr.evaluate(testdata2);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$boolean(true)', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean(true)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$boolean(false)', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean(false)');
            var result = expr.evaluate(testdata2);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$boolean(0)', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean(0)');
            var result = expr.evaluate(testdata2);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$boolean(10)', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean(10)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$boolean(-0.5)', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean(-0.5)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$boolean(null)', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean(null)');
            var result = expr.evaluate(testdata2);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$boolean([])', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean([])');
            var result = expr.evaluate(testdata2);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$boolean([0])', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean([0])');
            var result = expr.evaluate(testdata2);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$boolean([1])', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean([1])');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$boolean([1,2,3])', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean([1,2,3])');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$boolean([0,0])', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean([0,0])');
            var result = expr.evaluate(testdata2);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$boolean([[]])', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean([[]])');
            var result = expr.evaluate(testdata2);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$boolean([[null]])', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean([[null]])');
            var result = expr.evaluate(testdata2);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$boolean([[[true]]])', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean([[[true]]])');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$boolean({})', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean({})');
            var result = expr.evaluate(testdata2);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$boolean({"hello":"world"})', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean({"hello":"world"})');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$boolean(Account)', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean(Account)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$boolean(Account.Order.Product.Price)', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean(Account.Order.Product.Price)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$boolean(Account.blah)', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean(Account.blah)');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$boolean($boolean)', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean($boolean)');
            var result = expr.evaluate(testdata2);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$boolean(function(){true})', function () {
        it('should return result object', function () {
            var expr = jsonata('$boolean(function(){true})');
            var result = expr.evaluate(testdata2);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$boolean(2,3)', function () {
        it('should throw error', function () {
            var expr = jsonata('$boolean(2,3)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 9})
                .to.have.property('message').to.match(/The boolean function expects one argument/);
        });
    });

    describe('$boolean()', function () {
        it('should throw error', function () {
            var expr = jsonata('$boolean()');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 9})
                .to.have.property('message').to.match(/The boolean function expects one argument/);
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$keys({})', function () {
        it('should return result object', function () {
            var expr = jsonata('$keys({})');
            var result = expr.evaluate();
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$keys({"foo":{}})', function () {
        it('should return result object', function () {
            var expr = jsonata('$keys({"foo":{}})');
            var result = expr.evaluate();
            var expected = ["foo"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$keys("foo")', function () {
        it('should return result object', function () {
            var expr = jsonata('$keys("foo")');
            var result = expr.evaluate();
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$keys(function(){1})', function () {
        it('should return result object', function () {
            var expr = jsonata('$keys(function(){1})');
            var result = expr.evaluate();
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$keys(["foo", "bar"])', function () {
        it('should return result object', function () {
            var expr = jsonata('$keys(["foo", "bar"])');
            var result = expr.evaluate();
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

});

describe('Evaluator - functions: lookup', function () {

    describe('$lookup(Account, "Account Name")', function () {
        it('should return result object', function () {
            var expr = jsonata('$lookup(Account, "Account Name")');
            var result = expr.evaluate(testdata2);
            var expected = "Firefly";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$lookup(Account.Order.Product.ProductID, "Product Name"))', function () {
        it('should return result object', function () {
            var expr = jsonata('$lookup(Account.Order.Product.ProductID, "Product Name")');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

});

describe('Evaluator - functions: append', function () {

    describe('$append([1,2], [3,4])', function () {
        it('should return result object', function () {
            var expr = jsonata('$append([1,2], [3,4])');
            var result = expr.evaluate(testdata2);
            var expected = [1, 2, 3, 4];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$append(1, [3,4])', function () {
        it('should return result object', function () {
            var expr = jsonata('$append(1, [3,4])');
            var result = expr.evaluate(testdata2);
            var expected = [1, 3, 4];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$append(1, 2)', function () {
        it('should return result object', function () {
            var expr = jsonata('$append(1,2)');
            var result = expr.evaluate(testdata2);
            var expected = [1, 2];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$append(1, notexist)', function () {
        it('should return result object', function () {
            var expr = jsonata('$append(1,notexist)');
            var result = expr.evaluate(testdata2);
            var expected = 1;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$append(notexist, [2,3,4])', function () {
        it('should return result object', function () {
            var expr = jsonata('$append(notexist, [2,3,4])');
            var result = expr.evaluate(testdata2);
            var expected = [2, 3, 4];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

});


describe('Evaluator - functions: exists', function () {

    describe('$exists("Hello World")', function () {
        it('should return true', function () {
            var expr = jsonata('$exists("Hello World")');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists("")', function () {
        it('should return true', function () {
            var expr = jsonata('$exists("")');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(true)', function () {
        it('should return true', function () {
            var expr = jsonata('$exists(true)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(false)', function () {
        it('should return true', function () {
            var expr = jsonata('$exists(false)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(0)', function () {
        it('should return true', function () {
            var expr = jsonata('$exists(0)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(-0.5)', function () {
        it('should return true', function () {
            var expr = jsonata('$exists(-0.5)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(null)', function () {
        it('should return true', function () {
            var expr = jsonata('$exists(null)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists([])', function () {
        it('should return true', function () {
            var expr = jsonata('$exists([])');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists([0])', function () {
        it('should return true', function () {
            var expr = jsonata('$exists([0])');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists([1,2,3])', function () {
        it('should return true', function () {
            var expr = jsonata('$exists([1,2,3])');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists([[]])', function () {
        it('should return true', function () {
            var expr = jsonata('$exists([[]])');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists([[null]])', function () {
        it('should return true', function () {
            var expr = jsonata('$exists([[null]])');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists([[[true]]])', function () {
        it('should return true', function () {
            var expr = jsonata('$exists([[[true]]])');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists({})', function () {
        it('should return true', function () {
            var expr = jsonata('$exists({})');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists({"hello":"world"})', function () {
        it('should return true', function () {
            var expr = jsonata('$exists({"hello":"world"})');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(Account)', function () {
        it('should return true', function () {
            var expr = jsonata('$exists(Account)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(Account.Order.Product.Price)', function () {
        it('should return true', function () {
            var expr = jsonata('$exists(Account.Order.Product.Price)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists($exists)', function () {
        it('should return true', function () {
            var expr = jsonata('$exists($exists)');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(function(){true})', function () {
        it('should return true', function () {
            var expr = jsonata('$exists(function(){true})');
            var result = expr.evaluate(testdata2);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(blah)', function () {
        it('should return false', function () {
            var expr = jsonata('$exists(blah)');
            var result = expr.evaluate(testdata2);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(Account.blah)', function () {
        it('should return false', function () {
            var expr = jsonata('$exists(Account.blah)');
            var result = expr.evaluate(testdata2);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(Account.Order[2])', function () {
        it('should return false', function () {
            var expr = jsonata('$exists(Account.Order[2])');
            var result = expr.evaluate(testdata2);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(Account.Order[0].blah)', function () {
        it('should return false', function () {
            var expr = jsonata('$exists(Account.Order[0].blah)');
            var result = expr.evaluate(testdata2);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$exists(2,3)', function () {
        it('should throw error', function () {
            var expr = jsonata('$exists(2,3)');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/The exists function expects one argument/);
        });
    });

    describe('$exists()', function () {
        it('should throw error', function () {
            var expr = jsonata('$exists()');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/The exists function expects one argument/);
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
                .to.deep.contain({position: 5, token: '-', value: 's'})
                .to.have.property('message').to.match(/LHS of - operator/);
        });
    });

    describe('1 + null', function () {
        it('should throw error', function () {
            var expr = jsonata('1 + null');
            expect(function () {
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 3, token: '+', value: null})
                .to.have.property('message').to.match(/RHS of \+ operator/);
        });
    });

    describe('"no closing quote', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('"no closing quote');
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 17})
                .to.have.property('message').to.match(/no terminating quote/);
        });
    });

    describe('- "s"', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('- "s"');
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 1, token: '-', value: 's'})
                .to.have.property('message').to.match(/Cannot negate a non-numeric value/);
        });
    });

    describe('unknown(function)', function () {
        it('should throw error', function () {
            var expr = jsonata('unknown(function)');
            expect(function () {
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 8})
                .to.have.property('message').to.match(/Attempted to invoke a non-function/);
        });
    });

    describe('sum(Account.Order.OrderID)', function () {
        it('should throw error', function () {
            var expr = jsonata('sum(Account.Order.OrderID)');
            expect(function () {
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 4, token: 'sum'})
                .to.have.property('message').to.match(/Attempted to invoke a non-function. Did you mean/);
        });
    });

    describe('[1,2)', function () {
        it('should throw error', function () {
            expect(function () {
                jsonata('[1,2)');
            }).to.throw()
                .to.deep.contain({position: 5, token: ')', value: ']'})
                .to.have.property('message').to.match(/Syntax error: expected .* got/);
        });
    });

    describe('[1:2]', function () {
        it('should throw error', function () {
            expect(function () {
                jsonata('[1:2]');
            }).to.throw()
                .to.deep.contain({position: 3, token: ':', value: ']'})
                .to.have.property('message').to.match(/Syntax error: expected .* got/);
        });
    });

    describe('[1!2]', function () {
        it('should throw error', function () {
            expect(function () {
                jsonata('[1!2]');
            }).to.throw()
                .to.deep.contain({position: 3, token: '!'})
                .to.have.property('message').to.match(/Unknown operator/);
        });
    });

    describe('@ bar', function () {
        it('should throw error', function () {
            expect(function () {
                jsonata('@ bar');
            }).to.throw()
                .to.deep.contain({position: 1, token: '@'})
                .to.have.property('message').to.match(/Unknown operator/);
        });
    });

    describe('2(blah)', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('2(blah)');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 2, token: 2})
                .to.have.property('message').to.match(/Attempted to invoke a non-function/);
        });
    });

    describe('2()', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('2()');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 2, token: 2})
                .to.have.property('message').to.match(/Attempted to invoke a non-function/);
        });
    });

    describe('3(?)', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('3(?)');
                expr.evaluate();
            }).to.throw()
              .to.deep.contain({position:2, token: 3})
              .to.have.property('message').to.match(/Attempted to partially apply a non-function/);
        });
    });

    describe('1=', function () {
        it('should throw error', function () {
            expect(function () {
                jsonata('1=');
            }).to.throw()
                .to.have.property('message').to.match(/Syntax error: unexpected end of expression/);
        });
    });

    describe('function(x){$x}(3)', function () {
        it('should throw error', function () {
            expect(function () {
                jsonata('function(x){$x}(3)');
            }).to.throw()
                .to.deep.contain({position: 10, token: 'x'})
                .to.have.property('message').to.match(/of function definition must be a variable name/);
        });
    });

    describe('x:=1', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('x:=1');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 3, token: ':=', value: 'x'})
                .to.have.property('message').to.match(/Left hand side of := must be a variable name/);
        });
    });

    describe('2:=1', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('2:=1');
                expr.evaluate();
            }).to.throw()
              .to.deep.contain({position: 3, token: ':=', value: 2})
              .to.have.property('message').to.match(/Left hand side of := must be a variable name/);
        });
    });

    describe('$foo()', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('$foo()');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5})
                .to.have.property('message').to.match(/Attempted to invoke a non-function/);
        });
    });

    describe('55=>5', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('55=>5');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5, token: 5})
                .to.have.property('message').to.match(/Syntax error:/);
        });
    });

    describe('Ssum(:)', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('Ssum(:)');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 6, token: ':'})
                .to.have.property('message').to.match(/Syntax error:/);
        });
    });

    describe('[1,2,3]{"num": $}[true]', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('[1,2,3]{"num": $}[true]');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 18})
                .to.have.property('message').to.match(/A predicate cannot follow a grouping expression in a step/);
        });
    });

    describe('[1,2,3]{"num": $}{"num": $}', function () {
        it('should throw error', function () {
            expect(function () {
                var expr = jsonata('[1,2,3]{"num": $}{"num": $}');
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 18})
                .to.have.property('message').to.match(/Each step can only have one grouping expression/);
        });
    });


});


describe('Evaluator - array constructor', function () {

    describe('[]', function () {
        it('should return result object', function () {
            var expr = jsonata('[]');
            var result = expr.evaluate(testdata2);
            var expected = [];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[1]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1]');
            var result = expr.evaluate(testdata2);
            var expected = [1];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[1, 2]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1, 2]');
            var result = expr.evaluate(testdata2);
            var expected = [1, 2];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[1, 2,3]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1, 2,3]');
            var result = expr.evaluate(testdata2);
            var expected = [1, 2, 3];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[1, 2, [3, 4]]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1, 2, [3, 4]]');
            var result = expr.evaluate(testdata2);
            var expected = [1, 2, [3, 4]];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[1, "two", ["three", 4]]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1, "two", ["three", 4]]');
            var result = expr.evaluate(testdata2);
            var expected = [1, "two", ["three", 4]];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[1, $two, ["three", $four]]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1, $two, ["three", $four]]');
            expr.assign('two', 2);
            expr.assign('four', "four");
            var result = expr.evaluate(testdata2);
            var expected = [1, 2, ["three", "four"]];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('["foo.bar", foo.bar, ["foo.baz", foo.blah.baz]]', function () {
        it('should return result object', function () {
            var expr = jsonata('["foo.bar", foo.bar, ["foo.baz", foo.blah.baz]]');
            var result = expr.evaluate(testdata1);
            var expected = ["foo.bar", 42, ["foo.baz", {"fud": "hello"}, {"fud": "world"}]];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[1, 2, 3][0]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1, 2, 3][0]');
            var result = expr.evaluate(testdata2);
            var expected = 1;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[1, 2, [3, 4]][-1]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1, 2, [3, 4]][-1]');
            var result = expr.evaluate(testdata2);
            var expected = [3, 4];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[1, 2, [3, 4]][-1][-1]', function () {
        it('should return result object', function () {
            var expr = jsonata('[1, 2, [3, 4]][-1][-1]');
            var result = expr.evaluate(testdata2);
            var expected = 4;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.blah.baz.[fud, fud]', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.baz.[fud, fud]');
            var result = expr.evaluate(testdata1);
            var expected = [["hello","hello"],["world","world"]];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.blah.baz.[[fud, fud]]', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.baz.[[fud, fud]]');
            var result = expr.evaluate(testdata1);
            var expected = [[["hello","hello"]],[["world","world"]]];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.blah.[baz].fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.[baz].fud');
            var result = expr.evaluate(testdata1a);
            var expected = "hello";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('foo.blah.[baz, buz].fud', function () {
        it('should return result object', function () {
            var expr = jsonata('foo.blah.[baz, buz].fud');
            var result = expr.evaluate(testdata1a);
            var expected = ["hello", "world"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[0,1,2,3,4,5,6,7,8,9][$ % 2 = 0]', function () {
        it('should return result object', function () {
            var expr = jsonata('[0,1,2,3,4,5,6,7,8,9][$ % 2 = 0]');
            var result = expr.evaluate(null);
            var expected = [0, 2, 4, 6, 8];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[1, 2, 3].$', function () {
        it('should return result object', function () {
            var expr = jsonata('[1, 2, 3].$');
            var result = expr.evaluate();
            var expected = [1,2,3];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[1, 2, 3].$', function () {
        it('should return result object', function () {
            var expr = jsonata('[1, 2, 3].$');
            var result = expr.evaluate([]);
            var expected = [1,2,3];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[1, 2, 3].$', function () {
        it('should return result object', function () {
            var expr = jsonata('[1, 2, 3].$');
            var result = expr.evaluate([4,5,6]);
            var expected = [1,2,3];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

});

describe('Evaluator - range operator', function () {
    describe('[0..9]', function () {
        it('should return result object', function () {
            var expr = jsonata('[0..9]');
            var result = expr.evaluate(testdata1);
            var expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[0..9][$ % 2 = 0]', function () {
        it('should return result object', function () {
            var expr = jsonata('[0..9][$ % 2 = 0]');
            var result = expr.evaluate(testdata1);
            var expected = [0, 2, 4, 6, 8];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[0, 4..9, 20, 22]', function () {
        it('should return result object', function () {
            var expr = jsonata('[0, 4..9, 20, 22]');
            var result = expr.evaluate(testdata1);
            var expected = [0, 4, 5, 6, 7, 8, 9, 20, 22];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[5..2]', function () {
        it('should return result object', function () {
            var expr = jsonata('[5..2]');
            var result = expr.evaluate(testdata1);
            var expected = [];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[5..2, 2..5]', function () {
        it('should return result object', function () {
            var expr = jsonata('[5..2, 2..5]');
            var result = expr.evaluate(testdata1);
            var expected = [2, 3, 4, 5];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[-2..2]', function () {
        it('should return result object', function () {
            var expr = jsonata('[-2..2]');
            var result = expr.evaluate(testdata1);
            var expected = [-2, -1, 0, 1, 2];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[-2..2].($*$)', function () {
        it('should return result object', function () {
            var expr = jsonata('[-2..2].($*$)');
            var result = expr.evaluate(testdata1);
            var expected = [4, 1, 0, 1, 4];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[-2..blah]', function () {
        it('should return result object', function () {
            var expr = jsonata('[-2..blah]');
            var result = expr.evaluate();
            var expected = [];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[blah..5, 3, -2..blah]', function () {
        it('should return result object', function () {
            var expr = jsonata('[blah..5, 3, -2..blah]');
            var result = expr.evaluate();
            var expected = [3];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[1.1 .. 5]', function () {
        it('should throw error', function () {
            var expr = jsonata('[1.1 .. 5]');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 7, token: '..', value: 1.1})
                .to.have.property('message').to.match(/LHS of range operator \(\.\.\) must evaluate to an integer/);
        });
    });

    describe('[1 .. 5.5]', function () {
        it('should throw error', function () {
            var expr = jsonata('[1 .. 5.5]');
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 5, token: '..', value: 5.5})
                .to.have.property('message').to.match(/RHS of range operator \(\.\.\) must evaluate to an integer/);
        });
    });

});

describe('Evaluator - object constructor', function () {
    describe('{}', function () {
        it('should return result object', function () {
            var expr = jsonata('{}');
            var result = expr.evaluate(testdata1);
            var expected = {};
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('{"key": "value"}', function () {
        it('should return result object', function () {
            var expr = jsonata('{"key": "value"}');
            var result = expr.evaluate(testdata1);
            var expected = {"key": "value"};
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('{"one": 1, "two": 2}', function () {
        it('should return result object', function () {
            var expr = jsonata('{"one": 1, "two": 2}');
            var result = expr.evaluate(testdata1);
            var expected = {"one": 1, "two": 2};
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('{"one": 1, "two": 2}.two', function () {
        it('should return result object', function () {
            var expr = jsonata('{"one": 1, "two": 2}.two');
            var result = expr.evaluate(testdata1);
            var expected = 2;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('{"one": 1, "two": {"three": 3, "four": "4"}}', function () {
        it('should return result object', function () {
            var expr = jsonata('{"one": 1, "two": {"three": 3, "four": "4"}}');
            var result = expr.evaluate(testdata1);
            var expected = {"one": 1, "two": {"three": 3, "four": "4"}};
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('{"one": 1, "two": [3, "four"]}', function () {
        it('should return result object', function () {
            var expr = jsonata('{"one": 1, "two": [3, "four"]}');
            var result = expr.evaluate(testdata1);
            var expected = {"one": 1, "two": [3, "four"]};
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('blah.{}', function () {
        it('should return result object', function () {
            var expr = jsonata('blah.{}');
            var result = expr.evaluate(testdata1);
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order{OrderID: Product."Product Name"}', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order{OrderID: Product."Product Name"}');
            var result = expr.evaluate(testdata2);
            var expected = {"order103": ["Bowler Hat", "Trilby hat"], "order104": ["Bowler Hat", "Cloak"]};
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order.{OrderID: Product."Product Name"}', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.{OrderID: Product."Product Name"}');
            var result = expr.evaluate(testdata2);
            var expected = [{"order103": ["Bowler Hat", "Trilby hat"]}, {"order104": ["Bowler Hat", "Cloak"]}];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order.Product{$string(ProductID): Price}', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product{$string(ProductID): Price}');
            var result = expr.evaluate(testdata2);
            var expected = {"345664": 107.99, "858236": 21.67, "858383": [34.45, 34.45]};
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order.Product{$string(ProductID): (Price)[0]}', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product{$string(ProductID): (Price)[0]}');
            var result = expr.evaluate(testdata2);
            var expected = {"345664": 107.99, "858236": 21.67, "858383": 34.45};
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order.Product.{$string(ProductID): Price}', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product.{$string(ProductID): Price}');
            var result = expr.evaluate(testdata2);
            var expected = [{"858383": 34.45}, {"858236": 21.67}, {"858383": 34.45}, {"345664": 107.99}];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order.Product{ProductID: "Product Name"}', function () {
        it('should throw error', function () {
            var expr = jsonata('Account.Order.Product{ProductID: "Product Name"}');
            expect(function () {
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 22, value: 858383})
                .to.have.property('message').to.match(/Key in object structure must evaluate to a string/);
        });
    });

    describe('Account.Order.Product.{ProductID: "Product Name"}', function () {
        it('should throw error', function () {
            var expr = jsonata('Account.Order.Product.{ProductID: "Product Name"}');
            expect(function () {
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 23, value: 858383})
                .to.have.property('message').to.match(/Key in object structure must evaluate to a string/);
        });
    });

    describe('Account.Order{OrderID: $sum(Product.(Price*Quantity))}', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order{OrderID: $sum(Product.(Price*Quantity))}');
            var result = expr.evaluate(testdata2);
            var expected = {"order103": 90.57000000000001, "order104": 245.79000000000002};
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order.{OrderID: $sum(Product.(Price*Quantity))}', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.{OrderID: $sum(Product.(Price*Quantity))}');
            var result = expr.evaluate(testdata2);
            var expected = [{"order103": 90.57000000000001}, {"order104": 245.79000000000002}];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('false', function () {
        it('should return result object', function () {
            var expr = jsonata('false');
            var result = expr.evaluate(testdata1);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('false or false', function () {
        it('should return result object', function () {
            var expr = jsonata('false or false');
            var result = expr.evaluate(testdata1);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('false or true', function () {
        it('should return result object', function () {
            var expr = jsonata('false or true');
            var result = expr.evaluate(testdata1);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('true or false', function () {
        it('should return result object', function () {
            var expr = jsonata('true or false');
            var result = expr.evaluate(testdata1);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('true or true', function () {
        it('should return result object', function () {
            var expr = jsonata('true or true');
            var result = expr.evaluate(testdata1);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('false and false', function () {
        it('should return result object', function () {
            var expr = jsonata('false and false');
            var result = expr.evaluate(testdata1);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('false and true', function () {
        it('should return result object', function () {
            var expr = jsonata('false and true');
            var result = expr.evaluate(testdata1);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('true and false', function () {
        it('should return result object', function () {
            var expr = jsonata('true and false');
            var result = expr.evaluate(testdata1);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('true and true', function () {
        it('should return result object', function () {
            var expr = jsonata('true and true');
            var result = expr.evaluate(testdata1);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$not(false)', function () {
        it('should return result object', function () {
            var expr = jsonata('$not(false)');
            var result = expr.evaluate(testdata1);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$not(true)', function () {
        it('should return result object', function () {
            var expr = jsonata('$not(true)');
            var result = expr.evaluate(testdata1);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('and=1 and or=2', function () {
        it('should return result object', function () {
            var expr = jsonata('and=1 and or=2');
            var result = expr.evaluate({"and": 1, "or": 2});
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('and>1 or or<=2', function () {
        it('should return result object', function () {
            var expr = jsonata('and>1 or or<=2');
            var result = expr.evaluate({"and": 1, "or": 2});
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('and>1 or or!=2', function () {
        it('should return result object', function () {
            var expr = jsonata('and>1 or or!=2');
            var result = expr.evaluate({"and": 1, "or": 2});
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('and and and', function () {
        it('should return result object', function () {
            var expr = jsonata('and and and');
            var result = expr.evaluate({"and": 1, "or": 2});
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });
});

describe('Evaluator - null', function () {
    describe('null', function () {
        it('should return result object', function () {
            var expr = jsonata('null');
            var result = expr.evaluate(testdata1);
            var expected = null;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[null]', function () {
        it('should return result object', function () {
            var expr = jsonata('[null]');
            var result = expr.evaluate(testdata1);
            var expected = [null];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('[null, null]', function () {
        it('should return result object', function () {
            var expr = jsonata('[null, null]');
            var result = expr.evaluate(testdata1);
            var expected = [null, null];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$not(null)', function () {
        it('should return result object', function () {
            var expr = jsonata('$not(null)');
            var result = expr.evaluate(testdata1);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('null = null', function () {
        it('should return result object', function () {
            var expr = jsonata('null = null');
            var result = expr.evaluate(testdata1);
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('null != null', function () {
        it('should return result object', function () {
            var expr = jsonata('null != null');
            var result = expr.evaluate(testdata1);
            var expected = false;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('{"true": true, "false":false, "null": null}', function () {
        it('should return result object', function () {
            var expr = jsonata('{"true": true, "false":false, "null": null}');
            var result = expr.evaluate(testdata1);
            var expected = {"true": true, "false": false, "null": null};
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });


});


describe('Evaluator - Conditional expressions', function () {
    describe('["Red"[$$="Bus"], "White"[$$="Police Car"]][0]', function () {
        it('should return result object', function () {
            var expr = jsonata('["Red"[$$="Bus"], "White"[$$="Police Car"]][0]');
            var result = expr.evaluate("Bus");
            var expected = "Red";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('["Red"[$$="Bus"], "White"[$$="Police Car"]][0]', function () {
        it('should return result object', function () {
            var expr = jsonata('["Red"[$$="Bus"], "White"[$$="Police Car"]][0]');
            var result = expr.evaluate("Police Car");
            var expected = "White";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('["Red"[$$="Bus"], "White"[$$="Police Car"]][0]', function () {
        it('should return result object', function () {
            var expr = jsonata('["Red"[$$="Bus"], "White"[$$="Police Car"]][0]');
            var result = expr.evaluate("Tuk tuk");
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$lookup({"Bus": "Red", "Police Car": "White"}, $$)', function () {
        it('should return result object', function () {
            var expr = jsonata('$lookup({"Bus": "Red", "Police Car": "White"}, $$)');
            var result = expr.evaluate("Bus");
            var expected = "Red";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$lookup({"Bus": "Red", "Police Car": "White"}, $$)', function () {
        it('should return result object', function () {
            var expr = jsonata('$lookup({"Bus": "Red", "Police Car": "White"}, $$)');
            var result = expr.evaluate("Police Car");
            var expected = "White";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('$lookup({"Bus": "Red", "Police Car": "White"}, $$)', function () {
        it('should return result object', function () {
            var expr = jsonata('$lookup({"Bus": "Red", "Police Car": "White"}, $$)');
            var result = expr.evaluate("Tuk tuk");
            var expected = undefined;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order.Product.(Price < 30 ? "Cheap"', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product.(Price < 30 ? "Cheap")');
            var result = expr.evaluate(testdata2);
            var expected = "Cheap";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order.Product.(Price < 30 ? "Cheap" : "Expensive")', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product.(Price < 30 ? "Cheap" : "Expensive")');
            var result = expr.evaluate(testdata2);
            var expected = ["Expensive", "Cheap", "Expensive", "Expensive"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order.Product.(Price < 30 ? "Cheap" : Price < 100 ? "Expensive" : "Rip off")', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product.(Price < 30 ? "Cheap" : Price < 100 ? "Expensive" : "Rip off")');
            var result = expr.evaluate(testdata2);
            var expected = ["Expensive", "Cheap", "Expensive", "Rip off"];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

});

describe('Evaluator - Lambda functions', function () {
    describe('function($x){$x*$x}(5)', function () {
        it('should return result object', function () {
            var expr = jsonata('function($x){$x*$x}(5)');
            var result = expr.evaluate(null);
            var expected = 25;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('($factorial:= function($x){$x <= 1 ? 1 : $x * $factorial($x-1)}; $factorial(4))', function () {
        it('should return result object', function () {
            var expr = jsonata('($factorial:= function($x){$x <= 1 ? 1 : $x * $factorial($x-1)}; $factorial(4))');
            var result = expr.evaluate(null);
            var expected = 24;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('($fibonacci := function($x){$x <= 1 ? $x : $fibonacci($x-1) + $fibonacci($x-2)}; [1,2,3,4,5,6,7,8,9].$fibonacci($))', function () {
        it('should return result object', function () {
            var expr = jsonata('($fibonacci := function($x){$x <= 1 ? $x : $fibonacci($x-1) + $fibonacci($x-2)}; [1,2,3,4,5,6,7,8,9].$fibonacci($))');
            var result = expr.evaluate(null);
            var expected = [1, 1, 2, 3, 5, 8, 13, 21, 34];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('($nth_price := function($n) { (Account.Order.Product.Price)[$n] }; $nth_price(1) )', function () {
        it('should return result object', function () {
            var expr = jsonata('($nth_price := function($n) { (Account.Order.Product.Price)[$n] }; $nth_price(1) )');
            var result = expr.evaluate(testdata2);
            var expected = 21.67;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
                .to.deep.contain({position: 81})
                .to.have.property('message').to.match(/Stack overflow error:/);
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
                .to.deep.contain({position: 46})
                .to.have.property('message').to.match(/Stack overflow error:/);
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
              .to.deep.contain({position: 37})
              .to.have.property('message').to.match(/Expression evaluation timeout:/);
        });
    });

    describe('mutually recursive - odd/even, tail calls', function () {
        this.timeout(5000);
        it('should return result object', function () {
            var expr = jsonata(
                '        (' +
                '          $even := function($n) { $n = 0 ? true : $odd($n-1) }; ' +
                '          $odd := function($n) { $n = 0 ? false : $even($n-1) }; ' +
                '          $odd(6555) ' +
                '        )' );
            timeboxExpression(expr, 4000, 500);
            var result = expr.evaluate();
            var expected = true;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

});

describe('Evaluator - Higher order functions', function () {
    describe('($twice:=function($f){function($x){$f($f($x))}}; $add3:=function($y){$y+3}; $add6:=$twice($add3); $add6(7))', function () {
        it('should return result object', function () {
            var expr = jsonata('($twice:=function($f){function($x){$f($f($x))}}; $add3:=function($y){$y+3}; $add6:=$twice($add3); $add6(7))');
            var result = expr.evaluate(null);
            var expected = 13;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Y-combinator: factorial(6)', function () {
        it('should return result object', function () {
            var expr = jsonata('λ($f) { λ($x) { $x($x) }( λ($g) { $f( (λ($a) {$g($g)($a)}))})}(λ($f) { λ($n) { $n < 2 ? 1 : $n * $f($n - 1) } })(6)');
            var result = expr.evaluate(null);
            var expected = 720;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Y-combinator: fibonacci(6)', function () {
        it('should return result object', function () {
            var expr = jsonata('λ($f) { λ($x) { $x($x) }( λ($g) { $f( (λ($a) {$g($g)($a)}))})}(λ($f) { λ($n) { $n <= 1 ? $n : $f($n-1) + $f($n-2) } })(6) ');
            var result = expr.evaluate(null);
            var expected = 8;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

});

describe('Evaluator - Block expressions', function () {
    describe('(1; 2; 3)', function () {
        it('should return result object', function () {
            var expr = jsonata('(1; 2; 3)');
            var result = expr.evaluate(null);
            var expected = 3;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('(1; 2; 3;)', function () {
        it('should return result object', function () {
            var expr = jsonata('(1; 2; 3;)');
            var result = expr.evaluate(null);
            var expected = 3;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('($a:=1; $b:=2; $c:=($a:=4; $a+$b); $a+$c)', function () {
        it('should return result object', function () {
            var expr = jsonata('($a:=1; $b:=2; $c:=($a:=4; $a+$b); $a+$c)');
            var result = expr.evaluate(null);
            var expected = 7;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('Account.Order.Product.($var1 := Price ; $var2:=Quantity; $var1 * $var2)', function () {
        it('should return result object', function () {
            var expr = jsonata('Account.Order.Product.($var1 := Price ; $var2:=Quantity; $var1 * $var2)');
            var result = expr.evaluate(testdata2);
            var expected = [68.9, 21.67, 137.8, 107.99];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('PFA - native functions', function () {
        it('should return result object', function () {
            var expr = jsonata(
                '(' +
                '  $firstn := $substring(?, 0, ?);' +
                '  $first5 := $firstn(?, 5);' +
                '  $first5("Hello World")' +
                ')' +
                ''
            );
            var result = expr.evaluate(testdata2);
            var expected = 'Hello';
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('PFA - on a non-function', function () {
        it('should throw error', function () {
            var expr = jsonata('substring(?, 0, ?)');
            expect(function () {
                expr.evaluate(expr);
            }).to.throw()
                .to.deep.contain({position: 10, token: 'substring'})
                .to.have.property('message').to.match(/Attempted to partially apply a non-function. Did you mean/);
        });
    });

    describe('PFA - on a non-function', function () {
        it('should throw error', function () {
            var expr = jsonata('unknown(?)');
            expect(function () {
                expr.evaluate(expr);
            }).to.throw()
                .to.deep.contain({position: 8, token: 'unknown'})
                .to.have.property('message').to.match(/Attempted to partially apply a non-function/);
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
              '  $map($add, $data.one) ' +
              ')  ');
            var result = expr.evaluate(null);
            var expected = [1, 4, 9, 16, 25];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('map combining two arrays', function () {
        it('should return result object', function () {
            var expr = jsonata(
              '(' +
              '  $data := {' +
              '    "one": [1,2,3,4,5],' +
              '    "two": [5,4,3,2,1]' +
              '  };' +
              '  $add := function($x, $y){$x+$y};' +
              '  $map($add, $data.one, $data.two) ' +
              ') ');
            var result = expr.evaluate(null);
            var expected = [6, 6, 6, 6, 6];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('map combining two arrays', function () {
        it('should return result object', function () {
            var expr = jsonata(
              '(' +
              '  $data := {' +
              '    "one": [1,2,3,4,5],' +
              '    "two": [5,4,3,2,1]' +
              '  };' +
              '  $add := function($x, $y){$x+$y};' +
              '  $data.$map($add, $.one, $.two) ' +
              ') ');
            var result = expr.evaluate(null);
            var expected = [6, 6, 6, 6, 6];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('map combining two arrays', function () {
        it('should return result object', function () {
            var expr = jsonata(
              '(' +
              '  $data := {' +
              '    "one": [1],' +
              '    "two": [5]' +
              '  };' +
              '  $add := function($x, $y){$x+$y};' +
              '  $data.$map($add, $.one, $.two) ' +
              ') ');
            var result = expr.evaluate(null);
            var expected = 6;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('map combining two arrays', function () {
        it('should return result object', function () {
            var expr = jsonata(
              '(' +
              '  $data := {' +
              '    "one": 1,' +
              '    "two": 5' +
              '  };' +
              '  $add := function($x, $y){$x+$y};' +
              '  $data.$map($add, $.one, $.two) ' +
              ') ');
            var result = expr.evaluate(null);
            var expected = 6;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
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
            var result = expr.evaluate(null);
            var expected = [];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

});

describe('HOF - reduce', function () {
    describe('sum numbers in an array', function () {
        it('should return result object', function () {
            var expr = jsonata(
              '(' +
              '  $seq := [1,2,3,4,5];' +
              '  $reduce(function($x, $y){$x+$y}, $seq)' +
              ') ');
            var result = expr.evaluate(null);
            var expected = 15;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('join numbers in an array as a string', function () {
        it('should return result object', function () {
            var expr = jsonata("" +
              "(" +
              "  $concat := function($s){function($a, $b){$string($a) & $s & $string($b)}};" +
              "  $comma_join := $concat(' ... ');" +
              "  $reduce($comma_join, [1,2,3,4,5])" +
              ")" +
              "      ");
            var result = expr.evaluate(null);
            var expected = "1 ... 2 ... 3 ... 4 ... 5";
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('sum numbers in an array, with init', function () {
        it('should return result object', function () {
            var expr = jsonata(
              '(' +
              '  $seq := [1,2,3,4,5];' +
              '  $reduce(function($x, $y){$x+$y}, $seq, 2)' +
              ')' );
            var result = expr.evaluate(null);
            var expected = 17;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('sum numbers in an array, with init', function () {
        it('should return result object', function () {
            var expr = jsonata(
              '(' +
              '  $seq := 1;' +
              '  $reduce(function($x, $y){$x+$y}, $seq)' +
              ')' );
            var result = expr.evaluate(null);
            var expected = 1;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('sum numbers in an array - singleton', function () {
        it('should return result object', function () {
            var expr = jsonata(
              '(' +
              '  $seq := 1;' +
              '  $reduce(function($x, $y){$x+$y}, $seq)' +
              ')' );
            var result = expr.evaluate(null);
            var expected = 1;
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('reduce with built-in function', function () {
        it('should return result object', function () {
            var expr = jsonata('$reduce($append, Account.Order.Product.Quantity)');
            var result = expr.evaluate(testdata2);
            var expected = [2, 1, 4, 1];
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
    });

    describe('reduce function with one argument', function () {
        it('should throw error', function () {
            var expr = jsonata(
              '(' +
              '  $seq := 1;' +
              '  $reduce(function($x){$x}, $seq)' +
              ')' );
            expect(function () {
                expr.evaluate();
            }).to.throw()
                .to.deep.contain({position: 23})
                .to.have.property('message').to.match(/The first argument of the reduce function must be a function of arity 2/);
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
            assert.equal(JSON.stringify(result), JSON.stringify(expected));
        });
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
                    .to.deep.contain({token: '(end)', value: ')'})
                    .to.have.property('message').to.match(/Syntax error: expected \'\)\' before end of expression/);
            });

            it('unsupported function, e.g. $unknown()', function () {
                var expr = '$unknown(Salutation)';

                var evaluate = function () {
                    jsonata(expr).evaluate(person);
                };

                expect(evaluate).to.throw()
                    .to.deep.contain({position: 9, token: 'unknown'})
                    .to.have.property('message').to.match(/Attempted to invoke a non-function/);
            });

            it('unsupported function, e.g. $decrypt()', function () {
                var expr = '$decrypt(Salutation)';

                // Alter tree to force an unsupported type
                var prep = jsonata(expr);

                var evaluate = function () {
                    prep.evaluate(person);
                };

                expect(evaluate).to.throw()
                    .to.deep.contain({position: 9, token: 'decrypt'})
                    .to.have.property('message').to.match(/Attempted to invoke a non-function/);
            });

            it('unsupported function, e.g. Employment.authentication()', function () {
                var expr = 'Employment.authentication(Salutation)';

                var evaluate = function () {
                    jsonata(expr).evaluate(person);
                };

                expect(evaluate).to.throw()
                    .to.deep.contain({position: 26, token: 'authentication'})
                    .to.have.property('message').to.match(/Attempted to invoke a non-function/);
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
                    .to.deep.contain({position: 11, token: 'lowercase'})
                    .to.have.property('message').to.match(/The lowercase function expects one argument/);
            });

            it('$lowercase(Salary) - Field <NAME> is null', function () {
                expect(function () {
                    jsonata('$lowercase(Salary)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, token: 'lowercase', value: null})
                    .to.have.property('message').to.match(/Type error: argument of lowercase function must evaluate to a string/);
            });

            it('$lowercase(20) - Function lowercase expects a string argument', function () {
                expect(function () {
                    jsonata('$lowercase(20)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, token: 'lowercase', value: 20})
                    .to.have.property('message').to.match(/Type error: argument of lowercase function must evaluate to a string/);
            });

            it('$lowercase(20.55) - Function lowercase expects a string argument', function () {
                expect(function () {
                    jsonata('$lowercase(20.55)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, token: 'lowercase', value: 20.55})
                    .to.have.property('message').to.match(/Type error: argument of lowercase function must evaluate to a string/);
            });


            it('$lowercase(Employment) - Does not expect an object', function () {
                expect(function () {
                    jsonata('$lowercase(Employment)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, token: 'lowercase'})
                    .to.have.property('message').to.match(/Type error: argument of lowercase function must evaluate to a string/);
            });

            it('$lowercase(Qualifications) - Does not expect an array', function () {
                expect(function () {
                    jsonata('$lowercase(Qualifications)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, token: 'lowercase'})
                    .to.have.property('message').to.match(/Type error: argument of lowercase function must evaluate to a string/);
            });
        });

        describe('uppercase', function () {
            it('$uppercase("Coca","Cola") - Only expects a single argument', function () {
                expect(function () {
                    jsonata('$uppercase("Coca", "Cola")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, token: 'uppercase'})
                    .to.have.property('message').to.match(/The uppercase function expects one argument/);
            });

            it('$uppercase(Salary) - Field <NAME> is null', function () {
                expect(function () {
                    jsonata('$uppercase(Salary)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, token: 'uppercase', value: null})
                    .to.have.property('message').to.match(/Type error: argument of uppercase function must evaluate to a string/);
            });

            it('$uppercase(20) - Function uppercase expects a string argument', function () {
                expect(function () {
                    jsonata('$uppercase(28)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, token: 'uppercase', value: 28})
                    .to.have.property('message').to.match(/Type error: argument of uppercase function must evaluate to a string/);
            });

            it('$uppercase(20.55) - Function uppercase expects a string argument', function () {
                expect(function () {
                    jsonata('$uppercase(20.55)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, token: 'uppercase', value: 20.55})
                    .to.have.property('message').to.match(/Type error: argument of uppercase function must evaluate to a string/);
            });

            it('$uppercase(Cars) - Function uppercase expects a string argument', function () {
                expect(function () {
                    jsonata('$uppercase(Cars)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, token: 'uppercase', value: 3})
                    .to.have.property('message').to.match(/Type error: argument of uppercase function must evaluate to a string/);
            });

            it('$uppercase(Employment) - Does not expect an object', function () {
                expect(function () {
                    jsonata('$uppercase(Employment)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, token: 'uppercase'})
                    .to.have.property('message').to.match(/Type error: argument of uppercase function must evaluate to a string/);
            });

            it('$uppercase(Qualifications) - Does not expect an array', function () {
                expect(function () {
                    jsonata('$uppercase(Qualifications)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, token: 'uppercase'})
                    .to.have.property('message').to.match(/Type error: argument of uppercase function must evaluate to a string/);
            });
        });

        describe('substringBefore', function () {
            it('$substringBefore() - Expects 2 arguments', function () {
                expect(function () {
                    jsonata('$substringBefore("Coca" & "ca")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 17, token: 'substringBefore'})
                    .to.have.property('message').to.match(/The substringBefore function expects two arguments/);
            });

            it('$substringBefore(Salary,"xx") - Field <NAME> is null', function () {
                expect(function () {
                    jsonata('$substringBefore(Salary,"xx")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 17, token: 'substringBefore', value: null})
                    .to.have.property('message').to.match(/Type error: first argument of substringBefore function must evaluate to a string/);
            });

            it('$substringBefore(22,"xx") - Function substringBefore expects 2 string arguments', function () {
                expect(function () {
                    jsonata('$substringBefore(22,"xx")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 17, token: 'substringBefore', value: 22})
                    .to.have.property('message').to.match(/Type error: first argument of substringBefore function must evaluate to a string/);
            });

            it('$substringBefore(22.55,"xx") - Function substringBefore expects 2 string arguments', function () {
                expect(function () {
                    jsonata('$substringBefore(22.55,"xx")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 17, token: 'substringBefore', value: 22.55})
                    .to.have.property('message').to.match(/Type error: first argument of substringBefore function must evaluate to a string/);
            });

            it('$substringBefore("22",0) - Function substringBefore expects 2 string arguments', function () {
                expect(function () {
                    jsonata('$substringBefore("22",2)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 17, token: 'substringBefore', value: 2})
                    .to.have.property('message').to.match(/Type error: second argument of substringBefore function must evaluate to a string/);
            });

            it('$substringBefore("22.55",5) - Function substringBefore expects 2 string arguments', function () {
                expect(function () {
                    jsonata('$substringBefore("22.55",5)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 17, token: 'substringBefore', value: 5})
                    .to.have.property('message').to.match(/Type error: second argument of substringBefore function must evaluate to a string/);
            });

            it('$substringBefore(Employment,"xx") - Does not expect an object', function () {
                expect(function () {
                    jsonata('$substringBefore(Employment,"xx")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 17, token: 'substringBefore'})
                    .to.have.property('message').to.match(/Type error: first argument of substringBefore function must evaluate to a string/);
            });

            it('$substringBefore(Qualifications,"xx") - Does not expect an array', function () {
                expect(function () {
                    jsonata('$substringBefore(Qualifications,"xx")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 17, token: 'substringBefore'})
                    .to.have.property('message').to.match(/Type error: first argument of substringBefore function must evaluate to a string/);
            });
        });

        describe('substringAfter', function () {
            it('$substringAfter() - Expects 2 arguments', function () {
                expect(function () {
                    jsonata('$substringAfter("Coca" & "ca")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 16, token: 'substringAfter'})
                    .to.have.property('message').to.match(/The substringAfter function expects two arguments/);
            });

            it('$substringAfter(Salary,"xx") - Field <NAME> is null', function () {
                expect(function () {
                    jsonata('$substringAfter(Salary,"xx")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 16, token: 'substringAfter', value: null})
                    .to.have.property('message').to.match(/Type error: first argument of substringAfter function must evaluate to a string/);
            });

            it('$substringAfter(22,"xx") - Function substringAfter expects 2 string arguments', function () {
                expect(function () {
                    jsonata('$substringAfter(22,"xx")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 16, token: 'substringAfter', value: 22})
                    .to.have.property('message').to.match(/Type error: first argument of substringAfter function must evaluate to a string/);
            });

            it('$substringAfter(22.55,"xx") - Function substringAfter expects 2 string arguments', function () {
                expect(function () {
                    jsonata('$substringAfter(22.55,"xx")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 16, token: 'substringAfter', value: 22.55})
                    .to.have.property('message').to.match(/Type error: first argument of substringAfter function must evaluate to a string/);
            });

            it('$substringAfter("22",0) - Function substringAfter expects 2 string arguments', function () {
                expect(function () {
                    jsonata('$substringAfter("22",2)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 16, token: 'substringAfter', value: 2})
                    .to.have.property('message').to.match(/Type error: second argument of substringAfter function must evaluate to a string/);
            });

            it('$substringAfter("22.55",5) - Function substringAfter expects 2 string arguments', function () {
                expect(function () {
                    jsonata('$substringAfter("22.55",5)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 16, token: 'substringAfter', value: 5})
                    .to.have.property('message').to.match(/Type error: second argument of substringAfter function must evaluate to a string/);
            });

            it('$substringAfter(Employment,"xx") - Does not expect an object', function () {
                expect(function () {
                    jsonata('$substringAfter(Employment,"xx")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 16, token: 'substringAfter'})
                    .to.have.property('message').to.match(/Type error: first argument of substringAfter function must evaluate to a string/);
            });

            it('$substringAfter(Qualifications,"xx") - Does not expect an array', function () {
                expect(function () {
                    jsonata('$substringAfter(Qualifications,"xx")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 16, token: 'substringAfter'})
                    .to.have.property('message').to.match(/Type error: first argument of substringAfter function must evaluate to a string/);
            });
        });

        describe('substring', function () {
            it('$substring() - Expects 2 or 3 arguments', function () {
                expect(function () {
                    jsonata('$substring("Coca" & "ca", 2, 4, 5)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, token: 'substring'})
                    .to.have.property('message').to.match(/The substring function expects two or three arguments/);
            });

            it('$substring() with non-numeric second argument', function () {
                expect(function () {
                    jsonata('$substring("Coca", "Mr", 4)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, token: 'substring', value: "Mr"})
                    .to.have.property('message').to.match(/Type error: second argument of substring function must evaluate to a number/);
            });

            it('$substring() with non-numeric third argument', function () {
                expect(function () {
                    jsonata('$substring("Coca", 3, "Whoops")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, token: 'substring', value: "Whoops"})
                    .to.have.property('message').to.match(/Type error: third argument of substring function must evaluate to a number/);
            });

            it('$substring(Salary,2,4) - Field <NAME> is null', function () {
                expect(function () {
                    jsonata('$substring(Salary,2,4)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, token: 'substring', value: null})
                    .to.have.property('message').to.match(/Type error: first argument of substring function must evaluate to a string/);
            });

            it('$substring() - last two arguments to be integers', function () {
                expect(function () {
                    jsonata('$substring("Hello","World",5)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, token: 'substring', value: "World"})
                    .to.have.property('message').to.match(/Type error: second argument of substring function must evaluate to a number/);

                expect(function () {
                    jsonata('$substring("Hello",5,"World")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, token: 'substring', value: "World"})
                    .to.have.property('message').to.match(/Type error: third argument of substring function must evaluate to a number/);

                var result = jsonata('$substring("Hello World",5.5,5)').evaluate(person);
                expect(result).to.equal(" Worl");
            });

            it('$substring(Employment,6,5) - Does not expect an object', function () {
                expect(function () {
                    jsonata('$substring(Employment,"xx")').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, token: 'substring'})
                    .to.have.property('message').to.match(/Type error: first argument of substring function must evaluate to a string/);
            });

            it('$substring(Qualifications,6,5) - Does not expect an array', function () {
                expect(function () {
                    jsonata('$substring(Qualifications,6,5)').evaluate(person);
                }).to.throw()
                    .to.deep.contain({position: 11, token: 'substring'})
                    .to.have.property('message').to.match(/Type error: first argument of substring function must evaluate to a string/);
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

