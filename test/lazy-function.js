"use strict";

var jsonata = require('../jsonata');
//var assert = require('assert');
var chai = require("chai");
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

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

var sync = function(arg) {
    return Promise.resolve(arg());
};

describe('Evaluator - Lazy functions: transform', function () {
    describe('$ ~> $transform(Account.Order.Product, {"Total":Price*Quantity}, ["Description", "SKU"])', function () {
        it('should return result object', function () {
            var expr = jsonata('$ ~> $transform(Account.Order.Product, {"Total":Price*Quantity}, ["Description", "SKU"])');
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

    describe('$ ~> $transform(Account.Order.Product, {"Total":Price*Quantity, "Price": Price * 1.2})', function () {
        it('should return result object', function () {
            var expr = jsonata('$ ~> $transform(Account.Order.Product, {"Total":Price*Quantity, "Price": Price * 1.2})');
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

    describe('$transform($, Account.Order.Product, {}, "Description")', function () {
        it('should return result object', function () {
            var expr = jsonata('$transform($, Account.Order.Product, {}, "Description")');
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

    describe('$ ~> $transform(Account.Order.Product, nomatch, "Description")', function () {
        it('should return result object', function () {
            var expr = jsonata('$ ~> $transform(Account.Order.Product, nomatch, "Description")');
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

    describe('$transform($, (Account.Order.Product)[0], {"Description":"blah"})', function () {
        it('should return result object', function () {
            var expr = jsonata('$transform($, (Account.Order.Product)[0], {"Description":"blah"})');
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

    describe('$ ~> $transform(foo.bar, {"Description":"blah"})', function () {
        it('should return result object', function () {
            var expr = jsonata('$ ~> $transform(foo.bar, {"Description":"blah"})');
            var result = expr.evaluate(testdata2);
            var expected = testdata2;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('Account ~> $transform(Order, {"Product":"blah"}, nomatch)', function () {
        it('should return result object', function () {
            var expr = jsonata('Account ~> $transform(Order, {"Product":"blah"}, nomatch)');
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

    describe('$transform($, Account.Order.Product, {"Price": Price  ~> $formatNumber("£#0.00"), "Tax": Price * 0.2 ~> $round(2)}, ["Description", "Product Name", "ProductID", "SKU"])', function () {
        it('should return result object', function () {
            var expr = jsonata('$transform($, Account.Order.Product, {"Price": Price  ~> $formatNumber("£#0.00"), "Tax": Price * 0.2 ~> $round(2)}, ["Description", "Product Name", "ProductID", "SKU"])');
            var result = expr.evaluate(testdata2);
            var expected = {
                "Account": {
                    "Account Name": "Firefly",
                    "Order": [
                        {
                            "OrderID": "order103",
                            "Product": [
                                {
                                    "Price": "£34.45",
                                    "Quantity": 2,
                                    "Tax": 6.89
                                },
                                {
                                    "Price": "£21.67",
                                    "Quantity": 1,
                                    "Tax": 4.33
                                }
                            ]
                        },
                        {
                            "OrderID": "order104",
                            "Product": [
                                {
                                    "Price": "£34.45",
                                    "Quantity": 4,
                                    "Tax": 6.89
                                },
                                {
                                    "Price": "£107.99",
                                    "Quantity": 1,
                                    "Tax": 21.6
                                }
                            ]
                        }
                    ]
                }
            };
            expect(result).to.deep.equal(expected);
        });
    });

    describe('foo ~> $transform(foo.bar, {"Description":"blah"})', function () {
        it('should return result object', function () {
            var expr = jsonata('foo ~> $transform(foo.bar, {"Description":"blah"})');
            var result = expr.evaluate(testdata2);
            var expected = undefined;
            expect(result).to.deep.equal(expected);
        });
    });

    describe('transform expression with wrong insert/update type', function () {
        it('should throw error', function () {
            var expr = jsonata('Account ~> $transform(Order, 5)');
            expect(function () {
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 22, code: 'T2011', value: 5});
        });
    });

    describe('transform expression with wrong delete type', function () {
        it('should throw error', function () {
            var expr = jsonata('Account ~> $transform(Order, {}, 5)');
            expect(function () {
                expr.evaluate(testdata2);
            }).to.throw()
                .to.deep.contain({position: 22, code: 'T2012', value: 5});
        });
    });

});

describe('EXPERIMENTAL - delayed evaluation', function () {
    it('register lazy function', function () {
        var expr = jsonata('$sync("foo")');
        expr.registerLazyFunction('sync', sync);

        var callback = function(err, result) {
            err;
            result;
            //console.log('callback:', result, err);
        };

        expr.evaluate({foo: 'bar'}, {}, callback);

    });
});