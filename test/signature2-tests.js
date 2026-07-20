"use strict";

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;
var parseSignature = require("../src/signature2");


describe("Signature2 tests", () => {
    describe("Should parse tests", function() {
        const testCases = [
            { sig: 'n',     args:[10],          res:[10],                       descr:"Simple number" },
            { sig: 'nn',    args:[10, 20],      res:[10, 20],                   descr:"Simple 2 numbers" },
            { sig: 'ns',    args:[10, "a"],     res:[10, "a"],                  descr:"Simple number-string" },
            { sig: 'ns-',   args:[10, "a"],     res:[10, "a"],                  descr:"Number-string (may context)" },
            { sig: 'ns-',   args:[10],      context:"ctx",  res:[10, "ctx"],    descr:"Number-string (from context)" },
            { sig: 'ns-',   args:[10, "a"], context:"ctx",  res:[10, "a"],      descr:"Number-string (not from context)" },
            { sig: 'ns?',   args:[10, "a"],     res:[10, "a"],                  descr:"Number-string optional" },
            { sig: 'ns?',   args:[10],          res:[10, undefined],            descr:"Number-string undefined" },
            { sig: 's?n',   args:["a", 10],     res:["a", 10],                  descr:"String-number" },
            { sig: 's?n',   args:[10],          res:[undefined, 10],            descr:"String-number undefined" },
            { sig: 's?s?',  args:["a", "b"],    res:["a", "b"],                 descr:"String-string" },
            { sig: 's?s?',  args:["a"],         res:[undefined, "a"],           descr:"String-string ambiguous -- implementation specific" },
            { sig: 's?s?',  args:[],            res:[undefined, undefined],     descr:"String-string ambiguous -- implementation specific" },
            { sig: 's?s',   args:["a", "b"],    res:["a", "b"],                 descr:"Leading optional - full" },
            { sig: 's?s',   args:["b"],         res:[undefined, "b"],           descr:"Leading optional - undefined" },
            { sig: 'n+',    args:[10],          res:[10],                       descr:"One or more: single" },
            { sig: 'n+',    args:[10, 20],      res:[[10, 20]],                 descr:"One or more: array pack" },
            { sig: 'n+s',   args:[10, 20, "s"], res:[[10, 20], "s"],            descr:"One or more: array pack, string" },
            { sig: 'n+n',   args:[10, 20, 30],  res:[[10, 20], 30],             descr:"One or more: array pack properly (035)" },
            { sig: 'ns',    args:[10, "s", 30], res:[10, "s"],                  descr:"Excessive args are skipped" },
            { sig: 's?n+',  args:[10, 20],      res:[undefined, [10, 20]],      descr:"(041)" },
            { sig: 's?n+',  args:["s", 10, 20], res:["s", [10, 20]],            descr:"(042)" },
            { sig: 's?n?',  args:[20],          res:[undefined, 20],            descr:"(044)" },
            { sig: 'n?s-',  args:[],    context:"b", res:[undefined, "b"],      descr:"(045)" },
            { sig: 's?s-',  args:[],    context:"b", res:[undefined, "b"],      descr:"(046)" },
            { sig: 's?s-',  args:["a"], context:"b", res:["a", "b"],            descr:"(047)" },

        ];
        testCases.forEach((c) => {
            it(`${c.sig} ${c.args} -> ${c.res} : ${c.descr}`, function() {
                const signature = parseSignature(c.sig);
                const args = signature.validate(c.args, c.context);
                expect(args).to.deep.equal(c.res);
            })
        });
    });
});
