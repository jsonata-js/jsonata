"use strict";

var jsonata = require('../src').jsonata;
var request = require('request');

var jsonataPromise = function(expr, data?, bindings?) {
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
        it('should return promise to results', async () => {
            var expr = jsonata('$httpget("https://api.npmjs.org/downloads/range/2016-09-01:2017-03-31/jsonata").downloads{ $substring(day, 0, 7): $sum(downloads) }');
            expr.assign('httpget', httpget);
            let result = await jsonataPromise(expr);

            expect(result).toEqual({
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
        it('should throw', async () => {
            var expr = jsonata('5 + $httpget("htttttps://api.npmjs.org/downloads/range/2016-09-01:2017-03-31/jsonata")');
            expr.assign('httpget', httpget);
            
            try {
                await jsonataPromise(expr);
                expect(undefined).toBeDefined();
            } catch(e) {
                // Expected outcome
            }
        });
    });

    describe('Make HTTP request with dodgy url', function() {
        it('should throw', async () => {
            var expr = jsonata('$httpget("htttttps://api.npmjs.org/downloads/range/2016-09-01:2017-03-31/jsonata").downloads{ $substring(day, 0, 7): $sum(downloads) }');
            expr.assign('httpget', httpget);
            try {
                await jsonataPromise(expr);
                expect(undefined).toBeDefined();
            } catch(e) {
                // Expected outcome
            }
        });
    });
});

describe('Invoke JSONata with callback - return values', function() {
    it('should handle an undefined value', async () => {
        var data = { value: undefined };
        var expr = jsonata('value');
        let result = await jsonataPromise(expr, data);
        expect(result).toEqual(undefined);
    });
    it('should handle a null value', async() =>  {
        var data = { value: null };
        var expr = jsonata('value');
        let result = await jsonataPromise(expr, data);
        return expect(result).toEqual(null);
    });
    it('should handle a value', async() =>  {
        var data = { value: 'hello' };
        var expr = jsonata('value');
        let result = await jsonataPromise(expr, data);
        return expect(result).toEqual('hello');
    });
    it('should handle a promise', async() => {
        var data = { value: Promise.resolve('hello') };
        var expr = jsonata('value');
        let result = await jsonataPromise(expr, data);
        return expect(result).toEqual('hello');
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

    it('basic function that returns a thenable', async() => {
        var data = {};
        var expr = jsonata('$counter(5)');
        let result = await jsonataPromise(expr, data, bindings);
        expect(result).toEqual(5);
    });

    it('basic function that returns a thenable, but invokes another function', async() =>  {
        var data = {};
        var expr = jsonata('$counter(0).inc()');
        let result = await jsonataPromise(expr, data, bindings);
        return expect(result).toEqual(1);
    });

    it('basic function that returns a thenable, but invokes another function several times', async() =>  {
        var data = {};
        var expr = jsonata('$counter(0).inc().inc().inc().inc()');
        let result = await jsonataPromise(expr, data, bindings);
        return expect(result).toEqual(4);
    });

    it('basic function that returns a thenable and part of a numeric expression', async() =>  {
        var data = {};
        var expr = jsonata('$counter(3) + 5');
        let result = await jsonataPromise(expr, data, bindings);
        return expect(result).toEqual(8);
    });

    it('basic function that returns a thenable, but invokes another function several times and part of a numeric expression', async() =>  {
        var data = {};
        var expr = jsonata('$counter(0).inc().inc().inc().inc() + 3');
        let result = await jsonataPromise(expr, data, bindings);

        return expect(result).toEqual(7);
    });

    it('basic function that returns a thenable, but invokes another function - nested', async() =>  {
        var data = {};
        var expr = jsonata('$counter($counter(3).inc().inc()).inc()');
        let result = await jsonataPromise(expr, data, bindings);
        return expect(result).toEqual(6);
    });

    it('basic function that returns a thenable, then invokes a built-in function', async() => {
        var data = {};
        var expr = jsonata('$counter(3).inc().$string()');
        let result = await jsonataPromise(expr, data, bindings);
        return expect(result).toEqual('4');
    });

    it('basic function that returns a thenable, but invokes a non-existent function', async() => {
        var data = {};
        var expr = jsonata('$counter(2).inc().foo()');

        try {
            await jsonataPromise(expr, data, bindings);
            expect(undefined).toBeDefined();
        } catch(e) {
            // Expected outcome
        }
    });
});