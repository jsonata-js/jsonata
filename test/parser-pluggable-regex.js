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

describe("ParseDateTime RegexEngine tests", () => {
    describe("$toMillis respects the RegexEngine option in parseDateTime", function () {
        it("should return result object", async function () {
            var engineCalled = false;
            function TrackingRegExp(pattern, flags) {
                engineCalled = true;
                return new RegExp(pattern, flags);
            }
            var expr = jsonata(
                "$toMillis('2018-03-27T14:03:00.123Z', '[Y0001]-[M01]-[D01]T[H01]:[m01]:[s01].[f001]Z')",
                { RegexEngine: TrackingRegExp }
            );
            var result = await expr.evaluate({});
            expect(engineCalled).to.equal(true);
            expect(result).to.equal(1522159380123);
        });
    });

    describe("$toMillis falls back to RegExp when no RegexEngine is in the environment", function () {
        it("should return result object", function () {
            var datetime = require('../src/datetime');
            var fakeThis = {
                environment: {
                    timestamp: new Date('2018-03-27T14:03:00.123Z'),
                    base: {}
                }
            };
            var result = datetime.toMillis.call(fakeThis, '2018-03-27T14:03:00.123Z', '[Y0001]-[M01]-[D01]T[H01]:[m01]:[s01].[f001]Z');
            expect(result).to.equal(1522159380123);
        });
    });
});
