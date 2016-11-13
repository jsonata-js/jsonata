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
    describe(file, function() {
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
    var shareddata = (typeof parentdata !== "undefined") ? clone(parentdata) : {};

    tests.forEach(function(test) {
        if(test.expression) { // A test
            // We always report the expression, and optionally a name
            test.name = test.name ? test.name + ': ' + test.expression : test.expression;

            // Prepare the data
            var data; // undefined
            if(test.data) { // data was specified
                data = test.data;
            }
            else if(test.shareddata) { // use shared data
                // clone data first so that it's impossible for one test to pollute another
                data = clone(shareddata[test.shareddata]);
            }

            if(test.error) { // Expect an error
                var message = test.error.message;
                delete test.error.message;
                it(test.name + ' throws "' + message + '"', function() {
                    expect(function () {
                        jsonata(test.expression);
                    }).to.throw()
                        .to.deep.contain(test.error)
                        .to.have.property('message').to.have.string(message);
                });
            }
            else { // Expect a result
                it(test.name, function() {
                    expect(jsonata(test.expression).evaluate(data)).to.deep.equal(test.expected);
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
    if(typeof data === "undefined") {
        return undefined;
    }
    else {
        return JSON.parse(JSON.stringify(data));
    }
}