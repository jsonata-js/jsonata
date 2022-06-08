/**
 * © Copyright IBM Corp. 2016 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

"use strict";

var fs = require("fs");
var path = require("path");
var jsonata = require("../src/jsonata");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;

let groups = fs.readdirSync(path.join(__dirname, "test-suite", "groups")).filter((name) => !name.endsWith(".json"));

/**
 * Simple function to read in JSON
 * @param {string} dir - Directory containing JSON file
 * @param {string} file - Name of JSON file (relative to directory)
 * @returns {Object} Parsed JSON object
 */
function readJSON(dir, file) {
    try {
        return JSON.parse(fs.readFileSync(path.join(__dirname, dir, file)).toString());
    } catch(e) {
        throw new Error("Error reading "+file+" in "+dir+": "+e.message);
    }
}

let datasets = {};
let datasetnames = fs.readdirSync(path.join(__dirname, "test-suite", "datasets"));

datasetnames.forEach((name) => {
    datasets[name.replace(".json", "")] = readJSON(path.join("test-suite", "datasets"), name);
});

// This is the start of the set of tests associated with the test cases
// found in the test-suite directory.
describe("JSONata Test Suite", () => {
    // Iterate over all groups of tests
    groups.forEach(group => {
        let filenames = fs.readdirSync(path.join(__dirname, "test-suite", "groups", group)).filter((name) => name.endsWith(".json"));
        // Read JSON file containing all cases for this group
        let cases = [];
        filenames.forEach(name => {
            const spec = readJSON(path.join("test-suite", "groups", group), name);
            if(Array.isArray(spec)) {
                spec.forEach(item => {
                    if(!item.description) {
                        item.description = name;
                    }
                });
                cases = cases.concat(spec);
            } else {
                if(!spec.description) {
                    spec.description = name;
                }
                cases.push(spec);
            }
        });
        describe("Group: " + group, () => {
            // Iterate over all cases
            for (let i = 0; i < cases.length; i++) {
                // Extract the current test case of interest
                let testcase = cases[i];

                // if the testcase references an external jsonata file, read it in
                if(testcase['expr-file']) {
                    testcase.expr = fs.readFileSync(path.join(__dirname, "test-suite", "groups", group, testcase['expr-file'])).toString();
                }

                // Create a test based on the data in this testcase
                it(testcase.description+": "+testcase.expr, function() {
                    var expr;
                    // Start by trying to compile the expression associated with this test case
                    try {
                        expr = jsonata(testcase.expr);
                        // If there is a timelimit and depth limit for this case, use the
                        // `timeboxExpression` function to limit evaluation
                        if ("timelimit" in testcase && "depth" in testcase) {
                            this.timeout(testcase.timelimit * 2);
                            timeboxExpression(expr, testcase.timelimit, testcase.depth);
                        }
                    } catch (e) {
                        // If we get here, an error was thrown.  So check to see if this particular
                        // testcase expects an exception (as indicated by the presence of the
                        // `code` field in the testcase)
                        if (testcase.code) {
                            // See if we go the code we expected
                            expect(e.code).to.equal(testcase.code);
                            // If a token was specified, check for that too
                            if (testcase.hasOwnProperty("token")) {
                                expect(e.token).to.equal(testcase.token);
                            }
                        } else {
                            // If we get here, something went wrong because an exception
                            // was thrown when we didn't expect one to be thrown.
                            throw new Error("Got an unexpected exception: " + e.message);
                        }
                    }
                    // If we managed to compile the expression...
                    if (expr) {
                        // Load the input data set.  First, check to see if the test case defines its own input
                        // data (testcase.data).  If not, then look for a dataset number.  If it is -1, then that
                        // means there is no data (so use undefined).  If there is a dataset number, look up the
                        // input data in the datasets array.
                        let dataset = resolveDataset(datasets, testcase);

                        // Test cases have three possible outcomes from evaluation...
                        if ("undefinedResult" in testcase) {
                            // First is that we have an undefined result.  So, check
                            // to see if the result we get from evaluation is undefined
                            let result = expr.evaluate(dataset, testcase.bindings);
                            return expect(result).to.eventually.deep.equal(undefined);
                        } else if ("result" in testcase) {
                            // Second is that a (defined) result was provided.  In this case,
                            // we do a deep equality check against the expected result.
                            let result = expr.evaluate(dataset, testcase.bindings);
                            return expect(result).to.eventually.deep.equal(testcase.result);
                        } else if ("error" in testcase) {
                            // If an error was expected,
                            // we do a deep equality check against the expected error structure.
                            return expect(expr.evaluate(dataset, testcase.bindings))
                                .to.be.rejected
                                .to.eventually.deep.contain(testcase.error);
                        } else if ("code" in testcase) {
                            // Finally, if a `code` field was specified, we expected the
                            // evaluation to fail and include the specified code in the
                            // thrown exception.
                            return expect(expr.evaluate(dataset, testcase.bindings))
                                .to.be.rejected
                                .to.eventually.deep.contain({ code: testcase.code });
                        } else {
                            // If we get here, it means there is something wrong with
                            // the test case data because there was nothing to check.
                            throw new Error("Nothing to test in this test case");
                        }
                    }
                });
            }
        });
    });
});

/**
 * Protect the process/browser from a runnaway expression
 * i.e. Infinite loop (tail recursion), or excessive stack growth
 *
 * @param {Object} expr - expression to protect
 * @param {Number} timeout - max time in ms
 * @param {Number} maxDepth - max stack depth
 */
function timeboxExpression(expr, timeout, maxDepth) {
    var depth = 0;
    var time = Date.now();

    var checkRunnaway = function() {
        if (maxDepth > 0 && depth > maxDepth) {
            // stack too deep
            throw {
                message:
                    "Stack overflow error: Check for non-terminating recursive function.  Consider rewriting as tail-recursive.",
                stack: new Error().stack,
                code: "U1001"
            };
        }
        if (Date.now() - time > timeout) {
            // expression has run for too long
            throw {
                message: "Expression evaluation timeout: Check for infinite loop",
                stack: new Error().stack,
                code: "U1001"
            };
        }
    };

    // register callbacks
    expr.assign("__evaluate_entry", function(expr, input, env) {
        if (env.isParallelCall) return;
        depth++;
        checkRunnaway();
    });
    expr.assign("__evaluate_exit", function(expr, input, env) {
        if (env.isParallelCall) return;
        depth--;
        checkRunnaway();
    });
}

/**
 * Based on the collection of datasets and the information provided as part of the testcase,
 * determine what input data to use in the case (may return undefined).
 *
 * @param {Object} datasets Object mapping dataset names to JS values
 * @param {Object} testcase Testcase data read from testcase file
 * @returns {any} The input data to use when evaluating the jsonata expression
 */
function resolveDataset(datasets, testcase) {
    if ("data" in testcase) {
        return testcase.data;
    }
    if (testcase.dataset===null) {
        return undefined;
    }
    if (datasets.hasOwnProperty(testcase.dataset)) {
        return datasets[testcase.dataset];
    }
    throw new Error("Unable to find dataset "+testcase.dataset+" among known datasets, are you sure the datasets directory has a file named "+testcase.dataset+".json?");
}
