"use strict";

var jsonata = require('../src/jsonata');
var assert = require('assert');
var chai = require("chai");
var expect = chai.expect;

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
                        "stages": [
                            {
                                "expr": {
                                    "value": 0,
                                    "type": "number",
                                    "position": 15
                                },
                                "position": 14,
                                "type": "filter"
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
                        "stages": [
                            {
                                "expr": {
                                    "type": "error",
                                    "error": {
                                        "code": "S0207",
                                        "position": 8,
                                        "token": "(end)"
                                    }
                                },
                                "position": 8,
                                "type": "filter"
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
                        "stages": [
                            {
                                "expr": {
                                    "code": "S0211",
                                    "token": ";",
                                    "position": 15,
                                    "remaining": [
                                        {"value": 0, "type": "number", "position": 16},
                                        {"type": "operator", "value": "]", "position": 17},
                                        {"type": "operator", "value": ".", "position": 18},
                                        {"type": "name", "value": "Product", "position": 25}
                                    ],
                                    "type": "error"
                                },
                                "position": 14,
                                "type": "filter"
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
                        {"value": 0, "type": "number", "position": 16},
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
                            "type": "number",
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
                        "stages": [
                            {
                                "expr": {
                                    "value": 0,
                                    "type": "number",
                                    "position": 15
                                },
                                "position": 14,
                                "type": "filter"
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
                        "stages": [
                            {
                                "expr": {
                                    "value": 0,
                                    "type": "number",
                                    "position": 15
                                },
                                "position": 14,
                                "type": "filter"
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

    describe('$inputSource[0].UnstructuredAnswers^()[0].Text', function() {
        it('should return ast', function() {
            var expr = jsonata('$inputSource[0].UnstructuredAnswers^()[0].Text', { recover: true });
            var ast = expr.ast();
            var expected_ast = {
                    "type": "path",
                    "steps": [
                        {
                            "value": "inputSource",
                            "type": "variable",
                            "position": 12,
                            "predicate": [
                                {
                                    "type": "filter",
                                    "expr": {
                                        "value": 0,
                                        "type": "number",
                                        "position": 14
                                    },
                                    "position": 13
                                }
                            ]
                        },
                        {
                            "value": "UnstructuredAnswers",
                            "type": "name",
                            "position": 35
                        },
                        {
                            "type": "sort",
                            "terms": [
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
                                                "type": "filter",
                                                "expr": {
                                                    "type": "error",
                                                    "error": {
                                                        "code": "S0207",
                                                        "position": 46,
                                                        "token": "(end)"
                                                    }
                                                },
                                                "position": 39
                                            }
                                        ]
                                    }
                                }
                            ],
                            "position": 36
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
                            "expr": {
                                "error": {
                                    "code": "S0207",
                                    "position": 46,
                                    "token": "(end)"
                                },
                                "type": "error"
                            },
                            "position": 39,
                            "type": "filter"
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

    describe('«a {x;} b»', function() {
        it('should return ast', function() {
            var expr = jsonata('«a {x;} b»', { recover: true });
            var ast = expr.ast();
            var expected_ast = {
                "type": "template",
                "value": "«",
                "position": 1,
                "parts": [
                    "a ",
                    {
                        "expression": {
                            "type": "path",
                            "steps": [
                                {
                                    "value": "x",
                                    "type": "name",
                                    "position": 5
                                }
                            ]
                        },
                        "position": 4
                    }
                ]
            };
            var errors = expr.errors();
            var expected_errors = [
                {
                    "code": "S0202",
                    "position": 6,
                    "token": ";",
                    "value": "}",
                    "remaining": [
                        {
                            "type": "operator",
                            "value": ";",
                            "position": 6
                        },
                        {
                            "type": "operator",
                            "value": "}",
                            "position": 7
                        },
                        {
                            "type": "template-text",
                            "value": " b",
                            "position": 9
                        },
                        {
                            "type": "template-end",
                            "value": "»",
                            "position": 10
                        }
                    ]
                }
            ];
            assert.deepEqual(ast, expected_ast);
            assert.deepEqual(errors, expected_errors);
        });
    });

    describe('«abc', function() {
        it('should return ast', function() {
            var expr = jsonata('«abc', { recover: true });
            var ast = expr.ast();
            var expected_ast = {
                "type": "template",
                "value": "«",
                "position": 1,
                "parts": ["abc"]
            };
            var errors = expr.errors();
            var expected_errors = [
                {
                    "code": "S0107",
                    "position": 4,
                    "value": "»",
                    "remaining": []
                }
            ];
            assert.deepEqual(ast, expected_ast);
            assert.deepEqual(errors, expected_errors);
        });
    });

    describe('«Hello {name}', function() {
        it('should return ast', function() {
            var expr = jsonata('«Hello {name}', { recover: true });
            var ast = expr.ast();
            var expected_ast = {
                "type": "template",
                "value": "«",
                "position": 1,
                "parts": [
                    "Hello ",
                    {
                        "expression": {
                            "type": "path",
                            "steps": [
                                {
                                    "value": "name",
                                    "type": "name",
                                    "position": 12
                                }
                            ]
                        },
                        "position": 8
                    }
                ]
            };
            var errors = expr.errors();
            var expected_errors = [
                {
                    "code": "S0107",
                    "position": 13,
                    "value": "»",
                    "remaining": []
                }
            ];
            assert.deepEqual(ast, expected_ast);
            assert.deepEqual(errors, expected_errors);
        });
    });

    describe('«a {x;} b', function() {
        it('should record the error inside the braces without throwing', function() {
            var expr = jsonata('«a {x;} b', { recover: true });
            var errors = expr.errors().map(err => ({ code: err.code, position: err.position }));
            assert.deepEqual(errors, [{ code: "S0202", position: 6 }]);
        });
    });

    describe('<<a {«b', function() {
        it('should report the unterminated inner template and the missing }', function() {
            var expr = jsonata('<<a {«b', { recover: true });
            var errors = expr.errors().map(err => ({ code: err.code, position: err.position, value: err.value }));
            assert.deepEqual(errors, [
                { code: "S0107", position: 7, value: "»" },
                { code: "S0203", position: 7, value: "}" }
            ]);
        });
    });

    describe('«a {+} b»', function() {
        it('should recover from an invalid expression inside a closed template', function() {
            var expr = jsonata('«a {+} b»', { recover: true });
            var errors = expr.errors().map(err => ({ code: err.code, position: err.position, token: err.token }));
            assert.deepEqual(errors, [{ code: "S0211", position: 5, token: "+" }]);
        });
    });

    describe('«s3://{bucket;}/x»', function() {
        it('should tokenize the rest of the template as text, not as a regex', function() {
            var expr = jsonata('«s3://{bucket;}/x»', { recover: true });
            var errors = expr.errors();
            assert.equal(errors.length, 1);
            assert.equal(errors[0].code, "S0202");
            assert.deepEqual(errors[0].remaining.slice(-2), [
                { type: "template-text", value: "/x", position: 17 },
                { type: "template-end", value: "»", position: 18 }
            ]);
        });
    });

    describe('An expression with syntax error should not be executable', function() {
        describe('Account.', function() {
            it('should return ast', function() {
                var expr = jsonata('Account.', { recover: true });
                return expect(expr.evaluate({}))
                    .to.be.rejected
                    .to.eventually.deep.contain({position: 0, code: 'S0500'});
            });
        });
    });
});
