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
var glob = require('glob-fs')({ gitignore: true });
var path = require('path');
var chai = require('chai');
var expect = chai.expect;

// Identify JSON test files
// (Note, using a synchronous function is generally bad practice.  If we use a callback here, mocha
// will end the process before the callback returns, which is not what we want.)
var testfiles = glob.readdirSync('**/*-test.json');
if(!testfiles.length) {
    throw new Error('Could not match any JSON test files!');
}

// Iterate through each test file and run the tests
testfiles.forEach(function(file) {
    var tests = require(path.resolve(file)); // Load JSON as JS var
    describe(file, function() {
        run(tests);
    });
});


/**
 * Run tests specified in JSON
 * @param {Array} tests - the tests to run
 */
function run(tests) {
    // Check that we are passed an array
    if(typeof tests !== 'object' || !(tests instanceof Array) ) {
        throw new Error('Test spec is not an array: ' + JSON.stringify(tests));
    }

    tests.forEach(function(test) {
        if(test.expression) { // A test
            // We always report the expression, and optionally a name
            test.name = test.name ? test.name + ': ' + test.expression : test.expression;

            if(test.expected) { // Expect a result
                it(test.name, function() {
                    expect(jsonata(test.expression).evaluate()).to.deep.equal(test.expected);
                });
            }
            else if(test.error) { // Expect an error
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
        }
        else if(test.group) { // A group of tests
            describe(test.name, function() {
                run(test.group);
            });
        }
        else {
            throw new Error('Test was not an expression test or a group of tests: ' + JSON.stringify(test));
        }
    });
}