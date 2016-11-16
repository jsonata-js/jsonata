/**
 * © Copyright IBM Corp. 2016 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 *
 *   JSONata is all about JSON.  This is a test runner for JSONata unit tests specified in
 *   JSON rather than JavaScript.  This could make JSONata easier to port to other languages.
 */

'use strict';

var jsonata = require('../jsonata');
var glob = require('glob');
var path = require('path');
var fs = require('fs');
var parsejson = require('parse-json'); // Better error reporting
var chai = require('chai');
var expect = chai.expect;

// Identify JSON test files
// (Note, using synchronous functions is generally bad practice.  If we use a callback here, mocha
// will end testing before the callback returns, which is not what we want.)
var testfiles = glob.sync('**/*-test.json');
if(!testfiles.length) {
    throw new Error('Could not match any JSON test files!');
}

// Iterate through each test file and run the tests
testfiles.forEach(function(file) {
    var contents = fs.readFileSync(path.resolve(file));
    var tests = parsejson(contents);
    describe('File: ' + file, function() {
        run(tests);
    });
});


/**
 * Run tests specified in JSON
 * @param {Array} tests - the tests to run
 * @param {Object} parentdata - shared data from the called, may be `undefined`
 */
function run(tests, parentdata) {
    // Check that we are passed an array
    if(typeof tests !== 'object' || !(tests instanceof Array) ) {
        throw new Error('Test spec is not an array: ' + JSON.stringify(tests));
    }

    // If we have been passed shared data from our parent, then clone it so that we
    // cannot pollute the parent
    var shareddata = (typeof parentdata !== 'undefined') ? clone(parentdata) : {};

    tests.forEach(function(test) {
        if(test.expression) { // A test
            // We always report the expression, and optionally a name
            var name = test.name ? test.name + ': ' + test.expression : test.expression;
            var data = resolve(test.data, shareddata);

            if(test.error) { // Expect an error
                var message = test.error.message;
                delete test.error.message;
                it(name + ' throws "' + message + '"', function() {
                    expect(function () {
                        jsonata(test.expression).evaluate(data);
                    }).to.throw()
                        .to.deep.contain(test.error)
                        .to.have.property('message').to.have.string(message);
                });
            }
            else { // Expect a result
                it(name, function() {
                    var expected = resolve(test.expected, shareddata);
                    expect(jsonata(test.expression).evaluate(data)).to.deep.equal(expected);
                });
            }
        }
        else if(test.group) { // A group of tests
            describe(test.name, function() {
                run(test.group, shareddata);
            });
        }
        else if(test.data) { // This is test data
            shareddata[test.name] = test.data;
        }
        else {
            throw new Error('Test was not an expression test or a group of tests: ' + JSON.stringify(test));
        }
    });
}


/**
 * Deep clone of a JSON object
 * @param {Object} data - data to clone
 * @returns {Object} exact clone of the input data
 */
function clone(data) {
    if(typeof data === 'undefined') {
        return undefined;
    }
    else {
        return JSON.parse(JSON.stringify(data));
    }
}


/**
 * Resolve shared data references if there are any
 * References are of the form: {"$ref": "shared_data_name"}
 * The return value may be:
 *  - `undefined` if the `spec` was undefined
 *  - a clone of some shared data if the `spec` was a reference
 *  - a JSON object if the `spec` was a JSON object
 * @param {object} spec - the specification, which could be JSON data or a reference
 * @param {object} shareddata - the shared data store
 * @returns {object} the result of resolving the spec
 */
function resolve(spec, shareddata) {
    // No specification, so it's undefined
    if(typeof spec === 'undefined') {
        return undefined;
    }
    // Specification is a shared data reference
    else if(typeof spec === 'object' && spec !== null && typeof spec.$ref === 'string') {
        var ref = spec.$ref;
        if(shareddata[ref]) {
            // Clone data first so that it's impossible for one test to pollute another
            return clone(shareddata[ref]);
        }
        else {
            throw new Error('Could not resolve shared data reference: ' + ref);
        }
    }
    // Specification is any other JSON object
    else {
        return spec;
    }
}