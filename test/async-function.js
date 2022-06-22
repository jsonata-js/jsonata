"use strict";

var jsonata = require('../src/jsonata');
var request = require('request');
var chai = require("chai");
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var jsonataWithCallback = function(expr, data, bindings) {
    return expr.evaluate(data, bindings, function(error, response) {
        if(error) {
            // eslint-disable-next-line no-console
            console.error(error);
            return;
        }
        return response;
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
            return expect(jsonataWithCallback(expr)).to.eventually.deep.equal({
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
            return expect(jsonataWithCallback(expr)).to.be.rejected;
        });

    });

    describe('Make HTTP request with dodgy url', function() {
        it('should throw', function() {
            var expr = jsonata('$httpget("htttttps://api.npmjs.org/downloads/range/2016-09-01:2017-03-31/jsonata").downloads{ $substring(day, 0, 7): $sum(downloads) }');
            expr.assign('httpget', httpget);
            return expect(jsonataWithCallback(expr)).to.be.rejected;
        });
    });
});

describe('Invoke JSONata with callback - return values', function() {
    it('should handle an undefined value', function() {
        var data = { value: undefined };
        var expr = jsonata('value');
        return expect(jsonataWithCallback(expr, data)).to.eventually.equal(undefined);
    });
    it('should handle a null value', function() {
        var data = { value: null };
        var expr = jsonata('value');
        return expect(jsonataWithCallback(expr, data)).to.eventually.equal(null);
    });
    it('should handle a value', function() {
        var data = { value: 'hello' };
        var expr = jsonata('value');
        return expect(jsonataWithCallback(expr, data)).to.eventually.equal('hello');
    });
    it('should handle a promise', function() {
        var data = { value: Promise.resolve('hello') };
        var expr = jsonata('value');
        return expect(jsonataWithCallback(expr, data)).to.eventually.equal('hello');
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

        expr.evaluate({"payload":1}, {}).then(function(result) {
            expect(result).to.equal('goat');
            return partDone();
        // eslint-disable-next-line no-console
        }).catch(e => console.error(e));


        expr.evaluate({"payload":2}, {}).then(function(result) {
            expect(result).to.equal('cheese');
            return partDone();
        // eslint-disable-next-line no-console
        }).catch(e => console.error(e));
    });
});

describe('Handle chained functions that end in promises', function() {
    const counter = async (count) => ({
        value: count,
        inc: async () => await counter(count + 1)
    });

    var bindings = {
        counter: counter
    };

    it('basic async function', function() {
        var data = {};
        var expr = jsonata('$counter(5).value');
        return expect(expr.evaluate(data, bindings)).to.eventually.equal(5);
    });

    it('basic async function, but invokes another function', function() {
        var data = {};
        var expr = jsonata('$counter(0).inc().value');
        return expect(expr.evaluate(data, bindings)).to.eventually.equal(1);
    });

    it('basic async function, but invokes another function several times', function() {
        var data = {};
        var expr = jsonata('$counter(0).inc().inc().inc().inc().value');
        return expect(expr.evaluate(data, bindings)).to.eventually.equal(4);
    });

    it('basic async function and part of a numeric expression', function() {
        var data = {};
        var expr = jsonata('$counter(3).value + 5');
        return expect(expr.evaluate(data, bindings)).to.eventually.equal(8);
    });

    it('basic async function, but invokes another function several times and part of a numeric expression', function() {
        var data = {};
        var expr = jsonata('$counter(0).inc().inc().inc().inc().value + 3');
        return expect(expr.evaluate(data, bindings)).to.eventually.equal(7);
    });

    it('basic async function, but invokes another function - nested', function() {
        var data = {};
        var expr = jsonata('$counter($counter(3).inc().inc().value).inc().value');
        return expect(expr.evaluate(data, bindings)).to.eventually.equal(6);
    });

    it('basic async function, then invokes a built-in function', function() {
        var data = {};
        var expr = jsonata('$counter(3).inc().value.$string()');
        return expect(expr.evaluate(data, bindings)).to.eventually.equal('4');
    });

    it('basic async function, but invokes a non-existent function', function() {
        var data = {};
        var expr = jsonata('$counter(2).inc().foo().value');
        return expect(expr.evaluate(data, bindings)).to.be.rejected;
    });

});
