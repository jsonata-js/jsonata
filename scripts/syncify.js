/* eslint-disable */
const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "../src");
const srcFiles = fs.readdirSync(srcDir).map(file => path.join(srcDir, file));

const syncDir = path.join(__dirname, "../sync");
fs.mkdirSync(syncDir, { recursive: true });


srcFiles.forEach(file => {
    const content = fs.readFileSync(file, "utf8");
    const newContent = content
        .replace(/(.)/, `/* eslint-disable */\n$1`)
        .replace(/\basync\b/g, "/* async */")
        .replace(/\/\* async \*\/( ?):/g, "async$1:") // whoops
        .replace(/\bawait\b/g, "/* await */")
        .replace(/\bPromise.all\b/g, "Array.from")
        .replace(/(\s*)(\bif \(isPromise\(.*?\)\))/g, `\n$1$2 throw new Error(${JSON.stringify(`Check "$2" evaluated to a promise`.replace('isPromise', ''))});\n$1$2`)
        ;
    fs.writeFileSync(path.join(syncDir, path.basename(file)), newContent);
});

const syncTestDir = path.join(__dirname, "../sync-test");

fs.writeFileSync(path.join(syncTestDir, 'reasynced.js'), 
` // use the sync library but make it async anyway, so that tests relying on moch-as-promised work
const syncJsonata = require('../sync/jsonata');
module.exports = (...args) => {
    const sync = syncJsonata(...args);
    return {
        ...sync,
        evaluate: async (...args) => {
            return sync.evaluate(...args);
        }
    }
}
`);

fs.mkdirSync(syncTestDir, { recursive: true });
const testFiles = fs.globSync('test/**/*.*')

testFiles.forEach(file => {
    if (file.includes('async-function.js')) return; // async behaviour not supported in "sync" mode
    if (fs.statSync(file).isDirectory()) return;
    const newFilepath = file.replace('test/', 'sync-test/')
    const content = fs.readFileSync(file, "utf8");
    let newContent = content
    if (file.endsWith('.js')) {
        newContent = newContent.replace('/src/jsonata', '/sync-test/reasynced')

        // these specifically test async behavior, so we skip them
        const skippables = [
            `describe("$millis() returns different timestamp for subsequent evaluate() calls"`,
            `it('should be able to invoke a built-in function passed as an argument'`,
            `it('should be able to invoke a lambda function passed as an argument'`,
            `it('should be able to invoke a user-defined function passed as an argument'`,
        ]
        for (const s of skippables) {
            newContent = newContent.replace(s, s.replace('(', '.skip('))
        }
    }
    fs.mkdirSync(path.dirname(newFilepath), { recursive: true });
    fs.writeFileSync(newFilepath, newContent)
});

// add one test to make sure we "syncify"ed the library correctly
fs.writeFileSync(
    path.join(syncTestDir, 'sync-tests.js'),
`"use strict";

var jsonata = require("../sync/jsonata");
var chai = require("chai");
var expect = chai.expect;

var testdata1 = {
    "foo": {
        "bar": 42,
        "blah": [{"baz": {"fud": "hello"}}, {"baz": {"fud": "world"}}, {"bazz": "gotcha"}],
        "blah.baz": "here"
    }, "bar": 98
};

describe("Sync tests", () => {
    it("should evaluate a simple expression without awaiting", () => {
        expect(jsonata("foo.bar").evaluate(testdata1)).to.equal(42);
    });
});
`
)