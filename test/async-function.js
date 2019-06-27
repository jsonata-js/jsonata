"use strict";

var jsonata = require('../src/jsonata');
var request = require('request');
//var assert = require('assert');
var chai = require("chai");
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var jsonataPromise = function(expr, data, bindings) {
    return new Promise(function(resolve, reject) {
        expr.evaluate(data, bindings, function(error, response) {
            if(error) reject(error);
            resolve(response);
        });
    });
};

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

describe('Invoke JSONata with callback - return values', function() {
    it('should handle an undefined value', function() {
        var data = { value: undefined };
        var expr = jsonata('value');
        return expect(jsonataPromise(expr, data)).to.eventually.equal(undefined);
    });
    it('should handle a null value', function() {
        var data = { value: null };
        var expr = jsonata('value');
        return expect(jsonataPromise(expr, data)).to.eventually.equal(null);
    });
    it('should handle a value', function() {
        var data = { value: 'hello' };
        var expr = jsonata('value');
        return expect(jsonataPromise(expr, data)).to.eventually.equal('hello');
    });
    it('should handle a promise', function() {
        var data = { value: Promise.resolve('hello') };
        var expr = jsonata('value');
        return expect(jsonataPromise(expr, data)).to.eventually.equal('hello');
    });
});

describe('Evaluate concurrent expressions with callbacks', function() {
    it('should process two expressions concurrently', function(done) {
        const expr = jsonata("{'1':'goat','2': 'cheese'} ~> $lookup($string(payload))");

        var count = 0;
        var partDone = function() {
            count++;
            if(count >= 2) {
                done();
            }
        };

        expr.evaluate({"payload":1}, {}, function(err,result) {
            expect(result).to.equal('goat');
            partDone();
        });
        expr.evaluate({"payload":2}, {}, function(err,result) {
            expect(result).to.equal('cheese');
            partDone();
        });
    });
});

describe('Handle chained functions that end in promises', function() {

    var counter = function(count) {
        return {
            inc: function() {
                return counter(count + 1);
            },
            then: function(onFulfilled) {
                setImmediate(function(){
                    onFulfilled(count);
                });
                return Promise.resolve(count);
            }
        };
    };

    var bindings = {
        counter: counter
    };

    it('basic function that returns a thenable', function() {
        var data = {};
        var expr = jsonata('$counter(5)');
        return expect(jsonataPromise(expr, data, bindings)).to.eventually.equal(5);
    });

    it('basic function that returns a thenable, but invokes another function', function() {
        var data = {};
        var expr = jsonata('$counter(0).inc()');
        return expect(jsonataPromise(expr, data, bindings)).to.eventually.equal(1);
    });

    it('basic function that returns a thenable, but invokes another function several times', function() {
        var data = {};
        var expr = jsonata('$counter(0).inc().inc().inc().inc()');
        return expect(jsonataPromise(expr, data, bindings)).to.eventually.equal(4);
    });

    it('basic function that returns a thenable and part of a numeric expression', function() {
        var data = {};
        var expr = jsonata('$counter(3) + 5');
        return expect(jsonataPromise(expr, data, bindings)).to.eventually.equal(8);
    });

    it('basic function that returns a thenable, but invokes another function several times and part of a numeric expression', function() {
        var data = {};
        var expr = jsonata('$counter(0).inc().inc().inc().inc() + 3');
        return expect(jsonataPromise(expr, data, bindings)).to.eventually.equal(7);
    });

    it('basic function that returns a thenable, but invokes another function - nested', function() {
        var data = {};
        var expr = jsonata('$counter($counter(3).inc().inc()).inc()');
        return expect(jsonataPromise(expr, data, bindings)).to.eventually.equal(6);
    });

    it('basic function that returns a thenable, then invokes a built-in function', function() {
        var data = {};
        var expr = jsonata('$counter(3).inc().$string()');
        return expect(jsonataPromise(expr, data, bindings)).to.eventually.equal('4');
    });

    it('basic function that returns a thenable, but invokes a non-existent function', function() {
        var data = {};
        var expr = jsonata('$counter(2).inc().foo()');
        return expect(jsonataPromise(expr, data, bindings)).to.be.rejected;
    });

});
