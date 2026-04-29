"use strict";

var jsonata = require('../src/jsonata');
var assert = require('assert');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;

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

describe('Detect and repel ReDoS attack', function() {
    const SafeRegExp = function(regex) {
        // Perform static analysis on the regex before it's used.
        // Trivial check for test purposes - use a suitable ReDoS library
        if (regex.toString().includes('(a+)+')) {
            throw {
                code: 'U1001',
                stack: (new Error()).stack,
                value: regex,
                message: 'Rejecting regex (potential ReDoS): ' + regex
            };
        }
        this.regex = regex;
     };

    SafeRegExp.prototype.exec = function(str) {
        return this.regex.exec(str);
    }

    it('should successfully process a safe regex', async function() {
        const safeExpr = jsonata('$contains(data, /^a+$/)', {RegexEngine: SafeRegExp});
        const data = {data: 'aaaaaaaaaaaaaaa'};
        const result = await safeExpr.evaluate(data);
        expect(result).to.be.true;
    })

    it('should behave like the build-in regex processor (copied from regex test case)', async function() {
        const expr = jsonata('$match("ababbabbcc",/a(b+)/, 1)');
        const result = await expr.evaluate();
        const expected = { match: "ab", index: 0, groups: ["b"] };
        expect(result).to.deep.equal(expected);
    })

    it('should reject a potential ReDoS attack', async function() {
        const safeExpr = jsonata('$contains(data, /^(a+)+$/)', {RegexEngine: SafeRegExp});
        const data = {data: 'aaaaaaaaaaaaaaa'};
        expect(safeExpr.evaluate(data)).to.eventually.be.rejected.to.deep.contain({
            code: 'U1001',
        });
    })
})
