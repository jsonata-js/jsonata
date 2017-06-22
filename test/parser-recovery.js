"use strict";

var jsonata = require('../jsonata');
var assert = require('assert');

describe('Invoke parser with valid expression', function() {
    describe('Account.Order[0]', function() {
        it('should return ast', function() {
            var expr = jsonata('Account.Order[0]', true);
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
            var expr = jsonata('Account.', true);
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
            var expr = jsonata('Account[', true);
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
            var expr = jsonata('Account.Order[;0].Product', true);
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
                    "token": "(literal)",
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
            var expr = jsonata('Account.Order[0;].Product', true);
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
            var expr = jsonata('Account.Order[0].Product;', true);
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

});

