"use strict";

var jsonata = require('../src/jsonata');
var assert = require('assert');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

describe('Invoke parser with custom RegexEngine param', function() {

    var regexContentSpy = null;
    var regexEvalSpy = null;

    function RegexEngineSpy(content) {
        regexContentSpy = content;

        this.exec = function(input) {
            regexEvalSpy = input;
            return null;
        };
    }

    it('should call RegexEngine param constructure during evaluation', async function() {
        var expr = jsonata('$replace(\"foo\", /bar/, \"baaz\")', { RegexEngine: RegexEngineSpy });
        await expr.evaluate();
        assert.deepEqual(regexContentSpy.toString(), "/bar/g");
        assert.deepEqual(regexEvalSpy, "foo");
    });
});
