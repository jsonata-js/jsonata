"use strict";

var jsonata = require('../src').jsonata;
var assert = require('assert');

describe('Invoke parser with valid expression', function() {
    describe('Account.Order[0]', function() {
        it('should return ast', function() {
            var expr = jsonata('Account.Order[0]', { recover: true });
            var ast = expr.ast();
            var expected_ast = {
                "type": "path",
                "steps": [
                    {
                        "value": "Account",
                        "type": "name",
                        "position": 7
                    },
                    {
                        "value": "Order",
                        "type": "name",
                        "position": 13,
                        "predicate": [
                            {
                                "value": 0,
                                "type": "literal",
                                "position": 15
                            }
                        ]
                    }
                ]
            };
            var errors = expr.errors();
            var expected_errors = undefined;
            assert.deepEqual(ast, expected_ast);
            assert.deepEqual(errors, expected_errors);
        });
    });
});

describe('Invoke parser with incomplete expression', function() {
    describe('Account.', function() {
        it('should return ast', function() {
            var expr = jsonata('Account.', { recover: true });
            var ast = expr.ast();
            var expected_ast = {
                "type": "path",
                "steps": [
                    {
                        "value": "Account",
                        "type": "name",
                        "position": 7
                    },
                    {
                        "type": "error",
                        "error": {
                            "code": "S0207",
                            "position": 8,
                            "token": "(end)"
                        }
                    }
                ]
            };
            var errors = expr.errors();
            var expected_errors = [
                {
                    "code": "S0207",
                    "position": 8,
                    "token": "(end)"
                }
            ];
            assert.deepEqual(ast, expected_ast);
            assert.deepEqual(errors, expected_errors);
        });
    });

    describe('Account[', function() {
        it('should return ast', function() {
            var expr = jsonata('Account[', { recover: true });
            var ast = expr.ast();
            var expected_ast = {
                "type": "path",
                "steps": [
                    {
                        "value": "Account",
                        "type": "name",
                        "position": 7,
                        "predicate": [
                            {
                                "type": "error",
                                "error": {
                                    "code": "S0207",
                                    "position": 8,
                                    "token": "(end)"
                                }
                            }
                        ]
                    }
                ]
            };
            var errors = expr.errors();
            var expected_errors =   [
                {
                    "code": "S0203",
                    "position": 8,
                    "token": "(end)",
                    "value": "]",
                    "remaining": []
                },
                {
                    "code": "S0207",
                    "position": 8,
                    "token": "(end)"
                }
            ];
            assert.deepEqual(ast, expected_ast);
            assert.deepEqual(errors, expected_errors);
        });
    });

    describe('Account.Order[;0].Product', function() {
        it('should return ast', function() {
            var expr = jsonata('Account.Order[;0].Product', { recover: true });
            var ast = expr.ast();
            var expected_ast = {
                "type": "path",
                "steps": [
                    {
                        "value": "Account",
                        "type": "name",
                        "position": 7
                    },
                    {
                        "value": "Order",
                        "type": "name",
                        "position": 13,
                        "predicate": [
                            {
                                "code": "S0211",
                                "token": ";",
                                "position": 15,
                                "remaining": [
                                    {"value": 0, "type": "literal", "position": 16},
                                    {"type": "operator", "value": "]", "position": 17},
                                    {"type": "operator", "value": ".", "position": 18},
                                    {"type": "name", "value": "Product", "position": 25}
                                ],
                                "type": "error"
                            }
                        ]
                    }
                ]
            };
            var errors = expr.errors();
            var expected_errors =   [
                {
                    "code": "S0211",
                    "token": ";",
                    "position": 15,
                    "remaining": [
                        {"value": 0, "type": "literal", "position": 16},
                        {"type": "operator", "value": "]", "position": 17},
                        {"type": "operator", "value": ".", "position": 18},
                        {"type": "name", "value": "Product", "position": 25}
                    ],
                    "type": "error"
                },
                {
                    "code": "S0202",
                    "position": 16,
                    "token": "0",
                    "value": "]",
                    "remaining": [
                        {
                            "value": 0,
                            "type": "literal",
                            "position": 16
                        }
                    ]
                }
            ];
            assert.deepEqual(ast, expected_ast);
            assert.deepEqual(errors, expected_errors);
        });
    });

    describe('Account.Order[0;].Product', function() {
        it('should return ast', function() {
            var expr = jsonata('Account.Order[0;].Product', { recover: true });
            var ast = expr.ast();
            var expected_ast = {
                "type": "path",
                "steps": [
                    {
                        "value": "Account",
                        "type": "name",
                        "position": 7
                    },
                    {
                        "value": "Order",
                        "type": "name",
                        "position": 13,
                        "predicate": [
                            {
                                "value": 0,
                                "type": "literal",
                                "position": 15
                            }
                        ]
                    }
                ]
            };
            var errors = expr.errors();
            var expected_errors =   [
                {
                    "code": "S0202",
                    "position": 16,
                    "token": ";",
                    "value": "]",
                    "remaining": [
                        {"value": ";", "type": "operator", "position": 16},
                        {"type": "operator", "value": "]", "position": 17},
                        {"type": "operator", "value": ".", "position": 18},
                        {"type": "name", "value": "Product", "position": 25}
                    ]
                }
            ];
            assert.deepEqual(ast, expected_ast);
            assert.deepEqual(errors, expected_errors);
        });
    });

    describe('Account.Order[0].Product;', function() {
        it('should return ast', function() {
            var expr = jsonata('Account.Order[0].Product;', { recover: true });
            var ast = expr.ast();
            var expected_ast = {
                "type": "path",
                "steps": [
                    {
                        "value": "Account",
                        "type": "name",
                        "position": 7
                    },
                    {
                        "value": "Order",
                        "type": "name",
                        "position": 13,
                        "predicate": [
                            {
                                "value": 0,
                                "type": "literal",
                                "position": 15
                            }
                        ]
                    },
                    {
                        "value": "Product",
                        "type": "name",
                        "position": 24
                    }
                ]
            };
            var errors = expr.errors();
            var expected_errors = [
                {
                    "code": "S0201",
                    "position": 25,
                    "remaining": [
                        {
                            "position": 25,
                            "type": "operator",
                            "value": ";"
                        }
                    ],
                    "token": ";"
                }
            ];
            assert.deepEqual(ast, expected_ast);
            assert.deepEqual(errors, expected_errors);
        });
    });

    describe('$equals3lucy[0].UnstructuredAnswers^()[0].Text', function() {
        it('should return ast', function() {
            var expr = jsonata('$equals3lucy[0].UnstructuredAnswers^()[0].Text', { recover: true });
            var ast = expr.ast();
            var expected_ast = {
                "type": "sort",
                "value": "^",
                "position": 36,
                "lhs": {
                    "type": "path",
                    "steps": [
                        {
                            "value": "equals3lucy",
                            "type": "variable",
                            "position": 12,
                            "predicate": [
                                {
                                    "value": 0,
                                    "type": "literal",
                                    "position": 14
                                }
                            ]
                        },
                        {
                            "value": "UnstructuredAnswers",
                            "type": "name",
                            "position": 35
                        }
                    ]
                },
                "rhs": [
                    {
                        "descending": false,
                        "expression": {
                            "code": "S0211",
                            "token": ")",
                            "position": 38,
                            "remaining": [
                                {
                                    "type": "operator",
                                    "value": "[",
                                    "position": 39
                                },
                                {
                                    "type": "number",
                                    "value": 0,
                                    "position": 40
                                },
                                {
                                    "type": "operator",
                                    "value": "]",
                                    "position": 41
                                },
                                {
                                    "type": "operator",
                                    "value": ".",
                                    "position": 42
                                },
                                {
                                    "type": "name",
                                    "value": "Text",
                                    "position": 46
                                }
                            ],
                            "type": "error",
                            "predicate": [
                                {
                                    "type": "error",
                                    "error": {
                                        "code": "S0207",
                                        "position": 46,
                                        "token": "(end)"
                                    }
                                }
                            ]
                        }
                    }
                ]
            };
            var errors = expr.errors();
            var expected_errors = [
                {
                    "code": "S0211",
                    "position": 38,
                    "predicate": [
                        {
                            "error": {
                                "code": "S0207",
                                "position": 46,
                                "token": "(end)"
                            },
                            "type": "error"
                        }
                    ],
                    "remaining": [
                        {
                            "position": 39,
                            "type": "operator",
                            "value": "["
                        },
                        {
                            "position": 40,
                            "type": "number",
                            "value": 0
                        },
                        {
                            "position": 41,
                            "type": "operator",
                            "value": "]"
                        },
                        {
                            "position": 42,
                            "type": "operator",
                            "value": "."
                        },
                        {
                            "position": 46,
                            "type": "name",
                            "value": "Text"
                        }
                    ],
                    "token": ")",
                    "type": "error"
                },
                {
                    "code": "S0203",
                    "position": 46,
                    "remaining": [],
                    "token": "(end)",
                    "value": "]"
                },
                {
                    "code": "S0203",
                    "position": 46,
                    "remaining": [],
                    "token": "(end)",
                    "value": ")"
                },
                {
                    "code": "S0207",
                    "position": 46,
                    "token": "(end)"
                }
            ];
            assert.deepEqual(ast, expected_ast);
            assert.deepEqual(errors, expected_errors);
        });
    });

    describe('An expression with syntax error should not be executable', function() {
        describe('Account.', function() {
            it('should return ast', function() {
                var expr = jsonata('Account.', { recover: true });
                let error = false;
                try {
                    expr.evaluate({});
                } catch(e) {
                    expect(e.position).toEqual(0);
                    expect(e.code).toEqual("S0500");
                    error = true;
                }
                expect(error).toBeTruthy();
            });
        });
    });

});

