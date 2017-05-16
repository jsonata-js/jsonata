"use strict";

var jsonata = require('../jsonata');
var request = require('request');
//var assert = require('assert');
var chai = require("chai");
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

// var data = {
//     foo: [
//         {bar: 'hello'},
//         {bar: 'world'}
//     ]
// };

var jsonataPromise = function(expr, data, bindings) {
    return new Promise(function(resolve, reject) {
        expr.evaluate(data, bindings, function(error, response) {
            if(error) reject(error);
            resolve(response);
        });
    });
};

// var prom = function(arg) {
//     return new Promise((resolve) => {
//         setTimeout(function(){
//             resolve(arg+"Success!");
//         }, 750);
//     });
// };

var httpget = function(url) {
    return new Promise(function(resolve, reject) {
        request(url, function(error, response, body) {
            if(error) {
                reject(error);
                return;
            }
            resolve(JSON.parse(body));
        });
    });
};

describe('Invoke JSONata with callback', function() {
    describe('Make HTTP request', function() {
        it('should return promise to results', function() {
            var expr = jsonata('$httpget("https://api.npmjs.org/downloads/range/2016-09-01:2017-03-31/jsonata").downloads{ $substring(day, 0, 7): $sum(downloads) }');
            expr.assign('httpget', httpget);
            return expect(jsonataPromise(expr)).to.eventually.deep.equal({
                '2016-09': 205,
                '2016-10': 1266,
                '2016-11': 2783,
                '2016-12': 2158,
                '2017-01': 22977,
                '2017-02': 37728,
                '2017-03': 46460 });
        });

    });
});

describe('Invoke JSONata with callback - errors', function() {
    describe('type error', function() {
        it('should throw', function() {
            var expr = jsonata('5 + $httpget("htttttps://api.npmjs.org/downloads/range/2016-09-01:2017-03-31/jsonata")');
            expr.assign('httpget', httpget);
            return expect(jsonataPromise(expr)).to.be.rejected;
//              .to.deep.contain({position: 7, code: 'T0410', token: 'count', index: 2});;
        });

    });

    describe('Make HTTP request with dodgy url', function() {
        it('should throw', function() {
            var expr = jsonata('$httpget("htttttps://api.npmjs.org/downloads/range/2016-09-01:2017-03-31/jsonata").downloads{ $substring(day, 0, 7): $sum(downloads) }');
            expr.assign('httpget', httpget);
            return expect(jsonataPromise(expr)).to.be.rejected;
//              .to.deep.contain({position: 7, code: 'T0410', token: 'count', index: 2});;
        });
    });
});

