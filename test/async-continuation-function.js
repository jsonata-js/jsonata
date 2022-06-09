"use strict";

var jsonata = require('../src/jsonata');
var chai = require("chai");
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var jsonataContinuationPromise = function (expr, data, continuationCallback) {
    return new Promise(function (resolve, reject) {
        expr.evaluate(data, undefined, function (error, response) {
            if (error) reject(error);
            resolve(response);
        }, continuationCallback);
    });
};

describe('Invoke JSONata with continuation callback', function () {
    describe('Get bit value form valid bit index', function () {
        it('should return valid result', function () {
            let stepCounter = 0;
            const continuationCallback = () => { stepCounter++; return Promise.resolve(stepCounter < 100); };
            const getBit = jsonata(`($x:= λ($c,$n,$b){ $c=$b?$n%2:$x($c+1,$floor($n/2),$b)};$x(0,number,bitIndex))`);
            const data = { "number": 10000000, "bitIndex": 0 };
            expect(jsonataContinuationPromise(getBit, data, continuationCallback)).to.eventually.deep.equal(0);
        });
    });

    describe('Get bit value form invalid bit index', function () {
        it('should return error rejected', function () {
            let stepCounter = 0;
            const continuationCallback = () => { stepCounter++; return Promise.resolve(stepCounter < 100); };
            const getBit = jsonata(`($x:= λ($c,$n,$b){ $c=$b?$n%2:$x($c+1,$floor($n/2),$b)};$x(0,number,bitIndex))`);
            const data = { "number": 10000000, "bitIndex": -1 };
            expect(jsonataContinuationPromise(getBit, data, continuationCallback)).to.eventually.be.rejected;
        });
    });
});
