"use strict";

var jsonata = require('../src/jsonata');
var chai = require("chai");
var expect = chai.expect;

describe('Performance', function() {
    it("Heavy output", function() {
        const expr = jsonata("{\"top\": $.\"loop\"[].{ \"nested\": $$.\"loop\"[].{ \"doubleNested\": $$.\"loop\"[].{ \"sum\": $sum($$.\"loop\") } } } }");
        const input = {
            loop: new Array(70).fill(1).map(() => Math.random())
        };

        return expect(expr.evaluate(input)).to.eventually.be.ok;
    }).timeout(30000);

    it("Heavy input", function() {
        const input = new Array(10000000).fill(1).map(() => Math.random());

        return expect(jsonata("$").evaluate(input, {})).to.eventually.be.ok;
    }).timeout(30000);

    it("Recursion", function() {
        const expr = jsonata(`(
          $factorial := function($x){ $x <= 1 ? 1 : $x * $factorial($x-1) };
          $factorial(170)
        )`);

        return expect(expr.evaluate()).to.eventually.be.ok;
    }).timeout(30000);

    it("Long Array O(n^2) processing", function() {
        const expr = jsonata(`$shuffle($sort($reverse($shuffle($sort($shuffle($sort($shuffle($sort($$)))))))))`);
        const input = new Array(10000).fill(1).map(() => Math.random());

        return expect(expr.evaluate(input)).to.eventually.be.ok;
    }).timeout(30000);


    describe("Complex filtering expression", function() {
        it("Chained false statements", function() {
            var filterExpr = new Array(1000).fill(1).map(() => `$v = ${Math.random()}`).join(" and ");

            const expr = jsonata(`$filter($$, function($v) { ${filterExpr} })`);
            const input = new Array(1000).fill(1).map(() => Math.random());

            return expect(expr.evaluate(input)).to.eventually.be.undefined;
        }).timeout(30000);

        it("Chained true statements", function() {
            const filterExpr = new Array(1000).fill(1).map(() => `$v != ${Math.random()}`).join(" and ");

            const expr = jsonata(`$filter($$, function($v) { ${filterExpr} })`);
            const input = new Array(1000).fill(1).map(() => Math.random());

            return expect(expr.evaluate(input)).to.eventually.be.ok;
        }).timeout(30000);
    });
});
