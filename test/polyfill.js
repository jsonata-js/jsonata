"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");
var expect = require("chai").expect;

var polyfillSource = fs.readFileSync(path.join(__dirname, "../polyfill.js"), "utf8");
var datetimeSource = fs.readFileSync(path.join(__dirname, "../src/datetime.js"), "utf8");

describe("ES5 Number.parseInt polyfill (#537)", function() {
    var context;

    beforeEach(function() {
        context = vm.createContext({});
    });

    it("restores integer parsing when Number.parseInt is unavailable", function() {
        vm.runInContext("delete Number.parseInt", context);
        vm.runInContext(polyfillSource, context);
        var parse = vm.runInContext("Number.parseInt", context);

        expect(parse("  -30", 10)).to.equal(-30);
        expect(parse("0xff")).to.equal(255);
        expect(parse("101", 2)).to.equal(5);
        expect(parse("42px", 10)).to.equal(42);
        expect(parse("invalid", 10)).to.satisfy(isNaN);
    });

    it("preserves an existing Number.parseInt implementation", function() {
        var existing = vm.runInContext(
            "Number.parseInt = function(value, radix) { return parseInt(value, radix); }",
            context
        );
        vm.runInContext(polyfillSource, context);

        expect(vm.runInContext("Number.parseInt", context)).to.equal(existing);
    });

    [
        { offset: "+05:30", picture: "[Z01:01]", minutes: 330 },
        { offset: "+05", picture: "[Z01]", minutes: 300 },
        { offset: "+0530", picture: "[Z0000]", minutes: 330 },
        { offset: "GMT+05:30", picture: "[z01:01]", minutes: 330 }
    ].forEach(function(testcase) {
        it("parses timezone " + testcase.offset + " without native Number.parseInt", function() {
            vm.runInContext("delete Number.parseInt", context);
            vm.runInContext(polyfillSource, context);
            context.module = { exports: {} };
            context.require = function(name) {
                return require(path.join(__dirname, "../src", name));
            };
            vm.runInContext(datetimeSource, context);

            var result = context.module.exports.toMillis.call(
                { environment: { timestamp: new Date(0) } },
                "2020-01-02T03:04:05" + testcase.offset,
                "[Y0001]-[M01]-[D01]T[H01]:[m01]:[s01]" + testcase.picture
            );
            expect(result).to.equal(Date.UTC(2020, 0, 2, 3, 4, 5) - testcase.minutes * 60000);
        });
    });
});
