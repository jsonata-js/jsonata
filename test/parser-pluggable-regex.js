"use strict";

var jsonata = require('../src/jsonata');
var assert = require('assert');
var chai = require("chai");
var expect = chai.expect;

describe('Invoke parser with custom RegexEngine param', function() {

    var regexContentSpy = null;
    var regexEvalSpy = null;

    function RegexEngineSpy(content) {
        regexContentSpy = content;

        this.exec = function(input) {
            regexEvalSpy = input;
            return null;
        }
    }

    it('should call RegexEngine param constructure during evaluation', function() {
        var expr = jsonata('$replace(\"foo\", /bar/, \"baaz\")', { RegexEngine: RegexEngineSpy });
        expr.evaluate()
        assert.deepEqual(regexContentSpy.toString(), "/bar/g");
        assert.deepEqual(regexEvalSpy, "foo");
    });
});
